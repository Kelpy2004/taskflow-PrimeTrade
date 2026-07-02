'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { STATUSES, STATUS_META } from '@/lib/status';
import type { Task, TaskDraft, TaskStatus } from '@/types';

interface TaskModalProps {
  open: boolean;
  editing: Task | null;
  initialStatus: TaskStatus;
  submitting: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => void;
}

/** Create/edit task form. Title is validated on submit; server errors surface below. */
export default function TaskModal({
  open,
  editing,
  initialStatus,
  submitting,
  error,
  onClose,
  onSubmit,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(editing?.title ?? '');
      setDescription(editing?.description ?? '');
      setStatus(editing?.status ?? initialStatus);
      setLocalError('');
    }
  }, [open, editing, initialStatus]);

  const displayError = localError || error;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (title.trim().length < 4) {
      setLocalError('Title must be at least 4 characters.');
      return;
    }
    onSubmit({ title: title.trim(), description: description.trim(), status });
  };

  return (
    <Modal open={open} title={editing ? 'Edit task' : 'New task'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <label htmlFor="task-title" className="ml-0.5 block text-[13px] font-medium text-on-surface-variant">
            Title
          </label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => {
              setLocalError('');
              setTitle(event.target.value);
            }}
            placeholder="Task title"
            className={`glass-input ${localError ? 'input-error' : ''}`}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="task-description" className="ml-0.5 block text-[13px] font-medium text-on-surface-variant">
            Description
          </label>
          <textarea
            id="task-description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What needs to happen?"
            className="glass-input resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <span className="ml-0.5 block text-[13px] font-medium text-on-surface-variant">Status</span>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Task status">
            {STATUSES.map((option) => {
              const meta = STATUS_META[option];
              const active = status === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setStatus(option)}
                  className="cursor-pointer rounded-[10px] px-2 py-2 text-xs font-semibold transition-all focus-ring"
                  style={
                    active
                      ? { color: meta.text, background: meta.bg, border: `1px solid ${meta.border}` }
                      : {
                          color: '#7e90ab',
                          background: 'rgba(10,14,26,0.6)',
                          border: '1px solid rgba(125,211,252,0.12)',
                        }
                  }
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {displayError && (
          <p role="alert" className="flex items-center gap-2 text-xs text-[#ff9c9c]">
            <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0" aria-hidden>
              <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <path d="M6 3.4 V6.6 M6 8.2 v0.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {displayError}
          </p>
        )}

        <div className="flex justify-end gap-2.5 pt-1.5">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={submitting}>
            {editing ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
