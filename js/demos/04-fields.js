/* Fields & cursors · 10 canvas interactions */
(function () {
  const { add, loop, canvas, pointer, rand } = IX;

  /* shared scaffold: canvas + pointer + loop, draws one still frame before play */
  function scaffold(s, setup) {
    const cv = canvas(s), ptr = pointer(s);
    const api = setup(cv, ptr);
    const L = loop(api.draw);
    const still = () => { if (!L.running) api.draw(0.016, performance.now() / 1000, true); };
    cv.onresize = () => { api.init && api.init(); still(); };
    api.init && api.init();
    still();
    return {
      start: L.start,
      stop() { L.stop(); api.reset && api.reset(); still(); },
      update(k, v) { api.update && api.update(k, v); still(); },
      act(k) { api.act && api.act(k); },
    };
  }

  /* ── Particle field ── */
  add({
    name: 'Particle field', desc: 'Particles react to your cursor in five force modes.',
    controls: [
      { type: 'choice', key: 'mode', label: 'Mode', options: ['Attract', 'Repel', 'Vortex', 'Wave', 'Magnetic'], value: 'Repel' },
      { type: 'range', key: 'count', label: 'Count', min: 20, max: 400, value: 150 },
      { type: 'range', key: 'force', label: 'Force', min: 0, max: 100, value: 70 },
    ],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        let ps = [];
        const init = () => {
          ps = Array.from({ length: P.count }, () => {
            const x = rand(0, cv.w), y = rand(0, cv.h);
            return { x, y, ox: x, oy: y, vx: 0, vy: 0, r: rand(0.8, 2.2) };
          });
        };
        const draw = (dt, t) => {
          const { ctx, w, h } = cv, f = P.force / 100, R = Math.min(w, h) * 0.38;
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = IX.INK;
          for (const p of ps) {
            let ax = (p.ox - p.x) * 0.02, ay = (p.oy - p.y) * 0.02;
            if (P.mode === 'Wave') ay += Math.sin(p.ox * 0.025 + t * 3) * 0.35 * f;
            if (ptr.in) {
              const dx = ptr.x - p.x, dy = ptr.y - p.y, d = Math.hypot(dx, dy) + 0.01;
              if (d < R) {
                const k = (1 - d / R) * f * 2.2;
                if (P.mode === 'Attract') { ax += (dx / d) * k; ay += (dy / d) * k; }
                else if (P.mode === 'Repel' || P.mode === 'Wave') { ax -= (dx / d) * k * 1.4; ay -= (dy / d) * k * 1.4; }
                else if (P.mode === 'Vortex') { ax += (-dy / d) * k * 1.6 + (dx / d) * k * 0.3; ay += (dx / d) * k * 1.6 + (dy / d) * k * 0.3; }
                else if (P.mode === 'Magnetic') { const q = (k * 30) / (d * 0.2 + 6); ax += (dx / d) * q - (dy / d) * q * 0.6; ay += (dy / d) * q + (dx / d) * q * 0.6; }
              }
            }
            p.vx = (p.vx + ax) * 0.9; p.vy = (p.vy + ay) * 0.9;
            p.x += p.vx; p.y += p.vy;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
          }
        };
        return { init, draw, update(k) { if (k === 'count') init(); }, reset: init };
      });
    },
  });

  /* ── Magnetic field lines ── */
  add({
    name: 'Magnetic field lines', desc: 'A grid of needles aligns to a field shaped by your cursor.',
    controls: [
      { type: 'choice', key: 'mode', label: 'Mode', options: ['Dipole', 'Flow', 'Curl', 'Radial', 'Wave'], value: 'Dipole' },
      { type: 'range', key: 'density', label: 'Density', min: 6, max: 24, value: 12 },
      { type: 'range', key: 'strength', label: 'Strength', min: 10, max: 100, value: 70 },
    ],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        const m = { x: 0, y: 0 };
        const draw = (dt, t) => {
          const { ctx, w, h } = cv;
          const tx = ptr.in ? ptr.x : w / 2 + Math.cos(t * 0.7) * w * 0.2;
          const ty = ptr.in ? ptr.y : h / 2 + Math.sin(t * 0.9) * h * 0.15;
          m.x += (tx - m.x) * 0.15; m.y += (ty - m.y) * 0.15;
          ctx.clearRect(0, 0, w, h);
          const cols = P.density, gx = w / cols, rows = Math.max(3, Math.round(h / gx)), gy = h / rows;
          const st = P.strength / 100, len = gx * 0.36;
          ctx.strokeStyle = IX.INK; ctx.lineCap = 'round';
          for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
            const x = gx * (i + 0.5), y = gy * (j + 0.5);
            const dx = m.x - x, dy = m.y - y, d = Math.hypot(dx, dy) + 1;
            let a;
            if (P.mode === 'Dipole') {
              const off = 40, n1 = Math.atan2(y - m.y, x - (m.x - off)), n2 = Math.atan2(m.y - y, m.x + off - x);
              a = Math.atan2(Math.sin(n1) + Math.sin(n2), Math.cos(n1) + Math.cos(n2));
            } else if (P.mode === 'Flow') a = Math.sin(x * 0.012 + t) + Math.cos(y * 0.014 - t * 0.8) + Math.atan2(dy, dx) * st * (60 / d);
            else if (P.mode === 'Curl') a = Math.atan2(dy, dx) + Math.PI / 2;
            else if (P.mode === 'Radial') a = Math.atan2(dy, dx);
            else a = Math.sin(x * 0.03 + t * 2.4) * 1.2 + Math.atan2(dy, dx) * st * (50 / d);
            const mag = Math.min(1, (st * 220) / d);
            ctx.globalAlpha = 0.25 + 0.75 * mag;
            ctx.lineWidth = 1 + mag * 1.2;
            const l = len * (0.6 + 0.4 * mag);
            ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * l, y - Math.sin(a) * l); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
            ctx.beginPath(); ctx.arc(x + Math.cos(a) * l, y + Math.sin(a) * l, 1.4, 0, 6.283); ctx.fillStyle = IX.INK; ctx.fill();
          }
          ctx.globalAlpha = 1;
        };
        return { draw, init() { m.x = cv.w / 2; m.y = cv.h / 2; } };
      });
    },
  });

  /* ── Ribbon trail ── */
  add({
    name: 'Ribbon trail', desc: 'A tapered ribbon follows the cursor and fades behind it.',
    controls: [
      { type: 'range', key: 'len', label: 'Trail length', min: 6, max: 60, value: 28 },
      { type: 'range', key: 'wid', label: 'Width', min: 2, max: 20, value: 6 },
    ],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        let pts = [];
        const draw = (dt, t, still) => {
          const { ctx, w, h } = cv;
          if (still) { pts = []; for (let i = 0; i < P.len; i++) { const q = i / P.len; pts.push({ x: w * (0.2 + q * 0.6), y: h / 2 + Math.sin(q * 6) * h * 0.15 }); } }
          else if (ptr.in) pts.push({ x: ptr.x, y: ptr.y });
          else if (pts.length) pts.push(pts[pts.length - 1]);
          while (pts.length > P.len) pts.shift();
          ctx.clearRect(0, 0, w, h);
          ctx.lineCap = 'round'; ctx.strokeStyle = IX.INK;
          for (let i = 1; i < pts.length; i++) {
            const q = i / pts.length;
            ctx.globalAlpha = q; ctx.lineWidth = P.wid * q;
            ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
          }
          ctx.globalAlpha = 1;
        };
        return { draw, reset() { pts = []; } };
      });
    },
  });

  /* ── Sparks ── */
  add({
    name: 'Sparks', desc: 'Moving the cursor throws off sparks that fall with gravity.',
    controls: [
      { type: 'range', key: 'size', label: 'Spark size', min: 1, max: 6, value: 2 },
      { type: 'range', key: 'count', label: 'Count', min: 2, max: 20, value: 8 },
    ],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        let sp = [];
        const emit = (x, y, n) => { for (let i = 0; i < n; i++) sp.push({ x, y, vx: rand(-2.5, 2.5), vy: rand(-3.5, 0.5), life: 1 }); };
        const draw = (dt, t, still) => {
          const { ctx, w, h } = cv;
          if (still) { sp = []; for (let i = 0; i < 40; i++) sp.push({ x: w / 2 + rand(-40, 40), y: h / 2 + rand(-30, 40), vx: 0, vy: 0, life: rand(0.2, 1) }); }
          else if (ptr.in && Math.hypot(ptr.vx, ptr.vy) > 0.5) { emit(ptr.x, ptr.y, Math.ceil(P.count / 3)); ptr.vx *= 0.5; ptr.vy *= 0.5; }
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = IX.INK;
          sp = sp.filter((p) => p.life > 0);
          for (const p of sp) {
            if (!still) { p.vy += 0.14; p.x += p.vx; p.y += p.vy; p.life -= 0.018; }
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillRect(p.x, p.y, P.size, P.size);
          }
          ctx.globalAlpha = 1;
        };
        return { draw, reset() { sp = []; } };
      });
    },
  });

  /* ── Eyes ── */
  add({
    name: 'Following eyes', desc: 'A grid of eyes tracks the cursor and blinks now and then.',
    controls: [
      { type: 'range', key: 'cols', label: 'Columns', min: 2, max: 10, value: 6 },
      { type: 'range', key: 'rows', label: 'Rows', min: 1, max: 6, value: 3 },
    ],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        const blink = new Map();
        const draw = (dt, t, still) => {
          const { ctx, w, h } = cv;
          ctx.clearRect(0, 0, w, h);
          const gx = w / P.cols, gy = h / P.rows, r = Math.min(gx, gy) * 0.32;
          const tx = ptr.in ? ptr.x : w / 2, ty = ptr.in ? ptr.y : h * 0.9;
          for (let i = 0; i < P.cols; i++) for (let j = 0; j < P.rows; j++) {
            const x = gx * (i + 0.5), y = gy * (j + 0.5), id = i + ',' + j;
            if (!still && Math.random() < 0.0015) blink.set(id, 1);
            let b = blink.get(id) || 0;
            if (b > 0) { b -= dt * 6; blink.set(id, b); }
            const open = b > 0 ? Math.abs(1 - b * 2) : 1;
            ctx.save(); ctx.translate(x, y); ctx.scale(1, Math.max(0.08, open));
            ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fillStyle = '#FBFAF7'; ctx.fill();
            ctx.lineWidth = 1; ctx.strokeStyle = IX.INK; ctx.stroke();
            const a = Math.atan2(ty - y, tx - x), d = Math.min(r * 0.45, Math.hypot(tx - x, ty - y) * 0.1);
            ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, r * 0.42, 0, 6.283); ctx.fillStyle = IX.INK; ctx.fill();
            ctx.restore();
          }
        };
        return { draw };
      });
    },
  });

  /* ── Text trail ── */
  add({
    name: 'Text trail', desc: 'Your own words flow along the path of the cursor.',
    controls: [
      { type: 'text', key: 'text', label: 'Custom text', value: 'interactions' },
      { type: 'range', key: 'size', label: 'Size', min: 8, max: 32, value: 14 },
    ],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        let path = [];
        const draw = (dt, t, still) => {
          const { ctx, w, h } = cv;
          if (still) { path = []; for (let i = 0; i < 120; i++) { const q = i / 120; path.push({ x: w * (0.12 + q * 0.76), y: h / 2 + Math.sin(q * 7) * h * 0.18 }); } }
          else if (ptr.in) { const l = path[path.length - 1]; if (!l || Math.hypot(ptr.x - l.x, ptr.y - l.y) > 2) path.push({ x: ptr.x, y: ptr.y }); }
          if (path.length > 300) path.splice(0, path.length - 300);
          ctx.clearRect(0, 0, w, h);
          const text = (P.text || ' ') + '  ';
          ctx.font = `${P.size}px Fragment, serif`; ctx.fillStyle = IX.INK; ctx.textBaseline = 'middle';
          let ci = 0, acc = 0;
          for (let i = path.length - 1; i > 0; i--) {
            const a = path[i], b = path[i - 1], seg = Math.hypot(a.x - b.x, a.y - b.y);
            acc += seg;
            const ch = text[ci % text.length], cw = ctx.measureText(ch).width + 1;
            if (acc >= cw) {
              acc = 0;
              ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(Math.atan2(a.y - b.y, a.x - b.x) + Math.PI);
              ctx.globalAlpha = Math.max(0.1, i / path.length);
              ctx.fillText(ch, 0, 0); ctx.restore();
              ci++;
            }
          }
          ctx.globalAlpha = 1;
        };
        return { draw, reset() { path = []; } };
      });
    },
  });

  /* ── Shape morph ── */
  const SHAPES = {
    Circle: () => 1,
    Diamond: (a) => 1 / (Math.abs(Math.cos(a)) + Math.abs(Math.sin(a))),
    Star: (a) => { const k = ((a % (Math.PI * 0.4)) + Math.PI * 0.4) % (Math.PI * 0.4); return 0.5 + 0.5 * Math.abs(1 - k / (Math.PI * 0.2)); },
    Cross: (a) => { const c = Math.abs(Math.cos(a)), sn = Math.abs(Math.sin(a)); return Math.min(1, 0.32 / Math.min(c, sn) ) ; },
  };
  add({
    name: 'Shape morph', desc: 'The cursor follower morphs its shape with your speed.',
    controls: [
      { type: 'choice', key: 'shape', label: 'Shape', options: ['Auto', 'Circle', 'Diamond', 'Star', 'Cross'], value: 'Auto' },
      { type: 'range', key: 'speed', label: 'Speed', min: 0.25, max: 3, step: 0.25, value: 1, unit: '×' },
    ],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        const N = 80, rad = new Array(N).fill(1), pos = { x: 0, y: 0 };
        let sp = 0, label = 'Circle';
        const draw = (dt, t, still) => {
          const { ctx, w, h } = cv;
          const tx = ptr.in ? ptr.x : w / 2, ty = ptr.in ? ptr.y : h / 2;
          const e = Math.min(1, 0.12 * P.speed);
          const vx = (tx - pos.x) * e, vy = (ty - pos.y) * e;
          pos.x += vx; pos.y += vy;
          sp += (Math.hypot(vx, vy) - sp) * 0.15;
          label = P.shape !== 'Auto' ? P.shape : sp < 1.5 ? 'Circle' : sp < 5 ? 'Diamond' : sp < 12 ? 'Star' : 'Cross';
          const fn = SHAPES[label];
          ctx.clearRect(0, 0, w, h);
          ctx.beginPath();
          for (let i = 0; i < N; i++) {
            const a = (i / N) * Math.PI * 2 - Math.PI / 2;
            rad[i] += (fn(a + Math.PI / 2) - rad[i]) * (still ? 1 : 0.18);
            const R = 34 * rad[i];
            const x = pos.x + Math.cos(a) * R, y = pos.y + Math.sin(a) * R;
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.closePath(); ctx.fillStyle = IX.INK; ctx.fill();
          ctx.font = '13px Fragment, serif'; ctx.fillStyle = IX.MUTED; ctx.textAlign = 'center';
          ctx.fillText(label, w / 2, h - 16);
        };
        return { draw, init() { pos.x = cv.w / 2; pos.y = cv.h / 2; } };
      });
    },
  });

  /* ── Arc discharge ── */
  add({
    name: 'Arc discharge', desc: 'Lightning arcs leap from the edges to your cursor.',
    controls: [
      { type: 'choice', key: 'origin', label: 'Origin', options: ['Top', 'Corners', 'All edges'], value: 'Corners' },
      { type: 'choice', key: 'color', label: 'Colour', options: ['Ink', 'Accent'], value: 'Ink' },
    ],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        const bolt = (ctx, x1, y1, x2, y2, disp) => {
          if (disp < 3) { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); return; }
          const mx = (x1 + x2) / 2 + rand(-0.5, 0.5) * disp, my = (y1 + y2) / 2 + rand(-0.5, 0.5) * disp;
          bolt(ctx, x1, y1, mx, my, disp / 2); bolt(ctx, mx, my, x2, y2, disp / 2);
        };
        const origins = (w, h) => P.origin === 'Top' ? [[w / 2, 0]] : P.origin === 'Corners' ? [[0, 0], [w, 0], [0, h], [w, h]] : [[w / 2, 0], [w, h / 2], [w / 2, h], [0, h / 2], [0, 0], [w, h]];
        let fl = 0;
        const draw = (dt, t, still) => {
          const { ctx, w, h } = cv;
          ctx.clearRect(0, 0, w, h);
          const tx = ptr.in ? ptr.x : w / 2, ty = ptr.in ? ptr.y : h / 2;
          if (!still && !ptr.in) return;
          fl += dt;
          if (!still && fl < 0.05) return;
          fl = 0;
          ctx.strokeStyle = P.color === 'Accent' ? IX.ACCENT : IX.INK; ctx.lineWidth = 1.2;
          for (const [x, y] of origins(w, h)) {
            ctx.globalAlpha = 0.9; ctx.beginPath(); bolt(ctx, x, y, tx, ty, Math.hypot(tx - x, ty - y) * 0.35); ctx.stroke();
          }
          ctx.globalAlpha = 1; ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath(); ctx.arc(tx, ty, 4, 0, 6.283); ctx.fill();
        };
        // keep last frame when idle inside the loop
        return { draw };
      });
    },
  });

  /* ── Concentric echo ── */
  add({
    name: 'Concentric echo', desc: 'Rings ripple out from the cursor like sonar.',
    controls: [
      { type: 'range', key: 'reach', label: 'Echo reach', min: 20, max: 200, value: 80, unit: 'px' },
      { type: 'range', key: 'speed', label: 'Speed', min: 0.5, max: 4, step: 0.1, value: 1.8 },
    ],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        let rings = [], acc = 0, last = null;
        const draw = (dt, t, still) => {
          const { ctx, w, h } = cv;
          if (still) { rings = [0.2, 0.45, 0.7, 0.95].map((q) => ({ x: w / 2, y: h / 2, r: q * P.reach })); }
          else if (ptr.in) {
            acc += dt;
            const moved = !last || Math.hypot(ptr.x - last.x, ptr.y - last.y) > 6;
            if (acc > 0.12 || moved) { if (moved || acc > 0.5) { rings.push({ x: ptr.x, y: ptr.y, r: 0 }); last = { x: ptr.x, y: ptr.y }; } acc = 0; }
          }
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = IX.INK;
          rings = rings.filter((r) => r.r < P.reach);
          for (const r of rings) {
            if (!still) r.r += P.speed * 60 * dt;
            ctx.globalAlpha = 1 - r.r / P.reach; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 6.283); ctx.stroke();
          }
          ctx.globalAlpha = 1;
        };
        return { draw, reset() { rings = []; } };
      });
    },
  });

  /* ── Constellation ── */
  add({
    name: 'Constellation', desc: 'Stars near your cursor link up into constellations. Click to add a star.',
    controls: [
      { type: 'range', key: 'stars', label: 'Stars', min: 20, max: 160, value: 70 },
      { type: 'range', key: 'link', label: 'Link distance', min: 40, max: 180, value: 110, unit: 'px' },
      { type: 'button', key: 'clear', label: 'Reset sky' },
    ],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        let st = [];
        const init = () => { st = Array.from({ length: P.stars }, () => ({ x: rand(0, cv.w), y: rand(0, cv.h), vx: rand(-0.15, 0.15), vy: rand(-0.15, 0.15), r: rand(0.6, 1.8) })); };
        s.addEventListener('click', () => st.push({ x: ptr.x, y: ptr.y, vx: 0, vy: 0, r: 2.4, born: 1 }));
        const draw = (dt, t, still) => {
          const { ctx, w, h } = cv;
          const mx = ptr.in ? ptr.x : still ? w / 2 : -1e4, my = ptr.in ? ptr.y : still ? h / 2 : -1e4;
          ctx.clearRect(0, 0, w, h);
          for (const p of st) {
            if (!still) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; }
          }
          const L = P.link, near = st.filter((p) => Math.hypot(p.x - mx, p.y - my) < L * 1.4);
          ctx.strokeStyle = IX.INK;
          for (let i = 0; i < near.length; i++) {
            const a = near[i];
            ctx.globalAlpha = 0.5 * (1 - Math.hypot(a.x - mx, a.y - my) / (L * 1.4));
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke();
            for (let j = i + 1; j < near.length; j++) {
              const b = near[j], d = Math.hypot(a.x - b.x, a.y - b.y);
              if (d < L * 0.7) { ctx.globalAlpha = 0.6 * (1 - d / (L * 0.7)); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
            }
          }
          ctx.globalAlpha = 1; ctx.fillStyle = IX.INK;
          for (const p of st) {
            const lit = Math.hypot(p.x - mx, p.y - my) < L * 1.4;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (lit ? 1.6 : 1), 0, 6.283); ctx.fill();
          }
        };
        return { init, draw, update(k) { if (k === 'stars') init(); }, act: init };
      });
    },
  });
})();
