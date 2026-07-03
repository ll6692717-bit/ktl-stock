'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (!email || !password) {
      setMessage('メールアドレスとパスワードを入力してください。');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setMessage(`ログインエラー：${error.message}`);
      return;
    }

    window.location.href = '/admin';
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-[#800b0b] px-4 py-5 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">奇天烈軍 販売状況共有</h1>
          <p className="mt-2 text-sm">管理者ログイン</p>
        </div>
      </header>

      <div className="mx-auto max-w-md p-4">
        <a href="/" className="mb-5 inline-block text-sm font-bold text-[#800b0b]">
          ← トップページへ戻る
        </a>

        <form
          onSubmit={handleLogin}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h1 className="mb-5 border-l-4 border-[#800b0b] pl-3 text-2xl font-bold text-[#800b0b]">
            管理者ログイン
          </h1>

          {message && (
            <div className="mb-5 rounded bg-gray-100 p-3 text-sm font-bold text-[#800b0b]">
              {message}
            </div>
          )}

          <div className="mb-5">
            <label className="mb-2 block font-bold text-gray-900">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900"
              placeholder="admin@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-bold text-gray-900">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900"
              placeholder="パスワード"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-[#800b0b] py-3 font-bold text-white hover:bg-[#5f0808] disabled:bg-gray-300"
          >
            {isLoading ? 'ログイン中...' : 'ログインする'}
          </button>
        </form>
      </div>
    </main>
  );
}