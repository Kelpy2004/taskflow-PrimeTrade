import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Users, CheckSquare, Activity, AlertTriangle, TrendingUp, Download, MoreVertical, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/src/lib/utils';
import CreateTaskModal from '@/src/components/modals/CreateTaskModal';
import { api } from '@/src/lib/api';
import { downloadJson } from '@/src/lib/download';

function formatSecurityTimestamp(date: string) {
  try {
    const d = new Date(date);
    const when = d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    return `${when} • audit`;
  } catch {
    return 'Just now • audit';
  }
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });
  const [securityItems, setSecurityItems] = useState<Array<{ type: 'error' | 'admin' | 'success'; text: string; sub: string }>>([]);

  const load = async () => {
    const [statsRes, logsRes] = await Promise.all([
      api.getAdminStats(),
      api.getAdminLogs({ page: 1, limit: 3 }),
    ]);

    setStatsData({
      totalUsers: statsRes.stats.totalUsers,
      pendingTasks: statsRes.stats.pendingTasks,
      inProgressTasks: statsRes.stats.inProgressTasks,
      completedTasks: statsRes.stats.completedTasks,
    });

    const mapped = logsRes.items.map((log) => {
      const type = log.actionType === 'task.deleted' ? 'error' : log.actionType === 'task.updated' ? 'admin' : 'success';
      const verb = log.actionType === 'task.deleted' ? 'deleted' : log.actionType === 'task.updated' ? 'updated' : 'created';
      return {
        type,
        text: `${log.actor.name} ${verb} a task`,
        sub: formatSecurityTimestamp(log.createdAt),
      } as const;
    });

    setSecurityItems(
      mapped.length
        ? mapped
        : [
            { type: 'success', text: 'No recent audit activity yet', sub: 'Just now • audit' },
            { type: 'admin', text: 'Create a task to generate logs', sub: 'Tip • use the Create Task button' },
            { type: 'success', text: 'Admin stats are live', sub: 'Connected • backend' },
          ],
    );
  };

  useEffect(() => {
    load().catch(() => {
      // Keep UI stable even if backend is offline.
    });
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total Active Users', value: String(statsData.totalUsers), trend: '+12.5%', icon: Users, color: 'text-primary' },
      { label: 'Tasks in Progress', value: String(statsData.inProgressTasks), trend: '+8.2%', icon: CheckSquare, color: 'text-tertiary' },
      { label: 'System Health', value: '99.9%', trend: 'Uptime', icon: Activity, color: 'text-[#10b981]' },
      { label: 'Critical Flags', value: String(statsData.pendingTasks), trend: 'Requires Action', icon: AlertTriangle, color: 'text-error', highlight: true },
    ],
    [statsData.inProgressTasks, statsData.pendingTasks, statsData.totalUsers],
  );

  const chartData = useMemo(
    () => [
      { name: 'Done', value: statsData.completedTasks },
      { name: 'Review', value: statsData.pendingTasks },
      { name: 'Progress', value: statsData.inProgressTasks },
      { name: 'Blocked', value: 0 },
    ],
    [statsData.completedTasks, statsData.inProgressTasks, statsData.pendingTasks],
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isSubmitting={isSaving}
        error={modalError}
        onSubmit={async (values) => {
          setIsSaving(true);
          setModalError('');
          try {
            await api.createTask(values);
            setIsModalOpen(false);
            await load();
          } catch (err) {
            setModalError(err instanceof Error ? err.message : 'Unable to create task.');
          } finally {
            setIsSaving(false);
          }
        }}
      />
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-semibold text-on-surface tracking-tight">Overview</h2>
          <p className="text-on-surface-variant text-sm mt-1">System status and global metrics</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="glass-button-primary px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
          <button
            type="button"
            onClick={() =>
              downloadJson('dashboard-report.json', {
                exportedAt: new Date().toISOString(),
                stats: statsData,
                recentAudit: securityItems,
              })
            }
            className="glass-button-secondary px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className={cn(
              "glass-panel rounded-xl p-5 relative overflow-hidden group",
              stat.highlight && "border-error/20 shadow-[0_0_20px_rgba(255,107,107,0.05)]"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <span className={cn(
                "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border",
                stat.color === 'text-error' ? "bg-error/10 border-error/20 text-error" : "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
              )}>
                {stat.trend.includes('+') && <TrendingUp className="w-3 h-3" />}
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface-variant mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-on-surface tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-on-surface">Global Task Status</h3>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3a48" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#a0b4c4" dy={10} />
                <YAxis axisLine={false} tickLine={false} stroke="#a0b4c4" />
                <Tooltip 
                  cursor={{ fill: 'rgba(125, 211, 252, 0.05)' }}
                  contentStyle={{ backgroundColor: '#1a2438', border: '1px solid rgba(125, 211, 252, 0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Bar 
                      key={`cell-${index}`} 
                      fill={index % 2 === 0 ? "url(#colorPrimary)" : "url(#colorTertiary)"} 
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorTertiary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c8a0f0" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#c8a0f0" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-xl flex flex-col">
          <div className="p-6 border-b border-primary/10 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-on-surface">Security Log</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">Live</span>
          </div>
          <div className="p-2 space-y-1">
            {securityItems.map((activity, i) => (
              <div key={i} className="flex gap-4 p-4 hover:bg-white/5 rounded-lg transition-colors group">
                <div className={cn(
                  "w-8 h-8 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                  activity.type === 'error' ? "bg-error/10 border-error/30 text-error" : 
                  activity.type === 'admin' ? "bg-tertiary/10 border-tertiary/30 text-tertiary" : 
                  "bg-primary/10 border-primary/30 text-primary"
                )}>
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-on-surface">{activity.text}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{activity.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
