'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

/** Public-only shell: signed-in users are bounced to their home page. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (status === 'ready' && user) {
      router.replace(user.role === 'admin' ? '/dashboard' : '/tasks');
    }
  }, [status, user, router]);

  return <div className="flex min-h-screen items-center justify-center p-4">{children}</div>;
}
