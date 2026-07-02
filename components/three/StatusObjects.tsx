/**
 * The three status objects rendered in pure CSS — used for column
 * empty states and the loading orb. No image assets involved.
 */

/** Done — glass sphere with emissive checkmark. Doubles as the loading orb. */
export function DoneSphere({ size = 104, spinning = false }: { size?: number; spinning?: boolean }) {
  return (
    <div
      aria-hidden
      className="relative flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background:
          'radial-gradient(circle at 34% 28%, rgba(180,255,224,0.6), rgba(79,224,176,0.32) 34%, rgba(20,60,48,0.75) 78%)',
        border: '1px solid rgba(120,255,214,0.35)',
        boxShadow:
          '0 0 44px -4px rgba(79,224,176,0.5), inset 0 4px 18px rgba(255,255,255,0.35), inset 0 -18px 30px rgba(5,20,15,0.6)',
        animation: spinning ? undefined : 'tf-float-soft 6.5s ease-in-out infinite',
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          top: size * 0.15,
          left: size * 0.21,
          width: size * 0.25,
          height: size * 0.19,
          background: 'rgba(255,255,255,0.55)',
          filter: 'blur(5px)',
        }}
      />
      <svg
        width={size * 0.44}
        height={size * 0.44}
        viewBox="0 0 46 46"
        style={spinning ? { animation: 'tf-spin 1.2s linear infinite' } : undefined}
      >
        <path
          d="M11 24 L20 33 L36 15"
          fill="none"
          stroke="#eafff8"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(120,255,214,0.9))' }}
        />
      </svg>
    </div>
  );
}

/** To Do — frosted glass cube. */
export function TodoCube({ size = 84 }: { size?: number }) {
  const z = size / 2;
  const face = { position: 'absolute' as const, width: size, height: size, borderRadius: 12 };
  return (
    <div aria-hidden className="flex items-center justify-center" style={{ perspective: 700, height: size * 1.6 }}>
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-24deg) rotateY(-32deg)',
          animation: 'tf-float-soft 6s ease-in-out infinite',
          width: size,
          height: size,
          position: 'relative',
        }}
      >
        <div
          style={{
            ...face,
            background: 'linear-gradient(150deg, rgba(180,202,224,0.32), rgba(138,166,200,0.12))',
            border: '1px solid rgba(196,214,230,0.5)',
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.15)',
            transform: `translateZ(${z}px)`,
          }}
        />
        <div
          style={{
            ...face,
            background: 'linear-gradient(150deg, rgba(90,120,155,0.4), rgba(30,44,66,0.6))',
            border: '1px solid rgba(150,180,205,0.28)',
            transform: `rotateY(90deg) translateZ(${z}px)`,
          }}
        />
        <div
          style={{
            ...face,
            background: 'linear-gradient(150deg, rgba(210,228,244,0.5), rgba(150,180,205,0.2))',
            border: '1px solid rgba(220,236,248,0.6)',
            boxShadow: 'inset 0 2px 14px rgba(255,255,255,0.35)',
            transform: `rotateX(90deg) translateZ(${z}px)`,
          }}
        />
      </div>
    </div>
  );
}

/** In Progress — glass capsule with rotating internal arc. */
export function ProgressCapsule({ width = 74, height = 118 }: { width?: number; height?: number }) {
  return (
    <div
      aria-hidden
      className="relative flex items-center justify-center overflow-hidden rounded-full"
      style={{
        width,
        height,
        background: 'linear-gradient(160deg, rgba(216,182,248,0.28), rgba(26,36,56,0.7) 60%)',
        border: '1px solid rgba(216,182,248,0.4)',
        boxShadow:
          '0 0 34px -6px rgba(185,140,240,0.4), inset 0 2px 12px rgba(255,255,255,0.22), inset 0 -14px 22px rgba(5,9,18,0.5)',
        animation: 'tf-float-soft 5.5s ease-in-out infinite',
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          top: 12,
          left: 14,
          width: 22,
          height: 40,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent)',
          filter: 'blur(3px)',
        }}
      />
      <svg width={width * 0.7} height={width * 0.7} viewBox="0 0 52 52" style={{ animation: 'tf-spin 3s linear infinite' }}>
        <circle cx="26" cy="26" r="18" fill="none" stroke="rgba(216,182,248,0.22)" strokeWidth="4" />
        <path
          d="M26 8 a18 18 0 0 1 18 18"
          fill="none"
          stroke="#f0e2ff"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(216,182,248,0.9))' }}
        />
      </svg>
    </div>
  );
}

/** Full-page loading state — the Done orb doubling as a spinner. */
export function LoadingOrb({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5">
      <DoneSphere size={72} spinning />
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-on-surface-faint">{label}</span>
    </div>
  );
}
