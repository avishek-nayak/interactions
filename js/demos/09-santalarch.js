/* From the Santa Larch teardown (SL-03, SL-06, SL-09/10, SL-25, SL-27, SL-30) · 6 interactions
   Rebuilt from scratch with plain CSS / JS, no libraries. */
(function () {
  const { add, css } = IX;
  const OUT = 'cubic-bezier(.25,1,.5,1)';

  css(`
  .sl-rise{width:84%;font-size:19px;line-height:1.4}
  .sl-rise span{display:inline-block;will-change:transform,opacity}
  .sl-links{display:flex;flex-direction:column;gap:18px;align-items:center;font-size:22px}
  .sl-u{position:relative;display:inline-grid}
  .sl-u span{grid-area:1/1}
  .sl-u span:last-child{color:transparent;text-decoration:underline;text-decoration-color:var(--ink);text-decoration-thickness:1px;text-underline-offset:5px;clip-path:inset(-50% 0 -50% 0);transition:clip-path .8s ${OUT}}
  .sl-u:hover span:last-child{clip-path:inset(-50% 100% -50% 0)}
  .sl-wrap{position:absolute;inset:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
  .sl-tall{position:relative}
  .sl-view{position:sticky;top:0;overflow:hidden}
  .sl-hint{position:absolute;left:0;right:0;bottom:10px;text-align:center;font-size:12px;color:var(--muted);transition:opacity .3s;z-index:3}
  .sl-hair{position:absolute;inset:0;background:linear-gradient(var(--angle,180deg),transparent calc(50% - .5px),var(--ink) calc(50% - .5px),var(--ink) calc(50% + .5px),transparent calc(50% + .5px))}
  .sl-vl{position:absolute;top:0;bottom:0;width:1px;background:var(--line)}
  .sl-tag{position:absolute;left:0;right:0;top:0;padding:0 18px;font-size:30px;line-height:1.05;letter-spacing:-.01em;text-align:right}
  .sl-tag.masked{-webkit-mask-image:linear-gradient(var(--angle,180deg),#000 50%,transparent 50%);mask-image:linear-gradient(var(--angle,180deg),#000 50%,transparent 50%)}
  .sl-cols{position:absolute;inset:10px 10px 0;display:flex;gap:6px;align-items:flex-start}
  .sl-col{flex:1;display:flex;flex-direction:column;gap:6px;will-change:transform}
  .sl-col div{border:1px solid var(--ink);background:repeating-linear-gradient(135deg,var(--paper2) 0 6px,var(--card) 6px 12px);font-size:11px;padding:4px 6px}
  .sl-rail{position:absolute;inset:0}
  .sl-layer{position:absolute;inset:0}
  .sl-win{clip-path:inset(0 25% 0 calc(50% + 1px))}
  .sl-row{position:absolute;left:0;width:100%;height:40%;will-change:transform}
  .sl-row.t{top:12%;font-size:26px;white-space:nowrap}
  .sl-row.t span{position:absolute;top:0}
  .sl-dim{color:rgba(20,20,20,.16)}
  .sl-row.m{top:40%}
  .sl-row.m i{position:absolute;top:0;width:25%;aspect-ratio:3/4;overflow:hidden;display:block}
  .sl-row.m i b{position:absolute;inset:0;transform-origin:center}
  .sl-winframe{position:absolute;top:0;bottom:0;left:50%;width:25%;border-left:1px dashed var(--mark);border-right:1px dashed var(--mark);pointer-events:none}
  .sl-desc{position:absolute;left:12px;top:44%;width:44%;font-size:12px;color:var(--muted);line-height:1.35}
  .sl-globe{position:relative;width:70%;aspect-ratio:1;perspective:900px;display:grid;place-items:center}
  .sl-orb{position:absolute;width:62%;aspect-ratio:1;border-radius:50%;border:1px solid var(--line)}
  .sl-orb::before{content:"";position:absolute;inset:0 38%;border-radius:50%;border:1px solid var(--line)}
  .sl-orb::after{content:"";position:absolute;inset:38% 0;border-radius:50%;border:1px solid var(--line)}
  .sl-ln{position:absolute;left:50%;top:50%;width:46%;height:1px;transform-origin:0 50%;transform-style:preserve-3d;background:linear-gradient(90deg,transparent,var(--ink));animation:slSpin var(--dur,14s) linear infinite;animation-delay:var(--del,0s)}
  .sl-ln span{position:absolute;left:calc(100% + 4px);top:-7px;font-size:12px;white-space:nowrap;animation:slCounter var(--dur,14s) linear infinite;animation-delay:var(--del,0s)}
  @keyframes slSpin{from{transform:rotateZ(var(--z)) rotateY(0deg)}to{transform:rotateZ(var(--z)) rotateY(-360deg)}}
  @keyframes slCounter{from{transform:rotateY(0deg) rotateZ(calc(var(--z) * -1))}to{transform:rotateY(360deg) rotateZ(calc(var(--z) * -1))}}
  .sl-dot{width:8px;height:8px;border-radius:50%;background:var(--ink);position:relative;z-index:2}
  `);

  /* inner scroller → progress 0..1 (the stage is a small scrolling page) */
  function scroller(s, viewHTML, onP, tall = 4) {
    s.innerHTML = `<div class="sl-wrap"><div class="sl-tall" style="height:${tall * 100}%"><div class="sl-view" style="height:${100 / tall}%">${viewHTML}<div class="sl-hint">Scroll inside</div></div></div></div>`;
    const wrap = s.querySelector('.sl-wrap'), hint = s.querySelector('.sl-hint');
    const run = () => {
      const p = IX.clamp(wrap.scrollTop / Math.max(1, wrap.scrollHeight - wrap.clientHeight), 0, 1);
      hint.style.opacity = p > 0.03 ? 0 : 1;
      onP(p, wrap);
    };
    wrap.addEventListener('scroll', run, { passive: true });
    new ResizeObserver(run).observe(wrap);
    requestAnimationFrame(run);
    return { stop() { wrap.scrollTop = 0; run(); } };
  }

  /* SL-03 · Word rise reveal */
  add({
    name: 'Word rise reveal', desc: 'Words rise, straighten from a small tilt and fade in one after another.',
    controls: [
      { type: 'range', key: 'stagger', label: 'Stagger', min: 10, max: 120, value: 30, unit: 'ms' },
      { type: 'range', key: 'dur', label: 'Duration', min: 0.4, max: 3, step: 0.1, value: 1.6, unit: 's' },
      { type: 'button', key: 'replay', label: 'Replay' },
    ],
    build(s, P) {
      const txt = 'Architecture does not shout. It is a precise system of decisions, resolved until every detail feels inevitable.';
      s.innerHTML = `<p class="sl-rise">${txt.split(' ').map((w) => `<span>${w}</span>`).join(' ')}</p>`;
      const words = [...s.querySelectorAll('.sl-rise span')];
      let anims = [];
      const run = () => {
        anims.forEach((a) => a.cancel());
        anims = words.map((w, i) => w.animate(
          [{ opacity: 0, transform: 'translateY(20px) rotate(3deg)' }, { opacity: 1, transform: 'none' }],
          { duration: P.dur * 1000, delay: 200 + i * P.stagger, easing: OUT, fill: 'both' }
        ));
      };
      return { start: run, act: run, stop() { anims.forEach((a) => a.cancel()); anims = []; } };
    },
  });

  /* SL-06 · Underline wipe link */
  add({
    name: 'Underline wipe link', desc: 'The underline erases from left to right on hover and draws back when you leave.',
    build(s) {
      const link = (t) => `<a class="sl-u"><span>${t}</span><span aria-hidden="true">${t}</span></a>`;
      s.innerHTML = `<div class="sl-links">${link('Enquire')}${link('View all projects')}${link('Our process')}</div>`;
    },
  });

  /* SL-09 + SL-10 · Rotating hairline with an angle-masked tagline */
  add({
    name: 'Rotating hairline mask', desc: 'A corner-to-corner hairline pivots flat as you scroll, and the tagline is cut away along the same line.',
    build(s) {
      const v = `<div class="sl-vl" style="left:12.5%"></div><div class="sl-vl" style="left:62.5%"></div><div class="sl-hair"></div><div class="sl-tag">Architecture<br>shapes<br>perception</div>`;
      return scroller(s, v, (p, wrap) => {
        const view = s.querySelector('.sl-view'), tag = s.querySelector('.sl-tag');
        const w = view.clientWidth, h = view.clientHeight;
        const start = Math.atan2(h, w) * (180 / Math.PI) - 180;       // exactly corner to corner
        const q = IX.clamp(p / 0.65, 0, 1);
        view.style.setProperty('--angle', (start - start * q).toFixed(3) + 'deg');
        const travel = p * h * 0.9;
        tag.style.transform = `translateY(${h * 0.32 - travel}px)`;
        tag.classList.toggle('masked', travel > h * 0.12);
      });
    },
  });

  /* SL-25 · Masonry column parallax */
  add({
    name: 'Masonry column parallax', desc: 'Columns slide up at different speeds from the centre out and settle with their bottoms aligned.',
    build(s) {
      const hs = [70, 110, 55, 90, 130, 60, 100, 75, 85, 120, 65, 95];
      const cols = [[], [], []], tot = [0, 0, 0];
      hs.forEach((h, i) => { const c = tot.indexOf(Math.min(...tot)); cols[c].push([i + 1, h]); tot[c] += h; });
      const v = `<div class="sl-cols">${cols.map((c) => `<div class="sl-col">${c.map(([n, h]) => `<div style="height:${h}px">${String(n).padStart(2, '0')}</div>`).join('')}</div>`).join('')}</div>`;
      return scroller(s, v, (p) => {
        const view = s.querySelector('.sl-view'), els = [...s.querySelectorAll('.sl-col')];
        const H = view.clientHeight, heights = els.map((e) => e.offsetHeight), minH = Math.min(...heights);
        els.forEach((el, i) => {
          const d = Math.abs(i - 1) * 0.15, q = IX.clamp((p - d) / (1 - d), 0, 1);
          const from = H * 0.5, to = Math.min(0, H - 20 - heights[i]) - (heights[i] - minH) * 0;
          el.style.transform = `translateY(${IX.lerp(from, to, q)}px)`;
        });
      }, 3.5);
    },
  });

  /* SL-27 · Horizontal rail with a spotlight window */
  add({
    name: 'Spotlight rail', desc: 'Words glide sideways as you scroll and only light up while they pass through one fixed window.',
    build(s) {
      const items = ['Architecture', 'Interior', 'Procurement', 'Consulting', 'Marketing'];
      const descs = ['Private homes to masterplans.', 'Spaces shaped into a coherent experience.', 'Suppliers coordinated for predictable delivery.', 'Brief and strategy clarified first.', 'Narrative that shapes perception.'];
      const titles = items.map((t) => `<span>${t}</span>`).join('');
      const media = items.map((_, i) => `<i><b style="background:repeating-linear-gradient(${30 + i * 30}deg,var(--ink) 0 2px,var(--card) 2px ${8 + i * 2}px)"></b></i>`).join('');
      // the dim row moves freely; the bright copies sit inside a fixed, clipped window layer
      const v = `<div class="sl-rail">
        <div class="sl-layer"><div class="sl-row t sl-dim">${titles}</div></div>
        <div class="sl-layer sl-win"><div class="sl-row t">${titles}</div><div class="sl-row m">${media}</div></div>
        <div class="sl-winframe"></div><p class="sl-desc"></p></div>`;
      let active = -1;
      return scroller(s, v, (p) => {
        const view = s.querySelector('.sl-view'), W = view.clientWidth;
        const rows = [...s.querySelectorAll('.sl-row')], winL = W * 0.5, winW = W * 0.25;
        const step = W * 0.42;                                   // distance between items
        const x = IX.lerp(winL, winL - step * (items.length - 1), p); // item 0 starts at the window, last ends there
        rows.forEach((r) => {
          [...r.children].forEach((c, i) => (c.style.left = i * step + 'px'));
          r.style.transform = `translateX(${x}px)`;
        });
        // media scale 1.5 -> 1 as each image slides into the window
        [...rows[2].children].forEach((it, i) => {
          const left = x + i * step, q = IX.clamp(1 - (left - winL) / step, 0, 1);
          it.firstChild.style.transform = `scale(${IX.lerp(1.5, 1, q)})`;
        });
        const idx = IX.clamp(Math.round((winL - x) / step), 0, items.length - 1);
        if (idx !== active) {
          active = idx;
          const d = s.querySelector('.sl-desc');
          d.textContent = descs[idx];
          d.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: OUT });
        }
      }, 4);
    },
  });

  /* SL-30 · CSS 3D orbiting globe labels */
  add({
    name: 'Orbiting globe labels', desc: 'City labels orbit a centre like a spinning globe while counter-rotating so they always stay readable. Pure CSS 3D.',
    controls: [{ type: 'range', key: 'dur', label: 'One orbit', min: 4, max: 30, value: 14, unit: 's' }],
    build(s, P) {
      const cities = [['Lisbon', -24], ['Dubai', 12], ['Milan', -6], ['Riyadh', 22], ['Zurich', -14], ['Paris', 4], ['Doha', 16], ['London', -30]];
      s.innerHTML = `<div class="sl-globe"><div class="sl-orb"></div><div class="sl-dot"></div>${cities.map(([c, z], i) => `<div class="sl-ln" style="--z:${z}deg;--del:${(-i / cities.length) * P.dur}s"><span>${c}</span></div>`).join('')}</div>`;
      const set = () => s.querySelectorAll('.sl-ln').forEach((l, i) => { l.style.setProperty('--dur', P.dur + 's'); l.style.setProperty('--del', (-i / cities.length) * P.dur + 's'); });
      set();
      return { update: set };
    },
  });
})();
