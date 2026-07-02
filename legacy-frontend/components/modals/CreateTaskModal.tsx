import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, AlertCircle, ChevronDown } from 'lucide-react';

type ModalStatus = 'pending' | 'in_progress' | 'completed';

export interface TaskModalValues {
  title: string;
  description: string;
  status: ModalStatus | 'in-progress';
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  initialValues?: TaskModalValues;
  isSubmitting?: boolean;
  error?: string | null;
  onSubmit?: (values: { title: string; description: string; status: 'pending' | 'in-progress' | 'completed' }) => Promise<void> | void;
}

function normalizeStatus(status: TaskModalValues['status']): ModalStatus {
  if (status === 'in-progress') return 'in_progress';
  return status;
}

function toApiStatus(status: ModalStatus): 'pending' | 'in-progress' | 'completed' {
  if (status === 'in_progress') return 'in-progress';
  return status;
}

const defaultValues: { title: string; description: string; status: ModalStatus } = {
  title: '',
  description: '',
  status: 'pending',
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  mode = 'create',
  initialValues,
  isSubmitting = false,
  error,
  onSubmit,
}: CreateTaskModalProps) {
  const normalizedInitial = useMemo(() => {
    if (!initialValues) return null;
    return {
      title: initialValues.title,
      description: initialValues.description,
      status: normalizeStatus(initialValues.status),
    };
  }, [initialValues]);

  const [title, setTitle] = useState(defaultValues.title);
  const [description, setDescription] = useState(defaultValues.description);
  const [status, setStatus] = useState<ModalStatus>(defaultValues.status);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setTitle(normalizedInitial?.title || defaultValues.title);
    setDescription(normalizedInitial?.description || defaultValues.description);
    setStatus(normalizedInitial?.status || defaultValues.status);
    setValidationError('');
  }, [isOpen, normalizedInitial]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }

    setValidationError('');

    if (onSubmit) {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status: toApiStatus(status),
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel glow-effect rounded-xl w-full max-w-lg shadow-2xl relative pointer-events-auto flex flex-col max-h-[921px] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="font-semibold text-xl text-on-surface tracking-tight">
                  {mode === 'edit' ? 'Edit Task' : 'Create New Task'}
                </h2>
                <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <form className="space-y-6" onSubmit={handleSubmit} id="create-task-form">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface-variant">Task Title</label>
                    <input 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      type="text" 
                      placeholder="e.g., Implement authentication flow" 
                      className="w-full glass-input px-4 py-3"
                    />
                    {(validationError || error) && (
                      <p className="text-error text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {validationError || error}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface-variant">Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4} 
                      placeholder="Briefly describe the task requirements..." 
                      className="w-full glass-input px-4 py-3 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface-variant">Status</label>
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ModalStatus)}
                        className="w-full glass-input px-4 py-3 appearance-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface-variant">Assignee</label>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-surface-container-low">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                        JD
                      </div>
                      <span className="text-sm text-on-surface flex-1">Unassigned</span>
                      <button type="button" className="text-xs text-primary hover:text-primary-foreground font-medium">Assign</button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-white/5 flex items-center justify-end gap-3 bg-surface-container-lowest/50">
                <button 
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="create-task-form"
                  disabled={isSubmitting}
                  className="glass-button-primary px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Save Task'}
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
