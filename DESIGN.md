# Interactions · Design Language (Part 1: Foundations)

A quiet architectural drawing sheet: warm paper, black ink, hairline grey grid lines everywhere, and one elegant serif in one weight.

This file covers the foundations — **colour, typography, lines & grid, and layout** — so any new page can match the Interactions site.

---

## 1. Colour

### Palette

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F3F2EE` | Page background (warm off-white) |
| `--paper2` | `#E9E7E1` | Hover fills, striped placeholder images |
| `--card` | `#FBFAF7` | Raised surfaces: cards, inputs, demo objects |
| `--white` | `#FFFFFF` | Reserved for the search area |
| `--ink` | `#141414` | Text, selected states, filled buttons |
| `--muted` | `#8A867D` | Secondary text: descriptions, numbers, labels |
| `--line` | `#D9D6CE` | Every border and divider |
| `--mark` | `#B3AFA6` | Grid-intersection "+" marks, slider tracks |
| `--accent` | `#E8462B` | Status only (e.g. the "playing" dot) — use sparingly |
| `--hl` | `#F4D35E` | Text highlighter only |

### Rules

- **One light theme.** No dark mode.
- **Black means selected.** Black borders or fills mark the user's current focus (selected card, active list row, active segment). Everything at rest is grey.
- **Accent is a signal, not decoration.** Use it for live status or a single call-out per screen, never for large areas.
- **Text colours:** primary text is `--ink`; anything secondary is `--muted`. No other text colours.
- **Selection:** `::selection` is ink on paper (inverted).

---

## 2. Typography

### Typeface

- **Fragment Core** (`fonts/Fragmentcore.otf`) — a light, high-contrast serif with a small x-height.
- **One weight only (Regular 400).** Hierarchy comes from **size and colour, never weight**. Do not use `font-weight: bold`; the browser will fake it.
- Fallback: `Georgia, serif`.
- The font has **no arrow glyphs** (→ ← ↑ ↓). Draw arrows and icons as inline SVG.

### Scale

| Size | Use |
|---|---|
| 28px | Panel / page section title (line-height 1.1, letter-spacing −0.01em) |
| 24px | Site name in the nav (letter-spacing −0.01em) |
| 20px | Search input, large inputs |
| 17px | Card titles (line-height 1.2) |
| 15px | Body text, list items (base size, line-height 1.4) |
| 13–14px | Descriptions, controls, buttons |
| 12px | Labels, index numbers |

### Patterns

- **Labels:** 12px, UPPERCASE, `letter-spacing: .08em`, `--muted`. E.g. `INDEX`, `SELECTED`, `CONTROLS`.
- **Index numbers:** three digits (`001`, `012`, `112`), 12px, `--muted`, tabular figures, placed before a name.
- **Descriptions:** 13px, `--muted`, line-height 1.35, clamp to two lines in cards.
- Because the x-height is small, **never set running text below 13px**.

---

## 3. Lines & grid

The page should read like a technical drawing.

- **All borders are 1px and grey** (`--line`). No 2px borders, no coloured borders.
- **Exception — selection:** the selected item gets a 1px **black** outline (use `box-shadow: inset 0 0 0 1px var(--ink)` so layout does not shift), and its inner dividers and primary button turn black too.
- **Grid-intersection marks:** a small 9×9px "+" in `--mark` sits at each corner where cells meet, like registration marks on a drawing.
- **Graph-paper surfaces:** content stages carry a faint 24px grid at 4.5% ink.
- **Panels are divided by lines, not by fills or shadows.** Adjacent regions share one 1px line (no doubled borders).
- **Corners are square.** Allowed exceptions only:
  - circular icon buttons (e.g. 36px play button)
  - pill buttons (`border-radius: 20px`) for a primary action like Play / Stop
  - toggle switches
- **Shadows:** none on layout. A soft shadow is allowed only on something being dragged.

---

## 4. Layout

### Structure

```
┌──────────────────────────────────────────────────────────┐
│ Nav · 56px · name left, actions right                    │
├────────────┬──────────────────────────────┬──────────────┤
│ Left panel │ Main canvas                  │ Right panel  │
│ 264px      │ 3 or 4 columns, endless rows │ 300px        │
│ (index)    │                              │ (details)    │
└────────────┴──────────────────────────────┴──────────────┘
```

- The app fills the viewport. **The page itself never scrolls** — each region scrolls on its own.
- The nav's left cell matches the left panel's width, so the vertical line runs unbroken from top to bottom.
- **Side panels collapse** to a 40px rail with a vertical uppercase label. The canvas takes the freed space.
- **Panel header:** 40px tall, sticky, uppercase label on the left, count or action on the right, grey line below.

### Grid (main canvas)

- **4 columns** when the canvas is ≥ 1180px wide, otherwise **3**. (2 columns ≥ 420px and 1 below that, on small screens only.)
- Cells share borders: each has a right and bottom 1px `--line`; the last column's right line is hidden against the panel.
- **Cell anatomy:**
  1. Header — index number + title, 12px 14px 10px padding, line below
  2. Stage — aspect ratio `1 / 0.86`, graph-paper background, content centred
  3. Footer — two-line description + circular action button, line above

### Spacing

- Panel padding: **20px** horizontal, 18–20px vertical for sections.
- Cell padding: **14px** horizontal.
- List rows: 9px vertical, 20px horizontal.
- Gaps between controls: 16px; between buttons: 6px.

### Breakpoints

| Width | Change |
|---|---|
| ≤ 1100px | Left panel 220px, right panel 260px |
| ≤ 860px | Single column: left panel hidden (use search), right panel becomes a bottom drawer (max 42vh) |

---

## Starter CSS

Drop this into any new page to inherit the foundations.

```css
@font-face {
  font-family: 'Fragment';
  src: url('fonts/Fragmentcore.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  /* colour */
  --paper: #F3F2EE;
  --paper2: #E9E7E1;
  --card: #FBFAF7;
  --white: #FFFFFF;
  --ink: #141414;
  --muted: #8A867D;
  --line: #D9D6CE;
  --mark: #B3AFA6;
  --accent: #E8462B;
  --hl: #F4D35E;

  /* layout */
  --nav-h: 56px;
  --left-w: 264px;
  --right-w: 300px;
  --rail: 40px;

  color-scheme: light;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Fragment', Georgia, serif;
  font-size: 15px;
  line-height: 1.4;
  color: var(--ink);
  background: var(--paper);
  -webkit-font-smoothing: antialiased;
}

::selection { background: var(--ink); color: var(--paper); }
:focus-visible { outline: 1px solid var(--ink); outline-offset: 2px; }

/* labels and numbers */
.label { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.num   { font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.desc  { font-size: 13px; color: var(--muted); line-height: 1.35; }

/* lines */
.box      { border: 1px solid var(--line); }
.selected { box-shadow: inset 0 0 0 1px var(--ink); }

/* graph-paper surface */
.graph {
  background:
    linear-gradient(rgba(20, 20, 20, .045) 1px, transparent 1px) 0 0 / 24px 24px,
    linear-gradient(90deg, rgba(20, 20, 20, .045) 1px, transparent 1px) 0 0 / 24px 24px;
}

/* "+" mark at a cell's bottom-right corner (parent must be position: relative) */
.marked::after {
  content: ""; position: absolute; right: -5px; bottom: -5px; width: 9px; height: 9px; pointer-events: none;
  background:
    linear-gradient(var(--mark), var(--mark)) center / 1px 100% no-repeat,
    linear-gradient(var(--mark), var(--mark)) center / 100% 1px no-repeat;
}
```
