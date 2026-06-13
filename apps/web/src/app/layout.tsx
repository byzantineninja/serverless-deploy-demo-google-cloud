import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Architecture overview — Task Manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {children}
      </body>
    </html>
  );
}
