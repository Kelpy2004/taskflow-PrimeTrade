'use client';

export default function Pagination({
  page,
  totalPages,
  totalItems,
  shown,
  noun,
  onPage,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  shown: number;
  noun: string;
  onPage: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-primary/8 bg-[rgba(10,14,26,0.6)] px-4 py-3">
      <span className="text-xs text-on-surface-faint">
        {totalItems === 0 ? `0 ${noun}` : `${shown} of ${totalItems} ${noun}`}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-lg border border-primary/12 bg-[rgba(38,51,77,0.5)] text-on-surface-faint transition-colors hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40 focus-ring"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path d="M7.5 2.5 L4 6 L7.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <span className="min-w-[70px] px-1 text-center font-mono text-[11px] text-on-surface-variant">
          {page} / {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-lg border border-primary/12 bg-[rgba(38,51,77,0.5)] text-on-surface-faint transition-colors hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40 focus-ring"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path d="M4.5 2.5 L8 6 L4.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
