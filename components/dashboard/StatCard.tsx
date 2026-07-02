import type { ReactNode } from 'react';

/** Dashboard stat card with a tilted emblem in the corner. */
export default function StatCard({
  label,
  value,
  hue,
  emblem,
  loading,
}: {
  label: string;
  value: number | string;
  hue: string; // rgb triplet e.g. '125,211,252'
  emblem: ReactNode;
  loading: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[15px] p-4"
      style={{
        background: `linear-gradient(160deg, rgba(${hue},0.1), rgba(15,21,36,0.5))`,
        border: `1px solid rgba(${hue},0.16)`,
      }}
    >
      <div
        aria-hidden
        className="absolute -right-1.5 -top-2 flex h-11 w-11 rotate-[8deg] items-center justify-center rounded-xl"
        style={{
          background: `linear-gradient(155deg, rgba(${hue},0.28), rgba(26,36,56,0.4))`,
          border: `1px solid rgba(${hue},0.3)`,
        }}
      >
        {emblem}
      </div>
      <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-on-surface-faint">{label}</div>
      {loading ? (
        <div className="skeleton mt-2.5 h-7 w-14" />
      ) : (
        <div className="mt-1.5 font-display text-[27px] font-semibold text-[#f2f6fb]">{value}</div>
      )}
    </div>
  );
}
