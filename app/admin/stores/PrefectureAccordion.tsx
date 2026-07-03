'use client';

import { useState } from 'react';
import ThreadActions from './ThreadActions';

type Thread = {
  id: string;
  shop_name: string;
  prefecture: string | null;
  is_visible: boolean | null;
};

export default function PrefectureAccordion({
  prefecture,
  threads,
}: {
  prefecture: string;
  threads: Thread[];
}) {
  const [open, setOpen] = useState(false);

  const visibleCount = threads.filter((t) => t.is_visible !== false).length;
  const hiddenCount = threads.filter((t) => t.is_visible === false).length;

  return (
    <section className="rounded-xl border bg-white shadow">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="text-lg font-bold text-[#800b0b]">
          {open ? '▼' : '▶'} {prefecture}
        </span>

        <span className="text-sm font-bold text-gray-600">
          全{threads.length}件 / 表示中{visibleCount}件 / 非表示{hiddenCount}件
        </span>
      </button>

      {open && (
        <div className="border-t p-4">
          {threads.length === 0 ? (
            <p className="text-sm text-gray-500">
              登録された店舗スレッドはありません。
            </p>
          ) : (
            <div className="grid gap-4">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className="rounded-xl border bg-white p-4 shadow-sm"
                >
                  <h3 className="text-xl font-bold text-[#800b0b]">
                    {thread.shop_name}
                  </h3>

                  <p className="mt-1 text-sm">
                    状態：
                    <span
                      className={
                        thread.is_visible !== false
                          ? 'font-bold text-green-600'
                          : 'font-bold text-red-600'
                      }
                    >
                      {thread.is_visible !== false ? ' 表示中' : ' 非表示'}
                    </span>
                  </p>

                  <ThreadActions
                    id={thread.id}
                    isVisible={thread.is_visible ?? true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}