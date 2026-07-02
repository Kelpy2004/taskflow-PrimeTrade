'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoMark } from '@/components/ui/icons';
import { FOOTER_NAV, MAIN_NAV, type NavItem } from '@/lib/nav';
import { useAppSelector } from '@/store/hooks';

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={`relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] transition-colors duration-200 focus-ring ${
        active
          ? 'font-semibold text-[#eafaff] border border-primary/24 bg-[linear-gradient(160deg,rgba(125,211,252,0.16),rgba(125,211,252,0.05))]'
          : 'font-medium text-on-surface-variant border border-transparent hover:bg-primary/6 hover:text-on-surface'
      }`}
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-[18px] w-[3px] -translate-y-1/2 rounded-[3px] bg-primary"
          style={{ boxShadow: '0 0 10px #7dd3fc' }}
        />
      )}
      <Icon size={16} strokeWidth={1.7} />
      {item.label}
      {item.adminOnly && (
        <span className="ml-auto rounded-[5px] bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] text-primary">
          ADMIN
        </span>
      )}
    </Link>
  );
}

/** Desktop sidebar. Sign-out deliberately lives on the Settings page, not here. */
export default function Sidebar() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  const visible = (items: NavItem[]) => items.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="sticky top-0 z-40 hidden h-screen w-[216px] shrink-0 flex-col gap-1 border-r border-primary/8 bg-surface/60 p-3.5 backdrop-blur-glass md:flex">
      <Link
        href={isAdmin ? '/dashboard' : '/tasks'}
        className="flex items-center gap-2.5 px-2 pb-4 pt-1 focus-ring rounded-lg"
      >
        <LogoMark size={28} />
        <span className="font-display text-[15px] font-semibold text-on-surface">TaskForge</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
        {visible(MAIN_NAV).map((item) => (
          <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
        ))}
        <div className="flex-1" />
        {FOOTER_NAV.map((item) => (
          <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
        ))}
      </nav>
    </aside>
  );
}
