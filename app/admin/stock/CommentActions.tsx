'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Props = {
  id: string;
  isVisible: boolean;
};

export default function CommentActions({ id, isVisible }: Props) {
  const router = useRouter();

  async function toggleVisible() {
    const { error } = await supabase
      .from('posts')
      .update({ is_visible: !isVisible })
      .eq('id', id);

    if (error) {
      alert(`更新エラー：${error.message}`);
      return;
    }

    router.refresh();
  }

  async function deleteComment() {
    if (!confirm('このコメントを削除しますか？')) return;

    const { error } = await supabase
      .from('posts')
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
        {isVisible ? '非表示' : '表示'}
      </button>

      <button
        type="button"
        onClick={deleteComment}
        className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white"
      >
        削除
      </button>
    </div>
  );
}