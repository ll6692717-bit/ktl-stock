'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/app/components/ImageUploader';

export default function NewProductForm() {
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');

    if (!title.trim()) {
      setMessage('雑誌タイトルを入力してください。');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from('products').insert({
      title: title.trim(),
      publisher: publisher.trim() || null,
      release_date: releaseDate || null,
      cover_image_url: coverImageUrl || null,
    });

    setIsLoading(false);

    if (error) {
      setMessage(`追加エラー：${error.message}`);
      return;
    }

    setTitle('');
    setPublisher('');
    setReleaseDate('');
    setCoverImageUrl('');
    setMessage('雑誌を追加しました。トップページで確認できます。');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      {message && (
        <div className="mb-5 rounded bg-gray-100 p-3 text-sm font-bold text-[#800b0b]">
          {message}
        </div>
      )}

      <div className="mb-5">
        <label className="mb-2 block font-bold text-gray-900">
          雑誌タイトル（必須）
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400"
          placeholder="例：anan 2026年8月号"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block font-bold text-gray-900">出版社</label>
        <input
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400"
          placeholder="例：マガジンハウス"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block font-bold text-gray-900">発売日</label>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900"
        />
      </div>

      <div className="mb-6">
        <ImageUploader value={coverImageUrl} onChange={setCoverImageUrl} />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded bg-[#800b0b] py-3 font-bold text-white hover:bg-[#5f0808] disabled:bg-gray-300"
      >
        {isLoading ? '追加中...' : '雑誌を追加する'}
      </button>
    </form>
  );
}