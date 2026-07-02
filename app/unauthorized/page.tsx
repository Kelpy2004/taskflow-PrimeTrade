'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';

/** Unauthorized — glass shield object, Grotesk headline, one action (skill.md error skeleton). */
export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <div
        aria-hidden
        className="flex h-[120px] w-[120px] items-center justify-center rounded-[28px]"
        style={{
          background: 'linear-gradient(160deg, rgba(255,107,107,0.12), rgba(15,21,36,0.6))',
          border: '1px solid rgba(255,107,107,0.24)',
          boxShadow: '0 0 44px -8px rgba(255,107,107,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
          animation: 'tf-float-soft 6s ease-in-out infinite',
        }}
      >
        <svg width="52" height="52" viewBox="0 0 28 28">
          <path d="M14 4 L23 8 V14 C23 19 19 23 14 25 C9 23 5 19 5 14 V8 Z" fill="none" stroke="#ff9c9c" strokeWidth="1.7" strokeLinejoin="round" />
          <rect x="11" y="13" width="6" height="5" rx="1" fill="none" stroke="#ff9c9c" strokeWidth="1.4" />
          <path d="M12 13 v-1.5 a2 2 0 0 1 4 0 V13" fill="none" stroke="#ff9c9c" strokeWidth="1.4" />
        </svg>
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#f2f6fb]">Admin territory</h1>
        <p className="mt-2 max-w-sm text-sm text-on-surface-variant">
          This page needs admin access. Your account is a member — head back to your tasks.
        </p>
      </div>
      <Link href="/tasks">
        <Button variant="primary">Back to tasks</Button>
      </Link>
    </div>
  );
}
