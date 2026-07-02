'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';
import { StatusIcon } from '@/components/ui/icons';
import { DoneSphere, ProgressCapsule, TodoCube } from '@/components/three/StatusObjects';
import { STATUSES, STATUS_META } from '@/lib/status';
import type { Task, TaskStatus } from '@/types';

interface KanbanBoardProps {
  tasks: Task[];
  isAdmin: boolean;
  onMove: (task: Task, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAdd: (status: TaskStatus) => void;
}

const EMPTY_COPY: Record<TaskStatus, { art: React.ReactNode; text: string }> = {
  pending: { art: <TodoCube size={54} />, text: 'Nothing queued. Add a task to get started.' },
  'in-progress': { art: <ProgressCapsule width={44} height={70} />, text: 'Nothing in flight. Drag a card here to start it.' },
  completed: { art: <DoneSphere size={56} />, text: 'Clear! Ship the next one.' },
};

/** Three-column board wired to native HTML5 drag and drop. */
export default function KanbanBoard({ tasks, isAdmin, onMove, onEdit, onDelete, onAdd }: KanbanBoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);

  const draggingTask = tasks.find((task) => task.id === draggingId) ?? null;

  const handleDrop = (status: TaskStatus) => {
    if (draggingTask && draggingTask.status !== status) {
      onMove(draggingTask, status);
    }
    setDraggingId(null);
    setDropTarget(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {STATUSES.map((status) => {
        const meta = STATUS_META[status];
        const columnTasks = tasks.filter((task) => task.status === status);
        const isTarget = dropTarget === status && draggingTask !== null && draggingTask.status !== status;

        return (
          <section
            key={status}
            aria-label={`${meta.label} column`}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
              if (dropTarget !== status) setDropTarget(status);
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setDropTarget((current) => (current === status ? null : current));
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              handleDrop(status);
            }}
            className="flex min-h-[280px] flex-col rounded-2xl p-3.5 transition-colors duration-200"
            style={{
              background: 'rgba(10,14,26,0.4)',
              border: `1px solid ${isTarget ? meta.border : `${meta.color}29`}`,
            }}
          >
            <header className="mb-3.5 flex items-center justify-between px-0.5">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: meta.text }}>
                <StatusIcon status={status} size={13} />
                {meta.label}
              </span>
              <span
                className="rounded-full px-2 py-0.5 font-mono text-[11px] text-on-surface-faint"
                style={{ background: meta.bg }}
              >
                {columnTasks.length}
              </span>
            </header>

            <div className="flex flex-1 flex-col gap-2.5">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isAdmin={isAdmin}
                  dragging={draggingId === task.id}
                  onDragStart={() => setDraggingId(task.id)}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setDropTarget(null);
                  }}
                  onEdit={() => onEdit(task)}
                  onDelete={() => onDelete(task)}
                  onStatusChange={(next) => onMove(task, next)}
                />
              ))}

              {/* Drop slot while dragging over */}
              {isTarget && (
                <div
                  className="flex items-center justify-center gap-2 rounded-xl py-4 text-xs font-medium"
                  style={{
                    border: `1.5px dashed ${meta.border}`,
                    background: `${meta.color}0d`,
                    color: meta.text,
                  }}
                >
                  <Plus size={13} strokeWidth={1.8} />
                  Drop here
                </div>
              )}

              {/* Per-column empty state */}
              {columnTasks.length === 0 && !isTarget && (
                <div
                  className="flex flex-col items-center gap-2.5 rounded-xl px-3 py-6 text-center"
                  style={{ border: `1px dashed ${meta.color}33` }}
                >
                  {EMPTY_COPY[status].art}
                  <span className="text-[11px] text-on-surface-faint">{EMPTY_COPY[status].text}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => onAdd(status)}
                className="mt-auto flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-transparent py-2.5 text-xs font-medium text-on-surface-faint transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-on-surface-variant focus-ring"
              >
                <Plus size={13} strokeWidth={1.8} />
                Add card
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
