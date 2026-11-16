# 01 · Enerblock — https://enerblock.net/en/

Analysed on 2026-11-16 by loading the page in Chromium and reading the site's own JS and CSS.

**Stack:** Astro · GSAP 3 + ScrollTrigger + CustomEase · Lenis smooth scroll · SplitType (text splitting) · Swiper 11 · Canvas 2D · native Web Components (one custom element per effect).

**Motion language:**
- Main ease: `cubic-bezier(0.53, 0, 0, 1)`. It starts slowly and ends with a sharp snap, and nearly every transition on the site uses it.
- Link ease: `cubic-bezier(0.4, 0, 0.25, 1)`.
- Typical durations are 0.6 s for hovers and 1–1.2 s for reveals.
- Colours are coral `#ff5949`, near-black and grey. The theme is an architect's blueprint, with crosshairs, X/Y readouts and drawing numbers.

---

## A. Global / site-wide

### EB-01 · Clapperboard Split Preloader
- **What you see:** The page loads behind a coral screen. That screen splits along a diagonal seam: the top half shoots up and the bottom half drops down, like a clapperboard opening.
- **How:** Each half is built from a rectangle plus a CSS-border triangle, which gives the angled seam. Adding `.preload--out` to the body moves the top half `translateY(-100vh)` and the bottom half `translateY(100vh)` over 1 s with the main ease. A black backdrop behind it fades out over 1 s.
- **Trigger:** The page has loaded and GSAP is ready (after a 200 ms delay).

### EB-02 · Lenis Smooth Scroll
- **What you see:** Scrolling feels heavy and buttery.
- **How:** Lenis runs with `lerp: 0.13` and `smoothWheel`. It is driven by `gsap.ticker` with `lagSmoothing(0)`, and `ScrollTrigger.update` runs on every Lenis scroll so the scroll-linked effects never drift.

### EB-03 · AJAX Fade Page Transition
- **What you see:** Clicking an internal link fades the page out to a dark layer with a pulsing dot. The new page then fades in and its hero animations play again.
- **How:**
  1. The `<a-link>` custom element intercepts the click.
  2. It removes `page--in` and adds `fade--out`, then waits 400 ms.
  3. It runs `fetch()` on the new page, parses it with `DOMParser`, and swaps only `#page-content`. It also updates `<title>`, the meta description and the body theme class.
  4. It scrolls Lenis to 0, refreshes ScrollTrigger and calls `history.pushState`.
  5. After 400 ms it adds `page--in` again and dispatches a `page--in` event, which the hero effects listen for.
- The loading dot uses a `loading` keyframe that pulses opacity 0 → 1 → 0.

### EB-04 · Smart Header (hide / recolour)
- **What you see:** The header reacts to the scroll position:
  - It gets a different style at the very top.
  - It turns white over dark video or graphic sections.
  - It slides away when the footer comes into view.
- **How:** A scroll listener toggles `scroll--top` (at 10 px or less) and `scroll--down` / `scroll--up`, with a 5 px dead zone. `footer--in` sets `translateY(-100%)` on the header. `header--graph` and `header--white` change the logo and button to white while a scroll-frames section or white hero is in view.

### EB-05 · Clip-Wipe Fullscreen Menu
- **What you see:** The menu panel wipes in from the right edge. Divider lines draw themselves across and down, and the menu links slide up out of hidden masks.
- **How:**
  - The panel's `clip-path` goes from `inset(0 0 0 100%)` to `inset(0)` over 0.6 s.
  - The divider pseudo-elements go from `scaleX(0)` / `scaleY(0)` to 1 over 1 s.
  - Each link `<span>` sits inside an `overflow:hidden` `.mask` and moves from `translateY(-100%)` to 0 over 1 s.
  - Submenus open as a measured-height accordion with a plus icon that becomes a minus.

### EB-06 · Burger Line Swap (hover)
- **What you see:** On hover, the burger icon's lines slide out to the right while new lines slide in from the left.
- **How:** Each line has `:before` and `:after` bars. One moves `translate3d(100%,0,0)` with `origin:right` while the other moves in from the left.

### EB-07 · Text-Roll Arrow Button ("Learn more", "Contact")
- **What you see:** On hover, the label rolls down and an identical copy drops in from above. The arrow box pushes its arrow out to the right while an orange arrow box slides in from the left. The button background fills at the same time.
- **How:** The text is rendered twice. The second copy sits at `top:-100%`, and on hover both copies move `translate3d(0,100%,0)`. The icon box works the same way horizontally. All of this takes 0.6 s with the main ease.

### EB-08 · Underline Draw Link
- **What you see:** An underline grows from left to right on hover.
- **How:** A `:before` element goes from `scaleX(0)` to 1. `transform-origin` is left while the line grows and right while it shrinks, so the line leaves in the same direction it came in.

### EB-09 · Reveal-on-Approach (`.hide` system)
- **What you see:** Section labels, each with a small square bullet, and images fade or wipe in as they approach the viewport.
- **How:** A scroll listener removes the `.hide` class once an element is within 200 px of the viewport bottom (80 px on mobile). The actual animation for each element is defined in CSS.

---

## B. Hero

### EB-10 · Cursor-Morphing Logo
- **What you see:** The giant "E" logo warps toward your cursor. Its three slabs skew and stretch left, right, up or down, and they spring back when you leave. Thin guide lines around the logo stay attached to its edges.
- **How:**
  - Five versions of the logo (`center`, `left`, `right`, `top`, `bottom`) are stored as SVG polygons. Four of them sit in hidden `<template>` tags.
  - The mouse position is normalised to −1…1 on each axis, and each polygon point is a **weighted blend** of the five states. For example, cursor x = −0.6 gives 60 % of the "left" state.
  - The movement is smoothed with a lerp (`ease 0.1`) on `gsap.ticker`.
  - The four guide lines read the polygons' min/max X and Y every frame and move to match them.
- **Rebuild tip:** This works with any shape. Draw the extreme poses in Figma with **the same number of points** in each, then blend between them.

### EB-11 · Line Mask Wipe Reveal (`hero-title`, `line-text`)
- **What you see:** A solid bar the colour of the text sweeps across each line of a heading. The text appears behind the bar, and then the bar slides off to the right. Each line starts 0.1 s after the one above it.
- **How:**
  - SplitType splits the heading into lines, and each line gets `overflow:hidden`.
  - A `.line--mask` bar (`background: currentColor`) runs the keyframe `growAndSlide` over 1.2 s: width grows 0 → 100 % during the first 45 %, holds until 55 %, then moves `translateX(101%)`.
  - The text runs the keyframe `appear`, going from opacity 0 to 1 between 50 % and 60 % of the time, which is while the bar fully covers it.
- **Trigger:** The hero version plays on the `page--in` event. The `line-text` version plays when the element is within 25 % of the viewport height of the screen.
- The same wipe is reused on images, as in EB-18.

### EB-12 · Scramble Decode Title (`animated-title`)
- **What you see:** Small uppercase labels such as "SYSTEM", "APPROACH" and "SOLUTIONS" type themselves out. Each character flickers through random letters with a block-cursor highlight before settling on the real letter, like a computer terminal.
- **How:**
  - SplitType splits the text into characters.
  - Each character gets a GSAP tween with `repeat: 3`, `repeatRefresh: true` and an `innerHTML` set to a random a–z letter, lasting 0.03 s with `repeatDelay` 0.04.
  - Characters start 0.07 s apart.
  - A `--opa` CSS variable switches the highlight block on for the first cycle only.
  - `onComplete` restores the real character.
- **Source:** The code credits the Codrops article "Hover Animations for Terminal-like Typography" (2024).

### EB-13 · Scroll-Scrubbed Image Sequence (`scroll-frames`)
- **What you see:** As you scroll, a 3D object, such as the axonometric floor plan, rotates and assembles. It looks like a video controlled by the scrollbar.
- **How:**
  - A `<canvas>` draws pre-rendered WebP frames named `frame_%04d.webp`. The home section has 121 frames and the pre-footer has 145.
  - A GSAP tween runs on `{frame}` from 0 to N−1 with `scrub: true` across the section, and each update draws the rounded frame with `drawImage`.
  - Frame 1 loads first. The rest load in the background, one every 20 ms, and any frame that is still missing loads when it is needed.
  - The header switches to its white version (`header--graph`) while the section is active.

---

## C. Scroll / content sections

### EB-14 · Blueprint Crosshair Cursor (`cross-hair`)
- **What you see:** Inside certain sections, the cursor turns into a full-width and full-height pair of 1 px lines. They follow the mouse with a slight lag, a dot marks where they cross, and live **"X: 710 / Y: 811"** coordinates follow along.
- **How:** On `mousemove`, GSAP tweens the vertical line's `x`, the horizontal line's `y`, and the labels and dot, all with a 0.15 s `power2.out` tween. The coordinates are clamped to 4 rem inside the right and bottom edges. The crosshair fades in on mouseenter and out on mouseleave over 0.1 s.

### EB-15 · Crosshair Corner-Reveal Image (`cross-image`)
- **What you see:** As an image scrolls into view, it opens up from its top-left corner like a selection box being dragged. The image zooms out from 2× to 1× while it opens. Crosshair lines and X/Y coordinates ride along the moving corner.
- **How:**
  - Progress runs from 0 to 1 while the element's top moves from 80 % of the viewport height to 5 %. The page calculates this itself in a scroll listener rather than with ScrollTrigger.
  - That progress drives three things:
    - `clip-path: inset(1.25rem R% B% 1.25rem)`, which shrinks the right and bottom insets.
    - `img scale: 2 − progress`.
    - The `x`/`y` position of the crosshair lines, plus the coordinate text.
- There is also a hover version, `cross-image-mouse`, where the clip box follows the cursor instead of the scroll position.

### EB-16 · Parallax Media
- **What you see:** Images and videos inside frames move more slowly than the page. The hero media also fades out as you scroll past it.
- **How:** The media is taller than its container. It starts at `y: -dist` and is tweened to `dist − headerHeight` with `scrub` from "top bottom" to "bottom top". The hero version adds a second tween from opacity 1 to 0.

### EB-17 · SVG Wireframe Draw + Split (`home-graph`, `frame-morph`)
- **What you see:** Line drawings sketch themselves as you scroll. Then the drawing's parts slide apart sideways: the first part stays still, the second moves left and the third moves right. The section's text appears once that finishes.
- **How:**
  1. Every path gets `strokeDasharray = strokeDashoffset = getTotalLength()`.
  2. A scrubbed timeline (`scrub: 1`, `top top` → `75% bottom`) tweens the offset to 0.
  3. It then moves each part on `x` in two steps, to 75 % and then to 100 % of 24 % of the SVG's width.
  4. `onLeave` adds the `text--in` class to the section.

### EB-18 · Sticky Stacking Cards (Solutions 01–04)
- **What you see:** The four product cards stick and stack on top of each other as you scroll. Each card's image is revealed by the coloured-bar wipe from EB-11. Clicking a card title smooth-scrolls to the point where that card sits on top of the stack.
- **How:**
  - The cards use `position: sticky` with a calculated `top`.
  - Each image's `:before` bar runs `growAndSlide` over 0.8 s once the `.hide` class is removed.
  - Clicking a title calls `lenis.scrollTo(…)` with `duration 1.2` and an easeOutCubic curve. The target is `(cardHeight − 1.2 × headerHeight) × (order − 1) + stackStart`, recalculated on resize.

### EB-19 · Projects Carousel with Roll Titles (Swiper)
- **What you see:** A carousel of project cards that you can drag or move with the arrows. On hover, a card's title rolls to a duplicate and its arrow button fills orange.
- **How:** Swiper is set to 2.5 slides per view on desktop with a speed of 400, and 1.25 per view on mobile with a speed of 250. It has clickable pagination and prev/next arrows. The title roll uses the same duplicate-text technique as EB-07.

### EB-20 · Single-Open Accordion (`toggle-box`, Value section)
- **What you see:** Rows for Digitalization, Sustainability and Certification. Opening one row closes the others, and the plus icon turns into a minus. The first row opens automatically when the page loads.
- **How:** The row's content height is measured from `scrollHeight`, and the element's `height` changes between 0 and that value through a CSS transition. ScrollTrigger and Lenis are refreshed after 600 ms so the scroll effects below the accordion stay aligned.

### EB-21 · Floating Caption (`float-subtitle`)
- **What you see:** A caption rides up alongside a large image as you scroll through it, settling at the vertical middle. This only happens on desktop.
- **How:** A ScrollTrigger runs from `top 50%` to `bottom 50%`, and its `onUpdate` sets `top` from 100 % down to 50 %.

### EB-22 · Footer Curtain Reveal
- **What you see:** The footer is revealed underneath the page. Its giant "Enerblock" wordmark rises into place while a dark overlay fades away.
- **How:** `.footer__parallax` is tweened from `yPercent -50` to 0, and the `.footer__over` overlay from opacity 1 to 0. Both are scrubbed from the moment the last section (`.enerblock__window`) enters the viewport until it reaches the bottom.

### EB-23 · Viewport Video Autoplay
- **What you see:** Background videos play only while they are on screen.
- **How:** On every scroll, the page calls `play()` on a video when it is in view and `pause()` when it is not.

---

## D. Present in the code (used on inner pages)

- **EB-24 · Polygon Point Morph (`panel-morph`)** — Scrubbed and snapped to timeline labels. The SVG polygon and line coordinates tween to their `data-final-*` values, two side layers slide apart, and then the description fades in.
- **EB-25 · Robot Saw Path (`robot-morph`)** — Scroll moves a robot SVG down and then across the screen. A saw blade (`#Sierra`) starts with a 90° `rotateStart` and then spins nonstop with `rotateInfinite`.
- **EB-26 · Exploded-Layer Assembly (`system-morph`)** — The layers of a building system (left, right, external, internal, closing) drop in one group at a time with opacity and a y offset. The timeline is scrubbed and snaps to each step.
- **EB-27 · Slide-Up Video Dialog (`video-player`)** — A native `<dialog>` slides up from `translateY(30dvh)` while fading in. Lenis stops while it is open, and the video resets when it closes.
- **EB-28 · Multi-Step Contact Form** — Each step is validated before the next one opens. The container is fixed to the height of the tallest step so the page doesn't jump between steps.
- **EB-29 · Tag Filter** — Buttons show or hide items by their `data-tags`, then Lenis and ScrollTrigger are refreshed.
