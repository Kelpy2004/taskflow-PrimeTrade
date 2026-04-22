import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, ExternalLink } from 'lucide-react';
import type { Task } from '@/src/types/api';
import { formatDateTime, formatRelativeStatus } from '@/src/lib/format';

export default function TaskDetailsModal({
  isOpen,
  task,
  onClose,
}: {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}) {
  const handleCopy = async () => {
    if (!task) return;
    try {
      await navigator.clipboard.writeText(task.id);
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {isOpen && task && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              className="glass-panel glow-effect rounded-xl w-full max-w-2xl shadow-2xl relative pointer-events-auto overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div>
                  <h2 className="font-semibold text-xl text-on-surface tracking-tight">Task Details</h2>
                  <p className="text-xs text-on-surface-variant mt-1">API-driven view for GET /tasks/:id</p>
                </div>
                <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="text-on-surface font-semibold text-lg">{task.title}</div>
                    <div className="text-sm text-on-surface-variant mt-1">{task.description || 'No description provided.'}</div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold">
                    {formatRelativeStatus(task.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-elevated rounded-xl p-4">
                    <div className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Task ID</div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="font-mono text-xs text-on-surface break-all">{task.id}</div>
                      <button
                        onClick={handleCopy}
                        className="glass-button-secondary px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="glass-elevated rounded-xl p-4">
                    <div className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Owner</div>
                    <div className="mt-2 text-sm text-on-surface">
                      <div className="font-semibold">{task.owner?.name || 'Unknown'}</div>
                      <div className="text-xs text-on-surface-variant">{task.owner?.email || ''}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-elevated rounded-xl p-4">
                    <div className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Created</div>
                    <div className="mt-2 text-sm text-on-surface">{formatDateTime(task.createdAt)}</div>
                  </div>
                  <div className="glass-elevated rounded-xl p-4">
                    <div className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Updated</div>
                    <div className="mt-2 text-sm text-on-surface">{formatDateTime(task.updatedAt)}</div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 flex items-center justify-end bg-surface-container-lowest/50">
                <button
                  onClick={onClose}
                  className="glass-button-primary px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  Close
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
