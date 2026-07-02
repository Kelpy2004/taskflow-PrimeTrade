'use client';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { Task } from '@/types';

/** Delete confirmation — names the task so there's no ambiguity about what goes. */
export default function DeleteConfirm({
  task,
  deleting,
  onCancel,
  onConfirm,
}: {
  task: Task | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={task !== null} title="Delete task" onClose={onCancel} maxWidth={380}>
      <p className="text-sm leading-relaxed text-on-surface-variant">
        Delete <b className="text-on-surface">“{task?.title}”</b>? This can&apos;t be undone — the task is
        removed for good and the deletion is recorded in the audit log.
      </p>
      <div className="mt-5 flex justify-end gap-2.5">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" loading={deleting} onClick={onConfirm}>
          Delete task
        </Button>
      </div>
    </Modal>
  );
}
