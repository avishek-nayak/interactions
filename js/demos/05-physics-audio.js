/* Physics · 4  |  Audio-reactive · 4 */
(function () {
  const { add, loop, canvas, pointer, rand } = IX;

  function scaffold(s, setup) {
    const cv = canvas(s), ptr = pointer(s);
    const api = setup(cv, ptr);
    const L = loop(api.draw);
    const still = () => { if (!L.running) api.draw(0.016, performance.now() / 1000, true); };
    cv.onresize = () => { api.init && api.init(); still(); };
    api.init && api.init();
    still();
    return {
      start() { api.start && api.start(); L.start(); },
      stop() { L.stop(); api.init && api.init(); still(); },
      update(k, v) { api.update && api.update(k, v); still(); },
      act(k) { api.act && api.act(k); },
    };
  }

  /* ── Pendulum ── */
  add({
    name: 'Pendulum', desc: 'Click to push. The force builds up and friction slowly decays the swing.',
    controls: [{ type: 'range', key: 'friction', label: 'Friction', min: 0, max: 100, value: 20 }],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        let th = 0.5, om = 0;
        s.addEventListener('click', () => { const dir = ptr.x < cv.w / 2 ? 1 : -1; om += dir * 1.6; });
        const draw = (dt) => {
          const { ctx, w, h } = cv, L = h * 0.62, px = w / 2, py = h * 0.12;
          om += (-9.8 / (L / 100)) * Math.sin(th) * dt;
          om *= 1 - (P.friction / 100) * 1.5 * dt;
          th += om * dt;
          const bx = px + Math.sin(th) * L, by = py + Math.cos(th) * L;
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = IX.INK; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(w * 0.3, py); ctx.lineTo(w * 0.7, py); ctx.stroke();
          ctx.setLineDash([2, 4]); ctx.globalAlpha = 0.4;
          ctx.beginPath(); ctx.arc(px, py, L, Math.PI / 2 - 0.9, Math.PI / 2 + 0.9); ctx.stroke();
          ctx.setLineDash([]); ctx.globalAlpha = 1;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke();
          ctx.fillStyle = IX.INK; ctx.beginPath(); ctx.arc(bx, by, 14, 0, 6.283); ctx.fill();
          ctx.beginPath(); ctx.arc(px, py, 3, 0, 6.283); ctx.fill();
        };
        return { draw, init() { th = 0.5; om = 0; } };
      });
    },
  });

  /* ── Rope chain ── */
  add({
    name: 'Rope chain', desc: 'Verlet ropes sway in a gentle breeze. Hover to push them.',
    controls: [
      { type: 'range', key: 'ropes', label: 'Ropes', min: 3, max: 9, value: 5 },
      { type: 'range', key: 'breeze', label: 'Breeze', min: 0, max: 100, value: 30 },
    ],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        let ropes = [];
        const SEG = 14;
        const init = () => {
          ropes = [];
          for (let r = 0; r < P.ropes; r++) {
            const x = (cv.w / (P.ropes + 1)) * (r + 1), len = cv.h * (0.5 + 0.25 * ((r * 7) % 3) / 2), sl = len / SEG;
            ropes.push({ sl, pts: Array.from({ length: SEG + 1 }, (_, i) => ({ x, y: 10 + i * sl, px: x, py: 10 + i * sl })) });
          }
        };
        const draw = (dt, t) => {
          const { ctx, w, h } = cv, wind = Math.sin(t * 0.8) * 0.04 * (P.breeze / 30);
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = IX.INK; ctx.fillStyle = IX.INK; ctx.lineWidth = 1.2;
          for (const R of ropes) {
            const p = R.pts;
            for (let i = 1; i < p.length; i++) {
              const q = p[i], vx = (q.x - q.px) * 0.985, vy = (q.y - q.py) * 0.985;
              q.px = q.x; q.py = q.y;
              q.x += vx + wind * (i / p.length) * 4; q.y += vy + 0.35;
              if (ptr.in) { const dx = q.x - ptr.x, dy = q.y - ptr.y, d = Math.hypot(dx, dy); if (d < 40) { q.x += (dx / d) * (40 - d) * 0.25; q.y += (dy / d) * (40 - d) * 0.25; } }
            }
            for (let k = 0; k < 6; k++) for (let i = 0; i < p.length - 1; i++) {
              const a = p[i], b = p[i + 1], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, diff = (d - R.sl) / d;
              if (i === 0) { b.x -= dx * diff; b.y -= dy * diff; }
              else { a.x += dx * diff * 0.5; a.y += dy * diff * 0.5; b.x -= dx * diff * 0.5; b.y -= dy * diff * 0.5; }
            }
            ctx.beginPath(); p.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y))); ctx.stroke();
            const e = p[p.length - 1]; ctx.beginPath(); ctx.arc(e.x, e.y, 5, 0, 6.283); ctx.fill();
          }
          ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(w, 10); ctx.stroke();
        };
        return { init, draw, update(k) { if (k === 'ropes') init(); } };
      });
    },
  });

  /* ── Gel blob ── */
  add({
    name: 'Gel blob', desc: 'A soft organic shape deforms toward the cursor with spring physics.',
    controls: [{ type: 'range', key: 'soft', label: 'Softness', min: 10, max: 100, value: 55 }],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        const N = 28; let pts = [];
        const init = () => { pts = Array.from({ length: N }, () => ({ r: 1, v: 0 })); };
        const draw = (dt, t) => {
          const { ctx, w, h } = cv, cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.26;
          const k = 260 - P.soft * 2.2;
          pts.forEach((p, i) => {
            const a = (i / N) * Math.PI * 2;
            let target = 1 + Math.sin(a * 3 + t * 1.6) * 0.03;
            if (ptr.in) {
              const ang = Math.atan2(ptr.y - cy, ptr.x - cx), d = Math.hypot(ptr.x - cx, ptr.y - cy);
              let da = Math.abs(((a - ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
              const pull = Math.max(0, 1 - da / 1.1) * IX.clamp((d - R * 0.4) / R, -0.4, 0.6);
              target += pull;
            }
            const s2 = { x: p.r, v: p.v, t: target };
            IX.spring(s2, k, 9, dt); p.r = s2.x; p.v = s2.v;
          });
          const xy = pts.map((p, i) => { const a = (i / N) * Math.PI * 2; return [cx + Math.cos(a) * R * p.r, cy + Math.sin(a) * R * p.r]; });
          ctx.clearRect(0, 0, w, h);
          ctx.beginPath();
          for (let i = 0; i < N; i++) {
            const a = xy[i], b = xy[(i + 1) % N], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
            if (!i) { const z = xy[N - 1]; ctx.moveTo((z[0] + a[0]) / 2, (z[1] + a[1]) / 2); }
            ctx.quadraticCurveTo(a[0], a[1], m[0], m[1]);
          }
          ctx.closePath(); ctx.fillStyle = IX.INK; ctx.fill();
        };
        return { init, draw };
      });
    },
  });

  /* ── Friction drag ── */
  add({
    name: 'Friction drag', desc: 'Drag the block. It slides on with momentum and slows down realistically.',
    controls: [{ type: 'range', key: 'fr', label: 'Friction', min: 1, max: 20, value: 6 }],
    build(s, P) {
      return scaffold(s, (cv, ptr) => {
        const b = { x: 0, y: 0, vx: 0, vy: 0, s: 56 };
        let drag = null, hist = [];
        s.addEventListener('pointerdown', (e) => {
          if (Math.abs(ptr.x - b.x) < b.s / 2 && Math.abs(ptr.y - b.y) < b.s / 2) { drag = { ox: ptr.x - b.x, oy: ptr.y - b.y }; hist = []; s.setPointerCapture(e.pointerId); }
        });
        s.addEventListener('pointerup', () => {
          if (!drag) return;
          drag = null;
          if (hist.length > 1) { const a = hist[0], z = hist[hist.length - 1], dt = (z.t - a.t) / 1000 || 0.016; b.vx = (z.x - a.x) / dt; b.vy = (z.y - a.y) / dt; }
        });
        const draw = (dt) => {
          const { ctx, w, h } = cv, half = b.s / 2;
          if (drag) {
            b.x = ptr.x - drag.ox; b.y = ptr.y - drag.oy; b.vx = b.vy = 0;
            hist.push({ x: b.x, y: b.y, t: performance.now() }); if (hist.length > 5) hist.shift();
          } else {
            const f = Math.exp(-P.fr * 0.35 * dt);
            b.vx *= f; b.vy *= f; b.x += b.vx * dt; b.y += b.vy * dt;
            if (b.x < half) { b.x = half; b.vx *= -0.5; } if (b.x > w - half) { b.x = w - half; b.vx *= -0.5; }
            if (b.y < half) { b.y = half; b.vy *= -0.5; } if (b.y > h - half) { b.y = h - half; b.vy *= -0.5; }
          }
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = IX.INK; ctx.fillRect(b.x - half, b.y - half, b.s, b.s);
          ctx.font = '12px Fragment, serif'; ctx.fillStyle = IX.MUTED; ctx.textAlign = 'center';
          ctx.fillText(Math.round(Math.hypot(b.vx, b.vy)) + ' px/s', w / 2, h - 14);
        };
        return { draw, init() { b.x = cv.w / 2; b.y = cv.h / 2; b.vx = b.vy = 0; } };
      });
    },
  });

  /* ── Frequency bars ── */
  add({
    name: 'Frequency bars', desc: 'A simulated equaliser with independent animated bars.',
    controls: [{ type: 'range', key: 'bars', label: 'Bars', min: 8, max: 48, value: 24 }],
    build(s, P) {
      return scaffold(s, (cv) => {
        let v = [];
        const init = () => { v = Array.from({ length: P.bars }, (_, i) => ({ h: 0.2 + 0.5 * Math.abs(Math.sin(i * 0.7)), t: 0.5 })); };
        const draw = (dt, t) => {
          const { ctx, w, h } = cv, n = v.length, gap = 3, bw = (w * 0.8 - gap * (n - 1)) / n, x0 = w * 0.1;
          ctx.clearRect(0, 0, w, h); ctx.fillStyle = IX.INK;
          v.forEach((b, i) => {
            if (dt) { if (Math.random() < 0.12) b.t = Math.random() * (0.35 + 0.65 * Math.exp(-i / n * 1.5)); b.h += (b.t - b.h) * 0.25; }
            const bh = Math.max(2, b.h * h * 0.7);
            ctx.fillRect(x0 + i * (bw + gap), h * 0.85 - bh, bw, bh);
          });
          ctx.fillRect(w * 0.1, h * 0.85 + 4, w * 0.8, 1);
        };
        return { init, draw: (dt, t, still) => draw(still ? 0 : dt, t), update(k) { if (k === 'bars') init(); } };
      });
    },
  });

  /* ── Live waveform ── */
  add({
    name: 'Live waveform', desc: 'A continuous signal. Move the cursor to change amplitude and frequency.',
    build(s) {
      return scaffold(s, (cv, ptr) => {
        let amp = 0.3, fq = 3, ph = 0;
        const draw = (dt, t) => {
          const { ctx, w, h } = cv;
          const ta = ptr.in ? IX.clamp(1 - ptr.y / h, 0.05, 1) : 0.3, tf = ptr.in ? 1 + (ptr.x / w) * 9 : 3;
          amp += (ta - amp) * 0.08; fq += (tf - fq) * 0.08; ph += dt * 4;
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = IX.INK;
          [[1, 1.4], [0.5, 1], [0.25, 0.8]].forEach(([a, lw], k) => {
            ctx.globalAlpha = a; ctx.lineWidth = lw; ctx.beginPath();
            for (let x = 0; x <= w; x += 2) {
              const q = x / w, env = Math.sin(q * Math.PI);
              const y = h / 2 + Math.sin(q * fq * Math.PI * 2 + ph + k) * amp * h * 0.35 * env * (1 - k * 0.25);
              x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
            }
            ctx.stroke();
          });
          ctx.globalAlpha = 1;
        };
        return { draw };
      });
    },
  });

  /* ── BPM ring pulse ── */
  add({
    name: 'BPM ring pulse', desc: 'Rings expand on every beat. Set the tempo in the panel.',
    controls: [{ type: 'range', key: 'bpm', label: 'BPM', min: 40, max: 240, value: 120 }],
    build(s, P) {
      return scaffold(s, (cv) => {
        let acc = 0, rings = [], beat = 0;
        const draw = (dt, t, still) => {
          const { ctx, w, h } = cv, cx = w / 2, cy = h / 2, maxR = Math.min(w, h) * 0.45;
          if (still) rings = [0.3, 0.6, 0.9].map((q) => ({ r: q }));
          else { acc += dt; if (acc >= 60 / P.bpm) { acc = 0; rings.push({ r: 0 }); beat = 1; } beat *= 0.88; }
          ctx.clearRect(0, 0, w, h); ctx.strokeStyle = IX.INK;
          rings = rings.filter((r) => r.r < 1);
          for (const r of rings) { if (!still) r.r += dt * 0.7; ctx.globalAlpha = 1 - r.r; ctx.beginPath(); ctx.arc(cx, cy, 18 + r.r * maxR, 0, 6.283); ctx.stroke(); }
          ctx.globalAlpha = 1; ctx.fillStyle = IX.INK;
          ctx.beginPath(); ctx.arc(cx, cy, 16 + beat * 6, 0, 6.283); ctx.fill();
          ctx.font = '13px Fragment, serif'; ctx.fillStyle = IX.MUTED; ctx.textAlign = 'center'; ctx.fillText(P.bpm + ' BPM', cx, h - 14);
        };
        return { draw };
      });
    },
  });

  /* ── Volume ring ── */
  add({
    name: 'Volume ring', desc: 'A single ring scales with the volume. Drag the slider in the panel.',
    controls: [{ type: 'range', key: 'vol', label: 'Volume', min: 0, max: 100, value: 60 }],
    build(s, P) {
      return scaffold(s, (cv) => {
        let cur = P.vol;
        const draw = (dt, t, still) => {
          const { ctx, w, h } = cv, cx = w / 2, cy = h / 2, maxR = Math.min(w, h) * 0.38;
          cur += (P.vol - cur) * (still ? 1 : 0.12);
          const jitter = still ? 0 : Math.sin(t * 22) * (cur / 100) * 2.5;
          const R = 14 + (cur / 100) * maxR + jitter;
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = IX.INK; ctx.globalAlpha = 0.15; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(cx, cy, maxR + 14, 0, 6.283); ctx.stroke();
          ctx.globalAlpha = 1; ctx.lineWidth = 2 + (cur / 100) * 4;
          ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
          ctx.font = '22px Fragment, serif'; ctx.fillStyle = IX.INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(Math.round(cur), cx, cy);
        };
        return { draw };
      });
    },
  });
})();
