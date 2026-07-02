'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNav from '@/components/layout/MobileNav';
import { LoadingOrb } from '@/components/three/StatusObjects';
import { useAppSelector } from '@/store/hooks';

/** Protected shell: waits for auth bootstrap, then redirects anonymous visitors to /login. */
export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (status === 'ready' && !user) {
      router.replace('/login');
    }
  }, [status, user, router]);

  if (status !== 'ready' || !user) {
    return <LoadingOrb label="Preparing workspace" />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <Topbar />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-4 md:px-7">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
