'use client';

import Link from 'next/link';

const menus = [
  {
    title: '雑誌追加',
    href: '/admin/products/new',
    description: '新しい雑誌を登録します',
  },
  {
    title: '雑誌一覧・編集',
    href: '/admin/products',
    description: '登録済みの雑誌を編集します',
  },
  {
    title: '店舗一覧',
    href: '/admin/stores',
    description: '店舗を管理します',
  },
  {
    title: '在庫入力',
    href: '/admin/stock',
    description: '在庫を登録・更新します',
  },
];

export default function AdminMenu() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {menus.map((menu) => (
        <Link
          key={menu.href}
          href={menu.href}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow transition hover:border-[#800b0b] hover:shadow-lg"
        >
          <h2 className="text-xl font-bold text-[#800b0b]">
            {menu.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {menu.description}
          </p>
        </Link>
      ))}
    </div>
  );
}