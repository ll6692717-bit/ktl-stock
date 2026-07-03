'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Props = {
  id: string;
  isVisible: boolean;
};

export default function ThreadActions({ id, isVisible }: Props) {
  const router = useRouter();

  async function toggleVisible() {
    const { error } = await supabase
      .from('threads')
      .update({ is_visible: !isVisible })
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  async function deleteThread() {
    if (!confirm('この店舗スレッドを削除しますか？')) return;

    const { error } = await supabase
      .from('threads')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-4 flex gap-2">
      <button
        type="button"
        onClick={toggleVisible}
        className="rounded bg-gray-600 px-4 py-2 text-white"
      >
        {isVisible ? '非表示' : '表示'}
      </button>

      <button
        type="button"
        onClick={deleteThread}
        className="rounded bg-red-600 px-4 py-2 text-white"
      >
        削除
      </button>
    </div>
  );
}