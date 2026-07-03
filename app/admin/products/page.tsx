import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ProductActions from './ProductActions';
export default async function ProductsPage() {
  const { data: products, error } = await supabase
  .from('products')
  .select('id, title, publisher, release_date, cover_image_url, is_visible')
  .eq('is_visible', true)
  .order('release_date', { ascending: true });

  return (
    <main className="min-h-screen bg-white p-6 text-black">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="mb-5 inline-block text-sm font-bold text-[#800b0b]"
        >
          ← 管理画面へ戻る
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="border-l-4 border-[#800b0b] pl-3 text-2xl font-bold text-[#800b0b]">
            雑誌一覧・編集
          </h1>

          <Link
            href="/admin/products/new"
            className="rounded bg-[#800b0b] px-4 py-2 text-sm font-bold text-white"
          >
            雑誌追加
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            データ取得エラー：{error.message}
          </div>
        )}

        {!products || products.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-gray-600 shadow">
            登録された雑誌はありません。
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 rounded-xl border bg-white p-4 shadow"
              >
                <div className="h-32 w-24 shrink-0 overflow-hidden rounded bg-gray-100">
                  {product.cover_image_url ? (
                    <img
                      src={product.cover_image_url}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      IMAGE
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col">
                  <p className="text-lg font-bold text-[#800b0b]">
                    {product.title}
                  </p>

                  <p className="text-sm text-gray-700">
                    出版社：{product.publisher || '未登録'}
                  </p>

                  <p className="text-sm text-gray-700">
                    発売日：{product.release_date || '未登録'}
                  </p>

                  <div className="mt-4">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-block rounded bg-[#800b0b] px-4 py-2 text-sm font-bold text-white"
                    >
                      編集する
                    </Link>
                    <ProductActions
  id={product.id}
  isVisible={product.is_visible ?? true}
/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}