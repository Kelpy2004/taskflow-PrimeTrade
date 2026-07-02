import { Info, LayoutDashboard, ListTodo, ScrollText, Settings, Users } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
}

export const MAIN_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/users', label: 'Users', icon: Users, adminOnly: true },
  { href: '/audit-logs', label: 'Audit Logs', icon: ScrollText, adminOnly: true },
];

export const FOOTER_NAV: NavItem[] = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/about', label: 'About', icon: Info },
];

export const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
  '/users': 'Users',
  '/audit-logs': 'Audit Logs',
  '/settings': 'Settings',
  '/about': 'About',
};
