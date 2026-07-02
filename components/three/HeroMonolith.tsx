import { StatusIcon } from '@/components/ui/icons';

/**
 * Floating glass monolith for the auth screens — three stacked slabs,
 * one per task status, built entirely in CSS 3D.
 */
export default function HeroMonolith() {
  return (
    <div className="relative flex min-h-[420px] items-center justify-center" style={{ perspective: 1600 }} aria-hidden>
      {/* Contact glow */}
      <div
        className="absolute bottom-14 h-[130px] w-[340px] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(125,211,252,0.22), rgba(200,160,240,0.12) 45%, transparent 72%)',
          filter: 'blur(26px)',
        }}
      />
      <div
        className="flex flex-col gap-6"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(20deg) rotateZ(-19deg)',
          animation: 'tf-float 7s ease-in-out infinite',
        }}
      >
        {/* Done slab (top) */}
        <div
          className="relative flex h-[86px] w-[260px] items-center gap-4 rounded-[22px] px-5"
          style={{
            transform: 'translateZ(78px)',
            background: 'linear-gradient(155deg, rgba(79,224,176,0.16), rgba(26,36,56,0.72) 55%)',
            border: '1px solid rgba(125,211,252,0.28)',
            backdropFilter: 'blur(6px)',
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.18) inset, 0 -16px 26px -14px rgba(5,9,18,0.9) inset, 0 34px 60px -20px rgba(0,0,0,0.72), 0 0 40px -8px rgba(79,224,176,0.28)',
          }}
        >
          <div
            className="flex h-[46px] w-[46px] items-center justify-center rounded-[13px]"
            style={{
              background: 'radial-gradient(circle at 32% 28%, rgba(120,255,214,0.55), rgba(79,224,176,0.12) 70%)',
              border: '1px solid rgba(120,255,214,0.5)',
              boxShadow: '0 0 22px rgba(79,224,176,0.6), inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M5 12.5 L10 17.5 L19 6.5" fill="none" stroke="#eafff8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="font-display text-[15px] font-semibold text-[#eafff8]">Done</div>
            <div className="mt-0.5 font-mono text-[10px] tracking-[0.05em] text-[rgba(120,255,214,0.75)]">shipped</div>
          </div>
        </div>

        {/* In Progress slab */}
        <div
          className="relative flex h-[86px] w-[260px] items-center gap-4 rounded-[22px] px-5"
          style={{
            transform: 'translateZ(40px)',
            background: 'linear-gradient(155deg, rgba(200,160,240,0.15), rgba(26,36,56,0.72) 55%)',
            border: '1px solid rgba(200,160,240,0.24)',
            backdropFilter: 'blur(6px)',
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.12) inset, 0 -16px 26px -14px rgba(5,9,18,0.9) inset, 0 30px 54px -22px rgba(0,0,0,0.7)',
          }}
        >
          <div
            className="flex h-[46px] w-[46px] items-center justify-center rounded-[13px]"
            style={{
              background: 'radial-gradient(circle at 32% 28%, rgba(216,182,248,0.5), rgba(200,160,240,0.1) 70%)',
              border: '1px solid rgba(216,182,248,0.42)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" style={{ animation: 'tf-spin 3.2s linear infinite' }}>
              <circle cx="11" cy="11" r="7" fill="none" stroke="rgba(216,182,248,0.25)" strokeWidth="2.4" />
              <path d="M11 4 a7 7 0 0 1 7 7" fill="none" stroke="#f0e2ff" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="font-display text-[15px] font-semibold text-[#f0e6fb]">In Progress</div>
            <div className="mt-0.5 font-mono text-[10px] tracking-[0.05em] text-[rgba(216,182,248,0.72)]">building</div>
          </div>
        </div>

        {/* To Do slab */}
        <div
          className="relative flex h-[86px] w-[260px] items-center gap-4 rounded-[22px] px-5"
          style={{
            transform: 'translateZ(2px)',
            background: 'linear-gradient(155deg, rgba(138,166,200,0.13), rgba(15,21,36,0.78) 55%)',
            border: '1px solid rgba(138,166,200,0.2)',
            backdropFilter: 'blur(6px)',
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.08) inset, 0 -16px 26px -14px rgba(5,9,18,0.9) inset, 0 24px 46px -24px rgba(0,0,0,0.66)',
          }}
        >
          <div
            className="flex h-[46px] w-[46px] items-center justify-center rounded-[13px] text-[#c4d6e6]"
            style={{
              background: 'radial-gradient(circle at 32% 28%, rgba(180,202,224,0.35), rgba(138,166,200,0.08) 70%)',
              border: '1px solid rgba(180,202,224,0.32)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            <StatusIcon status="pending" size={22} />
          </div>
          <div>
            <div className="font-display text-[15px] font-semibold text-[#dbe6f0]">To Do</div>
            <div className="mt-0.5 font-mono text-[10px] tracking-[0.05em] text-[rgba(180,202,224,0.7)]">queued</div>
          </div>
        </div>
      </div>
    </div>
  );
}
