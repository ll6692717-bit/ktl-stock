import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KTL COUNT｜奇天烈軍販売状況共有',
  description: '奇天烈軍の雑誌販売状況共有サイト',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
