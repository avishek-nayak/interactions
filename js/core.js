/* ─────────────────────────────────────────────────────────────
   Interactions · core
   Registry + small helpers every demo shares.

   A demo is registered with:
     IX.add({
       name, desc,
       controls: [ ... ],          // optional, rendered in the right panel
       build(stage, P, api) {      // create DOM + listeners (stage is inert until play)
         return { start(), stop(), update(key, value), act(key) }   // all optional
       }
     })

   Control types:
     { type:'range',  key, label, min, max, step, value, unit }
     { type:'choice', key, label, options:[...], value }
     { type:'toggle', key, label, value }
     { type:'text',   key, label, value }
     { type:'button', key, label }            → calls inst.act(key)
   ───────────────────────────────────────────────────────────── */
(function () {
  const IX = (window.IX = { list: [], _css: [] });

  IX.add = (def) => IX.list.push(def);
  IX.css = (s) => IX._css.push(s);

  /* rAF loop, dt in seconds (clamped) */
  IX.loop = (fn) => {
    let id = 0, last = 0;
    const tick = (ts) => {
      const dt = Math.min(0.05, (ts - last) / 1000 || 0.016);
      last = ts;
      fn(dt, ts / 1000);
      id = requestAnimationFrame(tick);
    };
    return {
      start() { if (!id) { last = performance.now(); id = requestAnimationFrame(tick); } },
      stop() { cancelAnimationFrame(id); id = 0; },
      get running() { return !!id; },
    };
  };

  /* HiDPI canvas that always fills its stage */
  IX.canvas = (stage) => {
    const c = document.createElement('canvas');
    c.className = 'ix-cv';
    stage.appendChild(c);
    const ctx = c.getContext('2d');
    const o = { c, ctx, w: 1, h: 1, onresize: null };
    const fit = () => {
      const r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      o.w = r.width; o.h = r.height;
      c.width = Math.round(o.w * dpr); c.height = Math.round(o.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      o.onresize && o.onresize();
    };
    new ResizeObserver(fit).observe(stage);
    fit();
    return o;
  };

  /* pointer tracking relative to an element */
  IX.pointer = (el) => {
    const p = { x: -1e4, y: -1e4, in: false, down: false, vx: 0, vy: 0 };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const nx = e.clientX - r.left, ny = e.clientY - r.top;
      if (p.in) { p.vx = nx - p.x; p.vy = ny - p.y; }
      p.x = nx; p.y = ny; p.in = true;
    });
    el.addEventListener('pointerenter', () => (p.in = true));
    el.addEventListener('pointerleave', () => { p.in = false; p.down = false; });
    el.addEventListener('pointerdown', () => (p.down = true));
    window.addEventListener('pointerup', () => (p.down = false));
    return p;
  };

  /* critically / under-damped spring, semi-implicit Euler with substeps */
  IX.S = (x = 0) => ({ x, v: 0, t: x });
  IX.spring = (s, k, c, dt) => {
    const n = Math.max(1, Math.ceil(dt / 0.004)), h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = -k * (s.x - s.t) - c * s.v;
      s.v += a * h;
      s.x += s.v * h;
    }
  };
  IX.settled = (s, e = 0.05) => Math.abs(s.x - s.t) < e && Math.abs(s.v) < e * 10;

  /* FLIP: measure, mutate, animate from the old position */
  IX.flip = (els, mutate, opts = {}) => {
    const first = new Map();
    els.forEach((el) => first.set(el, el.getBoundingClientRect()));
    mutate();
    els.forEach((el) => {
      const a = first.get(el), b = el.getBoundingClientRect();
      if (!a || !b.width) return;
      const dx = a.left - b.left, dy = a.top - b.top;
      const sx = a.width / b.width, sy = a.height / b.height;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return;
      el.animate(
        [
          { transformOrigin: 'top left', transform: `translate(${dx}px,${dy}px) scale(${opts.scale === false ? 1 : sx},${opts.scale === false ? 1 : sy})` },
          { transformOrigin: 'top left', transform: 'none' },
        ],
        { duration: opts.duration || 520, easing: opts.easing || 'cubic-bezier(.2,.8,.2,1)', delay: opts.delay ? opts.delay(el) : 0, fill: 'backwards' }
      );
    });
  };

  /* spring keyframes for WAAPI (elastic motion without libraries) */
  IX.springKeys = (from, to, { k = 260, c = 16, frames = 60 } = {}) => {
    const s = { x: from, v: 0, t: to }, out = [];
    for (let i = 0; i <= frames; i++) { out.push(s.x); IX.spring(s, k, c, 1 / 60); }
    out[out.length - 1] = to;
    return out;
  };

  IX.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  IX.lerp = (a, b, t) => a + (b - a) * t;
  IX.rand = (a, b) => a + Math.random() * (b - a);

  IX.INK = '#141414';
  IX.MUTED = '#8a867d';
  IX.ACCENT = '#E8462B';
  IX.PAPER = '#F3F2EE';

  /* tiny inline SVG icon set (font has no arrows / symbols) */
  const P = {
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" stroke="none"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="1.5"/><path d="M15.5 8.5V5.5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
    bookmark: '<path d="M7 4h10v16l-5-3.5L7 20z"/>',
    star: '<path d="M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z"/>',
    card: '<rect x="3.5" y="6" width="17" height="12" rx="1.5"/><path d="M3.5 10h17"/>',
    image: '<rect x="4" y="5" width="16" height="14" rx="1.5"/><circle cx="9" cy="10" r="1.5"/><path d="M4 17l5-4 4 3 3-2 4 3"/>',
    spark: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/>',
    rocket: '<path d="M12 3c3 2 4.5 5.5 4 9l-2.5 3h-3L8 12c-.5-3.5 1-7 4-9z"/><circle cx="12" cy="9" r="1.5"/><path d="M9 15l-2 4 3-1M15 15l2 4-3-1"/>',
    cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    panel: '<rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M9 5v14"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><path d="M4 4l16 16"/>',
    trash: '<path d="M5 7h14M9 7V4.5h6V7M7 7l1 13h8l1-13"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    upload: '<path d="M12 16V5M7.5 9.5L12 5l4.5 4.5M5 19h14"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    undo: '<path d="M8 8H5V5M5.5 8.5A7 7 0 1 1 5 13"/>',
  };
  IX.icon = (name, size = 18) =>
    `<svg class="ix-ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
})();
