'use client';

import { useMemo, useState } from 'react';
import CommentActions from './CommentActions';

export default function CommentList({ comments }: { comments: any[] }) {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [visibility, setVisibility] = useState('');

  const filteredComments = useMemo(() => {
    const word = keyword.trim().toLowerCase();

    return comments.filter((post) => {
      const shopName = post.threads?.shop_name || '';
      const nickname = post.nickname || '';
      const comment = post.comment || '';

      const matchKeyword =
        !word ||
        shopName.toLowerCase().includes(word) ||
        nickname.toLowerCase().includes(word) ||
        comment.toLowerCase().includes(word);

      const matchStatus =
        !status || post.stock_status === status;

      const matchVisibility =
        !visibility ||
        (visibility === 'visible' && post.is_visible !== false) ||
        (visibility === 'hidden' && post.is_visible === false);

      return matchKeyword && matchStatus && matchVisibility;
    });
  }, [comments, keyword, status, visibility]);

  return (
    <>
      <div className="mb-5 grid gap-4 rounded-xl border bg-white p-4 shadow md:grid-cols-3">
        <div>
          <label className="mb-2 block font-bold text-gray-800">
            コメント検索
          </label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="店舗名・投稿者・コメント"
            className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900"
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-gray-800">
            在庫状況
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900"
          >
            <option value="">すべて</option>
            <option value="在庫あり">在庫あり</option>
            <option value="残りわずか">残りわずか</option>
            <option value="売り切れ">売り切れ</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-bold text-gray-800">
            表示状態
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900"
          >
            <option value="">すべて</option>
            <option value="visible">表示中</option>
            <option value="hidden">非表示</option>
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm font-bold text-gray-700">
        表示件数：{filteredComments.length}件
      </p>

      {filteredComments.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 shadow">
          条件に一致するコメントはありません。
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredComments.map((post) => (
            <div key={post.id} className="rounded-xl border bg-white p-4 shadow">
              <p className="text-sm text-gray-600">
                投稿者：{post.nickname || '未入力'}
              </p>

              <p className="mt-2 font-bold text-[#800b0b]">
                在庫状況：{post.stock_status || '未登録'}
              </p>

              <p className="mt-2 text-gray-800">
                {post.comment || 'コメントなし'}
              </p>

              <p className="mt-3 text-sm text-gray-600">
                店舗：{post.threads?.shop_name || '不明'}
              </p>

              <p className="text-sm text-gray-600">
                都道府県：{post.threads?.prefecture || '未登録'}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                投稿日：{post.created_at}
              </p>

              <p className="mt-2 text-sm">
                状態：
                <span
                  className={
                    post.is_visible === false
                      ? 'font-bold text-red-600'
                      : 'font-bold text-green-600'
                  }
                >
                  {post.is_visible === false ? ' 非表示' : ' 表示中'}
                </span>
              </p>

              <CommentActions
                id={post.id}
                isVisible={post.is_visible ?? true}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}