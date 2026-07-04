export const dynamic = 'force-dynamic';
export const revalidate = 0;
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import CommentList from './CommentList';

export default async function CommentAdminPage() {
  const { data: comments, error } = await supabase
    .from('posts')
    .select(`
      id,
      stock_status,
      comment,
      nickname,
      created_at,
      is_visible,
      threads (
        shop_name,
        prefecture,
        product_id
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-white p-6 text-black">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="mb-5 inline-block text-sm font-bold text-[#800b0b]"
        >
          ← 管理画面へ戻る
        </Link>

        <h1 className="mb-6 border-l-4 border-[#800b0b] pl-3 text-2xl font-bold text-[#800b0b]">
          コメント管理
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            データ取得エラー：{error.message}
          </div>
        )}

        {!comments || comments.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 shadow">
            コメントはまだありません。
          </div>
        ) : (
          <CommentList comments={comments} />
        )}
      </div>
    </main>
  );
}
