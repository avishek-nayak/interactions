/* Scroll · 4  |  Time · 4  |  AI feel · 4 */
(function () {
  const { add, css, loop, canvas, pointer } = IX;

  css(`
  .sc-wrap{position:absolute;inset:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
  .sc-tall{height:320%;position:relative}
  .sc-view{position:sticky;top:0;height:calc(100% / 3.2);overflow:hidden;display:grid;place-items:center}
  .sc-hint{position:absolute;left:0;right:0;bottom:10px;text-align:center;font-size:12px;color:var(--muted);transition:opacity .3s}
  .sc-l{position:absolute;inset:0;will-change:transform}
  .sc-l i{position:absolute;display:block;border:1px solid var(--ink)}
  .sc-pill{position:absolute;top:14px;left:50%;transform:translateX(-50%);height:40px;background:var(--ink);color:var(--paper);border-radius:20px;display:flex;align-items:center;justify-content:center;gap:10px;overflow:hidden;white-space:nowrap;font-size:14px}
  .sc-rows{position:absolute;left:14%;right:14%;top:72px;display:flex;flex-direction:column;gap:10px}
  .sc-rows i{display:block;height:10px;background:var(--paper2)}
  .sc-num{font-size:46px;letter-spacing:-.01em}
  .sc-sub{font-size:13px;color:var(--muted);text-align:center;margin-top:4px}
  .sc-words{font-size:26px;line-height:1.25;padding:0 24px;text-align:center}
  .sc-words span{transition:opacity .25s,filter .25s;opacity:.12}
  .tm-flip{display:flex;align-items:center;gap:6px;font-size:40px}
  .tm-d{position:relative;width:38px;height:56px;background:var(--ink);color:var(--paper);display:grid;place-items:center;perspective:200px}
  .tm-d::after{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:var(--paper);opacity:.25}
  .tm-d span{display:block;transform-origin:50% 50%}
  .tm-d.go span{animation:tmFlip .45s cubic-bezier(.4,0,.2,1)}
  @keyframes tmFlip{0%{transform:rotateX(0)}49%{transform:rotateX(90deg)}51%{transform:rotateX(-90deg)}100%{transform:rotateX(0)}}
  .tm-col{font-size:30px;color:var(--muted)}
  .tm-an line{transition:stroke .2s}
  .tm-an line:hover{stroke:var(--accent)}
  .tm-cd{display:flex;gap:10px;align-items:flex-start}
  .tm-u{text-align:center}
  .tm-u .w{height:44px;overflow:hidden;font-size:36px;line-height:44px;width:56px;border:1px solid var(--line);background:var(--card)}
  .tm-u .w div{transition:transform .5s cubic-bezier(.2,.8,.2,1)}
  .tm-u small{display:block;font-size:11px;color:var(--muted);margin-top:6px;letter-spacing:.08em}
  .tm-sch{position:relative;width:86%;height:120px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
  .tm-blk{position:absolute;height:28px;border:1px solid var(--ink);background:var(--card);font-size:12px;padding:5px 8px;white-space:nowrap;overflow:hidden}
  .tm-now{position:absolute;top:-6px;bottom:-6px;width:1px;background:var(--accent)}
  .tm-now::before{content:"";position:absolute;top:-4px;left:-4px;width:9px;height:9px;border-radius:50%;background:var(--accent)}
  .tm-hr{position:absolute;bottom:-20px;font-size:11px;color:var(--muted);transform:translateX(-50%)}
  .ai-tok{width:84%;font-size:16px;line-height:1.5;min-height:60%}
  .ai-tok span{animation:aiIn .3s ease}
  @keyframes aiIn{from{opacity:0;filter:blur(3px)}to{opacity:1;filter:none}}
  .ai-caret{display:inline-block;width:8px;height:16px;background:var(--ink);vertical-align:-2px;margin-left:2px;animation:tCaret 1s steps(1) infinite}
  .ai-think{width:80%}
  .ai-think .lbl{font-size:17px;height:24px;overflow:hidden}
  .ai-think .lbl div{animation:aiUp .4s cubic-bezier(.2,.8,.2,1)}
  @keyframes aiUp{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}
  .ai-bar{height:3px;background:var(--line);margin:14px 0 10px;overflow:hidden;position:relative}
  .ai-bar i{position:absolute;inset:0;background:var(--ink);transform-origin:left;transform:scaleX(0)}
  .ai-bar b{position:absolute;top:0;bottom:0;width:30%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);animation:aiShim 1.2s linear infinite}
  @keyframes aiShim{from{left:-30%}to{left:100%}}
  .ai-think small{font-size:12px;color:var(--muted)}
  .ai-conf{width:84%;display:flex;flex-direction:column;gap:12px}
  .ai-row{font-size:13px}
  .ai-row .top{display:flex;justify-content:space-between;margin-bottom:5px}
  .ai-row .tr{height:6px;background:var(--paper2)}
  .ai-row .tr i{display:block;height:100%;background:var(--ink);width:0;transition:width 1s cubic-bezier(.2,.8,.2,1)}
  `);

  /* inner scroller scaffold → progress 0..1 */
  function scroller(s, viewHTML, onP) {
    s.innerHTML = `<div class="sc-wrap"><div class="sc-tall"><div class="sc-view">${viewHTML}<div class="sc-hint">Scroll inside</div></div></div></div>`;
    const wrap = s.querySelector('.sc-wrap'), hint = s.querySelector('.sc-hint');
    const run = () => {
      const p = wrap.scrollTop / Math.max(1, wrap.scrollHeight - wrap.clientHeight);
      hint.style.opacity = p > 0.03 ? 0 : 1;
      onP(IX.clamp(p, 0, 1));
    };
    wrap.addEventListener('scroll', run, { passive: true });
    requestAnimationFrame(run);
    return { stop() { wrap.scrollTop = 0; run(); } };
  }

  add({
    name: 'Parallax layers', desc: 'Three depth layers move at different speeds. Scroll inside the cell.',
    build(s) {
      const layer = (cls, items) => `<div class="sc-l ${cls}">${items.map(([x, y, w, h, r, f]) => `<i style="left:${x}%;top:${y}%;width:${w}px;height:${h}px;border-radius:${r}px;${f ? 'background:var(--ink)' : ''}"></i>`).join('')}</div>`;
      const v = layer('b', [[10, 20, 40, 40, 20], [70, 30, 60, 60, 30], [40, 70, 30, 30, 15], [85, 80, 24, 24, 12]]) +
        layer('m', [[25, 40, 70, 46, 0], [60, 60, 54, 54, 0], [15, 85, 60, 30, 0]]) +
        layer('f', [[45, 30, 26, 26, 13, 1], [20, 60, 18, 18, 9, 1], [75, 75, 32, 32, 16, 1]]);
      return scroller(s, v, (p) => {
        s.querySelector('.b').style.transform = `translateY(${-p * 30}px)`;
        s.querySelector('.m').style.transform = `translateY(${-p * 90}px)`;
        s.querySelector('.f').style.transform = `translateY(${-p * 190}px)`;
      });
    },
  });

  add({
    name: 'Sticky pill morph', desc: 'A navbar pill compresses into a compact icon as you scroll down.',
    build(s) {
      const v = `<div class="sc-rows">${Array.from({ length: 8 }, (_, i) => `<i style="width:${60 + ((i * 37) % 40)}%"></i>`).join('')}</div><div class="sc-pill"><span class="lg">Interactions</span><span class="mn">Menu</span></div>`;
      return scroller(s, v, (p) => {
        const pill = s.querySelector('.sc-pill'), q = IX.clamp(p * 2.2, 0, 1);
        pill.style.width = `${IX.lerp(78, 0, q)}%`;
        pill.style.minWidth = '40px';
        s.querySelectorAll('.sc-pill span').forEach((e) => (e.style.opacity = 1 - q * 1.6));
        s.querySelector('.sc-rows').style.transform = `translateY(${-p * 120}px)`;
      });
    },
  });

  add({
    name: 'Scroll scrub counter', desc: 'The number counts up as you scroll. Scroll back to count down.',
    build(s) {
      const v = `<div><div class="sc-num">0</div><div class="sc-sub">active users</div></div>`;
      return scroller(s, v, (p) => { s.querySelector('.sc-num').textContent = Math.round((1 - Math.pow(1 - p, 2)) * 48291).toLocaleString('en-US'); });
    },
  });

  add({
    name: 'Scroll word reveal', desc: 'Words fade in one by one as you scroll.',
    build(s) {
      const words = 'We build things that matter, one careful detail at a time.'.split(' ');
      const v = `<p class="sc-words">${words.map((w) => `<span>${w}</span>`).join(' ')}</p>`;
      return scroller(s, v, (p) => {
        s.querySelectorAll('.sc-words span').forEach((e, i) => { const on = p * 1.15 > i / words.length; e.style.opacity = on ? 1 : 0.12; });
      });
    },
  });

  /* ── Time ── */
  const pad = (n) => String(n).padStart(2, '0');

  add({
    name: 'Live flip clock', desc: 'Digits flip like panels and show the actual current time.',
    build(s) {
      s.innerHTML = `<div class="tm-flip">${[0, 1, 'c', 2, 3, 'c', 4, 5].map((k) => (k === 'c' ? '<span class="tm-col">:</span>' : `<div class="tm-d"><span>0</span></div>`)).join('')}</div>`;
      const ds = [...s.querySelectorAll('.tm-d')];
      let id = 0, prev = '';
      const tick = (anim) => {
        const d = new Date(), str = pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
        ds.forEach((el, i) => {
          if (str[i] === prev[i]) return;
          const sp = el.querySelector('span');
          if (anim) { el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); setTimeout(() => (sp.textContent = str[i]), 220); }
          else sp.textContent = str[i];
        });
        prev = str;
      };
      tick(false);
      return { start() { tick(true); id = setInterval(() => tick(true), 1000); }, stop() { clearInterval(id); } };
    },
  });

  add({
    name: 'Live analog clock', desc: 'A smooth sweeping second hand shows the current time. Hover a hand to highlight it.',
    build(s) {
      const ticks = Array.from({ length: 60 }, (_, i) => { const a = (i / 60) * Math.PI * 2, r1 = i % 5 ? 88 : 82; return `<line x1="${100 + Math.sin(a) * r1}" y1="${100 - Math.cos(a) * r1}" x2="${100 + Math.sin(a) * 92}" y2="${100 - Math.cos(a) * 92}" stroke="var(--ink)" stroke-width="${i % 5 ? 0.6 : 1.4}"/>`; }).join('');
      s.innerHTML = `<svg class="tm-an" viewBox="0 0 200 200" style="width:72%;height:auto">${ticks}<line class="h" x1="100" y1="100" x2="100" y2="54" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><line class="m" x1="100" y1="100" x2="100" y2="30" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/><line class="s" x1="100" y1="114" x2="100" y2="22" stroke="var(--accent)" stroke-width="1"/><circle cx="100" cy="100" r="3.5" fill="var(--ink)"/></svg>`;
      const h = s.querySelector('.h'), m = s.querySelector('.m'), sc = s.querySelector('.s');
      const set = () => {
        const d = new Date(), ms = d.getMilliseconds() / 1000, se = d.getSeconds() + ms, mi = d.getMinutes() + se / 60, ho = (d.getHours() % 12) + mi / 60;
        h.setAttribute('transform', `rotate(${ho * 30} 100 100)`); m.setAttribute('transform', `rotate(${mi * 6} 100 100)`); sc.setAttribute('transform', `rotate(${se * 6} 100 100)`);
      };
      set();
      const L = loop(set);
      return { start: L.start, stop: L.stop };
    },
  });

  add({
    name: 'Live countdown', desc: 'Each unit ticks down on its own and the seconds roll every second.',
    build(s) {
      const units = ['DAYS', 'HRS', 'MIN', 'SEC'];
      s.innerHTML = `<div class="tm-cd">${units.map((u) => `<div class="tm-u"><div class="w"><div></div></div><small>${u}</small></div>`).join('')}</div>`;
      const cols = [...s.querySelectorAll('.tm-u .w div')];
      let end = 0, id = 0, last = [];
      const render = () => {
        let t = Math.max(0, Math.floor((end - Date.now()) / 1000));
        const v = [Math.floor(t / 86400), Math.floor((t % 86400) / 3600), Math.floor((t % 3600) / 60), t % 60];
        cols.forEach((c, i) => {
          if (v[i] === last[i]) return;
          c.innerHTML = `<div>${pad(last[i] ?? v[i])}</div><div>${pad(v[i])}</div>`;
          c.style.transition = 'none'; c.style.transform = 'translateY(0)';
          void c.offsetWidth;
          c.style.transition = ''; c.style.transform = last[i] === undefined ? 'translateY(-44px)' : 'translateY(-44px)';
        });
        last = v;
      };
      const reset = () => { end = Date.now() + ((7 * 24 + 14) * 3600 + 32 * 60) * 1000; last = []; render(); };
      reset();
      return { start() { reset(); id = setInterval(render, 250); }, stop() { clearInterval(id); reset(); } };
    },
  });

  add({
    name: 'Live schedule bar', desc: 'A “now” marker moves across today’s blocks in real time.',
    build(s) {
      s.innerHTML = `<div class="tm-sch"></div>`;
      const box = s.querySelector('.tm-sch');
      let id = 0;
      const render = () => {
        const now = new Date(), start = new Date(now); start.setMinutes(0, 0, 0); start.setHours(now.getHours() - 1);
        const span = 4 * 3600e3, pos = (d) => ((d - start) / span) * 100;
        const at = (h, m) => { const d = new Date(start); d.setTime(start.getTime() + (h * 60 + m) * 60e3); return d; };
        const blocks = [['Design sync', at(0, 15), at(1, 0), 10], ['Sprint review', at(1, 30), at(2, 45), 46], ['1:1', at(3, 0), at(3, 30), 82]];
        box.innerHTML = blocks.map(([n, a, b, top]) => `<div class="tm-blk" style="left:${pos(a)}%;width:${pos(b) - pos(a)}%;top:${top}px">${n}</div>`).join('') +
          [0, 1, 2, 3, 4].map((i) => `<span class="tm-hr" style="left:${i * 25}%">${pad((start.getHours() + i) % 24)}:00</span>`).join('') +
          `<div class="tm-now" style="left:${pos(now)}%"></div>`;
      };
      render();
      return { start() { render(); id = setInterval(render, 1000); }, stop() { clearInterval(id); } };
    },
  });

  /* ── AI feel ── */
  add({
    name: 'Token streaming', desc: 'Text arrives token by token at varying speed, like a live LLM response.',
    controls: [{ type: 'button', key: 'replay', label: 'Replay' }],
    build(s) {
      const text = 'Micro interactions are small moments of feedback. They confirm an action, show progress, and make an interface feel alive without getting in the way.';
      s.innerHTML = `<div class="ai-tok"></div>`;
      const box = s.querySelector('.ai-tok');
      const toks = text.match(/\S+\s*/g);
      let i = 0, t = 0;
      const step = () => {
        if (i >= toks.length) { box.querySelector('.ai-caret')?.remove(); return; }
        const sp = document.createElement('span'); sp.textContent = toks[i++];
        box.insertBefore(sp, box.querySelector('.ai-caret'));
        t = setTimeout(step, 40 + Math.random() * 160);
      };
      const replay = () => { clearTimeout(t); i = 0; box.innerHTML = '<i class="ai-caret"></i>'; step(); };
      box.innerHTML = toks.slice(0, 8).join('') + '<i class="ai-caret"></i>';
      return { start: replay, stop() { clearTimeout(t); box.innerHTML = toks.slice(0, 8).join('') + '<i class="ai-caret"></i>'; }, act: replay };
    },
  });

  add({
    name: 'AI thinking state', desc: 'A progress bar and rotating status line show a model at work, with a live token count.',
    build(s) {
      const steps = ['Reading your request', 'Searching the library', 'Comparing patterns', 'Drafting an answer', 'Checking details'];
      s.innerHTML = `<div class="ai-think"><div class="lbl"><div>${steps[0]}</div></div><div class="ai-bar"><i></i><b></b></div><small><span class="n">0</span> tokens processed</small></div>`;
      const lbl = s.querySelector('.lbl'), bar = s.querySelector('.ai-bar i'), n = s.querySelector('.n');
      let si = 0, tok = 0, id1 = 0;
      const L = loop((dt) => {
        tok += Math.round(Math.random() * 9); n.textContent = tok.toLocaleString('en-US');
        const p = (tok % 2400) / 2400; bar.style.transform = `scaleX(${p})`;
      });
      return {
        start() { L.start(); id1 = setInterval(() => { si = (si + 1) % steps.length; lbl.innerHTML = `<div>${steps[si]}…</div>`; }, 1400); },
        stop() { L.stop(); clearInterval(id1); tok = 0; si = 0; n.textContent = 0; bar.style.transform = 'scaleX(0)'; lbl.innerHTML = `<div>${steps[0]}</div>`; },
      };
    },
  });

  add({
    name: 'Confidence bars', desc: 'Classification results fill to their animated probability scores.',
    controls: [{ type: 'button', key: 'rerun', label: 'Re-run' }],
    build(s) {
      const labels = ['Button', 'Card', 'Modal', 'Toast'];
      s.innerHTML = `<div class="ai-conf">${labels.map((l) => `<div class="ai-row"><div class="top"><span>${l}</span><span class="v">0%</span></div><div class="tr"><i></i></div></div>`).join('')}</div>`;
      const rows = [...s.querySelectorAll('.ai-row')];
      const run = () => {
        let raw = labels.map(() => Math.random() ** 2); raw[(Math.random() * raw.length) | 0] += 1.5;
        const sum = raw.reduce((a, b) => a + b, 0), vals = raw.map((v) => Math.round((v / sum) * 100));
        rows.forEach((r, i) => {
          const bar = r.querySelector('i'), v = r.querySelector('.v');
          bar.style.width = '0'; v.textContent = '0%';
          setTimeout(() => {
            bar.style.width = vals[i] + '%';
            const t0 = performance.now();
            const tick = (t) => { const q = Math.min(1, (t - t0) / 1000); v.textContent = Math.round(vals[i] * (1 - Math.pow(1 - q, 3))) + '%'; if (q < 1) requestAnimationFrame(tick); };
            requestAnimationFrame(tick);
          }, 80 + i * 90);
        });
      };
      return { start: run, act: run, stop() { rows.forEach((r) => { r.querySelector('i').style.width = '0'; r.querySelector('.v').textContent = '0%'; }); } };
    },
  });

  add({
    name: 'Neural pulse', desc: 'Signals pulse through a network’s layers. Hover to trigger a forward pass.',
    build(s) {
      const cv = canvas(s), ptr = pointer(s);
      const layers = [3, 5, 5, 2];
      let pulses = [], idle = 0, wasIn = false;
      const nodes = () => layers.map((n, li) => Array.from({ length: n }, (_, i) => ({ x: cv.w * (0.15 + (li / (layers.length - 1)) * 0.7), y: cv.h * ((i + 1) / (n + 1)) })));
      const fire = () => { const N = nodes(); for (let li = 0; li < N.length - 1; li++) for (const a of N[li]) for (const b of N[li + 1]) if (Math.random() < 0.55) pulses.push({ a, b, t: -li * 0.6 - Math.random() * 0.2 }); };
      const draw = (dt) => {
        const { ctx, w, h } = cv, N = nodes();
        if (ptr.in && !wasIn) fire(); wasIn = ptr.in;
        idle += dt; if (dt && idle > 2.2) { idle = 0; fire(); }
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = IX.INK; ctx.globalAlpha = 0.15; ctx.lineWidth = 1;
        for (let li = 0; li < N.length - 1; li++) for (const a of N[li]) for (const b of N[li + 1]) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        ctx.globalAlpha = 1;
        const lit = new Set();
        pulses = pulses.filter((p) => p.t < 1);
        for (const p of pulses) {
          p.t += dt * 1.6;
          if (p.t < 0) continue;
          const x = IX.lerp(p.a.x, p.b.x, p.t), y = IX.lerp(p.a.y, p.b.y, p.t);
          ctx.fillStyle = IX.ACCENT; ctx.beginPath(); ctx.arc(x, y, 2.5, 0, 6.283); ctx.fill();
          if (p.t > 0.85) lit.add(p.b);
        }
        N.flat().forEach((n) => { ctx.beginPath(); ctx.arc(n.x, n.y, 7, 0, 6.283); ctx.fillStyle = lit.has(n) ? IX.ACCENT : '#FBFAF7'; ctx.fill(); ctx.strokeStyle = IX.INK; ctx.stroke(); });
      };
      const L = loop(draw);
      cv.onresize = () => !L.running && draw(0);
      draw(0);
      return { start() { fire(); L.start(); }, stop() { L.stop(); pulses = []; draw(0); } };
    },
  });
})();
