'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PostForm({ threadId }: { threadId: string }) {
  const [stockStatus, setStockStatus] = useState('在庫あり');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (!comment.trim()) {
      setMessage('コメントを入力してください。');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from('posts').insert({
      thread_id: threadId,
      nickname: '奇天烈軍',
      stock_status: stockStatus,
      comment: comment.trim(),
    });

    setIsLoading(false);

    if (error) {
      setMessage(`投稿エラー：${error.message}`);
      return;
    }

    setComment('');
    setMessage('投稿しました。画面を更新すると一覧に表示されます。');
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-xl bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-bold">在庫情報を投稿する</h2>

      {message && (
        <div className="mb-4 rounded-lg bg-pink-100 p-3 text-sm font-bold text-pink-700">
          {message}
        </div>
      )}
      <div className="mb-4">
        <label className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400">在庫状況</label>
        <select
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400"
        >
          <option value="在庫あり">在庫あり</option>
          <option value="残りわずか">残りわずか</option>
          <option value="売り切れ">売り切れ</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400">コメント</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="例：18時時点で5冊ほどありました"
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-[#800b0b] px-4 py-3 font-bold text-white transition hover:bg-[#5f0808]"
      >
        {isLoading ? '投稿中...' : '投稿する'}
      </button>
    </form>
  );
}