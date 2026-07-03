'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setMessage('');
    setIsUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('covers')
      .upload(fileName, file);

    if (error) {
      setIsUploading(false);
      setMessage(`アップロードエラー：${error.message}`);
      return;
    }

    const { data } = supabase.storage.from('covers').getPublicUrl(fileName);

    onChange(data.publicUrl);
    setIsUploading(false);
    setMessage('画像をアップロードしました。');
  }

  return (
    <div className="rounded border border-gray-300 bg-gray-50 p-4">
      <label className="mb-2 block font-bold text-gray-900">
        表紙画像をアップロード
      </label>

      <p className="mb-3 text-sm text-gray-600">
        JPG / PNG 画像を選択してください。アップロード後、自動で画像URLが設定されます。
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900"
      />

      {isUploading && (
        <p className="mt-3 text-sm font-bold text-[#800b0b]">
          アップロード中...
        </p>
      )}

      {message && (
        <p className="mt-3 text-sm font-bold text-[#800b0b]">
          {message}
        </p>
      )}

      {value && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-bold text-gray-700">
            現在の画像
          </p>
          <img
            src={value}
            alt="表紙画像"
            className="h-48 w-32 rounded object-cover shadow"
          />
        </div>
      )}
    </div>
  );
}