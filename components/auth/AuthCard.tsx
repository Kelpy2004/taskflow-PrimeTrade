import type { ReactNode } from 'react';
import HeroMonolith from '@/components/three/HeroMonolith';
import { LogoMark, StatusIcon } from '@/components/ui/icons';

const HIGHLIGHTS = [
  { status: 'pending' as const, title: 'Organize work', text: 'Capture tasks with clear statuses and owners.' },
  { status: 'in-progress' as const, title: 'Track progress', text: 'Drag cards across a live To Do → Done board.' },
  { status: 'completed' as const, title: 'Stay accountable', text: 'Roles and an audit trail keep every change visible.' },
];

/** Split-screen auth card: brand panel on the left, form on the right. */
export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="glass-panel grid w-full max-w-[960px] overflow-hidden rounded-[20px] shadow-e3 lg:grid-cols-[1.05fr_1fr] animate-rise-in">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-primary/10 p-9 lg:flex">
        <div className="flex items-center gap-3">
          <LogoMark size={34} />
          <div>
            <div className="font-display text-[17px] font-semibold leading-none text-on-surface">TaskForge</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-faint">
              Task Management
            </div>
          </div>
        </div>

        <HeroMonolith />

        <div className="space-y-3.5">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-surface-variant/50 text-primary">
                <StatusIcon status={item.status} size={13} />
              </span>
              <div>
                <div className="text-[13px] font-semibold text-on-surface">{item.title}</div>
                <div className="text-xs leading-relaxed text-on-surface-variant">{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center bg-[rgba(10,14,26,0.35)] p-7 sm:p-9">
        <div className="mb-7 flex items-center gap-2.5 lg:hidden">
          <LogoMark size={30} />
          <span className="font-display text-base font-semibold text-on-surface">TaskForge</span>
        </div>
        {children}
      </div>
    </div>
  );
}
