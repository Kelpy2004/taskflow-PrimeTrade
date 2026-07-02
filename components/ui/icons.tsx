import type { TaskStatus } from '@/types';

/** Status glyphs: dashed circle (to do), partial arc (in progress), checkmark (done). */
export function StatusIcon({ status, size = 13 }: { status: TaskStatus; size?: number }) {
  if (status === 'pending') {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden>
        <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2.4 2.6" />
      </svg>
    );
  }
  if (status === 'in-progress') {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden>
        <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.35" />
        <path d="M7 2 a5 5 0 0 1 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden>
      <path d="M3 7.4 L6 10.4 L11 4.2" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Brand checkmark used in the logo tile. */
export function LogoCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <path d="M3.2 8.4 L6.4 11.6 L12.8 4.6" fill="none" stroke="#eafaff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Logo tile — cyan/violet glass square with glowing check. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        background: 'linear-gradient(150deg, rgba(125,211,252,0.35), rgba(200,160,240,0.22))',
        border: '1px solid rgba(125,211,252,0.4)',
        boxShadow: '0 0 18px rgba(125,211,252,0.35), inset 0 1px 0 rgba(255,255,255,0.35)',
      }}
    >
      <LogoCheck size={Math.round(size * 0.5)} />
    </div>
  );
}

/** Admin crown glyph for the solid Admin role chip. */
export function CrownIcon({ size = 11, stroke = '#05121c' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden>
      <path d="M2 4 L4 9 L6 3 L8 9 L10 4" fill="none" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
