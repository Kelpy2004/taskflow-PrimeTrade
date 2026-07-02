'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/auth/AuthCard';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuthError, login } from '@/store/authSlice';

const DEMO_PASSWORD = 'Password123';
const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@taskforge.local' },
  { label: 'Member', email: 'user@taskforge.local' },
];

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { submitting, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fillDemo = (demoEmail: string) => {
    dispatch(clearAuthError());
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      router.replace(result.payload.role === 'admin' ? '/dashboard' : '/tasks');
    }
  };

  return (
    <AuthCard>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-[#f2f6fb]">Welcome back</h1>
      <p className="mt-1.5 text-sm text-on-surface-variant">Sign in to continue to your workspace.</p>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label htmlFor="email" className="ml-0.5 block text-[13px] font-medium text-on-surface-variant">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => {
              if (error) dispatch(clearAuthError());
              setEmail(event.target.value);
            }}
            placeholder="you@example.com"
            className="glass-input"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="ml-0.5 block text-[13px] font-medium text-on-surface-variant">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              if (error) dispatch(clearAuthError());
              setPassword(event.target.value);
            }}
            placeholder="••••••••••••"
            className="glass-input"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-center gap-2 rounded-[11px] border border-error/30 bg-error/10 px-3.5 py-2.5 text-[13px] text-[#ff9c9c]"
          >
            <svg width="13" height="13" viewBox="0 0 12 12" className="shrink-0" aria-hidden>
              <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <path d="M6 3.4 V6.6 M6 8.2 v0.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-7">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-white/5" />
          <span className="eyebrow text-[10px] text-on-surface-faint">Quick demo access</span>
          <span className="h-px flex-1 bg-white/5" />
        </div>
        <div className="mt-3.5 grid grid-cols-2 gap-3">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => fillDemo(account.email)}
              className="glass-panel flex cursor-pointer flex-col items-center rounded-xl border border-white/5 py-2.5 transition-all hover:bg-white/5 active:scale-95 focus-ring"
            >
              <span className="text-xs font-semibold text-on-surface">{account.label}</span>
              <span className="mt-0.5 font-mono text-[10px] text-on-surface-faint">{account.email}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-7 text-center text-xs text-on-surface-variant">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-bold text-primary hover:underline">
          Create one
        </Link>
      </p>
    </AuthCard>
  );
}
