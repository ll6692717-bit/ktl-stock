import Link from 'next/link';
import NewProductForm from './NewProductForm';

export default function NewProductPage() {
  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="mb-5 inline-block text-sm font-bold text-[#800b0b]"
        >
          ← 管理画面へ戻る
        </Link>

        <h1 className="mb-6 border-l-4 border-[#800b0b] pl-3 text-2xl font-bold text-[#800b0b]">
          雑誌追加
        </h1>

        <NewProductForm />
      </div>
    </main>
  );
}