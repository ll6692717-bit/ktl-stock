'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        window.location.href = '/login';
        return;
      }

      setIsLoggedIn(true);
      setIsChecking(false);
    }

    checkLogin();
  }, []);

  if (isChecking) {
    return (
      <main className="min-h-screen bg-white p-6">
        <p className="font-bold text-[#800b0b]">ログイン状態を確認中...</p>
      </main>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}