# Migration Notes — TaskForge v1 → v2

Working log of the migration from the original stack to the current one. The short version
lives in the README ("What existed vs. what changed"); this file keeps the longer story.

## Why this migration happened

The first version of TaskForge was a backend-focused assignment: React (Vite) + Express +
MongoDB with JWT auth, user/admin roles, task CRUD, admin stats and audit logging. A second
assignment asked for a task management dashboard on **Next.js + TypeScript + Tailwind CSS +
PostgreSQL + Redux**, and explicitly allowed building on top of the existing codebase as long
as the required stack and features were clearly demonstrated.

Rather than start fresh, v1 was migrated in place — the git history documents the whole
process, and the pre-migration state is preserved under the `v1-express-mongo` tag.

## Requirements → where they landed

| Requirement | Implementation |
|---|---|
| List tasks (title, description, status, created date) | Board cards + list view on `/tasks` |
| Add / update status (To Do, In Progress, Done) / delete | Modal create-edit, drag between columns (select fallback on touch), delete confirm |
| Redux for state | Redux Toolkit slices; optimistic status moves with rollback and undo |
| PostgreSQL for storage | Prisma ORM, relational schema, migrations, seed script |
| Responsive + loading/empty/error states | Mobile drawer + bottom tabs, skeletons, per-column empty states, error banners with retry |
| TypeScript + README | Strict TS end to end; README covers setup, API and the migration note |

## Key decisions

- **Single Next.js app** — the separate Express server was folded into App Router route
  handlers so the whole project runs and deploys as one unit.
- **Status values** stay `pending / in-progress / completed` in the database; the UI labels
  them To Do / In Progress / Done. No data migration needed, API contract preserved.
- **Prisma 6** over raw SQL for typed models and migrations. Pooled connection for the app,
  `directUrl` for migrations (needed on pooled hosts like Neon).
- **Kept from v1** (beyond the new brief): JWT auth + registration, user/admin RBAC, admin
  dashboard/users/audit-logs, search/filter/pagination, Zod validation, audit logging.
- **Sign-out lives on Settings**, not the sidebar — keeps the nav focused on destinations.
- **Design system** — tokens, component rules and the CSS-3D asset approach are documented in
  `design-export/docs/`; the UI implements that spec on Tailwind v4 `@theme` tokens.

## Verification

Verified end to end against a live PostgreSQL (Neon): admin and member logins, dashboard
stats, Kanban drag with optimistic persistence, undo, audit trail entries, role scoping
(members only see their own tasks), task creation, sign-out. Production build passes with
strict type-checking.

## Leftovers / follow-ups

- `legacy-frontend/` (v1 React app) and `backend/` (v1 Express API) remain in the tree for
  reference and are scheduled for removal — git history and the `v1-express-mongo` tag keep
  them recoverable.
- The old Render deployment tracks the v1 stack; the v2 deploy target is Vercel + Neon.
