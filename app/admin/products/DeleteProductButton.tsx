'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DeleteProductButton({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');

  async function handleDelete() {
    const ok = window.confirm(
      `「${productTitle}」を削除しますか？\n関連する店舗スレッドや投稿も削除される可能性があります。`
    );

    if (!ok) return;

    setIsDeleting(true);
    setMessage('');

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    setIsDeleting(false);

    if (error) {
      setMessage(`削除エラー：${error.message}`);
      return;
    }

    setMessage('削除しました。ページを更新してください。');
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
        className="rounded border border-gray-300 px-4 py-2 text-sm font-bold text-gray-600 hover:border-[#800b0b] hover:text-[#800b0b] disabled:bg-gray-200"
      >
        {isDeleting ? '削除中...' : '削除'}
      </button>
    </div>
  );
}