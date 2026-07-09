'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Thread = {
  id: string;
  product_id: string;
  prefecture: string;
  store_name: string;
  stock_status: string;
  comment: string | null;
  created_at: string;
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

export default function ThreadList({ productId }: { productId: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const [prefecture, setPrefecture] = useState('');
  const [storeName, setStoreName] = useState('');
  const [stockStatus, setStockStatus] = useState('在庫あり');
  const [comment, setComment] = useState('');
  const [isNonBookstore, setIsNonBookstore] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchThreads = async () => {
    const { data, error } = await supabase
      .from('threads')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setThreads((data || []) as Thread[]);
  };

  useEffect(() => {
    fetchThreads();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prefecture || !storeName || !stockStatus) {
      alert('都道府県・店舗名・在庫状況を入力してください。');
      return;
    }

    setLoading(true);

    const finalStoreName = isNonBookstore
      ? `${storeName}（書店以外）`
      : storeName;

    const { error } = await supabase.from('threads').insert({
      product_id: productId,
      prefecture,
      store_name: finalStoreName,
      stock_status: stockStatus,
      comment,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert('投稿に失敗しました。');
      return;
    }

    setPrefecture('');
    setStoreName('');
    setStockStatus('在庫あり');
    setComment('');
    setIsNonBookstore(false);
    fetchThreads();
  };

  const groupedThreads = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const filtered = threads.filter((thread) => {
      if (!keyword) return true;

      return (
        thread.store_name?.toLowerCase().includes(keyword) ||
        thread.prefecture?.toLowerCase().includes(keyword) ||
        thread.stock_status?.toLowerCase().includes(keyword) ||
        thread.comment?.toLowerCase().includes(keyword)
      );
    });

    const groups: Record<string, Thread[]> = {};

    prefectures.forEach((pref) => {
      const bookstore = filtered.filter(
        (thread) =>
          thread.prefecture === pref &&
          !thread.store_name.includes('書店以外')
      );

      const nonBookstore = filtered.filter(
        (thread) =>
          thread.prefecture === pref &&
          thread.store_name.includes('書店以外')
      );

      if (bookstore.length > 0) {
        groups[pref] = bookstore;
      }

      if (nonBookstore.length > 0) {
        groups[`${pref}書店以外`] = nonBookstore;
      }
    });

    return groups;
  }, [threads, search]);

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((name) => name !== groupName)
        : [...prev, groupName]
    );
  };

  return (
    <div className="space-y-6">
      {/* 販売店舗追加フォーム */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border bg-white p-4 shadow-sm space-y-4"
      >
        <h2 className="text-lg font-bold">販売店舗を追加</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value)}
            className="w-full rounded border px-3 py-2"
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
            className="w-full rounded border px-3 py-2"
          />

          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="在庫あり">在庫あり</option>
            <option value="残りわずか">残りわずか</option>
            <option value="売り切れ">売り切れ</option>
            <option value="不明">不明</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isNonBookstore}
              onChange={(e) => setIsNonBookstore(e.target.checked)}
            />
            書店以外として追加
          </label>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="コメント"
          className="w-full rounded border px-3 py-2"
          rows={3}
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-[#800b0b] px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? '投稿中...' : '追加する'}
        </button>
      </form>

      {/* 店舗名検索 */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="店舗名で検索"
        className="w-full rounded border px-3 py-2"
      />

      {/* アコーディオン */}
      <div className="space-y-3">
        {Object.keys(groupedThreads).length === 0 ? (
          <p className="text-sm text-gray-500">投稿はまだありません。</p>
        ) : (
          Object.entries(groupedThreads).map(([groupName, items]) => {
            const isOpen = openGroups.includes(groupName);

            return (
              <div key={groupName} className="rounded-xl border bg-white">
                <button
                  type="button"
                  onClick={() => toggleGroup(groupName)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left font-bold"
                >
                  <span>
                    {groupName}（{items.length}件）
                  </span>
                  <span>{isOpen ? '−' : '＋'}</span>
                </button>

                {isOpen && (
                  <div className="border-t px-4 py-3 space-y-3">
                    {items.map((thread) => (
                      <div
                        key={thread.id}
                        className="rounded-lg bg-gray-50 p-3 text-sm"
                      >
                        <div className="font-bold">{thread.store_name}</div>
                        <div className="mt-1">
                          在庫状況：{thread.stock_status}
                        </div>
                        {thread.comment && (
                          <div className="mt-1 whitespace-pre-wrap">
                            {thread.comment}
                          </div>
                        )}
                        <div className="mt-2 text-xs text-gray-500">
                          投稿日：
                          {new Date(thread.created_at).toLocaleString('ja-JP')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
