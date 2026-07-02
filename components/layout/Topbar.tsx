'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { PAGE_TITLES } from '@/lib/nav';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { mobileNavToggled } from '@/store/uiSlice';

/** Breadcrumb, page title, and the profile pill (which links to Settings). */
export default function Topbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const title = PAGE_TITLES[pathname] ?? 'TaskForge';

  return (
    <header className="flex items-center justify-between gap-4 px-5 pb-2 pt-5 md:px-7">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => dispatch(mobileNavToggled(true))}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-primary/12 bg-surface/70 text-on-surface-variant transition-colors hover:text-on-surface md:hidden focus-ring"
        >
          <Menu size={17} strokeWidth={1.8} />
        </button>
        <div>
          <div className="mb-1 flex items-center gap-2 font-mono text-[11px] text-on-surface-faint">
            <span>Home</span>
            <span>/</span>
            <span className="text-primary">{title}</span>
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-[#f2f6fb]">{title}</h1>
        </div>
      </div>

      {user && (
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-full border border-primary/12 bg-surface/70 py-1 pl-1 pr-3.5 transition-colors hover:border-primary/30 focus-ring"
        >
          <Avatar name={user.name} size={30} />
          <span className="hidden leading-tight sm:block">
            <span className="block text-xs font-semibold text-on-surface">{user.name}</span>
            <span className="block text-[10px] text-primary">{user.role === 'admin' ? 'Admin' : 'Member'}</span>
          </span>
        </Link>
      )}
    </header>
  );
}
