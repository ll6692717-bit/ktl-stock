'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DeletePostButton({
  postId,
}: {
  postId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');

  async function handleDelete() {
    const ok = window.confirm(
      'この投稿を削除しますか？\nこの操作は元に戻せません。'
    );

    if (!ok) return;

    setIsDeleting(true);
    setMessage('');

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    setIsDeleting(false);

    if (error) {
      setMessage(`削除エラー：${error.message}`);
      return;
    }

    setMessage('削除しました。ページを更新すると一覧から消えます。');
  }

  return (
    <div>
      {message && (
        <p className="mb-2 text-sm font-bold text-[#800b0b]">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded bg-[#800b0b] px-4 py-2 text-sm font-bold text-white hover:bg-[#5f0808] disabled:bg-gray-300"
      >
        {isDeleting ? '削除中...' : '🗑 投稿を削除'}
      </button>
    </div>
  );
}