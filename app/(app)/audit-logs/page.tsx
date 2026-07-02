'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { TodoCube } from '@/components/three/StatusObjects';
import { formatDateTime } from '@/lib/format';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLogs, setLogsPage } from '@/store/adminSlice';
import type { ActionType } from '@/types';

const HEAD = 'px-4 py-3 font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-on-surface-faint';

const ACTION_META: Record<ActionType, { label: string; text: string; bg: string; border: string }> = {
  'task.created': { label: 'Created', text: '#79ecc4', bg: 'rgba(79,224,176,0.13)', border: 'rgba(79,224,176,0.32)' },
  'task.updated': { label: 'Updated', text: '#aae4fe', bg: 'rgba(125,211,252,0.12)', border: 'rgba(125,211,252,0.3)' },
  'task.deleted': { label: 'Deleted', text: '#ff9c9c', bg: 'rgba(255,107,107,0.13)', border: 'rgba(255,107,107,0.32)' },
};

function ActionChip({ actionType }: { actionType: ActionType }) {
  const meta = ACTION_META[actionType];
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ color: meta.text, background: meta.bg, border: `1px solid ${meta.border}` }}
    >
      {meta.label}
    </span>
  );
}

export default function AuditLogsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { logs, logsPage, logsTotalPages, logsTotalItems, logsLoading, error } = useAppSelector(
    (state) => state.admin,
  );

  const [search, setSearch] = useState('');
  const [actionType, setActionType] = useState('');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user && !isAdmin) {
      router.replace('/unauthorized');
      return;
    }
    const timeout = setTimeout(() => {
      dispatch(fetchLogs({ search, actionType, page: logsPage }));
    }, 250);
    return () => clearTimeout(timeout);
  }, [dispatch, user, isAdmin, router, search, actionType, logsPage]);

  if (!isAdmin) return null;

  return (
    <div className="space-y-5 animate-rise-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-[280px]">
          <Search size={14} strokeWidth={1.8} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-faint" />
          <input
            value={search}
            onChange={(event) => {
              dispatch(setLogsPage(1));
              setSearch(event.target.value);
            }}
            placeholder="Search logs…"
            aria-label="Search audit logs"
            className="glass-input pl-9"
          />
        </div>
        <select
          value={actionType}
          onChange={(event) => {
            dispatch(setLogsPage(1));
            setActionType(event.target.value);
          }}
          aria-label="Filter by action"
          className="glass-input w-full cursor-pointer sm:w-[170px]"
        >
          <option value="">All actions</option>
          <option value="task.created">Created</option>
          <option value="task.updated">Updated</option>
          <option value="task.deleted">Deleted</option>
        </select>
      </div>

      {error && !logsLoading && (
        <div className="flex items-center justify-between gap-3 rounded-[13px] border border-error/30 bg-error/10 px-4 py-3">
          <span className="text-[13px] text-[#ff9c9c]">{error}</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch(fetchLogs({ search, actionType, page: logsPage }))}
          >
            Retry
          </Button>
        </div>
      )}

      <div className="overflow-hidden rounded-[14px] border border-primary/10">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[rgba(10,14,26,0.6)]">
                <th className={HEAD}>Actor</th>
                <th className={HEAD}>Action</th>
                <th className={HEAD}>Task</th>
                <th className={HEAD}>When</th>
              </tr>
            </thead>
            <tbody>
              {logsLoading
                ? [0, 1, 2, 3, 4].map((row) => (
                    <tr key={row} className="border-t border-primary/6 bg-surface/50">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="skeleton h-[26px] w-[26px] rounded-full" />
                          <div className="skeleton h-3 w-24" />
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><div className="skeleton h-5 w-16 rounded-full" /></td>
                      <td className="px-4 py-3.5"><div className="skeleton h-3 w-40" /></td>
                      <td className="px-4 py-3.5"><div className="skeleton h-3 w-24" /></td>
                    </tr>
                  ))
                : logs.map((log) => (
                    <tr key={log.id} className="border-t border-primary/6 bg-surface/50 transition-colors hover:bg-surface-variant/70">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={log.actor.name} size={26} />
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-medium text-on-surface">{log.actor.name}</div>
                            <div className="truncate text-[11px] text-on-surface-faint">{log.actor.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><ActionChip actionType={log.actionType} /></td>
                      <td className="max-w-xs px-4 py-3.5">
                        <span className="line-clamp-1 text-[13px] text-on-surface-variant">{log.taskTitleSnapshot}</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-on-surface-faint">{formatDateTime(log.createdAt)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!logsLoading && logs.length === 0 && !error && (
          <EmptyState
            art={<TodoCube size={54} />}
            title="No activity yet"
            body="Task creates, updates and deletes will appear here as they happen."
          />
        )}

        <Pagination
          page={logsPage}
          totalPages={logsTotalPages}
          totalItems={logsTotalItems}
          shown={logs.length}
          noun="entries"
          onPage={(page) => dispatch(setLogsPage(page))}
        />
      </div>
    </div>
  );
}
