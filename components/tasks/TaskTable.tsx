'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import StatusChip from '@/components/ui/StatusChip';
import Pagination from '@/components/ui/Pagination';
import { formatDate } from '@/lib/format';
import type { Task } from '@/types';

interface TaskTableProps {
  tasks: Task[];
  isAdmin: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPage: (page: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const HEAD = 'px-4 py-3 font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-on-surface-faint';

/** Table view of tasks with server-side pagination. */
export default function TaskTable({
  tasks,
  isAdmin,
  page,
  totalPages,
  totalItems,
  onPage,
  onEdit,
  onDelete,
}: TaskTableProps) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-primary/10">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[rgba(10,14,26,0.6)]">
              <th className={HEAD}>Task</th>
              <th className={HEAD}>Status</th>
              {isAdmin && <th className={HEAD}>Owner</th>}
              <th className={HEAD}>Created</th>
              <th className={`${HEAD} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-t border-primary/6 bg-surface/50 transition-colors hover:bg-surface-variant/70"
              >
                <td className="max-w-md px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="cursor-pointer text-left text-[13px] font-medium text-on-surface transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
                  >
                    {task.title}
                  </button>
                  {task.description && (
                    <div className="mt-0.5 line-clamp-1 text-xs text-on-surface-faint">{task.description}</div>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <StatusChip status={task.status} size="sm" />
                </td>
                {isAdmin && (
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <Avatar name={task.owner.name} size={22} />
                      {task.owner.name}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3.5 font-mono text-[11px] text-on-surface-faint">{formatDate(task.createdAt)}</td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${task.title}`}
                      onClick={() => onEdit(task)}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-on-surface-faint transition-colors hover:bg-primary/10 hover:text-primary focus-ring"
                    >
                      <Pencil size={13} strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${task.title}`}
                      onClick={() => onDelete(task)}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-on-surface-faint transition-colors hover:bg-error/15 hover:text-error focus-ring"
                    >
                      <Trash2 size={13} strokeWidth={1.8} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        shown={tasks.length}
        noun="tasks"
        onPage={onPage}
      />
    </div>
  );
}
