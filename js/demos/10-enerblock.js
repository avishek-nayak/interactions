/* From the Enerblock teardown · 19 interactions, rebuilt from scratch without libraries.
   EB-01 03 04 05 06 07 10 11 12 14 15 17 18 22 24 25 26 27 28 */
(function () {
  const { add, css, icon, loop, pointer, clamp, lerp } = IX;
  const SNAP = 'cubic-bezier(.53,0,0,1)';   // Enerblock's signature ease: slow start, sharp landing

  css(`
  .eb-wrap{position:absolute;inset:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
  .eb-tall{position:relative}
  .eb-view{position:sticky;top:0;overflow:hidden}
  .eb-hint{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:12px;color:var(--muted);transition:opacity .3s;z-index:9;pointer-events:none}
  /* 01 clapper */
  .eb-clap{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden}
  .eb-clap h4{font-weight:400;font-size:30px;line-height:1;text-align:center}
  .eb-half{position:absolute;inset:0;background:var(--accent)}
  .eb-half.t{clip-path:polygon(0 0,100% 0,100% 38%,0 62%)}
  .eb-half.b{clip-path:polygon(0 62%,100% 38%,100% 100%,0 100%)}
  /* 03 page transition */
  .eb-site{position:absolute;inset:0;display:flex;flex-direction:column}
  .eb-site nav{display:flex;gap:16px;padding:10px 14px;border-bottom:1px solid var(--line);font-size:13px}
  .eb-site nav a.on{text-decoration:underline;text-underline-offset:4px}
  .eb-page{flex:1;padding:18px 14px;transition:opacity .4s}
  .eb-page h4{font-weight:400;font-size:28px;line-height:1.05}
  .eb-page p{font-size:13px;color:var(--muted);margin-top:10px;max-width:80%}
  .eb-site.out .eb-page{opacity:0}
  .eb-layer{position:absolute;inset:38px 0 0;background:var(--ink);display:grid;place-items:center;opacity:0;pointer-events:none;transition:opacity .3s}
  .eb-site.out .eb-layer{opacity:1}
  .eb-layer i{width:8px;height:8px;border-radius:50%;background:var(--paper);animation:ebPulse 1s ease-in-out infinite}
  @keyframes ebPulse{0%,100%{opacity:0}50%{opacity:1}}
  /* 04 smart header */
  .eb-hd{position:absolute;left:0;right:0;top:0;height:40px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font-size:13px;transition:transform .45s ${SNAP},background .3s,border-color .3s;border-bottom:1px solid transparent;z-index:2}
  .eb-hd.solid{background:var(--card);border-color:var(--line)}
  .eb-hd.hide{transform:translateY(-100%)}
  .eb-hd b{font-weight:400;border:1px solid var(--ink);padding:3px 10px;border-radius:12px}
  .eb-fake{padding:56px 14px 20px}
  .eb-fake i{display:block;height:10px;background:var(--paper2);margin-bottom:10px}
  .eb-fake i.big{height:90px}
  /* 05 menu */
  .eb-mbtn{position:absolute;top:12px;right:12px;border:1px solid var(--ink);padding:5px 12px;font-size:13px;z-index:3;background:var(--card)}
  .eb-menu{position:absolute;inset:0;background:var(--ink);color:var(--paper);clip-path:inset(0 0 0 100%);transition:clip-path .6s ${SNAP};z-index:2;padding:52px 18px 0}
  .eb-menu.open{clip-path:inset(0 0 0 0)}
  .eb-menu li{position:relative;padding:9px 0;font-size:22px}
  .eb-menu li::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:rgba(243,242,238,.3);transform:scaleX(0);transform-origin:left;transition:transform 1s ${SNAP}}
  .eb-menu .mask{display:block;overflow:hidden}
  .eb-menu .mask span{display:block;transform:translateY(-100%);transition:transform 1s ${SNAP}}
  .eb-menu.open li::before{transform:scaleX(1)}
  .eb-menu.open .mask span{transform:none}
  .eb-menu:not(.open) li::before,.eb-menu:not(.open) .mask span{transition-duration:0s;transition-delay:.6s}
  /* 06 burger */
  .eb-burger{width:64px;height:64px;border:1px solid var(--ink);display:grid;place-items:center;transition:background .3s}
  .eb-burger .bx{display:grid;gap:7px;width:26px}
  .eb-burger .ln{position:relative;height:1.5px;overflow:hidden}
  .eb-burger .ln::before,.eb-burger .ln::after{content:"";position:absolute;inset:0;background:var(--ink);transition:transform .5s ${SNAP}}
  .eb-burger .ln::after{transform:translateX(-101%)}
  .eb-burger:hover{background:var(--ink)}
  .eb-burger:hover .ln::before{transform:translateX(101%);background:var(--paper)}
  .eb-burger:hover .ln::after{transform:none;background:var(--paper)}
  .eb-burger .ln:nth-child(2)::before,.eb-burger .ln:nth-child(2)::after{transition-delay:.06s}
  .eb-burger .ln:nth-child(3)::before,.eb-burger .ln:nth-child(3)::after{transition-delay:.12s}
  /* 07 roll button */
  .eb-rb{display:inline-flex;align-items:stretch;border:1px solid var(--ink);min-width:200px;transition:background .6s ${SNAP},color .6s ${SNAP}}
  .eb-rb .tx{flex:1;position:relative;overflow:hidden;padding:9px 12px;font-size:15px}
  .eb-rb .tx span{display:block;transition:transform .6s ${SNAP}}
  .eb-rb .tx span+span{position:absolute;left:12px;top:-100%;padding-top:9px}
  .eb-rb .ic{width:40px;border-left:1px solid var(--ink);position:relative;overflow:hidden}
  .eb-rb .ic i{position:absolute;inset:0;display:grid;place-items:center;transition:transform .6s ${SNAP}}
  .eb-rb .ic i+i{background:var(--accent);color:var(--ink);transform:translateX(-101%)}
  .eb-rb:hover{background:var(--ink);color:var(--paper)}
  .eb-rb:hover .tx span{transform:translateY(100%)}
  .eb-rb:hover .ic i{transform:translateX(101%)}
  .eb-rb:hover .ic i+i{transform:none}
  /* 10 morph logo */
  .eb-logo{position:absolute;inset:0}
  .eb-logo svg{position:absolute;left:50%;top:50%;width:52%;transform:translate(-50%,-50%);overflow:visible}
  .eb-gl{position:absolute;background:var(--mark)}
  .eb-gl.v{top:0;bottom:0;width:1px}.eb-gl.h{left:0;right:0;height:1px}
  /* 11 line mask */
  .eb-lm{font-size:30px;line-height:1.08;padding:0 16px;width:100%}
  .eb-lm .ln{position:relative;overflow:hidden;width:max-content}
  .eb-lm .in{opacity:0}
  .eb-lm .bar{position:absolute;left:0;top:0;bottom:0;width:0;background:currentColor}
  .eb-lm.go .in{animation:ebAppear 1.2s ease-in-out forwards;animation-delay:var(--d)}
  .eb-lm.go .bar{animation:ebGrow 1.2s ease-in-out forwards;animation-delay:var(--d)}
  @keyframes ebGrow{0%{width:0;transform:none}45%,55%{width:100%;transform:none}100%{width:100%;transform:translateX(101%)}}
  @keyframes ebAppear{0%,50%{opacity:0}60%,100%{opacity:1}}
  /* 12 decode */
  .eb-dec{display:flex;flex-direction:column;gap:14px;font-size:14px;letter-spacing:.12em}
  .eb-dec div{display:flex;align-items:center;gap:10px}
  .eb-dec div::before{content:"";width:6px;height:6px;background:var(--ink)}
  .eb-dec span span{position:relative;display:inline-block;min-width:.6em}
  .eb-dec span span.hl{background:var(--ink);color:var(--paper)}
  /* 14 crosshair */
  .eb-ch{position:absolute;inset:0;opacity:0;transition:opacity .1s;pointer-events:none}
  .eb-ch .v,.eb-ch .h{position:absolute;background:var(--ink)}
  .eb-ch .v{top:0;bottom:0;width:1px;left:0}.eb-ch .h{left:0;right:0;height:1px;top:0}
  .eb-ch .pt{position:absolute;left:-3px;top:-3px;width:7px;height:7px;border:1px solid var(--ink);background:var(--paper)}
  .eb-ch .nx,.eb-ch .ny{position:absolute;left:0;top:0;font-size:11px;white-space:nowrap}
  .eb-ch .nx{transform:translate(8px,-18px)}.eb-ch .ny{transform:translate(8px,6px)}
  /* 15 corner reveal */
  .eb-cr{position:absolute;inset:0}
  .eb-cr .img{position:absolute;inset:0;overflow:hidden}
  .eb-cr .img b{position:absolute;inset:0;background:radial-gradient(circle at 30% 30%,var(--paper2),transparent 60%),repeating-linear-gradient(90deg,var(--ink) 0 1px,transparent 1px 22px),repeating-linear-gradient(0deg,var(--ink) 0 1px,transparent 1px 22px),var(--card);transform-origin:0 0}
  /* 17 wireframe */
  .eb-wf{position:absolute;inset:0;display:grid;place-items:center}
  .eb-wf svg{width:78%;overflow:visible}
  .eb-wf path,.eb-wf line,.eb-wf rect,.eb-wf polyline{fill:none;stroke:var(--ink);stroke-width:1.2;vector-effect:non-scaling-stroke}
  .eb-wf .cap{position:absolute;bottom:34px;left:0;right:0;text-align:center;font-size:13px;opacity:0;transition:opacity .4s}
  /* 18 stacking */
  .eb-stk{padding:0 10px 10px}
  .eb-sc{position:sticky;background:var(--card);border:1px solid var(--ink);margin-top:10px;overflow:hidden}
  .eb-sc header{display:flex;justify-content:space-between;padding:8px 10px;font-size:14px;cursor:pointer;border-bottom:1px solid var(--line)}
  .eb-sc .ph{height:120px;position:relative;background:repeating-linear-gradient(135deg,var(--paper2) 0 6px,var(--card) 6px 12px)}
  .eb-sc .ph::before{content:"";position:absolute;left:0;top:0;bottom:0;width:0;background:var(--ink)}
  .eb-sc .ph .im{position:absolute;inset:0;opacity:0;background:inherit}
  .eb-sc.in .ph::before{animation:ebGrow .8s ease-in-out forwards}
  .eb-sc.in .ph .im{animation:ebAppear .8s ease-in-out forwards}
  .eb-sc p{font-size:12px;color:var(--muted);padding:8px 10px}
  /* 22 footer curtain */
  .eb-fc-page{position:relative;z-index:2;background:var(--paper)}
  .eb-fc-page section{padding:18px 14px;border-bottom:1px solid var(--line);font-size:13px;color:var(--muted)}
  .eb-fc-page section h5{font-weight:400;font-size:20px;color:var(--ink);margin-bottom:6px}
  .eb-foot{position:absolute;left:0;right:0;bottom:0;height:62%;background:var(--ink);color:var(--paper);overflow:hidden;z-index:0}
  .eb-fc .eb-wrap{z-index:1}
  .eb-fc-spacer{height:62%}
  .eb-foot .big{position:absolute;left:12px;bottom:6px;font-size:58px;line-height:.9;letter-spacing:-.02em;will-change:transform}
  .eb-foot .links{position:absolute;left:12px;top:14px;font-size:12px;display:flex;gap:16px;opacity:.7}
  .eb-foot .over{position:absolute;inset:0;background:var(--ink)}
  /* 24 / 26 svg stages */
  .eb-svg{position:absolute;inset:0;display:grid;place-items:center}
  .eb-svg svg{width:74%;overflow:visible}
  .eb-svg .lbl{font-size:10px;fill:var(--muted);font-family:inherit}
  .eb-desc{position:absolute;left:14px;right:14px;bottom:30px;font-size:13px;color:var(--muted);opacity:0}
  /* 25 saw */
  .eb-saw{position:absolute;left:0;top:0;width:46px;height:46px;will-change:transform}
  .eb-saw svg{width:100%;height:100%}
  .eb-saw.spin svg{animation:ebSpin .5s linear infinite}
  @keyframes ebSpin{to{transform:rotate(360deg)}}
  .eb-panel{position:absolute;left:8%;right:8%;height:14px;border:1px solid var(--ink);background:var(--card)}
  .eb-cut{position:absolute;height:2px;background:var(--accent);left:8%;width:0}
  /* 27 dialog */
  .eb-dlg-back{position:absolute;inset:0;background:rgba(20,20,20,.55);opacity:0;pointer-events:none;transition:opacity .35s}
  .eb-dlg{position:absolute;left:8%;right:8%;top:16%;bottom:16%;background:var(--ink);display:grid;place-items:center;color:var(--paper);opacity:0;transform:translateY(30%);pointer-events:none}
  .eb-dlg.open{animation:ebDlg .6s ${SNAP} forwards;pointer-events:auto}
  .eb-dlg-back.open{opacity:1;pointer-events:auto}
  @keyframes ebDlg{to{opacity:1;transform:none}}
  .eb-dlg .x{position:absolute;top:8px;right:8px;color:var(--paper)}
  .eb-dlg .pl{width:54px;height:54px;border:1px solid var(--paper);border-radius:50%;display:grid;place-items:center}
  /* 28 multistep */
  .eb-ms{width:84%;position:relative}
  .eb-ms .bar{height:2px;background:var(--line);margin-bottom:14px;position:relative}
  .eb-ms .bar i{position:absolute;left:0;top:0;bottom:0;background:var(--ink);transition:width .5s ${SNAP}}
  .eb-ms .steps{position:relative;overflow:hidden}
  .eb-ms .st{position:absolute;inset:0;opacity:0;transform:translateX(24px);transition:opacity .35s,transform .45s ${SNAP};pointer-events:none}
  .eb-ms .st.on{opacity:1;transform:none;pointer-events:auto;position:relative}
  .eb-ms .st small{font-size:11px;letter-spacing:.08em;color:var(--muted)}
  .eb-ms label{display:block;font-size:13px;margin:8px 0 4px}
  .eb-ms input,.eb-ms select{width:100%;border:1px solid var(--line);background:var(--card);padding:7px 9px;font:inherit;font-size:14px;outline:none}
  .eb-ms input.err{border-color:var(--accent);animation:fShake .4s}
  .eb-ms .row{display:flex;justify-content:space-between;margin-top:12px}
  .eb-ms button.b{border:1px solid var(--ink);padding:6px 14px;font-size:13px}
  .eb-ms button.b:hover{background:var(--ink);color:var(--paper)}
  .eb-ms .done{text-align:center;padding:20px 0;font-size:18px}
  `);

  /* inner scroller → progress 0..1 */
  function scroller(s, viewHTML, onP, tall = 4) {
    s.innerHTML = `<div class="eb-wrap"><div class="eb-tall" style="height:${tall * 100}%"><div class="eb-view" style="height:${100 / tall}%">${viewHTML}<div class="eb-hint">Scroll inside</div></div></div></div>`;
    const wrap = s.querySelector('.eb-wrap'), hint = s.querySelector('.eb-hint');
    const run = () => {
      const p = clamp(wrap.scrollTop / Math.max(1, wrap.scrollHeight - wrap.clientHeight), 0, 1);
      hint.style.opacity = p > 0.03 ? 0 : 1;
      onP(p, wrap);
    };
    wrap.addEventListener('scroll', run, { passive: true });
    new ResizeObserver(run).observe(wrap);
    requestAnimationFrame(run);
    return { stop() { wrap.scrollTop = 0; run(); } };
  }
  const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1); // progress within [a,b]

  /* EB-01 · Clapperboard split preloader */
  add({
    name: 'Clapperboard split preloader', desc: 'Two coloured halves meet on a diagonal seam, then split apart up and down to reveal the page.',
    controls: [{ type: 'button', key: 'replay', label: 'Replay' }],
    build(s) {
      s.innerHTML = `<div class="eb-clap"><h4>Next-gen<br>buildings</h4><div class="eb-half t"></div><div class="eb-half b"></div></div>`;
      const t = s.querySelector('.t'), b = s.querySelector('.b');
      let tm;
      const run = () => {
        [t, b].forEach((e) => e.getAnimations().forEach((a) => a.cancel()));
        clearTimeout(tm);
        tm = setTimeout(() => {
          const o = { duration: 1000, easing: SNAP, fill: 'forwards' };
          t.animate([{ transform: 'none' }, { transform: 'translateY(-100%)' }], o);
          b.animate([{ transform: 'none' }, { transform: 'translateY(100%)' }], o);
        }, 600);
      };
      return { start: run, act: run, stop() { clearTimeout(tm); [t, b].forEach((e) => e.getAnimations().forEach((a) => a.cancel())); } };
    },
  });

  /* EB-03 · Fade page transition */
  add({
    name: 'Fade page transition', desc: 'Clicking a link fades the page out to a dark layer with a pulsing dot, swaps the content and fades the new page in.',
    build(s) {
      const pages = {
        Home: ['Next-gen buildings', 'The future of construction is industrialised and digital.'],
        Approach: ['Design to assembly', 'One process from architecture to on-site assembly.'],
        Projects: ['Case studies', 'Housing, care homes and residential blocks.'],
      };
      s.innerHTML = `<div class="eb-site"><nav>${Object.keys(pages).map((k, i) => `<a data-p="${k}" class="${i ? '' : 'on'}">${k}</a>`).join('')}</nav><div class="eb-page"></div><div class="eb-layer"><i></i></div></div>`;
      const site = s.querySelector('.eb-site'), page = s.querySelector('.eb-page');
      const render = (k) => { page.innerHTML = `<h4>${pages[k][0]}</h4><p>${pages[k][1]}</p>`; };
      render('Home');
      let busy = false;
      s.querySelectorAll('nav a').forEach((a) => (a.onclick = () => {
        if (busy || a.classList.contains('on')) return;
        busy = true;
        s.querySelectorAll('nav a').forEach((x) => x.classList.toggle('on', x === a));
        site.classList.add('out');
        setTimeout(() => {
          render(a.dataset.p);
          setTimeout(() => {
            site.classList.remove('out');
            page.querySelector('h4').animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: SNAP, delay: 150, fill: 'backwards' });
            busy = false;
          }, 500);
        }, 400);
      }));
      return { stop() { site.classList.remove('out'); render('Home'); s.querySelectorAll('nav a').forEach((x, i) => x.classList.toggle('on', !i)); busy = false; } };
    },
  });

  /* EB-04 · Smart header */
  add({
    name: 'Smart hide header', desc: 'The header hides when you scroll down, comes back when you scroll up, and turns solid once you leave the top.',
    build(s) {
      s.innerHTML = `<div class="eb-wrap"><div class="eb-hd"><span>Studio</span><b>Menu</b></div><div class="eb-fake">${'<i class="big"></i><i></i><i style="width:70%"></i><i></i><i style="width:55%"></i>'.repeat(5)}</div></div><div class="eb-hint">Scroll inside</div>`;
      const wrap = s.querySelector('.eb-wrap'), hd = s.querySelector('.eb-hd'), hint = s.querySelector('.eb-hint');
      let last = 0;
      wrap.addEventListener('scroll', () => {
        const y = wrap.scrollTop;
        hint.style.opacity = y > 10 ? 0 : 1;
        hd.style.top = y + 'px';                 // stay at the top of the scrolling box
        hd.classList.toggle('solid', y > 10);
        if (Math.abs(y - last) <= 5) return;     // 5px dead zone, like the original
        hd.classList.toggle('hide', y > last && y > 40);
        last = y;
      }, { passive: true });
      return { stop() { wrap.scrollTop = 0; hd.className = 'eb-hd'; hd.style.top = '0px'; last = 0; } };
    },
  });

  /* EB-05 · Clip-wipe fullscreen menu */
  add({
    name: 'Clip-wipe menu', desc: 'The menu wipes in from the right edge, divider lines draw across and each link slides out of its mask.',
    build(s) {
      const links = ['Approach', 'Solutions', 'Projects', 'Company', 'Contact'];
      s.innerHTML = `<button class="eb-mbtn">Menu</button><div class="eb-menu"><ul>${links.map((l, i) => `<li style="--i:${i}"><span class="mask"><span>${l}</span></span></li>`).join('')}</ul></div>`;
      const btn = s.querySelector('.eb-mbtn'), menu = s.querySelector('.eb-menu');
      menu.querySelectorAll('li').forEach((li, i) => { li.querySelector('.mask span').style.transitionDelay = (0.15 + i * 0.06) + 's'; });
      btn.onclick = () => { const o = menu.classList.toggle('open'); btn.textContent = o ? 'Close' : 'Menu'; btn.style.background = o ? 'var(--paper)' : ''; };
      return { stop() { menu.classList.remove('open'); btn.textContent = 'Menu'; btn.style.background = ''; } };
    },
  });

  /* EB-06 · Burger line swap */
  add({
    name: 'Burger line swap', desc: 'On hover the burger lines slide out to the right while fresh lines slide in from the left.',
    build(s) { s.innerHTML = `<button class="eb-burger" aria-label="Menu"><span class="bx"><span class="ln"></span><span class="ln"></span><span class="ln"></span></span></button>`; },
  });

  /* EB-07 · Text-roll arrow button */
  add({
    name: 'Text-roll arrow button', desc: 'The label rolls down to a copy while the arrow is pushed out and a coloured arrow slides in behind it.',
    build(s) {
      const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
      s.innerHTML = `<div style="display:grid;gap:12px"><a class="eb-rb"><span class="tx"><span>Learn more</span><span>Learn more</span></span><span class="ic"><i>${arrow}</i><i>${arrow}</i></span></a><a class="eb-rb"><span class="tx"><span>Request information</span><span>Request information</span></span><span class="ic"><i>${arrow}</i><i>${arrow}</i></span></a></div>`;
    },
  });

  /* EB-10 · Cursor-morphing logo (polygon state blend) */
  add({
    name: 'Cursor-morphing mark', desc: 'A three-slab mark warps toward the cursor by blending five drawn poses, and guide lines stay locked to its edges.',
    controls: [{ type: 'range', key: 'ease', label: 'Follow ease', min: 0.02, max: 0.3, step: 0.01, value: 0.1 }],
    build(s, P, api) {
      // centre pose: three slanted slabs; other poses are the same points pushed toward a side
      const C = [[[40, 10], [100, 10], [80, 30], [20, 30]], [[30, 40], [90, 40], [70, 60], [10, 60]], [[40, 70], [100, 70], [80, 90], [20, 90]]];
      const pose = (fn) => C.map((poly) => poly.map(([x, y]) => fn(x, y)));
      const S = {
        c: C,
        l: pose((x, y) => [x - 22 + (y / 100) * 10, y]),
        r: pose((x, y) => [x + 22 - (y / 100) * 10, y]),
        t: pose((x, y) => [50 + (x - 50) * 1.08, 50 + (y - 50) * 0.78 - 10]),
        b: pose((x, y) => [50 + (x - 50) * 0.92, 50 + (y - 50) * 1.18 + 8]),
      };
      s.innerHTML = `<div class="eb-logo"><i class="eb-gl v a"></i><i class="eb-gl v b"></i><i class="eb-gl h a"></i><i class="eb-gl h b"></i><svg viewBox="0 0 110 100">${C.map(() => '<polygon fill="var(--ink)"/>').join('')}</svg></div>`;
      const polys = [...s.querySelectorAll('polygon')], svg = s.querySelector('svg'), ptr = pointer(s);
      const gl = [...s.querySelectorAll('.eb-gl')];
      let cx = 0, cy = 0;
      const draw = () => {
        const L = Math.max(0, -cx), R = Math.max(0, cx), T = Math.max(0, -cy), B = Math.max(0, cy);
        let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
        polys.forEach((pg, k) => {
          const pts = C[k].map(([x, y], i) => {
            const nx = x + L * (S.l[k][i][0] - x) + R * (S.r[k][i][0] - x) + T * (S.t[k][i][0] - x) + B * (S.b[k][i][0] - x);
            const ny = y + L * (S.l[k][i][1] - y) + R * (S.r[k][i][1] - y) + T * (S.t[k][i][1] - y) + B * (S.b[k][i][1] - y);
            minX = Math.min(minX, nx); maxX = Math.max(maxX, nx); minY = Math.min(minY, ny); maxY = Math.max(maxY, ny);
            return nx.toFixed(2) + ',' + ny.toFixed(2);
          });
          pg.setAttribute('points', pts.join(' '));
        });
        // guide lines follow the mark's bounding edges (viewBox → stage pixels)
        const r = svg.getBoundingClientRect(), sr = s.getBoundingClientRect(), k = r.width / 110;
        gl[0].style.transform = `translateX(${r.left - sr.left + minX * k}px)`;
        gl[1].style.transform = `translateX(${r.left - sr.left + maxX * k}px)`;
        gl[2].style.transform = `translateY(${r.top - sr.top + minY * k}px)`;
        gl[3].style.transform = `translateY(${r.top - sr.top + maxY * k}px)`;
      };
      const L = loop(() => {
        const r = s.getBoundingClientRect();
        const tx = ptr.in ? clamp((ptr.x - r.width / 2) / (r.width / 2), -1, 1) : 0;
        const ty = ptr.in ? clamp((ptr.y - r.height / 2) / (r.height / 2), -1, 1) : 0;
        cx += (tx - cx) * P.ease; cy += (ty - cy) * P.ease;
        draw();
        api.read({ x: cx.toFixed(2), y: cy.toFixed(2) });
      });
      requestAnimationFrame(draw);
      new ResizeObserver(draw).observe(s);
      return { start: L.start, stop() { L.stop(); cx = cy = 0; draw(); } };
    },
  });

  /* EB-11 · Line mask wipe reveal */
  add({
    name: 'Line mask wipe', desc: 'A solid bar sweeps across each line, the text appears behind it, then the bar slides away. Lines follow 0.1s apart.',
    controls: [{ type: 'button', key: 'replay', label: 'Replay' }],
    build(s) {
      const lines = ['Industrialised', 'vision and digital', 'control to execute'];
      s.innerHTML = `<div class="eb-lm">${lines.map((l, i) => `<div class="ln" style="--d:${i * 0.1}s"><div class="in">${l}</div><div class="bar"></div></div>`).join('')}</div>`;
      const box = s.querySelector('.eb-lm');
      const run = () => { box.classList.remove('go'); void box.offsetWidth; box.classList.add('go'); };
      return { start: run, act: run, stop() { box.classList.remove('go'); } };
    },
  });

  /* EB-12 · Terminal decode label */
  add({
    name: 'Terminal decode label', desc: 'Each character flickers through random letters under a block cursor, then settles. Characters follow 70ms apart.',
    controls: [{ type: 'button', key: 'replay', label: 'Replay' }],
    build(s) {
      const words = ['SYSTEM', 'APPROACH', 'SOLUTIONS', 'EST. 2025'];
      s.innerHTML = `<div class="eb-dec">${words.map((w) => `<div><span>${[...w].map((c) => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</span></div>`).join('')}</div>`;
      const chars = [...s.querySelectorAll('.eb-dec span span')];
      const orig = chars.map((c) => c.innerHTML);
      let timers = [];
      const AZ = 'abcdefghijklmnopqrstuvwxyz';
      const run = () => {
        timers.forEach(clearTimeout); timers = [];
        chars.forEach((c, i) => { c.style.opacity = 0; c.classList.remove('hl'); });
        chars.forEach((c, i) => {
          const t0 = (i + 1) * 70;
          for (let r = 0; r < 4; r++) timers.push(setTimeout(() => { c.style.opacity = 1; c.classList.toggle('hl', r === 0); c.textContent = AZ[(Math.random() * 26) | 0]; }, t0 + r * 70));
          timers.push(setTimeout(() => { c.classList.remove('hl'); c.innerHTML = orig[i]; }, t0 + 4 * 70 + 30));
        });
      };
      return { start: run, act: run, stop() { timers.forEach(clearTimeout); chars.forEach((c, i) => { c.style.opacity = 1; c.classList.remove('hl'); c.innerHTML = orig[i]; }); } };
    },
  });

  /* EB-14 · Blueprint crosshair cursor */
  add({
    name: 'Blueprint crosshair', desc: 'Full-length hairlines follow the cursor with a slight lag and show live X / Y coordinates.',
    build(s, P, api) {
      s.innerHTML = `<div class="eb-ch"><i class="v"></i><i class="h"></i><i class="pt"></i><span class="nx"></span><span class="ny"></span></div>`;
      const ch = s.querySelector('.eb-ch'), [v, h, pt, nx, ny] = [...ch.children], ptr = pointer(s);
      const pos = { x: 0, y: 0 };
      const L = loop(() => {
        ch.style.opacity = ptr.in ? 1 : 0;
        if (!ptr.in) return;
        const r = s.getBoundingClientRect(), pad = 48;
        const tx = Math.min(ptr.x, r.width - pad), ty = Math.min(ptr.y, r.height - pad);
        pos.x += (tx - pos.x) * 0.25; pos.y += (ty - pos.y) * 0.25;
        v.style.transform = `translateX(${pos.x}px)`; h.style.transform = `translateY(${pos.y}px)`;
        [pt, nx, ny].forEach((e) => (e.style.left = pos.x + 'px', e.style.top = pos.y + 'px'));
        nx.textContent = 'X: ' + Math.round(tx); ny.textContent = 'Y: ' + Math.round(ty);
      });
      return { start: L.start, stop() { L.stop(); ch.style.opacity = 0; } };
    },
  });

  /* EB-15 · Crosshair corner-reveal image */
  add({
    name: 'Corner-reveal image', desc: 'As you scroll, the image opens from its top-left corner and zooms out from 2× to 1×, with a crosshair riding the corner.',
    build(s) {
      const v = `<div class="eb-cr"><div class="img"><b></b></div><div class="eb-ch" style="opacity:1"><i class="v"></i><i class="h"></i><i class="pt"></i><span class="nx"></span><span class="ny"></span></div></div>`;
      return scroller(s, v, (p) => {
        const view = s.querySelector('.eb-view'), W = view.clientWidth, H = view.clientHeight, m = 16;
        const q = seg(p, 0.05, 0.85), x = m + (W - 2 * m) * q, y = m + (H - 2 * m) * q;
        s.querySelector('.img').style.clipPath = `inset(${m}px ${W - x}px ${H - y}px ${m}px)`;
        s.querySelector('.img b').style.transform = `scale(${2 - q})`;
        const ch = s.querySelector('.eb-ch'), [vv, hh, pt, nx, ny] = [...ch.children];
        vv.style.transform = `translateX(${x}px)`; hh.style.transform = `translateY(${y}px)`;
        [pt, nx, ny].forEach((e) => (e.style.left = x + 'px', e.style.top = y + 'px'));
        nx.textContent = 'X: ' + Math.round(x); ny.textContent = 'Y: ' + Math.round(y);
        nx.style.transform = q > 0.8 ? 'translate(-56px,-18px)' : ''; ny.style.transform = q > 0.8 ? 'translate(-56px,6px)' : '';
      });
    },
  });

  /* EB-17 · SVG wireframe draw + split */
  add({
    name: 'Wireframe draw and split', desc: 'A line drawing sketches itself as you scroll, then its three parts slide apart and a caption appears.',
    build(s) {
      const parts = [
        '<rect x="70" y="20" width="60" height="60"/><line x1="70" y1="40" x2="130" y2="40"/><line x1="100" y1="20" x2="100" y2="80"/>',
        '<polyline points="10,80 10,30 40,10 70,30 70,80 10,80"/><line x1="10" y1="55" x2="70" y2="55"/>',
        '<polyline points="130,80 130,30 160,10 190,30 190,80 130,80"/><line x1="160" y1="10" x2="160" y2="80"/>',
      ];
      const v = `<div class="eb-wf"><svg viewBox="0 0 200 90">${parts.map((g) => `<g>${g}</g>`).join('')}</svg><div class="cap">Standard floor plan · drawing 158.01</div></div>`;
      let lens = null;
      return scroller(s, v, (p) => {
        const shapes = [...s.querySelectorAll('.eb-wf rect, .eb-wf line, .eb-wf polyline')];
        if (!lens) lens = shapes.map((sh) => { const L = sh.getTotalLength(); sh.style.strokeDasharray = L; return L; });
        const d = seg(p, 0, 0.5);
        shapes.forEach((sh, i) => (sh.style.strokeDashoffset = lens[i] * (1 - d)));
        const sp = seg(p, 0.55, 0.85), e = 1 - Math.pow(1 - sp, 3);
        const gs = [...s.querySelectorAll('.eb-wf g')];
        gs[1].setAttribute('transform', `translate(${-22 * e} 0)`);
        gs[2].setAttribute('transform', `translate(${22 * e} 0)`);
        s.querySelector('.eb-wf .cap').style.opacity = p > 0.88 ? 1 : 0;
      });
    },
  });

  /* EB-18 · Sticky stacking cards */
  add({
    name: 'Sticky stacking cards', desc: 'Cards stick and stack as you scroll, each image wipes in with a colour bar, and clicking a title jumps to its place in the stack.',
    build(s) {
      const cards = [['01 · Panel', 'Lightweight multilayer sandwich panels.'], ['02 · Robot', 'Precision cutting and machining.'], ['03 · Frame', 'Galvanised steel structure.'], ['04 · System', 'One governable, scalable process.']];
      s.innerHTML = `<div class="eb-wrap"><div class="eb-stk">${cards.map(([t, d], i) => `<article class="eb-sc" style="top:${i * 36}px"><header>${t}<span>${icon('right', 14)}</span></header><div class="ph"><div class="im"></div></div><p>${d}</p></article>`).join('')}<div style="height:220px"></div></div></div><div class="eb-hint">Scroll inside</div>`;
      const wrap = s.querySelector('.eb-wrap'), els = [...s.querySelectorAll('.eb-sc')], hint = s.querySelector('.eb-hint');
      const check = () => {
        hint.style.opacity = wrap.scrollTop > 10 ? 0 : 1;
        const wr = wrap.getBoundingClientRect();
        els.forEach((el) => { if (!el.classList.contains('in') && el.getBoundingClientRect().top < wr.bottom - 60) el.classList.add('in'); });
      };
      wrap.addEventListener('scroll', check, { passive: true });
      els.forEach((el, i) => (el.querySelector('header').onclick = () => {
        const h = els[0].offsetHeight + 10 - 36;
        wrap.scrollTo({ top: i * h, behavior: 'smooth' });
      }));
      return { start: check, stop() { wrap.scrollTop = 0; els.forEach((e) => e.classList.remove('in')); } };
    },
  });

  /* EB-22 · Footer curtain reveal */
  add({
    name: 'Footer curtain reveal', desc: 'The page lifts away to reveal the footer underneath, whose giant wordmark rises into place as a dark overlay fades.',
    build(s) {
      // the footer sits behind the scrolling page; a transparent spacer at the end lets it show through
      s.innerHTML = `<div class="eb-fc" style="position:absolute;inset:0"><div class="eb-foot"><div class="links"><span>Approach</span><span>Projects</span><span>Contact</span></div><div class="big">Studio®</div><div class="over"></div></div><div class="eb-wrap"><div class="eb-fc-page">${['Approach', 'Solutions', 'Projects', 'Value', 'Contact'].map((t) => `<section><h5>${t}</h5>A short paragraph about this part of the page so there is something to scroll past.</section>`).join('')}</div><div class="eb-fc-spacer"></div></div></div><div class="eb-hint">Scroll to the end</div>`;
      const wrap = s.querySelector('.eb-wrap'), big = s.querySelector('.big'), over = s.querySelector('.over'), foot = s.querySelector('.eb-foot'), hint = s.querySelector('.eb-hint'), spacer = s.querySelector('.eb-fc-spacer');
      const run = () => {
        spacer.style.height = foot.offsetHeight + 'px';
        const max = wrap.scrollHeight - wrap.clientHeight, fh = foot.offsetHeight;
        const q = clamp(1 - (max - wrap.scrollTop) / fh, 0, 1);
        big.style.transform = `translateY(${(1 - q) * 50}%)`;
        over.style.opacity = 0.85 * (1 - q);
        hint.style.opacity = wrap.scrollTop > 10 ? 0 : 1;
      };
      wrap.addEventListener('scroll', run, { passive: true });
      new ResizeObserver(run).observe(wrap);
      requestAnimationFrame(run);
      return { stop() { wrap.scrollTop = 0; run(); } };
    },
  });

  /* EB-24 · Polygon point morph */
  add({
    name: 'Polygon point morph', desc: 'Scroll morphs a panel’s outline point by point into its final shape, then two side layers slide apart and the text fades in.',
    build(s) {
      const A = [[60, 20], [140, 20], [140, 80], [60, 80]], B = [[50, 30], [100, 10], [150, 30], [150, 75], [100, 95], [50, 75]];
      // equalise point counts by duplicating corners of A
      const A6 = [A[0], [100, 20], A[1], A[2], [100, 80], A[3]];
      const v = `<div class="eb-svg"><svg viewBox="0 0 200 110"><polygon class="l1" points="${A6.join(' ')}" fill="var(--card)" stroke="var(--ink)" stroke-width="1"/><polygon class="mid" points="${A6.join(' ')}" fill="var(--card)" stroke="var(--ink)" stroke-width="1"/><polygon class="l3" points="${A6.join(' ')}" fill="var(--card)" stroke="var(--ink)" stroke-width="1"/><line class="sp" x1="100" y1="10" x2="100" y2="95" stroke="var(--ink)" stroke-width=".6" stroke-dasharray="2 3"/></svg></div><p class="eb-desc">Sandwich panel · three layers, one envelope.</p>`;
      return scroller(s, v, (p) => {
        const m = seg(p, 0, 0.45), e = m < 0.5 ? 2 * m * m : 1 - Math.pow(-2 * m + 2, 2) / 2;
        const pts = A6.map(([x, y], i) => `${lerp(x, B[i][0], e).toFixed(1)},${lerp(y, B[i][1], e).toFixed(1)}`).join(' ');
        s.querySelectorAll('polygon').forEach((pg) => pg.setAttribute('points', pts));
        const sp = seg(p, 0.5, 0.8);
        s.querySelector('.l1').setAttribute('transform', `translate(${-30 * sp} 0)`);
        s.querySelector('.l3').setAttribute('transform', `translate(${30 * sp} 0)`);
        s.querySelector('.l1').style.opacity = s.querySelector('.l3').style.opacity = 0.4 + 0.6 * sp;
        s.querySelector('.eb-desc').style.opacity = seg(p, 0.8, 0.95);
      });
    },
  });

  /* EB-25 · Saw path */
  add({
    name: 'Saw path', desc: 'Scrolling drives a circular saw down onto a panel. It starts spinning on contact and cuts a line as it travels across.',
    build(s) {
      const teeth = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, b = a + 0.2; return `${24 + Math.cos(a) * 22},${24 + Math.sin(a) * 22} ${24 + Math.cos(b) * 17},${24 + Math.sin(b) * 17}`; }).join(' ');
      const v = `<div class="eb-panel"></div><div class="eb-cut"></div><div class="eb-saw"><svg viewBox="0 0 48 48"><polygon points="${teeth}" fill="var(--ink)"/><circle cx="24" cy="24" r="5" fill="var(--paper)"/></svg></div>`;
      return scroller(s, v, (p) => {
        const view = s.querySelector('.eb-view'), W = view.clientWidth, H = view.clientHeight;
        const panelY = H * 0.62, saw = s.querySelector('.eb-saw'), cut = s.querySelector('.eb-cut');
        s.querySelector('.eb-panel').style.top = panelY + 'px';
        cut.style.top = panelY + 6 + 'px';
        const down = seg(p, 0, 0.3), across = seg(p, 0.35, 0.95);
        const x = W * 0.08 - 23 + (W * 0.84) * across, y = lerp(-50, panelY - 16, down);
        saw.style.transform = `translate(${x}px,${y}px)`;
        saw.classList.toggle('spin', down >= 1);
        cut.style.width = W * 0.84 * across + 'px';
      });
    },
  });

  /* EB-26 · Exploded-layer assembly */
  add({
    name: 'Exploded layer assembly', desc: 'The layers of a wall build-up drop into place one group at a time as you scroll.',
    build(s) {
      const layers = ['Left frame', 'Right frame', 'External skin', 'Internal lining', 'Closing board'];
      const v = `<div class="eb-svg"><svg viewBox="0 0 200 120">${layers.map((l, i) => `<g class="ly"><rect x="${40 + i * 6}" y="${20 + i * 12}" width="${110 - i * 2}" height="14" fill="var(--card)" stroke="var(--ink)" stroke-width="1"/><text class="lbl" x="${154 - i * 2 + i * 6}" y="${30 + i * 12}">${l}</text></g>`).join('')}</svg></div>`;
      return scroller(s, v, (p) => {
        s.querySelectorAll('.ly').forEach((g, i) => {
          const q = seg(p, i * 0.17, i * 0.17 + 0.2), e = 1 - Math.pow(1 - q, 3);
          g.setAttribute('transform', `translate(0 ${-26 * (1 - e)})`);
          g.style.opacity = e;
        });
      }, 5);
    },
  });

  /* EB-27 · Slide-up dialog */
  add({
    name: 'Slide-up dialog', desc: 'A dialog rises from below as it fades in over a dimmed backdrop. Click outside or the close button to dismiss.',
    build(s) {
      s.innerHTML = `<a class="eb-rb" style="min-width:auto"><span class="tx"><span>Watch the film</span><span>Watch the film</span></span><span class="ic"><i>${icon('play', 12)}</i><i>${icon('play', 12)}</i></span></a><div class="eb-dlg-back"></div><div class="eb-dlg" role="dialog"><button class="x" aria-label="Close">${icon('close', 18)}</button><span class="pl">${icon('play', 18)}</span></div>`;
      const back = s.querySelector('.eb-dlg-back'), dlg = s.querySelector('.eb-dlg');
      const close = () => { back.classList.remove('open'); dlg.classList.remove('open'); };
      s.querySelector('.eb-rb').onclick = () => { back.classList.add('open'); dlg.classList.remove('open'); void dlg.offsetWidth; dlg.classList.add('open'); };
      back.onclick = close; s.querySelector('.x').onclick = close;
      return { stop: close };
    },
  });

  /* EB-28 · Multi-step form */
  add({
    name: 'Multi-step form', desc: 'Each step checks its field before moving on, slides the next step in and moves the progress bar.',
    build(s) {
      s.innerHTML = `<form class="eb-ms" novalidate><div class="bar"><i></i></div><div class="steps">
        <div class="st" data-s="1"><small>STEP 1 OF 3</small><label>Your name</label><input name="n" required placeholder="Jane Doe"><div class="row"><span></span><button type="button" class="b nx">Next</button></div></div>
        <div class="st" data-s="2"><small>STEP 2 OF 3</small><label>Email</label><input name="e" type="email" required placeholder="jane@studio.com"><div class="row"><button type="button" class="b pv">Back</button><button type="button" class="b nx">Next</button></div></div>
        <div class="st" data-s="3"><small>STEP 3 OF 3</small><label>Project type</label><select><option>Housing</option><option>Care home</option><option>Offices</option></select><div class="row"><button type="button" class="b pv">Back</button><button type="button" class="b sb">Send</button></div></div>
        <div class="st" data-s="4"><div class="done">Thanks, we will be in touch.</div></div></div></form>`;
      const steps = [...s.querySelectorAll('.st')], bar = s.querySelector('.bar i');
      let cur = 1;
      const go = (n) => { cur = n; steps.forEach((st) => st.classList.toggle('on', +st.dataset.s === n)); bar.style.width = (Math.min(n, 3) / 3) * 100 + '%'; };
      const valid = () => {
        const inp = steps[cur - 1].querySelector('input'); if (!inp) return true;
        const ok = inp.value.trim() && (inp.type !== 'email' || /\S+@\S+\.\S+/.test(inp.value));
        inp.classList.remove('err'); void inp.offsetWidth; if (!ok) inp.classList.add('err');
        return !!ok;
      };
      s.querySelectorAll('.nx').forEach((b) => (b.onclick = () => valid() && go(cur + 1)));
      s.querySelectorAll('.pv').forEach((b) => (b.onclick = () => go(cur - 1)));
      s.querySelector('.sb').onclick = () => go(4);
      s.querySelector('form').onsubmit = (e) => e.preventDefault();
      go(1);
      return { stop() { s.querySelectorAll('input').forEach((i) => { i.value = ''; i.classList.remove('err'); }); go(1); } };
    },
  });
})();
