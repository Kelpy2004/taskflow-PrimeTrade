import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  CheckSquare,
  ScanSearch,
} from 'lucide-react';
import CreateTaskModal from '@/src/components/modals/CreateTaskModal';
import TaskDetailsModal from '@/src/components/modals/TaskDetailsModal';
import { useAuth } from '@/src/context/AuthContext';
import { api } from '@/src/lib/api';
import { formatDateTime, formatRelativeStatus } from '@/src/lib/format';
import { cn } from '@/src/lib/utils';
import type { Task } from '@/src/types/api';

const emptyDraft = {
  title: '',
  description: '',
  status: 'pending' as const,
};

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [lookupId, setLookupId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTask, setDetailsTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response =
        user?.role === 'admin'
          ? await api.getAdminTasks({ search, status, page, limit: 8 })
          : await api.getTasks({ search, status, page, limit: 8 });

      setTasks(response.items);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadTasks();
    }, 250);

    return () => clearTimeout(timeout);
  }, [page, search, status, user?.role]);

  const stats = useMemo(() => {
    return {
      pending: tasks.filter((task) => task.status === 'pending').length,
      inProgress: tasks.filter((task) => task.status === 'in-progress').length,
      completed: tasks.filter((task) => task.status === 'completed').length,
    };
  }, [tasks]);

  const handleCreate = () => {
    setEditingTask(null);
    setModalError('');
    setModalOpen(true);
  };

  const handleSubmit = async (values: typeof emptyDraft) => {
    setIsSubmitting(true);
    setModalError('');

    try {
      if (editingTask) {
        await api.updateTask(editingTask.id, values);
        setSuccess('Task updated successfully.');
      } else {
        await api.createTask(values);
        setSuccess('Task created successfully.');
      }

      setModalOpen(false);
      setEditingTask(null);
      await loadTasks();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Unable to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (task: Task) => {
    const confirmed = window.confirm(`Delete "${task.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteTask(task.id);
      setSuccess('Task deleted successfully.');
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete task.');
    }
  };

  const openDetails = (task: Task) => {
    setDetailsTask(task);
    setDetailsOpen(true);
  };

  const handleLookup = async () => {
    if (!lookupId.trim()) return;
    setError('');
    setSuccess('');
    try {
      const res = await api.getTask(lookupId.trim());
      openDetails(res.task);
      setSuccess('Loaded task by ID.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch task by id.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <CreateTaskModal
        isOpen={modalOpen}
        mode={editingTask ? 'edit' : 'create'}
        initialValues={
          editingTask
            ? {
                title: editingTask.title,
                description: editingTask.description,
                status: editingTask.status,
              }
            : emptyDraft
        }
        isSubmitting={isSubmitting}
        error={modalError}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
      <TaskDetailsModal isOpen={detailsOpen} task={detailsTask} onClose={() => setDetailsOpen(false)} />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-semibold text-on-surface tracking-tight">Tasks</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            {user?.role === 'admin'
              ? 'Monitor all tasks across the platform and step in when needed.'
              : 'Manage your assigned work with real CRUD, filtering, and persistence.'}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="glass-button-primary px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending', value: stats.pending },
          { label: 'In Progress', value: stats.inProgress },
          { label: 'Completed', value: stats.completed },
        ].map((card) => (
          <div key={card.label} className="glass-panel rounded-xl p-5">
            <p className="text-sm font-medium text-on-surface-variant mb-2">{card.label}</p>
            <div className="text-3xl font-bold text-on-surface">{loading ? '--' : card.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            className="glass-input w-full pl-10 pr-4 py-2 text-sm"
            placeholder="Search tasks..."
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 glass-button-secondary px-3 py-2 rounded-lg text-sm">
            <Filter className="w-4 h-4" />
            <select
              value={status}
              onChange={(event) => {
                setPage(1);
                setStatus(event.target.value);
              }}
              className="bg-transparent outline-none"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-2 glass-panel rounded-lg px-3 py-2 w-full md:w-[340px]">
            <ScanSearch className="w-4 h-4 text-on-surface-variant" />
            <input
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="Fetch by task id..."
              className="bg-transparent border-none outline-none text-sm text-on-surface w-full placeholder:text-on-surface-variant/50 focus:ring-0 p-0"
            />
            <button
              onClick={handleLookup}
              className="glass-button-primary px-3 py-1.5 rounded-md text-xs font-semibold"
            >
              Fetch
            </button>
          </div>
        </div>
      </div>

      {error && <div className="glass-panel rounded-xl p-4 text-sm text-error">{error}</div>}
      {success && <div className="glass-panel rounded-xl p-4 text-sm text-emerald-300 border border-emerald-400/20">{success}</div>}

      <div className="glass-elevated rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/10 bg-surface-container/30">
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Task</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                {user?.role === 'admin' && (
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Owner</th>
                )}
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Updated</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <button
                          onClick={() => openDetails(task)}
                          className="font-medium text-on-surface text-left hover:text-primary transition-colors"
                        >
                          {task.title}
                        </button>
                        <div className="text-on-surface-variant text-xs mt-0.5 max-w-xl">{task.description || 'No description provided.'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                      task.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : task.status === 'in-progress'
                          ? 'bg-tertiary/10 text-tertiary border-tertiary/20'
                          : 'bg-primary/10 text-primary border-primary/20',
                    )}>
                      {formatRelativeStatus(task.status)}
                    </span>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      <div className="font-medium text-on-surface">{task.owner?.name || 'Unknown owner'}</div>
                      <div className="text-xs">{task.owner?.email || ''}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{formatDateTime(task.updatedAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setModalError('');
                          setModalOpen(true);
                        }}
                        className="glass-button-secondary px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task)}
                        className="px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 bg-error/10 border border-error/20 text-error hover:bg-error/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && tasks.length === 0 && (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 5 : 4} className="px-6 py-12 text-center">
                    <div className="text-on-surface font-medium">No tasks found</div>
                    <div className="text-sm text-on-surface-variant mt-1">
                      Try a different search, change filters, or create a new task.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-primary/10 bg-surface-container/20 flex items-center justify-between">
          <div className="text-sm text-on-surface-variant">
            Showing <span className="font-medium text-on-surface">{tasks.length}</span> of{' '}
            <span className="font-medium text-on-surface">{totalItems}</span> tasks
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              className="glass-button-secondary w-8 h-8 rounded flex items-center justify-center disabled:opacity-50"
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-sm text-on-surface-variant">
              Page <span className="font-medium text-on-surface">{page}</span> of{' '}
              <span className="font-medium text-on-surface">{totalPages}</span>
            </div>
            <button
              onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
              className="glass-button-secondary w-8 h-8 rounded flex items-center justify-center disabled:opacity-50"
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
