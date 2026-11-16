/* Card Motion Lab · 15 spring / FLIP specimens */
(function () {
  const { add, css, loop, pointer, S, spring, flip, clamp } = IX;

  css(`
  .ml{position:absolute;inset:0;touch-action:none}
  .ml-c{background:var(--card);border:1px solid var(--ink);display:flex;flex-direction:column;justify-content:flex-end;padding:10px;font-size:13px;user-select:none}
  .ml-c small{color:var(--muted);font-size:11px}
  .ml-tilt{position:absolute;inset:0;display:grid;place-items:center;perspective:700px}
  .ml-tc{position:relative;width:52%;aspect-ratio:3/4;transform-style:preserve-3d;background:var(--card);border:1px solid var(--ink)}
  .ml-tc .ly{position:absolute;border:1px solid var(--ink);background:var(--card)}
  .ml-tc .l1{left:12%;top:12%;right:12%;height:34%;transform:translateZ(18px);background:repeating-linear-gradient(135deg,var(--paper2) 0 6px,var(--card) 6px 12px)}
  .ml-tc .l2{left:12%;top:54%;right:30%;height:9%;transform:translateZ(34px);background:var(--ink)}
  .ml-tc .l3{left:12%;bottom:12%;width:30%;height:9%;transform:translateZ(52px);border-radius:12px}
  .ml-tc .gl{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.75),transparent 55%);mix-blend-mode:soft-light;opacity:var(--go,0)}
  .ml-deck{position:absolute;inset:0;display:grid;place-items:center}
  .ml-deck .ml-c{position:absolute;width:46%;aspect-ratio:3/4;cursor:grab;will-change:transform}
  .ml-deck .lbl{position:absolute;top:12px;font-size:11px;color:var(--muted);letter-spacing:.06em}
  .ml-x{position:absolute;width:38%;aspect-ratio:4/3;left:31%;top:30%;cursor:pointer;z-index:2;overflow:hidden}
  .ml-x.open{left:10px;top:10px;width:calc(100% - 20px);height:calc(100% - 20px);aspect-ratio:auto;justify-content:flex-start}
  .ml-x p{display:none;margin-top:8px;color:var(--muted);line-height:1.4}
  .ml-x.open p{display:block}
  .ml-grid{position:absolute;inset:14% 10%;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);gap:8px}
  .ml-grid .ml-c{align-items:center;justify-content:center;font-size:22px;cursor:grab;position:relative}
  .ml-grid .ml-c.drag{z-index:5;box-shadow:0 14px 24px -12px rgba(0,0,0,.4);cursor:grabbing}
  .ml-mag{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:6%}
  .ml-mag .ml-c{width:24%;aspect-ratio:3/4;will-change:transform}
  .ml-stk{position:absolute;inset:0;display:grid;place-items:center}
  .ml-stk .ml-c{position:absolute;width:44%;aspect-ratio:3/4}
  .ml-fl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:5%;perspective:600px}
  .ml-fc{width:26%;aspect-ratio:3/4;position:relative;transform-style:preserve-3d;cursor:pointer}
  .ml-fc>div{position:absolute;inset:0;backface-visibility:hidden;display:grid;place-items:center;border:1px solid var(--ink);font-size:20px}
  .ml-fc .fr{background:var(--card)}
  .ml-fc .bk{background:var(--ink);color:var(--paper);transform:rotateY(180deg)}
  .ml-arc{position:absolute;inset:0;overflow:hidden}
  .ml-arc .ml-c{position:absolute;width:22%;aspect-ratio:3/4;left:39%;top:56%;will-change:transform;cursor:pointer}
  .ml-map{position:absolute;inset:0;background:linear-gradient(var(--line) 1px,transparent 1px) 0 0/22px 22px,linear-gradient(90deg,var(--line) 1px,transparent 1px) 0 0/22px 22px}
  .ml-map b{position:absolute;left:12px;top:10px;font-weight:400;font-size:13px}
  .ml-sheet{position:absolute;left:0;right:0;top:0;height:100%;background:var(--card);border-top:1px solid var(--ink);box-shadow:0 -10px 30px -18px rgba(0,0,0,.35);will-change:transform;touch-action:none}
  .ml-sheet .hd{height:26px;display:grid;place-items:center;cursor:grab}
  .ml-sheet .hd i{width:36px;height:4px;border-radius:2px;background:var(--ink);opacity:.5}
  .ml-sheet .it{margin:0 14px;padding:10px 0;border-bottom:1px solid var(--line);font-size:13px;display:flex;justify-content:space-between}
  .ml-sheet .it span{color:var(--muted)}
  .ml-ball{position:absolute;left:0;top:0;width:54px;height:54px;border-radius:50%;background:var(--ink);cursor:grab;will-change:transform}
  .ml-dot{position:absolute;left:0;top:0;border-radius:50%;background:var(--ink);will-change:transform;pointer-events:none}
  .ml-chips{position:absolute;top:10px;left:0;right:0;display:flex;justify-content:center;gap:6px}
  .ml-chips button{border:1px solid var(--line);border-radius:14px;padding:3px 10px;font-size:12px;background:var(--card)}
  .ml-chips button.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}
  .ml-fg{position:absolute;left:8%;right:8%;top:46px;bottom:10px;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:min-content;gap:8px;align-content:start}
  .ml-fg div{aspect-ratio:1;border:1px solid var(--ink);display:grid;place-items:center;background:var(--card)}
  .ml-fg svg{width:44%;height:44%}
  .ml-cas{position:absolute;inset:8% 10%}
  .ml-cas .hero{position:absolute;left:0;top:0;width:100%;height:30%;background:var(--ink);color:var(--paper);padding:10px;font-size:15px;cursor:pointer;z-index:2;display:flex;align-items:flex-end}
  .ml-cas .ch{position:absolute;left:0;width:100%;height:13%;border:1px solid var(--ink);background:var(--card);font-size:12px;display:flex;align-items:center;padding:0 10px;will-change:transform,opacity}
  .ml-gx{position:absolute;inset:8%;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:1fr;grid-auto-flow:dense;gap:6px}
  .ml-gx div{border:1px solid var(--ink);background:var(--card);cursor:pointer;padding:6px;font-size:12px;overflow:hidden}
  .ml-gx div.big{grid-column:span 2;grid-row:span 2;background:var(--ink);color:var(--paper)}
  .ml-mas{position:absolute;inset:8% 8%}
  .ml-mas div{position:absolute;border:1px solid var(--ink);background:var(--card);font-size:11px;padding:5px;will-change:transform,opacity}
  `);

  const read = (api, o) => api.read(o);

  /* 01 · Spring tilt with depth */
  add({
    name: 'Spring tilt with depth', desc: 'The pointer sets a target rotation and springs chase it. Inner layers sit at different depths, with a cursor-tracked glare.',
    controls: [
      { type: 'range', key: 'k', label: 'Stiffness k', min: 40, max: 400, value: 190 },
      { type: 'range', key: 'c', label: 'Damping c', min: 4, max: 40, value: 16 },
    ],
    build(s, P, api) {
      s.innerHTML = `<div class="ml-tilt"><div class="ml-tc"><div class="ly l1"></div><div class="ly l2"></div><div class="ly l3"></div><div class="gl"></div></div></div>`;
      const card = s.querySelector('.ml-tc'), ptr = pointer(s);
      const rx = S(), ry = S(), sc = S(1);
      const L = loop((dt) => {
        if (ptr.in) { const r = s.getBoundingClientRect(), px = ptr.x / r.width, py = ptr.y / r.height; ry.t = (px - 0.5) * 34; rx.t = -(py - 0.5) * 34; sc.t = 1.04; card.style.setProperty('--gx', px * 100 + '%'); card.style.setProperty('--gy', py * 100 + '%'); card.style.setProperty('--go', 1); }
        else { rx.t = ry.t = 0; sc.t = 1; card.style.setProperty('--go', 0); }
        [rx, ry].forEach((q) => spring(q, P.k, P.c, dt)); spring(sc, P.k, P.c, dt);
        card.style.transform = `rotateX(${rx.x}deg) rotateY(${ry.x}deg) scale(${sc.x})`;
        read(api, { rotX: rx.x.toFixed(1) + '°', rotY: ry.x.toFixed(1) + '°', scale: sc.x.toFixed(3), 'spring vel': Math.hypot(rx.v, ry.v).toFixed(1) });
      });
      return { start: L.start, stop() { L.stop(); card.style.transform = ''; } };
    },
  });

  /* 02 · Swipe deck with velocity */
  add({
    name: 'Swipe deck with velocity', desc: 'Release uses flick velocity, not just distance: a slow long drag and a short sharp flick both dismiss. Everything else springs back.',
    controls: [{ type: 'button', key: 'undo', label: 'Undo' }, { type: 'button', key: 'reset', label: 'Reset deck' }],
    build(s, P, api) {
      const names = ['Arches', 'Dunes', 'Fjord', 'Mesa', 'Tundra'];
      s.innerHTML = `<div class="ml ml-deck"><span class="lbl">KEEP · DRAG · DISMISS</span>${names.map((n, i) => `<div class="ml-c" data-i="${i}">${n}<small>Card ${i + 1} of 5</small></div>`).join('')}</div>`;
      const els = [...s.querySelectorAll('.ml-c')];
      let cards, gone, drag = null, hist = [], verdict = '—';
      const reset = () => { cards = els.map((el) => ({ el, x: S(), out: false })); gone = []; render(); };
      const stack = () => cards.filter((c) => !c.out).reverse();
      const render = () => {
        const st = stack();
        cards.forEach((c) => {
          const depth = c.out ? 0 : st.length - 1 - st.indexOf(c);
          const top = depth === 0 && !c.out;
          c.el.style.zIndex = c.out ? 20 : 10 - depth;
          c.el.style.transform = `translateX(${c.x.x}px) rotate(${c.x.x * 0.06}deg) translateY(${(c.out ? 0 : -depth) * 7}px) scale(${1 - (c.out ? 0 : depth) * 0.04})`;
          c.el.style.opacity = c.out && Math.abs(c.x.x) > s.clientWidth ? 0 : 1;
          c.el.style.cursor = top ? 'grab' : 'default';
        });
      };
      const topCard = () => { const st = stack(); return st[st.length - 1]; };
      s.addEventListener('pointerdown', (e) => {
        const t = topCard(); if (!t || !t.el.contains(e.target)) return;
        drag = { c: t, x0: e.clientX - t.x.x }; hist = [{ x: e.clientX, t: performance.now() }];
        s.setPointerCapture(e.pointerId);
      });
      s.addEventListener('pointermove', (e) => {
        if (!drag) return;
        drag.c.x.x = drag.c.x.t = e.clientX - drag.x0; drag.c.x.v = 0;
        hist.push({ x: e.clientX, t: performance.now() }); if (hist.length > 6) hist.shift();
        render();
      });
      const release = () => {
        if (!drag) return;
        const c = drag.c, a = hist[0], z = hist[hist.length - 1], v = ((z.x - a.x) / Math.max(1, z.t - a.t)) * 1000;
        const dx = c.x.x, out = Math.abs(dx) > 120 || Math.abs(v) > 700;
        verdict = out ? (dx + v * 0.1 > 0 ? 'DISMISS' : 'KEEP') : 'spring back';
        if (out) { const dir = Math.sign(dx + v * 0.1) || 1; c.out = true; c.x.t = dir * s.clientWidth * 1.3; c.x.v = v; gone.push(c); } else c.x.t = 0;
        read(api, { velocity: Math.round(v) + ' px/s', verdict });
        drag = null;
      };
      s.addEventListener('pointerup', release);
      s.addEventListener('pointercancel', release);
      const L = loop((dt) => {
        cards.forEach((c) => { if (drag && drag.c === c) return; spring(c.x, 170, 20, dt); });
        render();
        read(api, { dx: Math.round(topCard()?.x.x || 0) + 'px', remaining: stack().length, threshold: '±120px or ±700px/s', verdict });
      });
      reset();
      return {
        start: L.start, stop() { L.stop(); reset(); },
        act(k) { if (k === 'reset') reset(); if (k === 'undo') { const c = gone.pop(); if (c) { c.out = false; c.x.t = 0; } } },
      };
    },
  });

  /* 03 · FLIP shared element expand */
  add({
    name: 'FLIP shared element expand', desc: 'First, Last, Invert, Play: the same card is measured, moved into its expanded layout, then the inverse transform is animated away.',
    build(s, P, api) {
      s.innerHTML = `<div class="ml"><div class="ml-c ml-x" tabindex="0"><b style="font-weight:400;font-size:16px">Press to expand</b><small>Specimen 03</small><p>The layout change happens instantly, then a transform makes the element appear to travel from its old position. Only transform animates, so it stays smooth. Press Escape or click again to collapse.</p></div></div>`;
      const el = s.querySelector('.ml-x');
      const toggle = (force) => {
        const a = el.getBoundingClientRect();
        flip([el], () => el.classList.toggle('open', force), { duration: 560, easing: 'cubic-bezier(.2,.9,.1,1)' });
        const b = el.getBoundingClientRect();
        read(api, { 'Δx': Math.round(a.left - b.left) + 'px', 'Δy': Math.round(a.top - b.top) + 'px', scaleX: (a.width / b.width).toFixed(2), scaleY: (a.height / b.height).toFixed(2), state: el.classList.contains('open') ? 'expanded' : 'collapsed' });
      };
      el.onclick = () => toggle();
      el.onkeydown = (e) => { if (e.key === 'Escape') toggle(false); if (e.key === 'Enter') toggle(); };
      return { stop() { el.classList.remove('open'); } };
    },
  });

  /* 04 · Drag to reorder, FLIP the rest */
  add({
    name: 'Drag to reorder', desc: 'The dragged card follows the pointer and every displaced sibling FLIPs into its new slot. Arrow keys work too.',
    build(s, P, api) {
      s.innerHTML = `<div class="ml"><div class="ml-grid">${'ABCDEF'.split('').map((l) => `<div class="ml-c" tabindex="0">${l}</div>`).join('')}</div></div>`;
      const grid = s.querySelector('.ml-grid');
      let drag = null, moves = 0;
      const order = () => [...grid.children].map((c) => c.textContent).join(' ');
      const report = () => read(api, { order: order(), moves, dragging: drag ? drag.el.textContent : '—' });
      const place = () => { if (!drag) return; drag.el.style.transform = `translate(${drag.px - drag.ox - drag.el.offsetLeft}px,${drag.py - drag.oy - drag.el.offsetTop}px)`; };
      grid.addEventListener('pointerdown', (e) => {
        const el = e.target.closest('.ml-c'); if (!el) return;
        const g = grid.getBoundingClientRect();
        drag = { el, ox: e.clientX - g.left - el.offsetLeft, oy: e.clientY - g.top - el.offsetTop, px: e.clientX - g.left, py: e.clientY - g.top };
        el.classList.add('drag'); grid.setPointerCapture(e.pointerId); report();
      });
      grid.addEventListener('pointermove', (e) => {
        if (!drag) return;
        const g = grid.getBoundingClientRect();
        drag.px = e.clientX - g.left; drag.py = e.clientY - g.top;
        const kids = [...grid.children];
        const over = kids.find((k) => k !== drag.el && drag.px > k.offsetLeft && drag.px < k.offsetLeft + k.offsetWidth && drag.py > k.offsetTop && drag.py < k.offsetTop + k.offsetHeight);
        if (over) {
          const others = kids.filter((k) => k !== drag.el);
          const from = kids.indexOf(drag.el), to = kids.indexOf(over);
          flip(others, () => grid.insertBefore(drag.el, from < to ? over.nextSibling : over), { duration: 380 });
          moves++; report();
        }
        place();
      });
      const end = () => {
        if (!drag) return;
        const el = drag.el; drag = null;
        el.classList.remove('drag');
        const cur = el.style.transform; el.style.transform = '';
        if (cur) el.animate([{ transform: cur }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.9,.2,1)' });
        report();
      };
      grid.addEventListener('pointerup', end); grid.addEventListener('pointercancel', end);
      grid.addEventListener('keydown', (e) => {
        const el = e.target.closest('.ml-c'); if (!el) return;
        const kids = [...grid.children], i = kids.indexOf(el), d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d || i + d < 0 || i + d >= kids.length) return;
        e.preventDefault();
        flip(kids, () => grid.insertBefore(el, d > 0 ? kids[i + 1].nextSibling : kids[i - 1]), { duration: 380 });
        el.focus(); moves++; report();
      });
      return { start: report };
    },
  });

  /* 05 · Magnetic field with falloff */
  add({
    name: 'Magnetic field with falloff', desc: 'Each card is pulled toward the cursor by a quadratic falloff of distance: a continuous force field, not a hover state.',
    controls: [
      { type: 'range', key: 'r', label: 'Pull radius', min: 60, max: 300, value: 170, unit: 'px' },
      { type: 'range', key: 'f', label: 'Force', min: 4, max: 60, value: 26, unit: 'px' },
    ],
    build(s, P, api) {
      s.innerHTML = `<div class="ml ml-mag">${['A', 'B', 'C'].map((l) => `<div class="ml-c">Field ${l}<small>(1 − d/r)²</small></div>`).join('')}</div>`;
      const els = [...s.querySelectorAll('.ml-c')], ptr = pointer(s);
      const st = els.map(() => ({ x: S(), y: S() }));
      const L = loop((dt) => {
        const r0 = s.getBoundingClientRect();
        let near = null, nd = 1e9, nf = 0;
        els.forEach((el, i) => {
          const b = el.getBoundingClientRect(), cx = b.left - r0.left + b.width / 2 - st[i].x.x, cy = b.top - r0.top + b.height / 2 - st[i].y.x;
          const dx = ptr.x - cx, dy = ptr.y - cy, d = Math.hypot(dx, dy);
          let f = 0;
          if (ptr.in && d < P.r) f = Math.pow(1 - d / P.r, 2) * P.f;
          st[i].x.t = d ? (dx / d) * f : 0; st[i].y.t = d ? (dy / d) * f : 0;
          spring(st[i].x, 220, 14, dt); spring(st[i].y, 220, 14, dt);
          el.style.transform = `translate(${st[i].x.x}px,${st[i].y.x}px)`;
          if (d < nd) { nd = d; near = 'Field ' + 'ABC'[i]; nf = f; }
        });
        read(api, { nearest: ptr.in ? near : '—', distance: ptr.in ? Math.round(nd) + 'px' : '—', force: nf.toFixed(1) + 'px' });
      });
      return { start: L.start, stop() { L.stop(); els.forEach((e) => (e.style.transform = '')); } };
    },
  });

  /* 06 · Scrubbable stack timeline */
  add({
    name: 'Scrubbable stack timeline', desc: 'The whole choreography is a pure function of progress t. Scrub it in the panel, or press Animate to drive t with a spring.',
    controls: [
      { type: 'range', key: 't', label: 'Progress t', min: 0, max: 1, step: 0.001, value: 1 },
      { type: 'button', key: 'go', label: 'Animate' },
    ],
    build(s, P, api) {
      s.innerHTML = `<div class="ml ml-stk">${[0, 1, 2, 3].map((i) => `<div class="ml-c">Layer ${i + 1}<small>stagger 0.18</small></div>`).join('')}</div>`;
      const els = [...s.querySelectorAll('.ml-c')];
      const ease = (x) => 1 - Math.pow(1 - x, 3);
      const render = (t) => {
        els.forEach((el, i) => {
          const q = ease(clamp((t - i * 0.18) / 0.46, 0, 1));
          el.style.opacity = q;
          el.style.transform = `translate(${(i - 1.5) * 16 * q}px,${(1 - q) * 70 - i * 6 * q}px) rotate(${(1 - q) * -10 + (i - 1.5) * 3 * q}deg) scale(${0.88 + 0.12 * q})`;
        });
        read(api, { t: t.toFixed(3), driver: drive ? 'spring' : 'manual' });
      };
      const sp = S(P.t); let drive = false;
      const L = loop((dt) => { if (!drive) return; spring(sp, 60, 12, dt); const t = clamp(sp.x, 0, 1); api.set('t', +t.toFixed(3)); render(t); if (IX.settled(sp, 0.001)) drive = false; });
      render(P.t);
      return {
        start: L.start, stop() { L.stop(); drive = false; api.set('t', 1); render(1); },
        update(k, v) { if (k === 't' && !drive) { sp.x = sp.t = v; render(v); } },
        act() { drive = true; sp.x = P.t; sp.v = 0; sp.t = P.t > 0.5 ? 0 : 1; },
      };
    },
  });

  /* 07 · Underdamped flip reveal */
  add({
    name: 'Underdamped flip reveal', desc: 'Damping is set low on purpose, so each card overshoots 180° and wobbles into place, with a 70ms stagger across the row.',
    controls: [{ type: 'range', key: 'c', label: 'Damping', min: 3, max: 30, value: 9 }, { type: 'button', key: 'all', label: 'Flip all' }],
    build(s, P, api) {
      s.innerHTML = `<div class="ml ml-fl">${['01', '02', '03'].map((n) => `<div class="ml-fc"><div class="fr">${n}</div><div class="bk">✓</div></div>`).join('')}</div>`;
      const els = [...s.querySelectorAll('.ml-fc')], st = els.map(() => S());
      let over = 0;
      els.forEach((el, i) => (el.onclick = () => (st[i].t = st[i].t ? 0 : 180)));
      const L = loop((dt) => {
        st.forEach((q, i) => { spring(q, 170, P.c, dt); els[i].style.transform = `rotateY(${q.x}deg)`; if (q.t) over = Math.max(over, q.x - 180); });
        const o = {}; st.forEach((q, i) => (o['card ' + (i + 1)] = Math.round(q.x) + '°')); o.overshoot = over.toFixed(1) + '°'; read(api, o);
      });
      return {
        start: L.start, stop() { L.stop(); st.forEach((q, i) => { q.x = q.t = q.v = 0; els[i].style.transform = ''; }); over = 0; },
        act() { const to = st[0].t ? 0 : 180; over = 0; st.forEach((q, i) => setTimeout(() => (q.t = to), i * 70)); },
      };
    },
  });

  /* 08 · Deal along an arc */
  add({
    name: 'Deal along an arc', desc: 'Five cards spring from one deck position out to a fan on a circular arc, staggered, then gather back in reverse.',
    controls: [{ type: 'button', key: 'deal', label: 'Deal / gather' }],
    build(s, P, api) {
      s.innerHTML = `<div class="ml ml-arc">${[1, 2, 3, 4, 5].map((n) => `<div class="ml-c">${n}</div>`).join('')}</div>`;
      const els = [...s.querySelectorAll('.ml-c')], st = els.map(() => ({ x: S(), y: S(), r: S() }));
      let dealt = false;
      const deal = () => {
        dealt = !dealt;
        const R = s.clientWidth * 0.9;
        els.forEach((_, i) => {
          const k = dealt ? i : els.length - 1 - i;
          setTimeout(() => {
            const a = ((i - 2) / 2) * 0.42;
            st[i].x.t = dealt ? Math.sin(a) * R : 0;
            st[i].y.t = dealt ? -(Math.cos(a) * R - R) - s.clientHeight * 0.22 : 0;
            st[i].r.t = dealt ? (a * 180) / Math.PI : 0;
          }, k * 70);
        });
      };
      s.querySelector('.ml-arc').onclick = deal;
      const L = loop((dt) => {
        let moving = 0;
        st.forEach((q, i) => { spring(q.x, 180, 17, dt); spring(q.y, 180, 17, dt); spring(q.r, 180, 17, dt); if (!IX.settled(q.x, 0.3)) moving++; els[i].style.transform = `translate(${q.x.x}px,${q.y.x}px) rotate(${q.r.x}deg) translateY(${-i * 1.5}px)`; els[i].style.zIndex = i; });
        read(api, { state: dealt ? 'fanned' : 'stacked', stagger: '70ms', settling: `${moving} / 5` });
      });
      return { start: L.start, stop() { L.stop(); dealt = false; st.forEach((q, i) => { q.x.x = q.x.t = q.y.x = q.y.t = q.r.x = q.r.t = 0; els[i].style.transform = `translateY(${-i * 1.5}px)`; }); }, act: deal };
    },
  });

  /* 09 · Bottom sheet with detents */
  add({
    name: 'Bottom sheet with detents', desc: 'Three resting positions. On release the sheet projects where your flick would land and springs to the nearest detent, just like native sheets.',
    build(s, P, api) {
      s.innerHTML = `<div class="ml"><div class="ml-map"><b>Map view behind</b></div><div class="ml-sheet" tabindex="0"><div class="hd"><i></i></div>${['Coffee · 120 m', 'Bookshop · 240 m', 'Park · 400 m', 'Museum · 650 m', 'Station · 900 m'].map((t) => { const [a, b] = t.split(' · '); return `<div class="it">${a}<span>${b}</span></div>`; }).join('')}</div></div>`;
      const sh = s.querySelector('.ml-sheet'), y = S(0);
      const det = () => { const h = s.clientHeight; return { PEEK: h - 64, HALF: h * 0.5, FULL: 18 }; };
      let drag = null, hist = [], name = 'PEEK', proj = '—';
      const snapTo = (v) => { const d = det(); proj = Math.round(v); let best = 'PEEK', bd = 1e9; for (const k in d) { const q = Math.abs(d[k] - v); if (q < bd) { bd = q; best = k; } } name = best; y.t = d[best]; };
      sh.addEventListener('pointerdown', (e) => { drag = { y0: e.clientY - y.x }; hist = [{ y: e.clientY, t: performance.now() }]; sh.setPointerCapture(e.pointerId); });
      sh.addEventListener('pointermove', (e) => { if (!drag) return; const d = det(); y.x = y.t = clamp(e.clientY - drag.y0, d.FULL - 20, d.PEEK + 20); y.v = 0; hist.push({ y: e.clientY, t: performance.now() }); if (hist.length > 6) hist.shift(); });
      const up = () => { if (!drag) return; drag = null; const a = hist[0], z = hist[hist.length - 1], v = ((z.y - a.y) / Math.max(1, z.t - a.t)) * 1000; y.v = v; snapTo(y.x + v * 0.18); };
      sh.addEventListener('pointerup', up); sh.addEventListener('pointercancel', up);
      sh.addEventListener('keydown', (e) => { const order = ['FULL', 'HALF', 'PEEK'], i = order.indexOf(name); if (e.key === 'ArrowUp' && i > 0) { name = order[i - 1]; y.t = det()[name]; e.preventDefault(); } if (e.key === 'ArrowDown' && i < 2) { name = order[i + 1]; y.t = det()[name]; e.preventDefault(); } });
      const L = loop((dt) => { if (!drag) spring(y, 260, 26, dt); sh.style.transform = `translateY(${y.x}px)`; read(api, { y: Math.round(y.x) + 'px', velocity: Math.round(y.v) + ' px/s', projected: proj, detent: name.toLowerCase() }); });
      const init = () => { y.x = y.t = det().PEEK; y.v = 0; name = 'PEEK'; sh.style.transform = `translateY(${y.x}px)`; };
      requestAnimationFrame(init);
      return { start() { init(); L.start(); }, stop() { L.stop(); init(); } };
    },
  });

  /* 10 · Throw with gravity and bounce */
  add({
    name: 'Throw with gravity and bounce', desc: 'Grab the ball and throw it. Gravity pulls it down and every wall bounce loses energy.',
    controls: [
      { type: 'range', key: 'g', label: 'Gravity', min: 0, max: 3000, step: 50, value: 1800 },
      { type: 'range', key: 'e', label: 'Bounce', min: 0.1, max: 0.95, step: 0.05, value: 0.6 },
    ],
    build(s, P, api) {
      s.innerHTML = `<div class="ml"><div class="ml-ball"></div></div>`;
      const b = s.querySelector('.ml-ball'), R = 27;
      const p = { x: 0, y: 0, vx: 0, vy: 0 };
      let drag = null, hist = [];
      const init = () => { p.x = s.clientWidth / 2; p.y = s.clientHeight / 2; p.vx = p.vy = 0; place(); };
      const place = () => (b.style.transform = `translate(${p.x - R}px,${p.y - R}px)`);
      b.addEventListener('pointerdown', (e) => { const r = s.getBoundingClientRect(); drag = { ox: e.clientX - r.left - p.x, oy: e.clientY - r.top - p.y }; hist = []; b.setPointerCapture(e.pointerId); });
      b.addEventListener('pointermove', (e) => { if (!drag) return; const r = s.getBoundingClientRect(); p.x = e.clientX - r.left - drag.ox; p.y = e.clientY - r.top - drag.oy; hist.push({ x: p.x, y: p.y, t: performance.now() }); if (hist.length > 5) hist.shift(); });
      const up = () => { if (!drag) return; drag = null; if (hist.length > 1) { const a = hist[0], z = hist[hist.length - 1], dt = Math.max(0.008, (z.t - a.t) / 1000); p.vx = (z.x - a.x) / dt; p.vy = (z.y - a.y) / dt; } };
      b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
      const L = loop((dt) => {
        const w = s.clientWidth, h = s.clientHeight;
        if (!drag) {
          p.vy += P.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.y > h - R) { p.y = h - R; p.vy *= -P.e; p.vx *= 0.985; if (Math.abs(p.vy) < 30) p.vy = 0; }
          if (p.y < R) { p.y = R; p.vy *= -P.e; }
          if (p.x < R) { p.x = R; p.vx *= -P.e; } if (p.x > w - R) { p.x = w - R; p.vx *= -P.e; }
        }
        place();
        read(api, { vx: Math.round(p.vx) + ' px/s', vy: Math.round(p.vy) + ' px/s', state: drag ? 'held' : 'free' });
      });
      requestAnimationFrame(init);
      return { start() { init(); L.start(); }, stop() { L.stop(); init(); } };
    },
  });

  /* 11 · Chained spring trail */
  add({
    name: 'Chained spring trail', desc: 'Each dot chases the one in front of it with its own spring, so the chain whips after the cursor.',
    controls: [
      { type: 'range', key: 'n', label: 'Dots', min: 3, max: 20, value: 10 },
      { type: 'range', key: 'k', label: 'Stiffness', min: 50, max: 600, value: 240 },
      { type: 'range', key: 'c', label: 'Damping', min: 8, max: 40, value: 18 },
    ],
    build(s, P, api) {
      s.innerHTML = `<div class="ml"></div>`;
      const box = s.firstChild, ptr = pointer(s);
      let dots = [];
      const init = () => {
        box.innerHTML = '';
        dots = Array.from({ length: P.n }, (_, i) => {
          const el = document.createElement('i'), sz = 22 - (i / P.n) * 14;
          el.className = 'ml-dot'; el.style.width = el.style.height = sz + 'px'; el.style.opacity = 1 - (i / P.n) * 0.7;
          box.appendChild(el);
          const cx = s.clientWidth / 2, cy = s.clientHeight / 2;
          return { el, sz, x: S(cx - i * 10), y: S(cy) };
        });
        draw();
      };
      const draw = () => dots.forEach((d) => (d.el.style.transform = `translate(${d.x.x - d.sz / 2}px,${d.y.x - d.sz / 2}px)`));
      const L = loop((dt, t) => {
        const tx = ptr.in ? ptr.x : s.clientWidth / 2 + Math.cos(t * 1.4) * s.clientWidth * 0.28, ty = ptr.in ? ptr.y : s.clientHeight / 2 + Math.sin(t * 2.1) * s.clientHeight * 0.22;
        dots.forEach((d, i) => { d.x.t = i ? dots[i - 1].x.x : tx; d.y.t = i ? dots[i - 1].y.x : ty; spring(d.x, P.k, P.c, dt); spring(d.y, P.k, P.c, dt); });
        draw();
        read(api, { lead: `${Math.round(dots[0].x.x)}, ${Math.round(dots[0].y.x)}`, tail: `${Math.round(dots[dots.length - 1].x.x)}, ${Math.round(dots[dots.length - 1].y.x)}` });
      });
      requestAnimationFrame(init);
      return { start: L.start, stop() { L.stop(); init(); }, update(k) { if (k === 'n') init(); } };
    },
  });

  /* 12 · Filter and FLIP grid */
  add({
    name: 'Filter and FLIP grid', desc: 'Pick a filter and the remaining items glide to their new places while the others fade out.',
    build(s, P, api) {
      const shapes = { circle: '<circle cx="12" cy="12" r="8"/>', square: '<rect x="4" y="4" width="16" height="16"/>', triangle: '<path d="M12 4l9 16H3z"/>' };
      const items = Array.from({ length: 12 }, (_, i) => Object.keys(shapes)[(i * 7 + 1) % 3]);
      s.innerHTML = `<div class="ml"><div class="ml-chips">${['all', 'circle', 'square', 'triangle'].map((f, i) => `<button class="${i ? '' : 'on'}" data-f="${f}">${f[0].toUpperCase() + f.slice(1)}</button>`).join('')}</div><div class="ml-fg">${items.map((t) => `<div data-t="${t}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">${shapes[t]}</svg></div>`).join('')}</div></div>`;
      const tiles = [...s.querySelectorAll('.ml-fg div')], chips = [...s.querySelectorAll('.ml-chips button')];
      const apply = (f) => {
        chips.forEach((c) => c.classList.toggle('on', c.dataset.f === f));
        const before = tiles.filter((t) => t.style.display !== 'none');
        flip(before, () => tiles.forEach((t) => (t.style.display = f === 'all' || t.dataset.t === f ? '' : 'none')), { scale: false, duration: 450 });
        tiles.filter((t) => t.style.display !== 'none' && !before.includes(t)).forEach((t, i) => t.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 120 + i * 30, easing: 'cubic-bezier(.2,.9,.2,1)', fill: 'backwards' }));
        read(api, { filter: f, visible: tiles.filter((t) => t.style.display !== 'none').length });
      };
      chips.forEach((c) => (c.onclick = () => apply(c.dataset.f)));
      return { stop() { tiles.forEach((t) => (t.style.display = '')); chips.forEach((c, i) => c.classList.toggle('on', !i)); } };
    },
  });

  /* 13 · Cascade from hero */
  add({
    name: 'Cascade from hero', desc: 'Click the hero and its children cascade out from under it, one after another.',
    controls: [{ type: 'button', key: 'go', label: 'Replay' }],
    build(s, P, api) {
      s.innerHTML = `<div class="ml"><div class="ml-cas"><div class="hero">Main colour</div>${['Primary', 'Secondary', 'Surface', 'Outline', 'Accent'].map((n, i) => `<div class="ch" style="top:${34 + i * 13.5}%">${n}</div>`).join('')}</div></div>`;
      const kids = [...s.querySelectorAll('.ch')];
      let open = false;
      const run = (to = !open) => {
        open = to;
        kids.forEach((k, i) => {
          const dy = -(k.offsetTop - 0);
          const idx = open ? i : kids.length - 1 - i;
          k.animate(open ? [{ transform: `translateY(${dy}px) scale(.96)`, opacity: 0 }, { transform: 'none', opacity: 1 }] : [{ transform: 'none', opacity: 1 }, { transform: `translateY(${dy}px) scale(.96)`, opacity: 0 }], { duration: 520, delay: idx * 60, easing: 'cubic-bezier(.2,.9,.2,1)', fill: 'both' });
        });
        read(api, { state: open ? 'cascaded' : 'collapsed', stagger: '60ms' });
      };
      s.querySelector('.hero').onclick = () => run();
      return { start: () => run(true), stop() { kids.forEach((k) => k.getAnimations().forEach((a) => a.cancel())); open = false; }, act: () => { run(false); setTimeout(() => run(true), 650); } };
    },
  });

  /* 14 · Grid expand in place */
  add({
    name: 'Grid expand in place', desc: 'Click a tile and it grows to span two by two while its neighbours reflow around it.',
    build(s, P, api) {
      s.innerHTML = `<div class="ml"><div class="ml-gx">${Array.from({ length: 8 }, (_, i) => `<div>Tile ${i + 1}</div>`).join('')}</div></div>`;
      const tiles = [...s.querySelectorAll('.ml-gx div')];
      tiles.forEach((t) => (t.onclick = () => {
        const was = t.classList.contains('big');
        flip(tiles, () => { tiles.forEach((x) => x.classList.remove('big')); if (!was) t.classList.add('big'); }, { duration: 500 });
        read(api, { expanded: was ? '—' : t.textContent });
      }));
      return { stop() { tiles.forEach((x) => x.classList.remove('big')); } };
    },
  });

  /* 15 · Masonry cascade */
  add({
    name: 'Masonry cascade', desc: 'Tiles of different heights pack into columns and cascade in. Shuffle to watch them re-pack.',
    controls: [{ type: 'button', key: 'shuffle', label: 'Shuffle' }],
    build(s, P, api) {
      const hs = [60, 90, 50, 110, 70, 80, 55, 100, 65];
      s.innerHTML = `<div class="ml"><div class="ml-mas">${hs.map((h, i) => `<div data-h="${h}">${i + 1}</div>`).join('')}</div></div>`;
      const box = s.querySelector('.ml-mas');
      let tiles = [...box.children];
      const layout = () => {
        const W = box.clientWidth, H = box.clientHeight, cols = 3, gap = 6, cw = (W - gap * (cols - 1)) / cols;
        const total = hs.reduce((a, b) => a + b, 0) / cols + gap * 3, k = Math.min(1.4, H / total);
        const col = [0, 0, 0];
        tiles.forEach((t) => { const c = col.indexOf(Math.min(...col)), h = +t.dataset.h * k; t.style.left = c * (cw + gap) + 'px'; t.style.top = col[c] + 'px'; t.style.width = cw + 'px'; t.style.height = h + 'px'; col[c] += h + gap; });
      };
      const cascade = () => tiles.forEach((t, i) => t.animate([{ opacity: 0, transform: 'translateY(24px) scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: i * 55, easing: 'cubic-bezier(.2,.9,.2,1)', fill: 'backwards' }));
      requestAnimationFrame(layout);
      new ResizeObserver(layout).observe(box);
      return {
        start() { layout(); cascade(); read(api, { tiles: tiles.length, columns: 3 }); },
        act() { flip(tiles, () => { tiles = tiles.sort(() => Math.random() - 0.5); tiles.forEach((t) => box.appendChild(t)); layout(); }, { duration: 600 }); },
      };
    },
  });
})();
