import { supabase } from '@/lib/supabase';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';

export default async function Home() {
  const { data: products, error } = await supabase
  .from('products')
  .select('id, title, publisher, release_date, cover_image_url, is_visible')
  .eq('is_visible', true)
  .order('release_date', { ascending: true });

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      <div className="mx-auto max-w-6xl p-4">
        <section className="mb-6 border-b-2 border-[#800b0b] pb-4">
          <h2 className="text-3xl font-bold text-[#800b0b]">雑誌一覧</h2>
          <p className="mt-3 text-gray-700">
            発売中の雑誌の在庫状況を確認できます。気になる雑誌を選んで、店舗の在庫情報をチェックしましょう。
          </p>
        </section>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            データ取得エラー：{error.message}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products?.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.id}`}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="h-44 w-28 shrink-0 overflow-hidden rounded bg-gray-200">
                {product.cover_image_url ? (
                  <img
                    src={product.cover_image_url}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 px-2 text-center text-sm font-bold text-[#800b0b]">
                    IMAGE
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <h3 className="text-xl font-bold text-[#800b0b]">
                  {product.title}
                </h3>

                <p className="mt-3 text-sm text-gray-700">
                  出版社：{product.publisher || '未登録'}
                </p>

                <p className="text-sm text-gray-700">
                  発売日：{product.release_date || '未登録'}
                </p>

                <div className="mt-auto pt-4">
                  <span className="inline-block rounded bg-[#800b0b] px-4 py-2 text-sm font-bold text-white">
                    在庫状況を確認する →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
