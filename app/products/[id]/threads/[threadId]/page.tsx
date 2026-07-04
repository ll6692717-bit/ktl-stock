export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PostForm from './PostForm';

function formatDate(dateText: string) {
  return new Date(dateText).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusBadge(status: string | null) {
  switch (status) {
    case '在庫あり':
      return 'bg-green-700 text-white';
    case '残りわずか':
      return 'bg-yellow-400 text-black';
    case '売り切れ':
      return 'bg-[#800b0b] text-white';
    default:
      return 'bg-gray-300 text-gray-700';
  }
}

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

const { data: posts, error: postsError } = await supabase
  .from('posts')
  .select('id, stock_status, comment, nickname, created_at, is_visible')
  .eq('thread_id', threadId)
  .order('created_at', { ascending: false });
  if (postsError) {
  console.error(postsError);
}

  if (!thread) {
    return (
      <main className="min-h-screen bg-white">
        <header className="bg-[#800b0b] px-4 py-5 text-white">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold sm:text-3xl">
              奇天烈軍 販売状況共有
            </h1>
          </div>
        </header>

        <div className="mx-auto max-w-3xl p-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="font-bold text-red-600">
              スレッドが見つかりません。
            </p>

            <Link
              href={`/products/${productId}`}
              className="mt-4 inline-block font-bold text-[#800b0b]"
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
          <h1 className="text-2xl font-bold sm:text-3xl">
            奇天烈軍 販売状況共有
          </h1>
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
          <h1 className="text-2xl font-bold text-[#800b0b] sm:text-3xl">
            {thread.shop_name}
          </h1>
          <p className="mt-2 text-sm text-gray-700 sm:text-base">
            都道府県：{thread.prefecture}
          </p>
        </section>

        <PostForm threadId={threadId} />

        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 border-l-4 border-[#800b0b] pl-3 text-xl font-bold text-[#800b0b] sm:text-2xl">
            過去の投稿
          </h2>

          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post, index) => {
                const isLatest = index === 0;

                return (
                  <div
                    key={post.id}
                    className={
                      isLatest
                        ? 'rounded-xl border-2 border-[#800b0b] bg-[#fff8f8] p-4 shadow-md'
                        : 'rounded-xl border border-gray-200 bg-gray-50 p-4'
                    }
                  >
                    {isLatest && (
                      <div className="mb-3 inline-block rounded-full bg-[#800b0b] px-3 py-1 text-xs font-bold text-white">
                        最新投稿
                      </div>
                    )}

                    <div>
                      <span
                        className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${getStatusBadge(
                          post.stock_status
                        )}`}
                      >
                        {post.stock_status || '未投稿'}
                      </span>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-gray-800 sm:text-base">
                      {post.comment || 'コメントなし'}
                    </p>

                    <div className="mt-3 rounded bg-white p-3 text-xs leading-6 text-gray-500 sm:text-sm">
                      <p>投稿者：{post.nickname || '奇天烈軍'}</p>
                      <p>投稿日時：{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                );
              })}
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
