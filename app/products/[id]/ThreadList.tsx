'use client';

import { useMemo, useState } from 'react';

const prefectures = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県',
  '沖縄県',
];

const pinnedTitle = '★テスト★まずはここで入力練習してみてください！';

type Thread = {
  id: string;
  shop_name: string;
  prefecture: string | null;
  latest_stock_status: string | null;
  latest_comment: string | null;
  post_count: number | null;
  has_recent_update: boolean | null;
  updated_at: string | null;
};

export default function ThreadList({
  productId,
  threads,
}: {
  productId: string;
  threads: Thread[];
}) {
  const [keyword, setKeyword] = useState('');
  const [openPrefecture, setOpenPrefecture] = useState<string | null>(null);

  const filteredThreads = useMemo(() => {
    const word = keyword.trim().toLowerCase();

    return threads.filter((thread) => {
      if (!word) return true;
      return thread.shop_name.toLowerCase().includes(word);
    });
  }, [threads, keyword]);

  const pinnedThread = filteredThreads.find(
    (thread) => thread.shop_name === pinnedTitle
  );

  const normalThreads = filteredThreads.filter(
    (thread) => thread.shop_name !== pinnedTitle
  );

  function getStatusInfo(status: string | null) {
    switch (status) {
      case '在庫あり':
        return {
          label: '🟢 在庫あり',
          className: 'bg-green-700 text-white',
        };
      case '残りわずか':
        return {
          label: '🟡 残りわずか',
          className: 'bg-yellow-400 text-black',
        };
      case '売り切れ':
        return {
          label: '🔴 売り切れ',
          className: 'bg-[#800b0b] text-white',
        };
      default:
        return {
          label: '⚪ 未投稿',
          className: 'bg-gray-300 text-gray-700',
        };
    }
  }

  function formatDate(dateText: string | null) {
    if (!dateText) return '未更新';

    return new Date(dateText).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <>
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <label className="mb-1 block text-sm font-bold text-gray-800">
          店舗名で検索
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="例：タワーレコード"
          className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400"
        />
      </div>

      {pinnedThread && (
        <div className="mb-5 rounded-xl border-2 border-[#800b0b] bg-white p-5 shadow">
          <h3 className="text-xl font-bold text-[#800b0b]">
            {pinnedThread.shop_name}
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            入力練習用のスレッドです。
          </p>

          <a
            href={`/products/${productId}/threads/${pinnedThread.id}`}
            className="mt-3 inline-block rounded bg-[#800b0b] px-4 py-2 text-sm font-bold text-white"
          >
            投稿する・過去の投稿を見る →
          </a>
        </div>
      )}

      <div className="mb-5 rounded-xl border border-gray-200 bg-[#fff8f8] p-5 shadow-sm">
        <h3 className="text-xl font-bold text-[#800b0b]">
          販売店舗を追加する
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-700">
          探している販売店舗がまだ一覧にない場合は、こちらから追加してください。
          追加された店舗には、他の方も在庫情報を投稿できるようになります。
        </p>

        <a
          href={`/products/${productId}/new-thread`}
          className="mt-4 inline-block rounded bg-[#800b0b] px-5 py-3 font-bold text-white hover:bg-[#5f0808]"
        >
          ＋ 販売店舗を追加する
        </a>
      </div>

      <div className="space-y-3">
        {prefectures.map((prefecture) => {
          const prefectureThreads = normalThreads.filter(
            (thread) => thread.prefecture === prefecture
          );

          const isOpen = openPrefecture === prefecture;

          return (
            <section
              key={prefecture}
              className="rounded-xl border bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenPrefecture(isOpen ? null : prefecture)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="text-lg font-bold text-[#800b0b]">
                  {isOpen ? '▼' : '▶'} {prefecture}
                </span>

                <span className="text-sm font-bold text-gray-600">
                  {prefectureThreads.length}件
                </span>
              </button>

              {isOpen && (
                <div className="border-t p-4">
                  {prefectureThreads.length === 0 ? (
                    <p className="text-sm text-gray-600">
                      店舗スレッドはありません。
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {prefectureThreads.map((thread) => {
                        const statusInfo = getStatusInfo(
                          thread.latest_stock_status
                        );

                        return (
                          <div
                            key={thread.id}
                            className="grid gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-[1.2fr_1.4fr_1fr]"
                          >
                            <div>
                              <h3 className="text-xl font-bold text-[#800b0b]">
                                {thread.shop_name}
                              </h3>

                              <p className="mt-2 text-sm text-gray-600">
                                📍 {thread.prefecture}
                              </p>
                            </div>

                            <div className="border-gray-200 md:border-l md:pl-5">
                              <span
                                className={`inline-block min-w-44 rounded-lg px-5 py-3 text-center text-lg font-bold ${statusInfo.className}`}
                              >
                                {statusInfo.label}
                              </span>

                              <p className="mt-3 text-sm leading-6 text-gray-800">
                                {thread.latest_comment ||
                                  'まだ投稿はありません。'}
                              </p>
                            </div>

                            <div className="border-gray-200 md:border-l md:pl-5">
                              {thread.has_recent_update && (
                                <span className="inline-block rounded bg-[#800b0b] px-3 py-1 text-xs font-bold text-white">
                                  更新あり
                                </span>
                              )}

                              <p className="mt-3 text-sm text-gray-700">
                                投稿数：{thread.post_count || 0}件
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                最終更新：{formatDate(thread.updated_at)}
                              </p>

                              <a
                                href={`/products/${productId}/threads/${thread.id}`}
                                className="mt-3 inline-block text-sm font-bold text-[#800b0b] hover:underline"
                              >
                                投稿する・過去の投稿を見る →
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}