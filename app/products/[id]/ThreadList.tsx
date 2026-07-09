import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ThreadList from './ThreadList';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ProductPage({ params }: PageProps) {
  const productId = params.id;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <p className="text-red-600">商品情報が見つかりませんでした。</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 underline">
            トップへ戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-[#800b0b] px-4 py-5 text-white">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm underline">
            ← トップへ戻る
          </Link>
          <h1 className="mt-3 text-2xl font-bold">{product.title}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <section className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-6">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.title}
                className="mb-4 max-h-80 w-full rounded-lg object-contain"
              />
            )}

            {product.description && (
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {product.description}
              </p>
            )}
          </div>

          <ThreadList productId={productId} />
        </section>
      </div>
    </main>
  );
}
