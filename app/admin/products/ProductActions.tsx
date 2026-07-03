'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type ProductActionsProps = {
  id: string;
  isVisible: boolean;
};

export default function ProductActions({ id, isVisible }: ProductActionsProps) {
  const router = useRouter();

  async function toggleVisible() {
    const { error } = await supabase
      .from('products')
      .update({ is_visible: !isVisible })
      .eq('id', id);

    if (error) {
      alert(`更新エラー：${error.message}`);
      return;
    }

    router.refresh();
  }

  async function deleteProduct() {
    const ok = confirm('この雑誌を削除しますか？');
    if (!ok) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      alert(`削除エラー：${error.message}`);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-3 flex gap-2">
      <button
        type="button"
        onClick={toggleVisible}
        className="rounded bg-gray-600 px-4 py-2 text-sm font-bold text-white"
      >
        {isVisible ? '非表示にする' : '表示する'}
      </button>

      <button
        type="button"
        onClick={deleteProduct}
        className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white"
      >
        削除
      </button>
    </div>
  );
}