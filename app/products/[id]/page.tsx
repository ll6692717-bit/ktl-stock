export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { supabase } from '@/lib/supabase';
import ThreadList from './ThreadList';

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const productId = params.id;

  const { data: product } = await supabase
    .from('products')
    .select('id, title, publisher, release_date, cover_image_url')
    .eq('id', productId)
    .maybeSingle();

  const { data: threads } = await supabase
    .from('thread_list_view')
    .select('*')
    .eq('product_id', productId)
    .order('updated_at', { ascending: false });

  if (!product) {
    return <main className="p-4">雑誌情報が見つかりません。</main>;
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-[#800b0b] px-4 py-5 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">🗝🔥 販売状況共有</h1>
          <p className="mt-2 text-sm">
            当サイトはKEY TO LITの非公式ファンサイトです。所属事務所・出版社・販売店とは関係ありません。
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-4">
        <a
          href="/"
          className="mb-5 inline-block text-sm font-bold text-[#800b0b]"
        >
          ← 雑誌一覧へ戻る
        </a>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="h-64 w-40 shrink-0 overflow-hidden rounded bg-gray-100">
              {product.cover_image_url ? (
                <img
                  src={product.cover_image_url}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#800b0b]">
                  IMAGE
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[#800b0b]">
                {product.title}
              </h1>

              <p className="mt-5 text-gray-700">
                出版社：{product.publisher || '未登録'}
              </p>

              <p className="mt-2 text-gray-700">
                発売日：{product.release_date || '未登録'}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="border-l-4 border-[#800b0b] pl-3 text-2xl font-bold text-[#800b0b]">
              店舗スレッド一覧
            </h2>

            
          </div>

          <ThreadList productId={productId} threads={threads || []} />
        </section>
      </div>

      <footer className="mt-10 bg-[#800b0b] px-4 py-5 text-center text-sm text-white">
        © 🗝🔥 販売状況共有
      </footer>
    </main>
  );
}
