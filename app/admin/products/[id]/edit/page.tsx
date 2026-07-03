import AdminGuard from '@/app/components/AdminGuard';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import { supabase } from '@/lib/supabase';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({
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

  if (!product) {
    return (
      <AdminGuard>
        <main className="min-h-screen bg-white">
          <SiteHeader subtitle="管理用：雑誌を編集できます。" />

          <div className="mx-auto max-w-3xl p-4">
            <p className="font-bold text-red-600">雑誌が見つかりません。</p>

            <a
              href="/admin/products"
              className="mt-4 inline-block font-bold text-[#800b0b]"
            >
              ← 雑誌一覧へ戻る
            </a>
          </div>

          <SiteFooter />
        </main>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-white">
        <SiteHeader subtitle="管理用：雑誌を編集できます。" />

        <div className="mx-auto max-w-3xl p-4">
          <a
            href="/admin/products"
            className="mb-5 inline-block text-sm font-bold text-[#800b0b]"
          >
            ← 雑誌一覧へ戻る
          </a>

          <h1 className="mb-5 border-l-4 border-[#800b0b] pl-3 text-2xl font-bold text-[#800b0b]">
            雑誌を編集
          </h1>

          <EditProductForm product={product} />
        </div>

        <SiteFooter />
      </main>
    </AdminGuard>
  );
}