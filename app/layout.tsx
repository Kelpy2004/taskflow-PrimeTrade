import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Space_Mono } from 'next/font/google';
import Providers from '@/app/providers';
import BackgroundDecor from '@/components/layout/BackgroundDecor';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono' });

export const metadata: Metadata = {
  title: 'TaskForge — Task Management Dashboard',
  description:
    'Glassmorphic task management dashboard. Next.js + TypeScript + Tailwind CSS + PostgreSQL + Redux.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${spaceMono.variable}`}>
      <body>
        <BackgroundDecor />
        <div className="relative z-[2]">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
