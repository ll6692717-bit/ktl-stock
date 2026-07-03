'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function NewStorePage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');

    if (!name.trim()) {
      setMessage('店舗名を入力してください。');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from('stores').insert({
      name: name.trim(),
      prefecture: prefecture.trim() || null,
      is_visible: true,
    });

    setIsLoading(false);

    if (error) {
      setMessage(`追加エラー：${error.message}`);
      return;
    }

    alert('店舗を追加しました');
    router.push('/admin/stores');
  }

  return (
    <main className="min-h-screen bg-white p-6 text-black">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/stores"
          className="mb-5 inline-block text-sm font-bold text-[#800b0b]"
        >
          ← 店舗一覧へ戻る
        </Link>

        <h1 className="mb-6 border-l-4 border-[#800b0b] pl-3 text-2xl font-bold text-[#800b0b]">
          店舗追加
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border bg-white p-6 shadow"
        >
          {message && (
            <div className="rounded bg-gray-100 p-3 text-sm font-bold text-[#800b0b]">
              {message}
            </div>
          )}

          <div>
            <label className="mb-2 block font-bold text-gray-900">
              店舗名（必須）
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400"
              placeholder="例：タワーレコード渋谷店"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-gray-900">
              都道府県
            </label>
            <input
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400"
              placeholder="例：東京都"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-[#800b0b] py-3 font-bold text-white hover:bg-[#5f0808] disabled:bg-gray-300"
          >
            {isLoading ? '追加中...' : '店舗を追加する'}
          </button>
        </form>
      </div>
    </main>
  );
}