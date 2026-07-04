export const dynamic = 'force-dynamic';
export const revalidate = 0;

import AdminGuard from '@/app/components/AdminGuard';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';

export default function AdminPage() {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-white">
        <SiteHeader subtitle="管理ダッシュボード" />

        <div className="mx-auto max-w-4xl p-4">
          <a
            href="/"
            className="mb-5 inline-block text-sm font-bold text-[#800b0b]"
          >
            ← トップページへ戻る
          </a>

          <h1 className="mb-6 border-l-4 border-[#800b0b] pl-3 text-2xl font-bold text-[#800b0b]">
            管理メニュー
          </h1>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="/admin/products"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-[#800b0b]"
            >
              <h2 className="text-xl font-bold text-[#800b0b]">
                📚 雑誌一覧・編集
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                雑誌の編集・削除・追加を行います。
              </p>
            </a>

            <a
              href="/admin/products/new"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-[#800b0b]"
            >
              <h2 className="text-xl font-bold text-[#800b0b]">
                ➕ 雑誌追加
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                新しい雑誌を登録します。
              </p>
            </a>

            <a
              href="/admin/posts"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-[#800b0b]"
            >
              <h2 className="text-xl font-bold text-[#800b0b]">
                🗑️ 投稿管理
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                投稿の確認・削除を行います。
              </p>
            </a>
          </div>
        </div>

        <SiteFooter />
      </main>
    </AdminGuard>
  );
}
