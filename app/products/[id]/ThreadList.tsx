'use client';

import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Thread = {
  [key: string]: any;
};

type ThreadListProps = {
  productId: string;
  threads: Thread[];
};

const prefectures = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
];

function getComment(thread: Thread) {
  return (
    thread.comment ||
    thread.latest_comment ||
    thread.last_comment ||
    thread.content ||
    thread.body ||
    ''
  );
}

function getDate(thread: Thread) {
  return thread.updated_at || thread.created_at || thread.last_posted_at || '';
}

function isNonBookstore(thread: Thread) {
  const storeName = thread.store_name || '';
  const category = thread.category || '';
  const placeType = thread.place_type || '';

  return (
    storeName.includes('書店以外') ||
    category.includes('書店以外') ||
    placeType.includes('書店以外') ||
    thread.is_non_bookstore === true
  );
}

export default function ThreadList({ productId, threads }: ThreadListProps) {
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const [prefecture, setPrefecture] = useState('');
  const [storeName, setStoreName] = useState('');
  const [stockStatus, setStockStatus] = useState('在庫あり');
  const [comment, setComment] = useState('');
  const [isOther, setIsOther] = useState(false);
  const [loading, setLoading] = useState(false);

  const groupedThreads = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const groups: Record<string, Thread[]> = {};

    const filtered = threads.filter((thread) => {
      if (!keyword) return true;

      const text = [
        thread.prefecture,
        thread.store_name,
        thread.stock_status,
        getComment(thread),
      ]
        .join(' ')
        .toLowerCase();

      return text.includes(keyword);
    });

    prefectures.forEach((pref) => {
      const normalItems = filtered.filter(
        (thread) => thread.prefecture === pref && !isNonBookstore(thread)
      );

      const otherItems = filtered.filter(
        (thread) => thread.prefecture === pref && isNonBookstore(thread)
      );

      if (normalItems.length > 0) {
        groups[pref] = normalItems;
      }

      if (otherItems.length > 0) {
        groups[`${pref}書店以外`] = otherItems;
      }
    });

    return groups;
  }, [threads, search]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prefecture || !storeName) {
      alert('都道府県と店舗名を入力してください。');
      return;
    }

    setLoading(true);

    const insertData: any = {
      product_id: productId,
      prefecture,
      store_name: isOther ? `${storeName}（書店以外）` : storeName,
      stock_status: stockStatus,
      comment,
    };

    const { error } = await supabase.from('threads').insert(insertData);

    setLoading(false);

    if (error) {
      console.error(error);
      alert('投稿に失敗しました。');
      return;
    }

    window.location.reload();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h3 className="mb-4 text-xl font-bold text-[#800b0b]">
          販売店舗を追加
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          >
            <option value="">都道府県を選択</option>
            {prefectures.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>

          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="店舗名"
            className="rounded border border-gray-300 px-3 py-2"
          />

          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          >
            <option value="在庫あり">在庫あり</option>
            <option value="残りわずか">残りわずか</option>
            <option value="売り切れ">売り切れ</option>
            <option value="不明">不明</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isOther}
              onChange={(e) => setIsOther(e.target.checked)}
            />
            書店以外
          </label>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="コメント"
          className="mt-3 w-full rounded border border-gray-300 px-3 py-2"
          rows={3}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded bg-[#800b0b] px-5 py-2 font-bold text-white disabled:opacity-50"
        >
          {loading ? '投稿中...' : '追加する'}
        </button>
      </form>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="店舗名で検索"
        className="mb-5 w-full rounded border border-gray-300 px-3 py-2"
      />

      <div className="space-y-3">
        {Object.entries(groupedThreads).map(([groupName, items]) => {
          const isOpen = openGroups.includes(groupName);

          return (
            <div
              key={groupName}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleGroup(groupName)}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-bold text-[#800b0b]"
              >
                <span>
                  {groupName}（{items.length}件）
                </span>
                <span>{isOpen ? '−' : '＋'}</span>
              </button>

              {isOpen && (
                <div className="border-t border-gray-200">
                  {items.map((thread) => {
                    const commentText = getComment(thread);
                    const dateText = getDate(thread);

                    return (
                      <div
                        key={thread.id}
                        className="border-b border-gray-100 p-4 last:border-b-0"
                      >
                        <div className="font-bold text-gray-900">
                          {thread.store_name}
                        </div>

                        <div className="mt-1 text-sm text-gray-700">
                          在庫状況：{thread.stock_status || '未登録'}
                        </div>

                        {commentText && (
                          <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                            {commentText}
                          </div>
                        )}

                        {dateText && (
                          <div className="mt-2 text-xs text-gray-500">
                            最終更新：
                            {new Date(dateText).toLocaleString('ja-JP')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(groupedThreads).length === 0 && (
          <p className="text-sm text-gray-500">該当する投稿はありません。</p>
        )}
      </div>
    </div>
  );
}
