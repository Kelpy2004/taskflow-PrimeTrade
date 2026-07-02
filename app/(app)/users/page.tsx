'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import RoleChip from '@/components/ui/RoleChip';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { TodoCube } from '@/components/three/StatusObjects';
import { formatDate } from '@/lib/format';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers, setUsersPage } from '@/store/adminSlice';

const HEAD = 'px-4 py-3 font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-on-surface-faint';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { users, usersPage, usersTotalPages, usersTotalItems, usersLoading, error } = useAppSelector(
    (state) => state.admin,
  );

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user && !isAdmin) {
      router.replace('/unauthorized');
      return;
    }
    const timeout = setTimeout(() => {
      dispatch(fetchUsers({ search, role, page: usersPage }));
    }, 250);
    return () => clearTimeout(timeout);
  }, [dispatch, user, isAdmin, router, search, role, usersPage]);

  if (!isAdmin) return null;

  return (
    <div className="space-y-5 animate-rise-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-[280px]">
          <Search size={14} strokeWidth={1.8} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-faint" />
          <input
            value={search}
            onChange={(event) => {
              dispatch(setUsersPage(1));
              setSearch(event.target.value);
            }}
            placeholder="Search users…"
            aria-label="Search users"
            className="glass-input pl-9"
          />
        </div>
        <select
          value={role}
          onChange={(event) => {
            dispatch(setUsersPage(1));
            setRole(event.target.value);
          }}
          aria-label="Filter by role"
          className="glass-input w-full cursor-pointer sm:w-[150px]"
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">Member</option>
        </select>
      </div>

      {error && !usersLoading && (
        <div className="flex items-center justify-between gap-3 rounded-[13px] border border-error/30 bg-error/10 px-4 py-3">
          <span className="text-[13px] text-[#ff9c9c]">{error}</span>
          <Button variant="secondary" size="sm" onClick={() => dispatch(fetchUsers({ search, role, page: usersPage }))}>
            Retry
          </Button>
        </div>
      )}

      <div className="overflow-hidden rounded-[14px] border border-primary/10">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[rgba(10,14,26,0.6)]">
                <th className={HEAD}>User</th>
                <th className={HEAD}>Role</th>
                <th className={HEAD}>Tasks</th>
                <th className={HEAD}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading
                ? [0, 1, 2, 3].map((row) => (
                    <tr key={row} className="border-t border-primary/6 bg-surface/50">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="skeleton h-[30px] w-[30px] rounded-full" />
                          <div className="space-y-1.5">
                            <div className="skeleton h-3 w-28" />
                            <div className="skeleton h-2.5 w-36" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><div className="skeleton h-5 w-16 rounded-[7px]" /></td>
                      <td className="px-4 py-3.5"><div className="skeleton h-3 w-8" /></td>
                      <td className="px-4 py-3.5"><div className="skeleton h-3 w-14" /></td>
                    </tr>
                  ))
                : users.map((row) => (
                    <tr key={row.id} className="border-t border-primary/6 bg-surface/50 transition-colors hover:bg-surface-variant/70">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={row.name} size={30} />
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-medium text-on-surface">{row.name}</div>
                            <div className="truncate text-xs text-on-surface-faint">{row.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><RoleChip role={row.role} /></td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-on-surface-variant">{row.taskCount}</td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-on-surface-faint">{formatDate(row.createdAt)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!usersLoading && users.length === 0 && !error && (
          <EmptyState
            art={<TodoCube size={54} />}
            title="No users found"
            body="Try a different search or clear the role filter."
          />
        )}

        <Pagination
          page={usersPage}
          totalPages={usersTotalPages}
          totalItems={usersTotalItems}
          shown={users.length}
          noun="users"
          onPage={(page) => dispatch(setUsersPage(page))}
        />
      </div>
    </div>
  );
}
