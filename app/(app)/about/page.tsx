import { GitBranch, Layers, RefreshCcw } from 'lucide-react';

/** Recruiter-facing delivery notes: what existed vs. what changed in this migration. */
export default function AboutPage() {
  return (
    <div className="max-w-3xl space-y-4 animate-rise-in">
      <section className="glass-panel rounded-2xl p-6">
        <h2 className="eyebrow mb-3 text-primary">About this build</h2>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          TaskForge is a full-stack task management dashboard built on{' '}
          <b className="text-on-surface">Next.js (App Router) + TypeScript + Tailwind CSS + PostgreSQL (Prisma) + Redux Toolkit</b>.
          It was migrated from an earlier React&nbsp;+&nbsp;Vite / Express / MongoDB build — the migration story below
          is part of the submission.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <section className="glass-panel rounded-2xl p-5">
          <div className="mb-2.5 flex items-center gap-2.5">
            <Layers size={16} strokeWidth={1.7} className="text-primary" />
            <h3 className="font-display text-sm font-semibold text-on-surface">What existed</h3>
          </div>
          <p className="text-xs leading-relaxed text-on-surface-variant">
            JWT auth, user/admin roles, task CRUD, admin stats, audit logging and validation — originally on
            Express + MongoDB with a React (Vite) frontend using Context state.
          </p>
        </section>

        <section className="glass-panel rounded-2xl p-5">
          <div className="mb-2.5 flex items-center gap-2.5">
            <RefreshCcw size={16} strokeWidth={1.7} className="text-tertiary" />
            <h3 className="font-display text-sm font-semibold text-on-surface">What changed</h3>
          </div>
          <p className="text-xs leading-relaxed text-on-surface-variant">
            Rebuilt as a single Next.js app: API routes on Prisma/PostgreSQL, Redux Toolkit state with optimistic
            drag-and-drop, a new Kanban board, created dates, mobile navigation and a fresh design system.
          </p>
        </section>

        <section className="glass-panel rounded-2xl p-5">
          <div className="mb-2.5 flex items-center gap-2.5">
            <GitBranch size={16} strokeWidth={1.7} className="text-success" />
            <h3 className="font-display text-sm font-semibold text-on-surface">How it scales</h3>
          </div>
          <p className="text-xs leading-relaxed text-on-surface-variant">
            Modular slices and route handlers, pooled Prisma client, indexed relational schema, and a token-based
            design system — ready for caching, background jobs or a service split later.
          </p>
        </section>
      </div>

      <section className="glass-panel rounded-2xl p-6">
        <h2 className="eyebrow mb-3 text-secondary">Requirements coverage</h2>
        <ul className="grid grid-cols-1 gap-2 text-xs text-on-surface-variant sm:grid-cols-2">
          {[
            'List tasks — title, description, status, created date',
            'Add tasks, update status (To Do / In Progress / Done), delete',
            'Redux Toolkit for state (thunks + optimistic updates)',
            'PostgreSQL storage via Prisma ORM',
            'Responsive UI with loading / empty / error states',
            'Typed end-to-end with TypeScript',
            'Bonus: JWT auth + roles, admin dashboard, audit logs',
            'Bonus: search, filters, pagination, undo toasts',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <svg width="13" height="13" viewBox="0 0 14 14" className="mt-0.5 shrink-0 text-[#79ecc4]" aria-hidden>
                <path d="M3 7.4 L6 10.4 L11 4.2" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
