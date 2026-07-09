'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const basePrefectures = [
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

const prefectures = basePrefectures.flatMap((prefecture) => [
  prefecture,
  `${prefecture}書店以外`,
]);

export default function NewThreadForm({ productId }: { productId: string }) {
  const [shopName, setShopName] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (!shopName.trim()) {
      setMessage('店舗名を入力してください。');
      return;
    }

    if (!prefecture) {
      setMessage('都道府県を選択してください。');
      return;
    }

    const { error } = await supabase.from('threads').insert({
      product_id: productId,
      shop_name: shopName.trim(),
      prefecture,
      created_by_name: '匿名',
      is_visible: true,
    });

    if (error) {
      setMessage(`作成エラー：${error.message}`);
      return;
    }

    setShopName('');
    setPrefecture('');
    setMessage('スレッドを作成しました。雑誌詳細ページに戻って確認してください。');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-gray-900">
      {message && (
        <div className="rounded-lg bg-gray-100 p-3 text-sm font-bold text-[#800b0b]">
          {message}
        </div>
      )}

      <div>
        <label className="mb-2 block font-bold text-gray-900">
          店舗名（必須）
        </label>
        <p className="mb-2 text-sm text-gray-600">
          在庫情報を共有したい店舗名を入力してください。
          書店以外の場合は、店舗名や施設名などを入力してください。
        </p>
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="例：タワーレコード渋谷店 / コンビニ・駅売店など"
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400"
        />
      </div>

      <div>
        <label className="mb-2 block font-bold text-gray-900">
          都道府県・分類（必須）
        </label>
        <p className="mb-2 text-sm text-gray-600">
          書店の場合は都道府県を、書店以外の場合は「○○県書店以外」を選択してください。
        </p>
        <select
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
        >
          <option value="">選択してください</option>
          {prefectures.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-[#800b0b] px-4 py-3 font-bold text-white transition hover:bg-[#5f0808]"
      >
        追加
      </button>
    </form>
  );
}
