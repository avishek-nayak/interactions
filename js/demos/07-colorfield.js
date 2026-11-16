/* Interactive colour field · 1 interaction (with full control panel) */
(function () {
  const { add, loop, canvas, pointer, rand } = IX;

  const hsl = (h, s, l) => `hsl(${Math.round(h)} ${s}% ${l}%)`;
  const newPalette = () => { const base = rand(0, 360); return Array.from({ length: 7 }, (_, i) => ({ h: (base + i * rand(35, 60)) % 360, s: rand(55, 80), l: rand(45, 62) })); };
  const toDB = (c) => { const d = Math.min(Math.abs(c.h - 0), Math.abs(c.h - 360)); return Math.round(30 + (1 - Math.min(d, 220) / 220) * 70); };

  function clip(poly, nx, ny, c) { // keep points where nx*x + ny*y <= c
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const da = nx * a[0] + ny * a[1] - c, db = nx * b[0] + ny * b[1] - c;
      if (da <= 0) out.push(a);
      if ((da <= 0) !== (db <= 0)) { const t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }

  add({
    name: 'Interactive colour field', desc: 'Paint a grid of cells with your cursor. Every colour maps to a loudness on a live decibel meter.',
    controls: [
      { type: 'choice', key: 'shape', label: 'Shape', options: ['Square', 'Circle', 'Voronoi'], value: 'Square' },
      { type: 'choice', key: 'mode', label: 'Mode', options: ['Trail', 'Gradient'], value: 'Trail' },
      { type: 'range', key: 'fade', label: 'Fade', min: 0.2, max: 3, step: 0.1, value: 1.1, unit: 's' },
      { type: 'toggle', key: 'draw', label: 'Draw (hold to paint)', value: false },
      { type: 'toggle', key: 'sound', label: 'Sound', value: false },
      { type: 'button', key: 'regen', label: 'Regenerate' },
      { type: 'button', key: 'clear', label: 'Clear' },
      { type: 'button', key: 'save', label: 'Save PNG' },
    ],
    build(s, P, api) {
      const cv = canvas(s), ptr = pointer(s);
      let cells = [], pal = newPalette(), size = 30, cols = 0, rows = 0, db = 30, peak = 30, audio = null, lastNote = 0, time = 0;

      const build = () => {
        const { w, h } = cv;
        cols = Math.max(4, Math.round(w / size)); rows = Math.max(4, Math.round((h - 26) / size));
        const cw = w / cols, ch = (h - 26) / rows;
        cells = [];
        if (P.shape === 'Voronoi') {
          const seeds = [];
          for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) seeds.push([(i + 0.5 + rand(-0.4, 0.4)) * cw, (j + 0.5 + rand(-0.4, 0.4)) * ch]);
          seeds.forEach((sd, k) => {
            let poly = [[0, 0], [w, 0], [w, h - 26], [0, h - 26]];
            for (let m = 0; m < seeds.length; m++) {
              if (m === k) continue;
              const o = seeds[m], dx = o[0] - sd[0], dy = o[1] - sd[1];
              if (dx * dx + dy * dy > (cw * 3) ** 2) continue;
              poly = clip(poly, dx, dy, (o[0] * o[0] + o[1] * o[1] - sd[0] * sd[0] - sd[1] * sd[1]) / 2);
            }
            cells.push({ x: sd[0], y: sd[1], poly, a: 0, c: null, delay: 0 });
          });
        } else {
          for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) cells.push({ x: (i + 0.5) * cw, y: (j + 0.5) * ch, i, j, cw, ch, a: 0, c: null, delay: 0 });
        }
      };

      const colorAt = (cell) => {
        if (P.mode === 'Gradient') return { h: (cell.x / cv.w) * 300 + (cell.y / cv.h) * 60, s: 70, l: 55 };
        return pal[(Math.random() * pal.length) | 0];
      };
      const note = (c) => {
        if (!P.sound) return;
        const now = performance.now(); if (now - lastNote < 70) return; lastNote = now;
        try {
          audio = audio || new (window.AudioContext || window.webkitAudioContext)();
          const o = audio.createOscillator(), g = audio.createGain();
          o.frequency.value = 180 + (toDB(c) - 30) * 9; o.type = 'sine';
          g.gain.setValueAtTime(0.0001, audio.currentTime); g.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.25);
          o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime + 0.3);
        } catch (e) {}
      };
      const paint = (cell, delay = 0) => { cell.c = colorAt(cell); cell.a = 1; cell.delay = delay; const v = toDB(cell.c); db = Math.max(db, v); peak = Math.max(peak, v); if (!delay) note(cell.c); };
      const cellAt = (x, y) => {
        if (P.shape === 'Voronoi') { let best = null, bd = 1e12; for (const c of cells) { const d = (c.x - x) ** 2 + (c.y - y) ** 2; if (d < bd) { bd = d; best = c; } } return best; }
        const i = Math.floor(x / (cv.w / cols)), j = Math.floor(y / ((cv.h - 26) / rows));
        if (i < 0 || j < 0 || i >= cols || j >= rows) return null;
        return cells[j * cols + i];
      };

      let lastCell = null;
      s.addEventListener('click', () => {
        const c0 = cellAt(ptr.x, ptr.y); if (!c0) return;
        const d0 = Math.min(cv.w, cv.h);
        for (const c of cells) { const d = Math.hypot(c.x - c0.x, c.y - c0.y); if (d < d0 * 0.6) paint(c, d / 260); }
      });

      const draw = (dt) => {
        const { ctx, w, h } = cv;
        time += dt;
        if (ptr.in && (!P.draw || ptr.down)) { const c = cellAt(ptr.x, ptr.y); if (c && c !== lastCell) { paint(c); lastCell = c; } }
        db += (30 - db) * Math.min(1, dt * 1.5);
        ctx.clearRect(0, 0, w, h);
        for (const c of cells) {
          if (c.delay > 0) { c.delay -= dt; continue; }
          if (c.a > 0 && dt) c.a = Math.max(0, c.a - dt / P.fade);
          const path = () => {
            ctx.beginPath();
            if (c.poly) { c.poly.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); }
            else if (P.shape === 'Circle') ctx.arc(c.x, c.y, Math.min(c.cw, c.ch) * 0.42, 0, 6.283);
            else ctx.rect(c.x - c.cw / 2, c.y - c.ch / 2, c.cw, c.ch);
          };
          path();
          if (c.a > 0 && c.c) { ctx.globalAlpha = c.a; ctx.fillStyle = hsl(c.c.h, c.c.s, c.c.l); ctx.fill(); ctx.globalAlpha = 1; }
          ctx.strokeStyle = 'rgba(20,20,20,.12)'; ctx.lineWidth = 1; ctx.stroke();
        }
        // decibel meter
        const q = (db - 30) / 70;
        ctx.fillStyle = 'rgba(20,20,20,.08)'; ctx.fillRect(10, h - 16, w - 90, 6);
        ctx.fillStyle = hsl(220 - q * 220, 70, 50); ctx.fillRect(10, h - 16, (w - 90) * q, 6);
        ctx.font = '12px Fragment, serif'; ctx.fillStyle = IX.INK; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(db) + ' dB', w - 10, h - 13);
        if (dt) api.read({ Decibel: Math.round(db) + ' dB', Peak: Math.round(peak) + ' dB' });
      };

      const L = loop(draw);
      cv.onresize = () => { build(); if (!L.running) draw(0); };
      build(); draw(0);
      return {
        start: L.start,
        stop() { L.stop(); cells.forEach((c) => (c.a = 0)); db = peak = 30; draw(0); },
        update(k) { if (k === 'shape') build(); if (!L.running) draw(0); },
        act(k) {
          if (k === 'regen') { pal = newPalette(); build(); }
          if (k === 'clear') { cells.forEach((c) => (c.a = 0)); peak = 30; }
          if (k === 'save') cv.c.toBlob((b) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'colour-field.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); });
          if (!L.running) draw(0);
        },
      };
    },
  });
})();
