import { supabase } from '@/lib/supabase';

export default async function AdminDashboardStats() {
  const [
    productsResult,
    hiddenProductsResult,
    threadsResult,
    hiddenThreadsResult,
    postsResult,
    hiddenPostsResult,
  ] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_visible', false),
    supabase.from('threads').select('id', { count: 'exact', head: true }),
    supabase.from('threads').select('id', { count: 'exact', head: true }).eq('is_visible', false),
    supabase.from('posts').select('id', { count: 'exact', head: true }),
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('is_visible', false),
  ]);

  const items = [
    { label: '雑誌', count: productsResult.count || 0 },
    { label: '非表示雑誌', count: hiddenProductsResult.count || 0 },
    { label: '店舗スレッド', count: threadsResult.count || 0 },
    { label: '非表示スレッド', count: hiddenThreadsResult.count || 0 },
    { label: 'コメント', count: postsResult.count || 0 },
    { label: '非表示コメント', count: hiddenPostsResult.count || 0 },
  ];

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border bg-white p-5 shadow">
          <p className="text-sm font-bold text-gray-600">{item.label}</p>
          <p className="mt-2 text-3xl font-bold text-[#800b0b]">
            {item.count}
          </p>
        </div>
      ))}
    </div>
  );
}