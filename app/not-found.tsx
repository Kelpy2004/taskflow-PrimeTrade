import Link from 'next/link';
import Button from '@/components/ui/Button';

/** 404 — gradient glass digits (design asset), one action home. */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <div
        aria-hidden
        className="rounded-[28px] px-10 py-6"
        style={{
          background: 'linear-gradient(160deg, rgba(26,36,56,0.55), rgba(15,21,36,0.45))',
          border: '1px solid rgba(125,211,252,0.16)',
          boxShadow: '0 0 44px -8px rgba(125,211,252,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
          animation: 'tf-float-soft 6s ease-in-out infinite',
        }}
      >
        <span
          className="font-display text-[64px] font-bold tracking-tight"
          style={{
            background: 'linear-gradient(120deg, #7dd3fc, #c8a0f0)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </span>
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#f2f6fb]">Lost in space</h1>
        <p className="mt-2 max-w-sm text-sm text-on-surface-variant">
          This page doesn&apos;t exist — maybe the task was completed and shipped without it.
        </p>
      </div>
      <Link href="/">
        <Button variant="primary">Take me home</Button>
      </Link>
    </div>
  );
}
