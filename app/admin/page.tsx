import AdminDashboardStats from './AdminDashboardStats';
import AdminGuard from '@/app/components/AdminGuard';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import AdminMenu from './AdminMenu';

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
          <AdminDashboardStats />
          <AdminMenu />
        </div>

        <SiteFooter />
      </main>
    </AdminGuard>
  );
}