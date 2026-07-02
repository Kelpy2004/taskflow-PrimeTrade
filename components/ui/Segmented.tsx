'use client';

/** Segmented toggle used for the board/list switch. */
export default function Segmented<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex rounded-[11px] border border-primary/12 bg-[rgba(10,14,26,0.6)] p-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-lg px-4 py-2 text-[13px] transition-all duration-200 focus-ring ${
              active
                ? 'font-semibold text-on-primary bg-[linear-gradient(160deg,#a6e2ff,#7dd3fc)] shadow-[0_4px_12px_-4px_rgba(125,211,252,0.5)]'
                : 'font-medium text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
