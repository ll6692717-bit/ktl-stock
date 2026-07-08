import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🗝🔥販売状況共有',
  description: '🗝🔥販売状況共有サイト',
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
