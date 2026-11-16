/* Cards · 18 interactions */
(function () {
  const { add, css, icon } = IX;

  css(`
  .k-card{width:62%;aspect-ratio:4/3;background:var(--card);border:1px solid var(--line);display:grid;place-items:center;color:var(--ink);transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s;}
  .k-lift:hover{transform:translateY(-8px);box-shadow:0 18px 30px -18px rgba(20,20,20,.45);}
  .k-scale{overflow:hidden}
  .k-scale .k-img{width:100%;height:100%;display:grid;place-items:center;background:repeating-linear-gradient(135deg,var(--paper2) 0 8px,var(--card) 8px 16px);transition:transform .6s cubic-bezier(.2,.8,.2,1)}
  .k-scale:hover .k-img{transform:scale(1.08)}
  .k-glow{animation:kGlow 2s ease-in-out infinite}
  @keyframes kGlow{0%,100%{box-shadow:0 0 0 0 rgba(20,20,20,.0),0 0 0 1px var(--line)}50%{box-shadow:0 0 0 6px rgba(20,20,20,.06),0 0 0 1px var(--ink)}}
  .k-float{animation:kFloat 2.4s ease-in-out infinite}
  @keyframes kFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  .k-shadow{width:40%;height:8px;border-radius:50%;background:rgba(20,20,20,.12);margin-top:14px;animation:kShadow 2.4s ease-in-out infinite}
  @keyframes kShadow{0%,100%{transform:scaleX(1);opacity:1}50%{transform:scaleX(.7);opacity:.5}}
  .k-tilt:hover{animation:kTilt .6s ease-in-out}
  @keyframes kTilt{0%,100%{transform:rotate(0)}20%{transform:rotate(-5deg)}40%{transform:rotate(4deg)}60%{transform:rotate(-3deg)}80%{transform:rotate(2deg)}}
  .k-pulse{position:relative;width:18px;height:18px;border-radius:50%;background:var(--ink)}
  .k-pulse::before,.k-pulse::after{content:"";position:absolute;inset:0;border-radius:50%;border:1px solid var(--ink);animation:kPulse 2s cubic-bezier(.2,.6,.3,1) infinite}
  .k-pulse::after{animation-delay:1s}
  @keyframes kPulse{0%{transform:scale(1);opacity:.9}100%{transform:scale(5);opacity:0}}
  .k-live{display:flex;align-items:center;gap:14px;font-size:15px}
  .k-slide{position:relative;overflow:hidden}
  .k-slide .k-bar{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:center;gap:4px;padding:10px;background:var(--ink);color:var(--paper);transform:translateY(100%);transition:transform .4s cubic-bezier(.2,.8,.2,1)}
  .k-slide:hover .k-bar{transform:none}
  .k-bar button{color:inherit;width:34px;height:30px;display:grid;place-items:center}
  .k-bar button:hover{background:rgba(255,255,255,.12)}
  .k-exp{width:72%;background:var(--card);border:1px solid var(--line)}
  .k-exp-h{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;width:100%;text-align:left;font-size:15px}
  .k-exp-h .ix-ic{transition:transform .4s cubic-bezier(.2,.8,.2,1)}
  .k-exp.open .k-exp-h .ix-ic{transform:rotate(180deg)}
  .k-exp-b{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s cubic-bezier(.2,.8,.2,1)}
  .k-exp.open .k-exp-b{grid-template-rows:1fr}
  .k-exp-b>div{overflow:hidden}
  .k-row{display:flex;justify-content:space-between;padding:9px 14px;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}
  .k-row b{font-weight:400;color:var(--ink)}
  .k-acc{position:relative;justify-items:start;padding-left:22px;overflow:hidden}
  .k-acc::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--ink);transform:translateX(-100%);transition:transform .35s cubic-bezier(.2,.8,.2,1)}
  .k-acc>div{transition:transform .35s cubic-bezier(.2,.8,.2,1)}
  .k-acc:hover::before{transform:none}.k-acc:hover>div{transform:translateX(8px)}
  .k-acc small{display:block;color:var(--muted);font-size:12px;margin-top:4px}
  .k-checks{display:flex;gap:16px}
  .k-chk{width:44px;height:44px;border:1px solid var(--ink);display:grid;place-items:center;background:var(--card);transition:background .25s}
  .k-chk path{stroke-dasharray:24;stroke-dashoffset:24;transition:stroke-dashoffset .45s cubic-bezier(.65,0,.35,1)}
  .k-chk.done{background:var(--ink);color:var(--paper)}
  .k-chk.done path{stroke-dashoffset:0}
  .k-ring{display:flex;align-items:center;gap:18px}
  .k-ring svg circle{transition:stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)}
  .k-ring-l{position:absolute;inset:0;display:grid;place-items:center;font-size:15px}
  .k-btns{display:flex;flex-direction:column;gap:6px}
  .k-btn{border:1px solid var(--ink);padding:6px 12px;font-size:13px;background:var(--card)}
  .k-btn:hover{background:var(--ink);color:var(--paper)}
  .k-tgl-row{display:flex;align-items:center;justify-content:space-between;width:150px;font-size:14px;padding:6px 0}
  .k-tgl{width:44px;height:24px;border:1px solid var(--ink);border-radius:12px;position:relative;background:var(--card);transition:background .3s}
  .k-tgl i{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:8px;background:var(--ink);transition:left .35s cubic-bezier(.5,1.6,.4,1),width .18s ease,background .3s}
  .k-tgl.on{background:var(--ink)}
  .k-tgl.on i{left:23px;background:var(--paper)}
  .k-tgl.moving i{width:24px}
  .k-tgl.on.moving i{left:15px}
  .k-copy{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--ink);padding:8px 14px;font-size:14px;background:var(--card);transition:background .25s,color .25s}
  .k-copy.done{background:var(--ink);color:var(--paper)}
  .k-copy .ix-ic{transition:transform .3s cubic-bezier(.5,1.6,.4,1)}
  .k-copy.done .ix-ic{transform:scale(1.15)}
  .k-prog{position:relative;width:170px;height:42px;border:1px solid var(--ink);overflow:hidden;background:var(--card);font-size:14px}
  .k-prog i{position:absolute;inset:0;background:var(--ink);transform-origin:left;transform:scaleX(0)}
  .k-prog span{position:relative;display:flex;align-items:center;justify-content:center;gap:8px;height:100%;mix-blend-mode:difference;color:#fff}
  .k-stars{display:flex;gap:4px}
  .k-stars button{color:var(--ink);transition:transform .2s cubic-bezier(.5,1.6,.4,1)}
  .k-stars button.lit svg{fill:var(--ink)}
  .k-stars button:hover{transform:scale(1.2)}
  .k-star-l{text-align:center;font-size:13px;color:var(--muted);margin-top:10px;height:16px}
  .k-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;width:80%}
  .k-chip{border:1px solid var(--line);padding:6px 14px;font-size:14px;border-radius:20px;background:var(--card);transition:background .2s,color .2s,border-color .2s}
  .k-chip.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}
  .k-chip.pop{animation:kPop .35s cubic-bezier(.5,1.6,.4,1)}
  @keyframes kPop{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}
  .k-count{display:flex;align-items:center;gap:20px}
  .k-count button{width:38px;height:38px;border:1px solid var(--ink);display:grid;place-items:center;background:var(--card)}
  .k-count button:hover{background:var(--ink);color:var(--paper)}
  .k-num{font-size:42px;width:60px;text-align:center;transition:transform .18s ease,opacity .18s ease}
  .k-num.out{transform:translateY(-30%) scale(.6);opacity:0}
  .k-num.in{transform:translateY(30%) scale(.6);opacity:0;transition:none}
  .k-faq{width:82%;border-top:1px solid var(--line)}
  .k-faq-i{border-bottom:1px solid var(--line)}
  .k-faq-q{width:100%;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:11px 2px;font-size:14px;text-align:left}
  .k-faq-q .ix-ic{transition:transform .4s cubic-bezier(.2,.8,.2,1);flex:none}
  .k-faq-i.open .ix-ic{transform:rotate(180deg)}
  .k-faq-a{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s cubic-bezier(.2,.8,.2,1)}
  .k-faq-i.open .k-faq-a{grid-template-rows:1fr}
  .k-faq-a p{overflow:hidden;font-size:13px;color:var(--muted);line-height:1.45}
  .k-faq-i.open .k-faq-a p{padding-bottom:12px}
  `);

  const simple = (name, desc, html) => add({ name, desc, build(s) { s.innerHTML = html; } });

  simple('Lift on hover', 'Card rises with a depth shadow on hover.', `<div class="k-card k-lift">${icon('card', 28)}</div>`);
  simple('Scale up', 'A subtle zoom tells you the card is interactive.', `<div class="k-card k-scale"><div class="k-img">${icon('image', 28)}</div></div>`);
  simple('Border glow', 'A pulsing outline ring marks a featured card.', `<div class="k-card k-glow">${icon('spark', 28)}</div>`);
  simple('Floating bob', 'A gentle vertical loop for empty states.', `<div style="display:grid;justify-items:center;width:100%"><div class="k-card k-float" style="width:50%">${icon('rocket', 28)}</div><div class="k-shadow"></div></div>`);
  simple('Tilt wobble', 'A playful rotation for gamified UI.', `<div class="k-card k-tilt">${icon('cube', 28)}</div>`);
  simple('Pulse ring', 'Expanding rings signal live status.', `<div class="k-live"><div class="k-pulse"></div>Live</div>`);

  simple('Slide-in action bar', 'Actions slide up from the bottom on hover.',
    `<div class="k-card k-slide"><span style="color:var(--muted);font-size:14px">Hover card</span><div class="k-bar"><button aria-label="Like">${icon('heart')}</button><button aria-label="Share">${icon('share')}</button><button aria-label="Save">${icon('bookmark')}</button></div></div>`);

  add({
    name: 'Expand on click', desc: 'Click to reveal extra detail rows.',
    build(s) {
      s.innerHTML = `<div class="k-exp"><button class="k-exp-h">Project details ${icon('chev')}</button><div class="k-exp-b"><div><div class="k-row">Last updated <b>2 hours ago</b></div><div class="k-row">Status <b>Published</b></div><div class="k-row">Owner <b>Design</b></div></div></div></div>`;
      const box = s.querySelector('.k-exp');
      s.querySelector('.k-exp-h').onclick = () => box.classList.toggle('open');
      return { stop() { box.classList.remove('open'); } };
    },
  });

  simple('Left accent bar', 'A bar slides in from the left and the content nudges right.',
    `<div class="k-card k-acc"><div>Weekly report<small>Updated today</small></div></div>`);

  add({
    name: 'Checkmark draw', desc: 'The SVG check path draws itself on completion.',
    build(s) {
      s.innerHTML = `<div class="k-checks">${[0, 1, 2].map(() => `<button class="k-chk" aria-label="Toggle">${icon('check', 26)}</button>`).join('')}</div>`;
      s.querySelectorAll('.k-chk').forEach((b) => (b.onclick = () => b.classList.toggle('done')));
      return { stop() { s.querySelectorAll('.k-chk').forEach((b) => b.classList.remove('done')); } };
    },
  });

  add({
    name: 'Micro progress ring', desc: 'The stroke draws as completion increases.',
    build(s) {
      const C = 2 * Math.PI * 26;
      s.innerHTML = `<div class="k-ring"><div style="position:relative;width:72px;height:72px"><svg width="72" height="72" viewBox="0 0 72 72"><circle cx="36" cy="36" r="26" fill="none" stroke="var(--line)" stroke-width="3"/><circle class="f" cx="36" cy="36" r="26" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" transform="rotate(-90 36 36)"/></svg><div class="k-ring-l">0%</div></div><div class="k-btns"><button class="k-btn a">+10%</button><button class="k-btn r">Reset</button></div></div>`;
      let v = 0;
      const f = s.querySelector('.f'), l = s.querySelector('.k-ring-l');
      const set = () => { f.style.strokeDashoffset = C - (C * v) / 100; l.textContent = v + '%'; };
      s.querySelector('.a').onclick = () => { v = Math.min(100, v + 10); set(); };
      s.querySelector('.r').onclick = () => { v = 0; set(); };
      return { stop() { v = 0; set(); } };
    },
  });

  add({
    name: 'Toggle morph', desc: 'The knob stretches like rubber while it slides.',
    build(s) {
      s.innerHTML = `<div>${['Dark mode', 'Notifications'].map((t, i) => `<div class="k-tgl-row">${t}<button class="k-tgl${i ? ' on' : ''}" aria-label="${t}"><i></i></button></div>`).join('')}</div>`;
      s.querySelectorAll('.k-tgl').forEach((b) => (b.onclick = () => {
        b.classList.add('moving');
        b.classList.toggle('on');
        setTimeout(() => b.classList.remove('moving'), 180);
      }));
    },
  });

  add({
    name: 'Copy confirm', desc: 'The chip fills and swaps its icon when you copy.',
    build(s) {
      s.innerHTML = `<button class="k-copy">${icon('copy', 16)}<span>Copy token</span></button>`;
      const b = s.querySelector('.k-copy');
      let t;
      b.onclick = () => {
        b.classList.add('done');
        b.innerHTML = `${icon('check', 16)}<span>Copied</span>`;
        clearTimeout(t);
        t = setTimeout(() => { b.classList.remove('done'); b.innerHTML = `${icon('copy', 16)}<span>Copy token</span>`; }, 1600);
      };
    },
  });

  add({
    name: 'Progress button', desc: 'The button becomes its own progress bar.',
    build(s) {
      s.innerHTML = `<button class="k-prog"><i></i><span>${icon('upload', 16)}<b style="font-weight:400">Upload file</b></span></button>`;
      const b = s.querySelector('.k-prog'), bar = b.querySelector('i'), lbl = b.querySelector('b');
      let raf = 0, busy = false;
      const reset = () => { cancelAnimationFrame(raf); busy = false; bar.style.transform = 'scaleX(0)'; lbl.textContent = 'Upload file'; };
      b.onclick = () => {
        if (busy) return;
        busy = true;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / 2200);
          const e = p < 1 ? p + Math.sin(p * 18) * 0.012 : 1;
          bar.style.transform = `scaleX(${e})`;
          lbl.textContent = p < 1 ? Math.round(p * 100) + '%' : 'Done';
          if (p < 1) raf = requestAnimationFrame(tick);
          else setTimeout(reset, 1400);
        };
        raf = requestAnimationFrame(tick);
      };
      return { stop: reset };
    },
  });

  add({
    name: 'Star rating', desc: 'Stars fill one by one and the label reads your choice.',
    build(s) {
      const words = ['Tap to rate', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
      s.innerHTML = `<div><div class="k-stars">${[1, 2, 3, 4, 5].map((i) => `<button data-v="${i}" aria-label="${i} stars">${icon('star', 30)}</button>`).join('')}</div><div class="k-star-l">${words[0]}</div></div>`;
      let sel = 0;
      const btns = [...s.querySelectorAll('.k-stars button')], l = s.querySelector('.k-star-l');
      const paint = (v) => btns.forEach((b, i) => b.classList.toggle('lit', i < v));
      btns.forEach((b) => {
        b.onmouseenter = () => { paint(+b.dataset.v); l.textContent = words[+b.dataset.v]; };
        b.onclick = () => { sel = +b.dataset.v; };
      });
      s.querySelector('.k-stars').onmouseleave = () => { paint(sel); l.textContent = words[sel]; };
      return { stop() { sel = 0; paint(0); l.textContent = words[0]; } };
    },
  });

  add({
    name: 'Tag pop chips', desc: 'Chips pop and change state when you click them.',
    build(s) {
      s.innerHTML = `<div class="k-chips">${['All', 'Design', 'Code', 'Motion', 'Research'].map((t, i) => `<button class="k-chip${i ? '' : ' on'}">${t}</button>`).join('')}</div>`;
      const cs = [...s.querySelectorAll('.k-chip')];
      cs.forEach((c) => (c.onclick = () => {
        cs.forEach((x) => x.classList.remove('on'));
        c.classList.add('on');
        c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
      }));
    },
  });

  add({
    name: 'Number morph counter', desc: 'The value scales out and back in on every change.',
    build(s) {
      s.innerHTML = `<div class="k-count"><button class="m" aria-label="Decrease">${icon('minus')}</button><div class="k-num">5</div><button class="p" aria-label="Increase">${icon('plus')}</button></div>`;
      let v = 5;
      const n = s.querySelector('.k-num');
      const go = (d) => {
        const nv = Math.max(0, Math.min(20, v + d));
        if (nv === v) return;
        v = nv;
        n.classList.add('out');
        setTimeout(() => {
          n.textContent = v;
          n.classList.remove('out'); n.classList.add('in');
          void n.offsetWidth;
          n.classList.remove('in');
        }, 160);
      };
      s.querySelector('.m').onclick = () => go(-1);
      s.querySelector('.p').onclick = () => go(1);
    },
  });

  add({
    name: 'Smooth accordion', desc: 'Content slides open and the chevron turns 180°.',
    build(s) {
      const qa = [
        ['What is a micro interaction?', 'A purposeful animation that responds to a user action and shows the system state clearly.'],
        ['How many are enough?', 'As few as needed. Each one must earn its place by reducing confusion or confirming intent.'],
      ];
      s.innerHTML = `<div class="k-faq">${qa.map(([q, a]) => `<div class="k-faq-i"><button class="k-faq-q">${q}${icon('chev', 16)}</button><div class="k-faq-a"><p>${a}</p></div></div>`).join('')}</div>`;
      const items = [...s.querySelectorAll('.k-faq-i')];
      items.forEach((it) => (it.querySelector('button').onclick = () => {
        const open = it.classList.contains('open');
        items.forEach((x) => x.classList.remove('open'));
        if (!open) it.classList.add('open');
      }));
      return { stop() { items.forEach((x) => x.classList.remove('open')); } };
    },
  });
})();
