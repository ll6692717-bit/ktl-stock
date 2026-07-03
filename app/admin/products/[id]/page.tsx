import { supabase } from '@/lib/supabase';
import ThreadList from './ThreadList';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';

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
    .from('threads')
    .select('id, product_id, shop_name, prefecture, is_visible')
    .eq('product_id', productId)
    .or('is_visible.eq.true,is_visible.is.null')
    .order('shop_name', { ascending: true });

  const safeThreads =
    threads?.map((thread) => ({
      ...thread,
      latest_stock_status: null,
      latest_comment: null,
      post_count: null,
      has_recent_update: null,
      updated_at: null,
    })) || [];

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <SiteHeader subtitle="雑誌情報" />

        <div className="mx-auto max-w-4xl p-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-bold text-red-700">
              雑誌情報が見つかりません。
            </h2>

            <a
              href="/"
              className="mt-5 inline-block rounded bg-[#800b0b] px-4 py-2 font-bold text-white"
            >
              ← 雑誌一覧へ戻る
            </a>
          </div>
        </div>

        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader subtitle="雑誌詳細・店舗在庫一覧" />

      <div className="mx-auto max-w-6xl p-4">
        <a href="/" className="mb-5 inline-block font-bold text-[#800b0b]">
          ← 雑誌一覧へ戻る
        </a>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="h-64 w-40 shrink-0 overflow-hidden rounded bg-gray-100">
              {product.cover_image_url ? (
                <img
                  src={product.cover_image_url}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-[#800b0b]">
                  IMAGE
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#800b0b]">
                {product.title}
              </h1>

              <div className="mt-5 space-y-2">
                <p className="text-gray-700">
                  <span className="font-bold">出版社：</span>
                  {product.publisher || '未登録'}
                </p>

                <p className="text-gray-700">
                  <span className="font-bold">発売日：</span>
                  {product.release_date || '未登録'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="border-l-4 border-[#800b0b] pl-3 text-2xl font-bold text-[#800b0b]">
              店舗スレッド一覧
            </h2>

            <a
              href={`/products/${productId}/new-thread`}
              className="rounded bg-[#800b0b] px-5 py-3 text-center font-bold text-white hover:bg-[#5f0808]"
            >
              ＋ 新しい店舗スレッドを作成
            </a>
          </div>

          <ThreadList productId={productId} threads={safeThreads} />
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}