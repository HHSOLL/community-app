import type { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900">
        <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
