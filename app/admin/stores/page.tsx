export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PrefectureAccordion from './PrefectureAccordion';

const prefectures = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県',
  '沖縄県', '書店以外',
];

export default async function StoresPage() {
  const { data: threads, error } = await supabase
    .from('threads')
    .select('id, shop_name, prefecture, is_visible, product_id')
    .order('prefecture', { ascending: true })
    .order('shop_name', { ascending: true });

  return (
    <main className="min-h-screen bg-white p-6 text-black">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="mb-5 inline-block text-sm font-bold text-[#800b0b]"
        >
          ← 管理画面へ戻る
        </Link>

        <h1 className="mb-6 border-l-4 border-[#800b0b] pl-3 text-2xl font-bold text-[#800b0b]">
          店舗スレッド一覧
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            データ取得エラー：{error.message}
          </div>
        )}

        <div className="space-y-3">
          {prefectures.map((prefecture) => {
            const prefectureThreads =
              threads?.filter((thread) => thread.prefecture === prefecture) ||
              [];

            return (
              <PrefectureAccordion
                key={prefecture}
                prefecture={prefecture}
                threads={prefectureThreads}
              />
            );
          })}

          <PrefectureAccordion
            prefecture="未登録"
            threads={
              threads?.filter((thread) => !thread.prefecture) || []
            }
          />
        </div>
      </div>
    </main>
  );
}
