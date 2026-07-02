'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import TaskTable from '@/components/tasks/TaskTable';
import TaskModal from '@/components/tasks/TaskModal';
import DeleteConfirm from '@/components/tasks/DeleteConfirm';
import Button from '@/components/ui/Button';
import Segmented from '@/components/ui/Segmented';
import EmptyState from '@/components/ui/EmptyState';
import { TodoCube } from '@/components/three/StatusObjects';
import { STATUS_META, STATUSES } from '@/lib/status';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createTask,
  deleteTask,
  fetchTasks,
  moveTask,
  setPage,
  setSearch,
  setStatusFilter,
  setView,
  taskStatusChanged,
  updateTask,
} from '@/store/tasksSlice';
import { toastAdded } from '@/store/uiSlice';
import type { Task, TaskDraft, TaskStatus } from '@/types';

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const tasks = useAppSelector((state) => state.tasks);
  const isAdmin = user?.role === 'admin';

  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');
  const [editing, setEditing] = useState<Task | null>(null);
  const [presetStatus, setPresetStatus] = useState<TaskStatus>('pending');
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  // Debounced re-fetch on filters / view / page changes.
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(fetchTasks({ admin: Boolean(isAdmin) }));
    }, 250);
    return () => clearTimeout(timeout);
  }, [dispatch, isAdmin, tasks.search, tasks.statusFilter, tasks.page, tasks.view]);

  const openCreate = (status: TaskStatus = 'pending') => {
    setEditing(null);
    setPresetStatus(status);
    setModalError('');
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setModalError('');
    setModalOpen(true);
  };

  const handleSubmit = async (draft: TaskDraft) => {
    setModalError('');
    const action = editing
      ? await dispatch(updateTask({ id: editing.id, changes: draft }))
      : await dispatch(createTask(draft));

    if (updateTask.rejected.match(action) || createTask.rejected.match(action)) {
      setModalError((action.payload as string) || 'Unable to save task.');
      return;
    }

    setModalOpen(false);
    dispatch(toastAdded({ type: 'success', message: editing ? 'Task updated.' : 'Task created.' }));
    setEditing(null);
  };

  // Optimistic move: update the UI first, roll back if the request fails.
  const handleMove = async (task: Task, status: TaskStatus) => {
    if (task.status === status) return;
    const prevStatus = task.status;

    dispatch(taskStatusChanged({ id: task.id, status }));
    const action = await dispatch(moveTask({ id: task.id, status, prevStatus }));

    if (moveTask.rejected.match(action)) {
      dispatch(taskStatusChanged({ id: task.id, status: prevStatus }));
      dispatch(toastAdded({ type: 'error', message: (action.payload as string) || 'Unable to move task.' }));
      return;
    }

    dispatch(
      toastAdded({
        type: 'info',
        message: `Moved to ${STATUS_META[status].label}.`,
        undo: { taskId: task.id, prevStatus },
      }),
    );
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    const action = await dispatch(deleteTask(deleting.id));
    setDeleteBusy(false);

    if (deleteTask.rejected.match(action)) {
      dispatch(toastAdded({ type: 'error', message: (action.payload as string) || 'Unable to delete task.' }));
      return;
    }
    dispatch(toastAdded({ type: 'success', message: `Deleted “${deleting.title}”.` }));
    setDeleting(null);
  };

  const hasFilters = tasks.search !== '' || tasks.statusFilter !== '';

  return (
    <div className="space-y-5 animate-rise-in">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-[280px]">
            <Search size={14} strokeWidth={1.8} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-faint" />
            <input
              value={tasks.search}
              onChange={(event) => dispatch(setSearch(event.target.value))}
              placeholder="Search tasks…"
              aria-label="Search tasks"
              className="glass-input pl-9"
            />
          </div>
          <select
            value={tasks.statusFilter}
            onChange={(event) => dispatch(setStatusFilter(event.target.value as '' | TaskStatus))}
            aria-label="Filter by status"
            className="glass-input w-full cursor-pointer sm:w-[160px]"
          >
            <option value="">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_META[status].label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Segmented
            ariaLabel="Tasks view"
            value={tasks.view}
            options={[
              { value: 'board', label: 'Board' },
              { value: 'list', label: 'List' },
            ]}
            onChange={(view) => dispatch(setView(view))}
          />
          <Button variant="primary" onClick={() => openCreate()}>
            <Plus size={15} strokeWidth={2} />
            New task
          </Button>
        </div>
      </div>

      {/* Error state */}
      {tasks.error && !tasks.loading && (
        <div className="flex items-center justify-between gap-3 rounded-[13px] border border-error/30 bg-error/10 px-4 py-3">
          <span className="text-[13px] text-[#ff9c9c]">{tasks.error}</span>
          <Button variant="secondary" size="sm" onClick={() => dispatch(fetchTasks({ admin: Boolean(isAdmin) }))}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading skeletons */}
      {tasks.loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[0, 1, 2].map((column) => (
            <div key={column} className="space-y-2.5 rounded-2xl border border-primary/10 bg-[rgba(10,14,26,0.4)] p-3.5">
              <div className="skeleton h-4 w-24" />
              {[0, 1].map((row) => (
                <div key={row} className="space-y-2 rounded-xl border border-primary/8 bg-surface/50 p-3.5">
                  <div className="skeleton h-3.5 w-4/5" />
                  <div className="skeleton h-3 w-3/5" />
                  <div className="skeleton h-2.5 w-2/5" />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!tasks.loading && !tasks.error && tasks.items.length === 0 && (
        <div className="glass-panel rounded-2xl">
          <EmptyState
            art={<TodoCube size={64} />}
            title={hasFilters ? 'No matching tasks' : 'No tasks yet'}
            body={
              hasFilters
                ? 'Try a different search or clear the status filter.'
                : 'Create your first task and it will show up on the board.'
            }
            action={
              hasFilters ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    dispatch(setSearch(''));
                    dispatch(setStatusFilter(''));
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={() => openCreate()}>
                  <Plus size={14} strokeWidth={2} />
                  New task
                </Button>
              )
            }
          />
        </div>
      )}

      {/* Board / list */}
      {!tasks.loading && !tasks.error && tasks.items.length > 0 && (
        tasks.view === 'board' ? (
          <KanbanBoard
            tasks={tasks.items}
            isAdmin={Boolean(isAdmin)}
            onMove={handleMove}
            onEdit={openEdit}
            onDelete={setDeleting}
            onAdd={openCreate}
          />
        ) : (
          <TaskTable
            tasks={tasks.items}
            isAdmin={Boolean(isAdmin)}
            page={tasks.page}
            totalPages={tasks.totalPages}
            totalItems={tasks.totalItems}
            onPage={(page) => dispatch(setPage(page))}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
        )
      )}

      <TaskModal
        open={modalOpen}
        editing={editing}
        initialStatus={presetStatus}
        submitting={tasks.mutating}
        error={modalError}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
      <DeleteConfirm
        task={deleting}
        deleting={deleteBusy}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
