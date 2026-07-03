import Link from 'next/link';
import NewThreadForm from './NewThreadForm';

export default function NewThreadPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <header className="bg-[#800b0b] px-4 py-5 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">奇天烈軍 販売状況共有</h1>
          <p className="mt-2 text-sm">
            雑誌の在庫状況をみんなで共有しよう！
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl p-4">
      <Link
  href={`/products/${params.id}`}
  className="mb-5 inline-block text-sm font-bold text-[#800b0b]"
>
  ← 雑誌詳細へ戻る
</Link>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-6 border-l-4 border-[#800b0b] pl-3 text-2xl font-bold text-[#800b0b]">
            店舗スレッドを追加する
          </h1>

          <NewThreadForm productId={params.id} />
        </section>
      </div>

      <footer className="mt-8 bg-[#800b0b] px-4 py-4 text-center text-sm text-white">
        © KEY TO LIT販売状況
      </footer>
    </main>
  );
}