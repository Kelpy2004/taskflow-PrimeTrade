'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { LogoMark } from '@/components/ui/icons';
import { FOOTER_NAV, MAIN_NAV, type NavItem } from '@/lib/nav';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { mobileNavToggled } from '@/store/uiSlice';

/** Mobile navigation: a slide-in drawer plus a bottom tab bar for the main pages. */
export default function MobileNav() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.mobileNavOpen);
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  const visible = (items: NavItem[]) => items.filter((item) => !item.adminOnly || isAdmin);
  const tabs = [...visible(MAIN_NAV).slice(0, 2), FOOTER_NAV[0]!];
  const close = () => dispatch(mobileNavToggled(false));

  return (
    <>
      {/* Drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          style={{ background: 'rgba(6,9,18,0.66)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="glass-strong flex h-full w-[260px] flex-col gap-1 p-4 animate-rise-in">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                <LogoMark size={28} />
                <span className="font-display text-[15px] font-semibold text-on-surface">TaskForge</span>
              </span>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={close}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-primary/12 text-on-surface-variant hover:text-on-surface"
              >
                <X size={15} strokeWidth={1.8} />
              </button>
            </div>
            {[...visible(MAIN_NAV), ...visible(FOOTER_NAV)].map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-[10px] px-3 py-3 text-sm transition-colors ${
                    active
                      ? 'font-semibold text-[#eafaff] border border-primary/24 bg-[linear-gradient(160deg,rgba(125,211,252,0.16),rgba(125,211,252,0.05))]'
                      : 'font-medium text-on-surface-variant border border-transparent hover:text-on-surface'
                  }`}
                >
                  <Icon size={17} strokeWidth={1.7} />
                  {item.label}
                  {item.adminOnly && (
                    <span className="ml-auto rounded-[5px] bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] text-primary">
                      ADMIN
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav
        aria-label="Quick navigation"
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-primary/10 bg-[rgba(10,14,26,0.85)] backdrop-blur-glass-strong md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {tabs.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                active ? 'text-primary' : 'text-on-surface-faint hover:text-on-surface-variant'
              }`}
            >
              <Icon size={18} strokeWidth={1.7} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
