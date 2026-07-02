import { STATUS_META } from '@/lib/status';
import type { AdminStats } from '@/types';

/** Status donut drawn with a conic gradient; counts live in the legend. */
export default function DistributionDonut({ stats }: { stats: AdminStats }) {
  const done = stats.completedTasks;
  const progress = stats.inProgressTasks;
  const todo = stats.pendingTasks;
  const total = Math.max(done + progress + todo, 1);

  const doneTurn = done / total;
  const progressTurn = progress / total;
  const percent = Math.round(doneTurn * 100);

  const gradient = `conic-gradient(${STATUS_META.completed.color} 0turn ${doneTurn}turn, ${STATUS_META['in-progress'].color} ${doneTurn}turn ${doneTurn + progressTurn}turn, ${STATUS_META.pending.color} ${doneTurn + progressTurn}turn 1turn)`;

  const legend = [
    { label: 'Done', color: STATUS_META.completed.color, count: done },
    { label: 'In Progress', color: STATUS_META['in-progress'].color, count: progress },
    { label: 'To Do', color: STATUS_META.pending.color, count: todo },
  ];

  return (
    <div className="flex items-center gap-6">
      <div
        role="img"
        aria-label={`Task status distribution: ${percent}% complete`}
        className="flex h-[118px] w-[118px] shrink-0 items-center justify-center rounded-full"
        style={{ background: gradient }}
      >
        <div className="flex h-[78px] w-[78px] flex-col items-center justify-center rounded-full bg-surface">
          <span className="font-display text-[22px] font-semibold text-[#f2f6fb]">{percent}%</span>
          <span className="text-[10px] text-on-surface-faint">complete</span>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-xs text-[#cdd9e5]">
            <span aria-hidden className="h-2.5 w-2.5 rounded-[3px]" style={{ background: item.color }} />
            {item.label}
            <b className="ml-auto pl-4 font-semibold text-[#f2f6fb]">{item.count}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
