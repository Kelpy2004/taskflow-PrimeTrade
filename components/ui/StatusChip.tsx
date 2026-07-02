import { STATUS_META } from '@/lib/status';
import { StatusIcon } from '@/components/ui/icons';
import type { TaskStatus } from '@/types';

/** Status chip — pairs an icon with the label so color is never the only signal. */
export default function StatusChip({ status, size = 'md' }: { status: TaskStatus; size?: 'sm' | 'md' }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1.5 text-xs'
      }`}
      style={{ color: meta.text, background: meta.bg, border: `1px solid ${meta.border}` }}
    >
      <StatusIcon status={status} size={size === 'sm' ? 11 : 13} />
      {meta.label}
    </span>
  );
}
