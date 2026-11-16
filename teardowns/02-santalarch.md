# 02 · Santa Larch — https://santalarch.com/

Analysed on 2026-11-16 by loading the page in Chromium (about 41,500px tall), screenshotting it top to bottom, and reading the site's own JS bundles and CSS.

**Stack:** Nuxt 3 (Vue) · GSAP + ScrollTrigger, SplitText, MorphSVG, DrawSVG, Observer, Flip · Lenis smooth scroll (with infinite loop) · Three.js + Draco-compressed GLB models + troika 3D text · WebCodecs `VideoDecoder` for scroll-scrubbed video · Swiper (mobile only).

**Motion language:**
- Three named easings are used everywhere:
  - **Out** `cubic-bezier(.25, 1, .5, 1)`, a fast start with a long soft landing
  - **In** `(.5, 0, .75, 0)`
  - **InOut** `(.215, .61, .355, 1)`
- UI transitions run at 0.3s (fast) or 0.8s (slow).
- Text almost always enters with **SL-03 Word Rise** and leaves with a quick 0.25s fade.
- The palette is monochrome: architectural photography, hairline grid lines and huge grotesk type.
- The heavy 3D only runs on desktop (≥1024px) and switches off when the visitor has asked their system to reduce motion.

---

## A. Global / site-wide

### SL-01 · Counting Word Preloader
- **What you see:** A loading screen counts from 0 to 100%. Words slide in one after another, then slide out to the left while the title slides out to the right. The background turns near-black, a second line ("Until it becomes whole") appears, and two panels close vertically before the site fades in.
- **How:**
  - A GSAP timeline runs the counter over 4s with `roundProps: "value"`. It uses a custom `CustomEase("preloader")` curve with built-in pauses, so the count stalls and jumps like real loading.
  - The words move to `x: 0` with a 0.1s stagger, then to `xPercent: -100`. The overlay changes to `#0f0f0f`, and the panels go from `scaleY: 0` to 1 over 0.8s with InOut.
- **Detail:** It only plays once per session (`sessionStorage.preloaderShown`).

### SL-02 · Smooth Scroll with an Infinite Loop
- **What you see:** The scroll feels heavy and slow-braking. On desktop the page never ends: scrolling past Contact wraps you back to the hero.
- **How:** Lenis runs with `duration: 1.8` and `wheelMultiplier: 0.65`, plus `infinite: true` on desktop. A loop callback reports the direction, and the hero and Contact text fade or replay depending on which way you crossed the seam.

### SL-03 · Word Rise Reveal (the signature text motion)
- **What you see:** Paragraphs assemble word by word. Each word rises slightly, straightens from a small tilt and fades in.
- **How:** SplitText splits the text into words. Each word starts at `{opacity:0, y:20, rotate:3}` and animates to `{opacity:1, y:0, rotate:0}` over 1.6s with the **Out** easing, 0.03s apart, after a 0.2s delay. On exit the whole block fades out in 0.25s.
- **Direction-aware:** The scroll direction decides which content block appears next, so scrolling back up plays the reveals in reverse order.

### SL-04 · Light / Dark Invert Toggle
- **What you see:** A small fixed button in the bottom-left corner flips the whole site between light and dark, including the 3D scenes and the videos.
- **How:**
  - The button uses `mix-blend-mode: difference`, so it stays visible on any background.
  - It sets `data-theme` on `<html>` and saves the choice in `localStorage`, defaulting to the system's `prefers-color-scheme`.
  - The button is disabled while its icon animates.
  - The theme switches between pre-rendered video versions (`watch_white` / `watch_black`) and changes the 3D materials.

### SL-05 · Section-Driven Dark Page
- **What you see:** The page background turns dark as you enter Works and turns light again in Company.
- **How:** ScrollTrigger `onLeave` / `onEnterBack` callbacks set a `pageDark` flag, which toggles `.main-page.dark`.

### SL-06 · Underline Wipe Button
- **What you see:** An underlined link whose underline erases from left to right on hover.
- **How:** The label is drawn twice. The second copy is transparent, with only its underline visible. On hover its `clip-path` animates to `inset(-50% 100% -50% 0)` over 0.8s.

### SL-07 · Slide-Up Text Button
- **What you see:** On hover, the label rolls up and an identical copy comes in from below.
- **How:** Two stacked spans move `translateY(-100%)` inside an `overflow:hidden` wrapper over 0.8s.

### SL-08 · Cookie Bar Rise
- **What you see:** The cookie bar fades up into place and drops away once you choose.
- **How:** A 12px y-offset combined with opacity, over 0.3s with the Out easing.

---

## B. Hero

### SL-09 · Rotating Diagonal Hairline
- **What you see:** A thin line runs exactly from corner to corner of the screen. As you scroll, it pivots around the centre until it lies flat.
- **How:**
  - The starting angle is `atan2(height, width)`, so the line always hits the corners on any screen size.
  - A scrubbed ScrollTrigger (`top top` → `top -65%`) drives a `--angle` CSS variable down to 0.
  - The line is a 1px stripe drawn with `linear-gradient(var(--angle), …)`.

### SL-10 · Angle-Masked Sticky Tagline
- **What you see:** "Architecture Shapes Perception" slides upward in a pinned frame. Then it starts disappearing along the same rotating diagonal, as if the line cuts it off.
- **How:**
  - A sticky 100lvh wrapper holds the tagline, which is moved with `translate3d` by the scroll amount.
  - After 12% of the viewport height, the class `is-masked` adds `mask-image: linear-gradient(var(--angle), #000 50%, transparent 50%)`.

### SL-11 · Grid Lines Draw In
- **What you see:** On entry, the hero's vertical grid lines grow down from the top one after another. The "Scroll to discover" caption slides in, then fades as soon as you scroll.
- **How:** The lines go from `clip-path: inset(0 0 100% 0)` to `inset(0)` over 1.2s with a 0.2s stagger. The caption fades out on the first scroll pixel (`scrollTrigger: {start: 0, once: true}`).

---

## C. Philosophy: the 3D cubes journey (about 18,600px of scroll)

### SL-12 · 3D Word-Cube Pyramid
- **What you see:** Layers of floating cubes carry words on their faces ("Perception", "Defines", "Experience", "Architecture", "Shapes", "Refines", "See", "Hear", "Touch", "Feel"). The camera arcs around them and slowly zooms out, and the cubes rotate into view.
- **How:**
  - Three.js renders the cubes, with troika SDF text on the faces so the words stay sharp in 3D.
  - A scrubbed GSAP timeline drives the camera along an arc while the zoom changes.
  - The first word is revealed with a clipping plane tied to the hero tagline's scroll position.
- **Pointer tilt:** On desktop, the camera tilts slightly toward your cursor. This switches off once the camera finishes its move.

### SL-13 · Cube Face Hover Light (shader)
- **What you see:** Hovering a cube face makes a diagonal band of light sweep across it and its edges glow. Moving to another face leaves a fading "ghost" glow behind.
- **How:**
  - A custom fragment shader on an overlay plane takes `uHover`, `uSweep` and `uMode` (corner / halo / comet).
  - The sweep takes 680ms. Hover-in takes 0.9s and hover-out 1.1s, both with `power2.inOut`.
  - When you leave a face, a cloned "ghost" mesh keeps fading out, so the light never cuts off abruptly.

### SL-14 · Ambient Edge Comets
- **What you see:** Even without hovering, small streaks of light randomly race around the edges of cube faces.
- **How:**
  - The same shader has a comet mode. A head moves along the face's perimeter with an exponential tail (`COMET_SPEED 2.4`, `COMET_TAIL 3.2`) and a small spark at the front.
  - A new comet spawns every 0.35–1.1s, with at most 4 at once, each living 1.4–2.4s.
  - Comets only appear on on-screen faces that point toward the camera.

### SL-15 · Layers Flatten Into a Grid
- **What you see:** The pyramid collapses: the outer layers fade away and the rest slide flat into one even grid of cubes.
- **How:** The hidden layers' line, text and plane opacities go to 0 with the Out easing, while every visible cube's `position.z` tweens to 0 with the In easing, in a 3-second timeline section.

### SL-16 · Camera Dive Into a Cube, Then Video Handoff
- **What you see:** The camera drops straight down over the grid until one cube fills the screen, and that cube seamlessly becomes a photographic top-down view of a room.
- **How:**
  - The camera's y position and look-at target are animated.
  - Every frame, the code measures how much of the screen the cube covers. An HTML `<canvas>` video is resized to match the cube's projected size, so the 3D object and the video line up exactly before the crossfade.

### SL-17 · Scroll-Scrubbed Video via WebCodecs
- **What you see:** The room (and later the watch) plays forwards and backwards with your scroll, perfectly smooth, with no video controls.
- **How:**
  - A JSON manifest (`/sequences/room.json`: 380 frames, 1240×1240, 24fps; `watch_white.json`: 92 frames) points to chunked H.264 `.bin` files.
  - A `VideoDecoder` (WebCodecs, in a worker) decodes them, and the frame chosen by scroll progress is drawn to canvas.
- **Why it matters:** This is far smoother than setting `video.currentTime`, and much lighter than hundreds of JPEG frames.

### SL-18 · Chaptered Content With an Index Nav (Bold / Confident / Quiet)
- **What you see:** While the room video plays, the headline switches between "Bold", "Confident" and "Quiet", each with its description. A side index highlights 01 / 02 / 03 against a total of 03.
- **How:** Specific video frames act as chapter boundaries (192, 237 and 321). When a boundary is crossed, the old content fades out in 0.25s, the new content plays the SL-03 Word Rise, and the matching index item becomes active.

---

## D. Approach

### SL-19 · Staggered Word Slide ("WE · SEE · HEAR · TOUCH · FEEL")
- **What you see:** Huge words start offset sideways and slide into a staggered stack as you scroll.
- **How:** On desktop, each `.word-item` moves to `x: 0` with a 0.1s stagger, scrubbed from `top bottom` to `bottom bottom`. On mobile, a ScrollTrigger per word sets which one is active.

---

## E. Door: from concept to built detail (about 8,900px, pinned)

### SL-20 · Watch Sequence Intro With Clip Open
- **What you see:** A small scroll-scrubbed watch video grows into place while the pinned frame clips open to full screen. The Approach section fades out at the same time.
- **How:** One scrubbed timeline moves the thumbnail to `y: 0` and `scale: 1`, animates the containers from a clipped inset to `clip-path: inset(0%)`, and fades Approach out. The watch frames are decoded the same way as SL-17.

### SL-21 · SVG Door Outline Morph and Draw
- **What you see:** A door's outline drawing transforms its shape, then new lines draw themselves stroke by stroke while shaded areas fade in.
- **How:** MorphSVG animates each path to its matching target path in `<defs>` over 0.5s. Then DrawSVG animates the strokes from 0% to 100% over 0.75s.

### SL-22 · Exploded 3D Door
- **What you see:** A realistic 3D door ("Complete skeleton door design") separates into its layers as you scroll. Thin label lines stay attached to parts of the model, and the view tilts slightly toward your cursor.
- **How:**
  - A Draco-compressed GLB model (`/models/Door.glb`) is positioned by the timeline's progress: layer offsets and camera are recalculated on every scroll update.
  - **HTML lines locked to 3D:** anchor points on the model are projected to screen x every frame, and DOM lines are moved there with `gsap.set`.
  - **Silhouette squeeze:** the canvas `clip-path` narrows toward the door's projected bounding box.

### SL-23 · Direction-Aware Steps With a Progress Line
- **What you see:** Four steps ("Intent Before Image", "Engineering as Foundation", "Material Intelligence", "Detail as Discipline") swap as you scroll. Door detail thumbnails stack in, and an index counter updates.
- **How:**
  - Timeline callbacks placed at fixed points call `show(i)` or `hide(i)` depending on the scroll direction.
  - The thumbnails fade in reverse order with a 0.2s stagger.
  - The section height is computed from the timeline length (`(duration + 1) × 100lvh`).

---

## F. Works (featured projects)

### SL-24 · Clip Reveal That Turns the Page Dark
- **What you see:** The Works section opens like a widening window. Once it is fully open, the whole page switches to dark.
- **How:** A scrubbed `clip-path` animates to `inset(0% 0%)`. Its `onLeave` sets `pageDark = true` (see SL-05).

### SL-25 · Masonry Column Parallax
- **What you see:** Project images sit in 3 columns (2 on mobile) that slide upward at slightly different speeds and settle with their bottoms aligned.
- **How:**
  - Each image goes into whichever column is currently shortest, measured by aspect ratio.
  - Each column starts `0.5 × viewport` lower and moves to `minColumnHeight − itsHeight`.
  - The stagger is `|index − middle| × 0.2`, so the columns fan out from the centre.

### SL-26 · Load More With a Height Morph
- **What you see:** "Load more" grows the grid smoothly, scrolls you to the new projects, and the new cards rise in.
- **How:**
  - New items are appended, and the container height tweens from old to new over 1.2s with InOut while Lenis scrolls to the new content.
  - The parallax timeline is rebuilt with the new heights.
  - Cards reveal through an IntersectionObserver: from `y: 40` to 0 with opacity, over 0.9s, 0.06s apart.
  - The next batch of thumbnails is preloaded.

---

## G. Services

### SL-27 · Horizontal Rail With a Spotlight Window
- **What you see:** As you scroll down, the service names (Architecture, Interior, Procurement, Consulting, Marketing) glide sideways in dim grey. Each word lights up only while it passes through one fixed column of the screen. A photo appears in the same column and settles from a zoom, and the active service's description swaps in.
- **How:**
  - Vertical scroll progress (scrubbed from `top 25%` to `bottom bottom`) is mapped to the rail's `x`.
  - A second, bright copy of the titles row is clipped to `inset(0 25% 0 calc(50% + 1px))`. That clipped column is the spotlight, and the media row uses the same clip.
  - Each image scales from 1.5 to 1 while entering the window, then drifts −15% as the next one arrives.
  - The active index drives the description's Word Rise.
- **Mobile:** It switches to a Swiper carousel with prev/next arrows.

---

## H. Process

### SL-28 · Sticky Stage List and Hairline Accordion
- **What you see:** A pinned panel whose list of stages scrolls up inside it. Each stage expands to show its scope, and the hairline above a row brightens on hover or when open.
- **How:**
  - A scrubbed timeline moves the list `yPercent: -100` while the headers cross-fade.
  - Opening a stage tweens its height over 0.8s with the Out easing.
  - The `:before` line goes from opacity 0.2 to 1 on hover or when active.

---

## I. Company

### SL-29 · "Working ⟷ Worldwide" Split
- **What you see:** After the team portraits, the words "Working" and "Worldwide" slide apart to the screen edges, opening space for a globe.
- **How:** In a scrubbed timeline, `x` is computed per word so each moves outward, a globe icon scales to `50/98`, and a clip-path reveal opens the centre.

### SL-30 · CSS 3D Orbiting Globe Labels
- **What you see:** Lines carrying city names orbit around a central point like a slowly spinning globe, while the labels stay readable.
- **How:**
  - Each line runs `@keyframes rotateY(start → start − 1turn)` endlessly.
  - Each label runs the opposite rotation so it always faces you.
  - A `--locations-fade` variable fades the lines and text together through `color-mix()`.
- **Detail:** This is pure CSS, with no WebGL.

### SL-31 · Plus-Sign Snap Transition
- **What you see:** A giant "+" grows until it fills the screen, the scroll briefly snaps, and the page comes back light for Contact.
- **How:** A scrubbed scale on the plus icon, plus a snap point (`gateLabel: "plus-snap"`). Leaving it sets `pageDark = false`.

---

## J. Contact

### SL-32 · Wordmark Band and Loop Seam
- **What you see:** A huge "SANTAL" wordmark band with lines growing vertically. Keep scrolling and you are back at the hero.
- **How:** A scrubbed `scaleY` on the band lines and `yPercent` moves. The hero and Contact text share an opacity tween that plays forward or reverses at the infinite-loop seam (SL-02).

### SL-33 · Multi-Step Enquiry Popup
- **What you see:** "Enquire" opens a stepped form. A thin progress line grows with each step, with a "Prev Step" button and a success screen decorated with crossing lines.
- **How:** `--current-step` and `--total-steps` CSS variables drive `scaleY((step + 1) / total)`, which becomes `scaleX` on mobile, with a 0.3s transition. Steps cross-fade using Vue `<Transition>`.

### SL-34 · Form Field Hover Lines and Country Picker
- **What you see:** Input underlines react on hover, and a phone-country dropdown with flags highlights options as you hover them.
- **How:** CSS `:hover` and `:has(.input:hover)` rules animate the field's `:after` line. Inactive flag rows change colour on hover.
