# TaskForge — Design System & Assets

Dark, glassmorphic, 3D-forward task management dashboard. Portfolio-grade design system for a Next.js (App Router) + TypeScript + Tailwind + Redux build.

## Art direction

Deep space-navy ground (`#0a0e1a`), frosted-glass panels, cyan (`#7dd3fc`) + violet (`#c8a0f0`) light, fine film grain. The three task statuses are treated as physical glass objects: dashed cube (To Do), arc capsule (In Progress), checkmark sphere (Done) — one lighting rig, one material family, one camera language. Mood: calm, focused, futuristic, tactile, premium.

Type: **Space Grotesk** (display) · **Inter** (body) · **Space Mono** (meta/labels). All Google Fonts, OFL.

## Files

| File | What it is |
|---|---|
| `TaskForge Design System.dc.html` | Living showcase — hero, foundations, 3D asset set, full component library (interactive board⇄list, modal), flagship Dashboard. Open in browser. |
| `docs/design-system.md` | Tokens: tables, CSS variables, Tailwind theme mapping, component state spec, a11y. |
| `docs/skill.md` | How to design/build in this system: principles, recipes, 3D rules, do/don't, screen skeletons. |
| `docs/README.md` | This file. |

## 3D asset inventory

Current build: assets are **CSS/HTML constructions** living inside the showcase (ship as React components — zero image weight, animate free, SSR-safe). For Blender replacements, render transparent PNG/WebP @2x at the sizes below and drop into `/public/3d/`, same slots.

| Asset | Target file | @2x size | Used on |
|---|---|---|---|
| Hero monolith (3 slabs + check) | `3d/hero-monolith@2x.webp` | 1200×1400 | Login/Register left panel, Dribbble shot |
| Status cube (To Do) | `3d/status-todo-cube@2x.webp` | 480×480 | Kanban header, empty column |
| Status capsule (In Progress) | `3d/status-progress-capsule@2x.webp` | 480×640 | Kanban header, loading |
| Status sphere (Done) | `3d/status-done-sphere@2x.webp` | 560×560 | Kanban header, success, spinner motif |
| Stat emblems ×4 (users/tasks/ring/pulse) | `3d/emblem-{users,tasks,ring,pulse}@2x.webp` | 320×320 each | Dashboard stat cards |
| Empty drawer | `3d/empty-drawer@2x.webp` | 640×480 | No tasks |
| Magnifier orb | `3d/empty-search@2x.webp` | 560×560 | No results |
| Glass shield | `3d/shield@2x.webp` | 560×640 | Unauthorized, audit motif |
| Glass 404 digits | `3d/404@2x.webp` | 960×480 | 404 page |
| Logo mark | `3d/logo-mark@2x.png` + `favicon.svg` | 512×512 | Wordmark, favicon |

Rig spec for renders: cyan key top-left, violet rim bottom-right, low HDRI, ~20–25° camera elevation, frosted glass (transmission high, roughness .25–.4, IOR 1.45), soft contact shadow, light grain. Compress: `cwebp -q 82`.

## Tokens → Tailwind / Next.js

1. Paste CSS variables (design-system.md §6) into `app/globals.css` `:root`.
2. Merge Tailwind theme (§7) into `tailwind.config.ts` (or `@theme` for v4).
3. Fonts via `next/font/google`: `Space_Grotesk`, `Inter`, `Space_Mono` → CSS variables consumed by `fontFamily`.
4. 3D: `next/image` + `loading="lazy"`, static fallback first, optional R3F/Spline hero behind `dynamic(..., { ssr: false })`.

## Screen index

| Screen | Status |
|---|---|
| Design system showcase + Dashboard flagship | ✅ this delivery |
| Login / Register | next |
| Tasks — Kanban + list, modal, details, undo | next |
| Users, Audit Logs (admin) | next |
| Settings, About/Delivery Notes | next |
| Unauthorized / 404 | next |
| Mobile layouts | after desktop set |

## Credits

Fonts: Google Fonts (OFL). All visuals original. Design system v1, 2026.
