'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/dashboard/StatCard';
import DistributionDonut from '@/components/dashboard/DistributionDonut';
import { PulseEmblem, RingEmblem, TasksEmblem, UsersEmblem } from '@/components/dashboard/Emblems';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { timeAgo } from '@/lib/format';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDashboard } from '@/store/adminSlice';
import type { ActivityLog } from '@/types';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function activityLine(log: ActivityLog) {
  const verb =
    log.actionType === 'task.created' ? 'created' : log.actionType === 'task.updated' ? 'updated' : 'deleted';
  return { verb, isDelete: log.actionType === 'task.deleted', isDone: (log.metadata as { to?: string } | null)?.to === 'completed' };
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { stats, statsLoading, recentLogs, error } = useAppSelector((state) => state.admin);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user && !isAdmin) {
      router.replace('/unauthorized');
      return;
    }
    dispatch(fetchDashboard());
  }, [dispatch, user, isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <div className="space-y-5 animate-rise-in">
      <p className="font-display text-lg font-semibold text-on-surface-variant">
        {greeting()}, <span className="text-[#f2f6fb]">{user.name.split(' ')[0]}</span>
      </p>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-[13px] border border-error/30 bg-error/10 px-4 py-3">
          <span className="text-[13px] text-[#ff9c9c]">{error}</span>
          <Button variant="secondary" size="sm" onClick={() => dispatch(fetchDashboard())}>
            Retry
          </Button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatCard label="Users" value={stats?.totalUsers ?? 0} hue="125,211,252" emblem={<UsersEmblem />} loading={statsLoading} />
        <StatCard label="Total tasks" value={stats?.totalTasks ?? 0} hue="200,160,240" emblem={<TasksEmblem />} loading={statsLoading} />
        <StatCard label="Completed" value={stats?.completedTasks ?? 0} hue="79,224,176" emblem={<RingEmblem />} loading={statsLoading} />
        <StatCard label="In progress" value={stats?.inProgressTasks ?? 0} hue="245,197,99" emblem={<PulseEmblem />} loading={statsLoading} />
      </div>

      {/* Distribution + activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-2xl border border-primary/10 bg-surface/55 p-5">
          <h2 className="mb-4 font-display text-sm font-semibold text-on-surface">Status distribution</h2>
          {statsLoading || !stats ? (
            <div className="flex items-center gap-6">
              <div className="skeleton h-[118px] w-[118px] rounded-full" />
              <div className="flex-1 space-y-2.5">
                <div className="skeleton h-3 w-3/4" />
                <div className="skeleton h-3 w-2/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ) : (
            <DistributionDonut stats={stats} />
          )}
        </section>

        <section className="rounded-2xl border border-primary/10 bg-surface/55 p-5">
          <h2 className="mb-4 font-display text-sm font-semibold text-on-surface">Recent activity</h2>
          {statsLoading ? (
            <div className="space-y-3.5">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <div className="skeleton h-[26px] w-[26px] rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3 w-4/5" />
                    <div className="skeleton h-2.5 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentLogs.length === 0 ? (
            <p className="py-6 text-center text-xs text-on-surface-faint">
              No activity yet — create a task to start the trail.
            </p>
          ) : (
            <div className="space-y-3.5">
              {recentLogs.map((log) => {
                const { verb, isDelete, isDone } = activityLine(log);
                return (
                  <div key={log.id} className="flex items-start gap-3">
                    <Avatar name={log.actor.name} size={26} />
                    <div className="min-w-0">
                      <p className="truncate text-xs text-[#cdd9e5]">
                        <b className="text-[#f2f6fb]">{log.actor.name}</b> {verb}{' '}
                        <b className={isDelete ? 'text-on-surface' : isDone ? 'text-[#79ecc4]' : 'text-on-surface'}>
                          {log.taskTitleSnapshot}
                        </b>
                        {isDone ? ' → Done' : ''}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-on-surface-faint">{timeAgo(log.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
