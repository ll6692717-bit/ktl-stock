'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SiteHeader({
  subtitle = '当サイトはKEY TO LITの非公式ファンサイトです。所属事務所・出版社・販売店とは関係ありません。',
}: {
  subtitle?: string;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    }

    checkSession();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <header className="bg-[#800b0b] px-4 py-5 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">🗝 販売状況共有</h1>
          <p className="mt-2 text-sm">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <>
              <a
                href="/admin"
                className="rounded-lg border border-white px-4 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-[#800b0b]"
              >
                ⚙️ 管理画面
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#800b0b] transition hover:bg-gray-100"
              >
                🚪 ログアウト
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
