import { avatarStyle, initials } from '@/lib/format';

/** Initials avatar — gradient is picked deterministically from the name. */
export default function Avatar({ name, size = 30 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(Math.round(size * 0.36), 9),
        border: '2px solid #0f1524',
        ...avatarStyle(name),
      }}
    >
      {initials(name)}
    </span>
  );
}
