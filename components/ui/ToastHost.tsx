'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toastDismissed, type Toast } from '@/store/uiSlice';
import { moveTask, taskStatusChanged } from '@/store/tasksSlice';

function ToastCard({ toast }: { toast: Toast }) {
  const dispatch = useAppDispatch();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Errors and undo toasts stick around a little longer.
    const duration = toast.type === 'error' || toast.undo ? 8000 : 5000;
    timeoutRef.current = setTimeout(() => dispatch(toastDismissed(toast.id)), duration);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [dispatch, toast]);

  const border =
    toast.type === 'success'
      ? 'rgba(79,224,176,0.3)'
      : toast.type === 'error'
        ? 'rgba(255,107,107,0.3)'
        : 'rgba(125,211,252,0.28)';

  const handleUndo = () => {
    if (!toast.undo) return;
    const { taskId, prevStatus } = toast.undo;
    // Optimistic revert, then persist.
    dispatch(taskStatusChanged({ id: taskId, status: prevStatus }));
    dispatch(moveTask({ id: taskId, status: prevStatus, prevStatus }));
    dispatch(toastDismissed(toast.id));
  };

  return (
    <div
      role="status"
      className="pointer-events-auto flex items-center gap-3 rounded-[13px] px-4 py-3 animate-rise-in"
      style={{
        background: 'rgba(15,21,36,0.85)',
        border: `1px solid ${border}`,
        boxShadow: '0 12px 28px -12px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      {toast.type === 'success' && (
        <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg" style={{ background: 'rgba(79,224,176,0.16)' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M3 7.4 L6 10.4 L11 4.2" fill="none" stroke="#79ecc4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      {toast.type === 'error' && (
        <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg" style={{ background: 'rgba(255,107,107,0.16)' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M7 3 V8 M7 10 v0.2" stroke="#ff9c9c" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      )}
      <span className="flex-1 text-[13px] text-[#dbe8f0]">{toast.message}</span>
      {toast.undo && (
        <button
          type="button"
          onClick={handleUndo}
          className="cursor-pointer rounded-lg border border-primary/28 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 focus-ring"
        >
          Undo
        </button>
      )}
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => dispatch(toastDismissed(toast.id))}
        className="cursor-pointer text-on-surface-faint transition-colors hover:text-on-surface"
      >
        <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden>
          <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/** Toast stack — bottom-right on desktop, full-width bottom on mobile. */
export default function ToastHost() {
  const toasts = useAppSelector((state) => state.ui.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[360px]">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
