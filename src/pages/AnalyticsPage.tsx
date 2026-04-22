import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { History, Search, Filter, Download, PlusCircle, FileEdit, Trash2, RefreshCw, ChevronLeft, ChevronRight, Tags } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { api } from '@/src/lib/api';
import type { ActivityLog } from '@/src/types/api';
import { downloadCsv } from '@/src/lib/download';

function formatLogTime(date: string) {
  try {
    const d = new Date(date);
    const month = d.toLocaleString('en-US', { month: 'short' });
    const day = d.toLocaleString('en-US', { day: '2-digit' });
    const time = d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${month} ${day}, ${time}`;
  } catch {
    return 'Unknown';
  }
}

function toType(actionType: ActivityLog['actionType']) {
  if (actionType === 'task.created') return 'create' as const;
  if (actionType === 'task.updated') return 'update' as const;
  if (actionType === 'task.deleted') return 'delete' as const;
  return 'system' as const;
}

export default function AnalyticsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');
  const [actionType, setActionType] = useState<ActivityLog['actionType'] | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const handle = setTimeout(() => {
      api
        .getAdminLogs({ search, actionType, page, limit: 6 })
        .then((res) => {
          setLogs(res.items);
          setTotalPages(res.totalPages);
          setTotalItems(res.totalItems);
        })
        .catch(() => {
          setLogs([]);
          setTotalPages(1);
          setTotalItems(0);
        });
    }, 250);

    return () => clearTimeout(handle);
  }, [actionType, page, search]);

  const derived = useMemo(() => {
    const deletes = logs.filter((l) => l.actionType === 'task.deleted').length;
    const actors = new Set(logs.map((l) => l.actor.email)).size;
    return { deletes, actors };
  }, [logs]);

  const stats = useMemo(() => ([
    { label: 'Total Events (24h)', value: String(totalItems), trend: '+12%', icon: History, color: 'text-primary' },
    { label: 'Critical Actions', value: String(derived.deletes), trend: '3%', icon: History, color: 'text-error' },
    { label: 'Active Actors', value: String(derived.actors), trend: '0%', icon: History, color: 'text-secondary' },
  ]), [derived.actors, derived.deletes, totalItems]);

  const uiLogs = useMemo(() => {
    return logs.map((log) => {
      const type = toType(log.actionType);
      const event =
        log.actionType === 'task.created'
          ? 'Task Created'
          : log.actionType === 'task.updated'
            ? 'Status Updated'
            : 'Task Deleted';
      const action =
        log.actionType === 'task.created'
          ? 'task.create'
          : log.actionType === 'task.updated'
            ? 'task.update'
            : 'task.delete';
      const target = log.task ? log.task.slice(-6).toUpperCase() : log.taskTitleSnapshot;
      return {
        event,
        action,
        actor: log.actor.name,
        email: log.actor.email,
        target,
        time: formatLogTime(log.createdAt),
        type,
      };
    });
  }, [logs]);

  const cycleFilter = () => {
    setPage(1);
    setActionType((current) => {
      if (!current) return 'task.created';
      if (current === 'task.created') return 'task.updated';
      if (current === 'task.updated') return 'task.deleted';
      return '';
    });
  };

  const showing = useMemo(() => {
    const start = totalItems === 0 ? 0 : (page - 1) * 6 + 1;
    const end = Math.min(page * 6, totalItems);
    return { start, end };
  }, [page, totalItems]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            Audit Logs
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">System-wide chronological record of task activity, admin actions, and reviewer-ready traces.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative glass-panel rounded-full px-4 py-2 flex items-center min-w-[240px]">
            <Search className="w-4 h-4 text-on-surface-variant mr-2" />
            <input 
              type="text"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="bg-transparent border-none text-sm text-on-surface focus:ring-0 w-full placeholder:text-on-surface-variant/50 p-0 h-auto" 
              placeholder="Search logs..." 
            />
          </div>
          <button
            onClick={cycleFilter}
            className="glass-panel hover:bg-surface-variant/50 transition-colors rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium"
            title="Cycles through create/update/delete filters"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            type="button"
            onClick={() =>
              downloadCsv(
                'audit-logs.csv',
                ['Event', 'Action', 'Actor', 'Email', 'Target', 'Timestamp'],
                uiLogs.map((log) => [log.event, log.action, log.actor, log.email, log.target, log.time]),
              )
            }
            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={stat.label} className="glass-elevated rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">{stat.label}</h3>
              <div className="text-4xl font-bold text-on-surface mb-2">{stat.value}</div>
              <div className="flex items-center text-sm">
                <span className={cn("font-medium", i === 1 ? "text-error" : "text-emerald-400")}>{stat.trend}</span>
                <span className="text-on-surface-variant ml-2 text-xs">vs yesterday</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-xl border border-outline-variant overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-variant/30">
                <th className="py-4 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-16">Event</th>
                <th className="py-4 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Action</th>
                <th className="py-4 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actor</th>
                <th className="py-4 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Target</th>
                <th className="py-4 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {uiLogs.map((log, i) => (
                <tr key={i} className={cn(
                  "hover:bg-surface-variant/20 transition-colors group",
                  log.type === 'delete' && "bg-error/5"
                )}>
                  <td className="py-4 px-6">
                    <div className={cn(
                      "w-8 h-8 rounded border flex items-center justify-center",
                      log.type === 'create' ? "bg-primary/10 border-primary/20 text-primary" :
                      log.type === 'update' ? "bg-secondary/10 border-secondary/20 text-secondary" :
                      log.type === 'delete' ? "bg-error/10 border-error/20 text-error" :
                      "bg-tertiary/10 border-tertiary/20 text-tertiary"
                    )}>
                      {log.type === 'create' ? <PlusCircle className="w-4 h-4" /> :
                       log.type === 'update' ? <FileEdit className="w-4 h-4" /> :
                       log.type === 'delete' ? <Trash2 className="w-4 h-4" /> :
                       <RefreshCw className="w-4 h-4" />}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className={cn("font-medium", log.type === 'delete' ? "text-error" : "text-on-surface")}>{log.event}</span>
                      <span className="text-xs text-on-surface-variant mt-0.5">{log.action}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant font-medium text-[10px] text-on-surface-variant">
                        {log.actor.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-on-surface font-medium text-sm">{log.actor}</span>
                        <span className="text-xs text-on-surface-variant">{log.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-surface-variant border border-outline-variant text-on-surface text-xs font-medium">
                      <Tags className="w-3 h-3 text-primary opacity-70" />
                      {log.target}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-on-surface-variant font-mono text-xs">
                    {log.time}
                  </td>
                </tr>
              ))}
              {uiLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 px-6 text-center text-sm text-on-surface-variant">
                    No audit logs matched the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="border-t border-outline-variant bg-surface-variant/20 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">Showing {showing.start} to {showing.end} of {totalItems} entries</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-variant disabled:opacity-50"
              disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-md flex items-center justify-center bg-primary/20 text-primary border border-primary/30 font-medium text-sm">{page}</button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-variant disabled:opacity-50"
              disabled={page >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
