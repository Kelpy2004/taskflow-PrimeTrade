'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingOrb } from '@/components/three/StatusObjects';
import { useAppSelector } from '@/store/hooks';

/** Landing router: admins → dashboard, members → tasks, anonymous → login. */
export default function RootPage() {
  const router = useRouter();
  const { user, status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (status !== 'ready') return;
    if (!user) {
      router.replace('/login');
    } else {
      router.replace(user.role === 'admin' ? '/dashboard' : '/tasks');
    }
  }, [status, user, router]);

  return <LoadingOrb label="TaskForge" />;
}
