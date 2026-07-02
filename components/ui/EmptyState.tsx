import type { ReactNode } from 'react';

/** Empty state: illustration, a one-line reason, and an optional action. */
export default function EmptyState({
  art,
  title,
  body,
  action,
}: {
  art: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
      {art}
      <div>
        <div className="font-display text-lg font-semibold text-on-surface">{title}</div>
        <p className="mt-1 max-w-sm text-sm text-on-surface-variant">{body}</p>
      </div>
      {action}
    </div>
  );
}
