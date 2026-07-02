'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { StatusIcon } from '@/components/ui/icons';
import { STATUSES, STATUS_META } from '@/lib/status';
import { formatDate } from '@/lib/format';
import type { Task, TaskStatus } from '@/types';

interface TaskCardProps {
  task: Task;
  isAdmin: boolean;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

/** Board card. Draggable with the mouse; the status select covers touch and keyboard. */
export default function TaskCard({
  task,
  isAdmin,
  dragging,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const meta = STATUS_META[task.status];
  const done = task.status === 'completed';

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', task.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`group rounded-xl p-3.5 transition-all duration-200 ${dragging ? 'opacity-40' : 'cursor-grab hover:-translate-y-0.5'}`}
      style={{
        background: done
          ? 'linear-gradient(160deg, rgba(26,36,56,0.7), rgba(15,21,36,0.6))'
          : 'linear-gradient(160deg, rgba(26,36,56,0.85), rgba(15,21,36,0.7))',
        border: `1px solid ${dragging ? meta.border : 'rgba(125,211,252,0.1)'}`,
        boxShadow: dragging ? `0 22px 44px -14px rgba(0,0,0,0.7), 0 0 24px -6px ${meta.border}` : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onEdit}
          className={`cursor-pointer text-left text-[13px] font-semibold transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline ${
            done ? 'text-[#cdd9e5] line-through decoration-[rgba(79,224,176,0.5)]' : 'text-on-surface'
          }`}
        >
          {task.title}
        </button>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            aria-label={`Edit ${task.title}`}
            onClick={onEdit}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-on-surface-faint transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <Pencil size={12} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${task.title}`}
            onClick={onDelete}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-on-surface-faint transition-colors hover:bg-error/15 hover:text-error"
          >
            <Trash2 size={12} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className={`mt-1.5 line-clamp-2 text-xs leading-relaxed ${done ? 'text-on-surface-faint' : 'text-on-surface-variant'}`}>
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-on-surface-faint" title="Created date">
          {formatDate(task.createdAt)}
        </span>
        <div className="flex items-center gap-2">
          {/* Status select — drag fallback for touch and keyboard users */}
          <label className="relative flex items-center md:hidden">
            <span className="sr-only">Change status of {task.title}</span>
            <span className="pointer-events-none absolute left-2" style={{ color: meta.text }}>
              <StatusIcon status={task.status} size={11} />
            </span>
            <select
              value={task.status}
              onChange={(event) => onStatusChange(event.target.value as TaskStatus)}
              className="cursor-pointer appearance-none rounded-full py-1 pl-7 pr-2.5 text-[11px] font-semibold outline-none"
              style={{ color: meta.text, background: meta.bg, border: `1px solid ${meta.border}` }}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status} className="bg-surface text-on-surface">
                  {STATUS_META[status].label}
                </option>
              ))}
            </select>
          </label>
          {isAdmin && <Avatar name={task.owner.name} size={22} />}
        </div>
      </div>
    </div>
  );
}
