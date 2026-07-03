'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Product = {
  id: string;
  title: string;
  publisher: string | null;
  release_date: string | null;
  cover_image_url: string | null;
};

export default function EditProductForm({ product }: { product: Product }) {
  const [title, setTitle] = useState(product.title || '');
  const [publisher, setPublisher] = useState(product.publisher || '');
  const [releaseDate, setReleaseDate] = useState(product.release_date || '');
  const [coverImageUrl, setCoverImageUrl] = useState(product.cover_image_url || '');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (!title.trim()) {
      setMessage('雑誌タイトルを入力してください。');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from('products')
      .update({
        title: title.trim(),
        publisher: publisher.trim() || null,
        release_date: releaseDate || null,
        cover_image_url: coverImageUrl.trim() || null,
      })
      .eq('id', product.id);

    setIsLoading(false);

    if (error) {
      setMessage(`保存エラー：${error.message}`);
      return;
    }

    setMessage('保存しました。雑誌一覧で確認できます。');
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {message && (
        <div className="mb-5 rounded bg-gray-100 p-3 text-sm font-bold text-[#800b0b]">
          {message}
        </div>
      )}

      <div className="mb-5">
        <label className="mb-2 block font-bold text-gray-900">
          雑誌タイトル（必須）
        </label>
        <p className="mb-2 text-sm text-gray-600">
          表示される雑誌名を入力してください。
        </p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400"
          placeholder="例：anan 2026年8月号"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block font-bold text-gray-900">
          出版社
        </label>
        <p className="mb-2 text-sm text-gray-600">
          雑誌の出版社名を入力してください。
        </p>
        <input
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400"
          placeholder="例：マガジンハウス"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block font-bold text-gray-900">
          発売日
        </label>
        <p className="mb-2 text-sm text-gray-600">
          雑誌の発売日を選択してください。
        </p>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900"
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-bold text-gray-900">
          表紙画像URL
        </label>
        <p className="mb-2 text-sm text-gray-600">
          表紙画像のURLを入力すると、トップページと雑誌詳細に画像が表示されます。
        </p>
        <input
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded bg-[#800b0b] py-3 font-bold text-white hover:bg-[#5f0808] disabled:bg-gray-300"
      >
        {isLoading ? '保存中...' : '保存する'}
      </button>
    </form>
  );
}