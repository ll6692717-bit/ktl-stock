import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PostForm from './PostForm';

export default async function ThreadDetailPage({
  params,
}: {
  params: { id: string; threadId: string };
}) {
  const productId = params.id;
  const threadId = params.threadId;

  const { data: thread } = await supabase
  .from('threads')
  .select('id, shop_name, prefecture, is_visible')
  .eq('id', threadId)
  .eq('is_visible', true)
  .maybeSingle();

  const { data: posts } = await supabase
    .from('posts')
    .select('id, stock_status, comment, nickname, created_at')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: false });

  if (!thread) {
    return (
      <main className="min-h-screen bg-white">
        <header className="bg-[#800b0b] px-4 py-5 text-white">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl font-bold">奇天烈軍 販売状況共有</h1>
          </div>
        </header>

        <div className="mx-auto max-w-3xl p-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="font-bold text-red-600">スレッドが見つかりません。</p>

            <Link
              href={`/products/${productId}`}
              className="mt-4 inline-block text-[#800b0b] font-bold"
            >
              ← 雑誌詳細へ戻る
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-[#800b0b] px-4 py-5 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">奇天烈軍 販売状況共有</h1>
          <p className="mt-2 text-sm">
            店舗ごとの在庫情報を投稿・確認できます。
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl p-4">
        <Link
          href={`/products/${productId}`}
          className="mb-5 inline-block text-sm font-bold text-[#800b0b]"
        >
          ← 雑誌詳細へ戻る
        </Link>

        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h1 className="text-3xl font-bold text-[#800b0b]">
            {thread.shop_name}
          </h1>
          <p className="mt-2 text-gray-700">
            都道府県：{thread.prefecture}
          </p>
        </section>

        <PostForm threadId={threadId} />

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 border-l-4 border-[#800b0b] pl-3 text-2xl font-bold text-[#800b0b]">
            過去の投稿
          </h2>

          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <p className="font-bold text-[#800b0b]">
                    {post.stock_status}
                  </p>
                  <p className="mt-2 text-gray-800">{post.comment}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    投稿者：{post.nickname || '奇天烈軍'} / {post.created_at}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              まだ投稿はありません。最初の在庫情報を投稿してください。
            </p>
          )}
        </section>
      </div>

      <footer className="mt-10 bg-[#800b0b] px-4 py-5 text-center text-sm text-white">
        © 奇天烈軍 販売状況共有
      </footer>
    </main>
  );
}