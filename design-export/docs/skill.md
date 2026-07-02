# skill: designing & building TaskForge

Use this when designing new TaskForge screens or writing its React/Tailwind code. Pairs with `design-system.md` (tokens) and `README.md` (inventory).

## Principles

1. **Deep space, warm glass.** One near-black navy ground (`background`), glass panels floating above it. Light comes from content — cyan key top-left, violet rim bottom-right — never flat white.
2. **Calm density.** Generous padding (16–24 in cards), 4pt rhythm, max ~3 levels of surface stacking (bg → panel → control).
3. **Status is a physical object.** To Do = dashed outline (empty), In Progress = partial arc (moving), Done = checkmark (solid, glowing). Always icon + label; color is reinforcement, not information.
4. **One glow per view.** Glow marks THE focal thing (primary CTA, active nav, done-moment). If everything glows, nothing does.
5. **Motion is physics, not decoration.** Things settle (spring), fade+lift 8–12px on enter, never bounce for fun. Respect reduced motion.

## Using tokens

- Backgrounds: `background` page, `surface` wells/inputs, `surface-variant` raised glass. Never pure black/white.
- Text: `on-surface` headings/body, `on-surface-variant` secondary, `on-surface-faint` meta only (≥12px).
- Cyan (`primary`) = interaction: CTAs, focus, active nav, links. Violet (`tertiary`) = identity/accents: eyebrows, gradients paired w/ cyan, In-Progress kinship. Emerald (`success`/`status-done`) = completion only.
- Borders: default `border` (12% cyan). Intensify to 30–55% for hover/focus, or swap to a status hue at ~30%.
- Type: Space Grotesk 600 for anything ≥21px; Inter otherwise; Space Mono uppercase +tracking for eyebrows/meta/counts. Never Grotesk for body, never mono >13px.

## Glass recipe (memorize)

```
bg: linear-gradient(160deg, rgba(26,36,56,.55), rgba(15,21,36,.45))
border: 1px solid rgba(125,211,252,.12)
backdrop-blur: 18px  ·  inset 0 1px 0 rgba(255,255,255,.18)
```
Tailwind: `bg-gradient-to-br from-surface-variant/55 to-surface/45 border backdrop-blur-glass shadow-e1`.
Modals/topbars: blur 24px, opacity ↑ to ~.96. Never stack blur >3 layers.

## 3D usage rules

- Assets share one rig: cyan key top-left, violet rim bottom-right, ~20–25° elevation, soft contact shadow below.
- **Hero monolith** → auth screens + marketing only, right half, ~40–48% width. **Status trio** → kanban column headers (small) + empty states (large). **Emblems** → stat cards only, top-right, tilted ~8°. **Shield/404/magnifier/drawer** → their error/empty screens, centered, max 240px.
- One hero object per screen. 3D never sits behind text. Idle float 6–7s; static under reduced motion.
- In production: transparent WebP @2x, `next/image` lazy, static PNG fallback — never block first paint.

## Component rules

- Buttons: one primary per view. Icon buttons need `aria-label`. Loading disables + spinner.
- Forms: label above, 13px Inter 500; error = border+ring hue swap + icon message below (never color alone). Validate on blur.
- Kanban: column = well (`bg-black/40` on navy) not glass; cards are the glass. Drag: source at 40% ghost, card rotates −2° scale 1.02 glow, target column shows dashed drop slot. Drop = spring settle 200ms. Every move/delete → undo toast.
- Tables: mono uppercase headers, sortable = arrow + `aria-sort`. Rows hover `surface-variant`. Mobile → cards.
- Modals: max-w 380–480, scrim blur 6px, focus-trapped, Esc closes. Destructive confirm = danger button + task name in body.
- Toasts: bottom-right desktop / bottom mobile, auto-dismiss 5s except error/undo (8s), max 3 stacked.
- Empty states: 3D object + one-line reason + one action. Skeletons for loads, spinner-orb only for full-page or in-button.
- Navigation: active item owns the glow bar. Admin-only items show mono ADMIN tag and hide for members. Logout lives on Settings, not sidebar.

## Do / Don't

**Do:** hue-tint glows to their semantic; pair every status color w/ its glyph; use `focus` ring on EVERY interactive; put counts in Space Mono; keep 12–13px chips.
**Don't:** white cards or light mode; glows on secondary elements; more than 2 gradient hues in one element; body text under 14px; borders above 60% alpha; rounded-left-accent "AI card" tropes; emoji in UI; center-aligned body copy; 3D clip-art scattered as decoration.

## Screen skeletons

- **Auth:** split 50/50 — left brand navy w/ monolith + 3 feature bullets; right form panel (max-w 400) on `background`. Demo sign-in buttons = secondary glass.
- **App shell:** sidebar 216px glass, topbar = breadcrumb mono + title Grotesk + ⌘K pill + bell + avatar-menu (links to Settings). Mobile: drawer + optional bottom tabs (Dashboard/Tasks/Settings).
- **Dashboard:** 4 stat cards (emblems) → distribution donut + activity feed. Donut always has a legend w/ counts.
- **Tasks:** header (title, search, filter, board⇄list segmented, + New task primary) → board or table. Mobile: columns stack w/ status dropdown on cards as drag fallback.
- **Errors:** centered 3D object, Grotesk headline, one-line body, one primary action home/back.
