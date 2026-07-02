# TaskForge Design System — Tokens v1

Dark, glassmorphic, spatial. Deep navy ground, frosted-glass surfaces, cyan+violet light. Lean token set: full ramps only for cyan/violet/navy; single tokens for everything else.

## 1. Color

### Core (CSS variable → value → Tailwind key)

| Token | Value | Tailwind |
|---|---|---|
| `--tf-bg` | `#0a0e1a` | `background` |
| `--tf-surface` | `#0f1524` | `surface` |
| `--tf-surface-variant` | `#1a2438` | `surface-variant` |
| `--tf-on-surface` | `#e0e8f0` | `on-surface` |
| `--tf-on-surface-variant` | `#a0b4c4` | `on-surface-variant` |
| `--tf-on-surface-faint` | `#7e90ab` | `on-surface-faint` |
| `--tf-primary` | `#7dd3fc` | `primary` (cyan-300) |
| `--tf-on-primary` | `#05121c` | `on-primary` |
| `--tf-secondary` | `#88b4cc` | `secondary` |
| `--tf-tertiary` | `#c8a0f0` | `tertiary` (violet-300) |
| `--tf-error` | `#ff6b6b` | `error` |
| `--tf-success` | `#4fe0b0` | `success` |
| `--tf-warning` | `#f5c563` | `warning` |
| `--tf-focus` | `#7dd3fc` | `focus` |
| `--tf-border` | `rgba(125,211,252,0.12)` | `border` (glass hairline) |

### Status (never color-only — always icon + label)

| Token | Value | Icon |
|---|---|---|
| `--tf-status-todo` | `#8aa6c8` | dashed circle |
| `--tf-status-progress` | `#b98cf0` | partial arc |
| `--tf-status-done` | `#4fe0b0` | checkmark |

Chip recipe: text = status color lightened (`#b4cae0` / `#d8b6f8` / `#79ecc4`), bg = status @ 12–13% alpha, border = status @ 30% alpha, radius `full`.

### Ramps (50→900)

**cyan** `#ecfaff #d2f1ff #aae4fe #7dd3fc #4fb9ec #2f9bd4 #1f7db2 #1b6390 #1c5075 #0f3a58`
**violet** `#f7f1ff #ecdcff #dcc2fa #c8a0f0 #b07fe6 #9760d6 #7e46bd #663a99 #4f2f77 #382258`
**navy** (light→dark) `#e0e8f0 #c4d2de #a0b4c4 #7e90ab #566885 #3a4a67 #26334d #1a2438 #0f1524 #0a0e1a`

Brand anchor = the 300 step (`primary` = cyan-300, `tertiary` = violet-300). Darker steps (600–800) are for on-light contexts and pressed states.

## 2. Typography

| Role | Face / weight | Size / line-height / tracking |
|---|---|---|
| display | Space Grotesk 600 | 68 / 0.98 / −0.03em |
| h1 | Space Grotesk 600 | 42 / 1.1 / −0.025em |
| h2 | Space Grotesk 600 | 28 / 1.2 / −0.02em |
| h3 | Space Grotesk 600 | 21 / 1.3 / −0.01em |
| body-lg | Inter 400 | 18 / 1.62 / 0 |
| body | Inter 400 | 16 / 1.6 / 0 |
| body-sm | Inter 400–500 | 14 / 1.55 / 0 |
| label | Inter 500 | 13 / 1.4 / 0 |
| caption | Inter 500 | 12 / 1.4 / 0 |
| mono / meta | Space Mono 400 | 11–12 / 1.4 / +0.06–0.2em, uppercase for eyebrows |

Fonts: Google Fonts — Space Grotesk (400–700), Inter (400–700), Space Mono (400,700).

## 3. Spacing, radii, blur

- **Spacing (4pt):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 (Tailwind default scale works as-is)
- **Radii:** `sm` 8 · `md` 12 · `lg` 16 · `xl` 20 · `full` 999. Cards `lg/xl`, controls `md`, chips `full`.
- **Blur:** `glass` 18px (panels) · `glass-strong` 24px (modals/topbars) · `backdrop` 6px (overlay scrims)

## 4. Elevation & glow

| Token | Value | Use |
|---|---|---|
| `--tf-e1` | `0 4px 12px -4px rgba(0,0,0,0.6)` | resting cards |
| `--tf-e2` | `0 16px 34px -12px rgba(0,0,0,0.7)` | hover, popovers |
| `--tf-e3` | `0 40px 80px -24px rgba(0,0,0,0.8)` | modals, dragging |
| `--tf-glow-primary` | `0 0 26px -2px rgba(125,211,252,0.55)` | primary emphasis |
| `--tf-glow-success` | `0 0 44px -4px rgba(79,224,176,0.5)` | done/success moments |
| `--tf-inner-glass` | `inset 0 1px 0 rgba(255,255,255,0.18)` | top bevel on glass |

Glass panel recipe: `background: linear-gradient(160deg, rgba(26,36,56,.55), rgba(15,21,36,.45)); border: 1px solid var(--tf-border); backdrop-filter: blur(18px);` + `--tf-inner-glass`.

## 5. Motion

| Token | Value | Use |
|---|---|---|
| `--tf-dur-fast` | 120ms | hovers, toggles |
| `--tf-dur-base` | 200ms | most transitions |
| `--tf-dur-slow` | 320ms | modals, drawers |
| `--tf-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | entrances |
| `--tf-ease-spring` | `cubic-bezier(0.34, 1.2, 0.64, 1)` | drag settle, toasts |

Idle 3D float: 6–7s ease-in-out loop, ±9–16px translateY. All motion gated by `prefers-reduced-motion: reduce` → none.

## 6. CSS variables (drop-in)

```css
:root {
  --tf-bg:#0a0e1a; --tf-surface:#0f1524; --tf-surface-variant:#1a2438;
  --tf-on-surface:#e0e8f0; --tf-on-surface-variant:#a0b4c4; --tf-on-surface-faint:#7e90ab;
  --tf-primary:#7dd3fc; --tf-on-primary:#05121c; --tf-secondary:#88b4cc; --tf-tertiary:#c8a0f0;
  --tf-error:#ff6b6b; --tf-success:#4fe0b0; --tf-warning:#f5c563; --tf-focus:#7dd3fc;
  --tf-border:rgba(125,211,252,0.12);
  --tf-status-todo:#8aa6c8; --tf-status-progress:#b98cf0; --tf-status-done:#4fe0b0;
  --tf-e1:0 4px 12px -4px rgba(0,0,0,.6); --tf-e2:0 16px 34px -12px rgba(0,0,0,.7);
  --tf-e3:0 40px 80px -24px rgba(0,0,0,.8);
  --tf-glow-primary:0 0 26px -2px rgba(125,211,252,.55);
  --tf-glow-success:0 0 44px -4px rgba(79,224,176,.5);
  --tf-inner-glass:inset 0 1px 0 rgba(255,255,255,.18);
  --tf-dur-fast:120ms; --tf-dur-base:200ms; --tf-dur-slow:320ms;
  --tf-ease-out:cubic-bezier(.16,1,.3,1); --tf-ease-spring:cubic-bezier(.34,1.2,.64,1);
}
```

## 7. Tailwind theme (v3 `tailwind.config.ts` excerpt)

```ts
theme: {
  extend: {
    colors: {
      background:'#0a0e1a', surface:'#0f1524', 'surface-variant':'#1a2438',
      'on-surface':'#e0e8f0', 'on-surface-variant':'#a0b4c4', 'on-surface-faint':'#7e90ab',
      primary:{ DEFAULT:'#7dd3fc', 50:'#ecfaff',100:'#d2f1ff',200:'#aae4fe',300:'#7dd3fc',400:'#4fb9ec',500:'#2f9bd4',600:'#1f7db2',700:'#1b6390',800:'#1c5075',900:'#0f3a58' },
      tertiary:{ DEFAULT:'#c8a0f0', 50:'#f7f1ff',100:'#ecdcff',200:'#dcc2fa',300:'#c8a0f0',400:'#b07fe6',500:'#9760d6',600:'#7e46bd',700:'#663a99',800:'#4f2f77',900:'#382258' },
      secondary:'#88b4cc', 'on-primary':'#05121c',
      error:'#ff6b6b', success:'#4fe0b0', warning:'#f5c563', focus:'#7dd3fc',
      'status-todo':'#8aa6c8', 'status-progress':'#b98cf0', 'status-done':'#4fe0b0',
    },
    borderColor: { DEFAULT:'rgba(125,211,252,0.12)' },
    fontFamily: {
      display:['"Space Grotesk"','sans-serif'], sans:['Inter','sans-serif'], mono:['"Space Mono"','monospace'],
    },
    borderRadius: { sm:'8px', md:'12px', lg:'16px', xl:'20px' },
    boxShadow: {
      e1:'0 4px 12px -4px rgba(0,0,0,.6)', e2:'0 16px 34px -12px rgba(0,0,0,.7)', e3:'0 40px 80px -24px rgba(0,0,0,.8)',
      'glow-primary':'0 0 26px -2px rgba(125,211,252,.55)', 'glow-success':'0 0 44px -4px rgba(79,224,176,.5)',
    },
    backdropBlur: { glass:'18px', 'glass-strong':'24px' },
    transitionDuration: { fast:'120ms', base:'200ms', slow:'320ms' },
    transitionTimingFunction: { out:'cubic-bezier(.16,1,.3,1)', spring:'cubic-bezier(.34,1.2,.64,1)' },
  },
}
```

(Tailwind v4: paste the CSS variables into `@theme` instead.)

## 8. Component spec (states)

- **Button** — primary (cyan gradient `#a6e2ff→#7dd3fc`, text `on-primary`, glow shadow), secondary (surface-variant glass + border), ghost (transparent → 8% primary on hover), danger (error @14% bg, 40% border). Sizes sm 32 / md 40 / lg 48. States: hover (−1px translate, stronger glow), focus (3px ring `rgba(125,211,252,.3)` outside 1px border), active (translate 0, darker), disabled (faint text, 35% bg, no border), loading (spinner replaces icon, `cursor: wait`).
- **Input / textarea / select** — bg `rgba(10,14,26,.6)`, border `--tf-border`, radius md; focus: border 55% cyan + 3px ring @18%; error: border/ring in error hue + message w/ icon below; disabled 50% opacity.
- **Checkbox/radio/switch** — checked = cyan gradient fill, dark check; switch thumb white, track gradient cyan.
- **Status chip** — see recipe §1. **Role chip** — Member: neutral glass; Admin: solid cyan gradient, dark text, crown glyph.
- **Card / glass panel** — recipe §4; `panel` (e1) vs `elevated` (e2). Stat card: hue-tinted gradient bg + tilted emblem top-right, mono uppercase label, Grotesk 600 number.
- **Kanban card** — default (glass, hairline), hover (border 30% cyan, lift −2px), dragging (rotate −2°, scale 1.02, e3 + hue glow, `cursor: grabbing`), drop-target (dashed 40% cyan border + 5% fill), ghost/origin (40% opacity). Column: 40% navy well, status-tinted hairline, count pill, empty state w/ 3D object, "+ add card" row.
- **Table** — mono uppercase header w/ sort arrow, row hover surface-variant, status chips inline, pagination: square buttons, active = cyan gradient.
- **Modal** — e3 + subtle cyan glow, scrim `rgba(6,9,18,.66)` + 6px blur; enter: slow/out scale .96→1.
- **Toast** — glass, semantic border (success/error/info), icon tile, optional Undo button; enter from bottom w/ spring.
- **Tooltip** — near-black `#05121c`, 25% cyan border, 8px arrow.
- **Skeleton** — 6–18% cyan shimmer, 1.6s linear loop.
- **Avatar** — initials on hue gradients (cyan/violet/emerald rotation), 2px surface ring; stack overlap −8px, `+N` overflow.
- **Sidebar item** — default faint text; hover 6% cyan bg; active: cyan gradient bg @16%, 24% border, 3px glowing left bar. Admin items carry mono `ADMIN` tag.
- **Segmented toggle** — dark well, active segment cyan gradient w/ shadow.

## 9. Accessibility

- Text ≥ AA: body `#e0e8f0` on navy = 12.9:1; secondary `#a0b4c4` = 7.4:1; faint `#7e90ab` only for meta ≥12px.
- Focus always visible: 3px ring `rgba(125,211,252,.3)` + border color shift. Never remove outline without replacement.
- Status = icon + label + color, everywhere (chips, columns, charts get legends).
- Hit targets ≥ 40px desktop, ≥ 44px mobile. Reduced motion: all animation off.
