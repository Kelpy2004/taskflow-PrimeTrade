'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import RoleChip from '@/components/ui/RoleChip';
import Button from '@/components/ui/Button';
import { formatDateTime } from '@/lib/format';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <div className="max-w-2xl space-y-4 animate-rise-in">
      {/* Profile */}
      <section className="glass-panel rounded-2xl p-6">
        <h2 className="eyebrow mb-5 text-primary">Profile</h2>
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size={52} />
          <div className="min-w-0">
            <div className="font-display text-lg font-semibold text-[#f2f6fb]">{user.name}</div>
            <div className="truncate text-sm text-on-surface-variant">{user.email}</div>
          </div>
          <div className="ml-auto shrink-0">
            <RoleChip role={user.role} />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-2 border-t border-primary/8 pt-4 text-xs text-on-surface-variant sm:grid-cols-2">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-faint">Member since</span>
            <div className="mt-1">{formatDateTime(user.createdAt)}</div>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-faint">Access level</span>
            <div className="mt-1">
              {user.role === 'admin' ? 'Full workspace — users, all tasks, audit logs' : 'Personal tasks only'}
            </div>
          </div>
        </div>
      </section>

      {/* Session */}
      <section className="glass-panel rounded-2xl p-6">
        <h2 className="eyebrow mb-4 text-tertiary">Session</h2>
        <p className="text-[13px] leading-relaxed text-on-surface-variant">
          You&apos;re signed in with a JWT stored in this browser. The token authorizes API requests via a
          Bearer header — signing out clears it from this device.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-[10px] border border-primary/12 bg-[rgba(10,14,26,0.6)] px-3.5 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-faint">API</span>
          <span className="font-mono text-xs text-on-surface">/api/v1</span>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-[#79ecc4]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" style={{ boxShadow: '0 0 8px #4fe0b0' }} />
            authenticated
          </span>
        </div>
        <div className="mt-5 border-t border-primary/8 pt-4">
          <Button variant="danger" onClick={handleLogout}>
            <LogOut size={14} strokeWidth={1.8} />
            Sign out
          </Button>
        </div>
      </section>
    </div>
  );
}
