/* Forms & inputs · 6 interactions */
(function () {
  const { add, css, icon } = IX;

  css(`
  .f-field{position:relative;width:76%}
  .f-in{width:100%;border:none;border-bottom:1px solid var(--ink);background:transparent;padding:22px 2px 8px;font:inherit;font-size:17px;color:var(--ink);outline:none}
  .f-lbl{position:absolute;left:2px;top:22px;font-size:17px;color:var(--muted);pointer-events:none;transform-origin:left top;transition:transform .3s cubic-bezier(.2,.8,.2,1),color .3s}
  .f-in:focus+.f-lbl,.f-in:not(:placeholder-shown)+.f-lbl{transform:translateY(-20px) scale(.72);color:var(--ink)}
  .f-line{position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--ink);transform:scaleX(0);transition:transform .35s cubic-bezier(.2,.8,.2,1)}
  .f-in:focus~.f-line{transform:scaleX(1)}
  .f-cnt{display:flex;justify-content:space-between;font-size:13px;color:var(--muted);margin-top:8px}
  .f-cnt b{font-weight:400;transition:color .2s}
  .f-cnt b.warn{color:#b26b00}.f-cnt b.full{color:var(--accent)}
  .f-bar{height:2px;background:var(--line);margin-top:6px}.f-bar i{display:block;height:100%;background:var(--ink);width:0;transition:width .2s,background .2s}
  .f-val{display:flex;flex-direction:column;gap:12px;width:76%}
  .f-val .f-in{padding-top:10px;border:1px solid var(--line);padding:10px 12px;transition:border-color .25s}
  .f-val .f-in.bad{border-color:var(--accent);animation:fShake .4s}
  .f-val .f-in.good{border-color:#1f7a4d}
  @keyframes fShake{0%,100%{transform:none}20%{transform:translateX(-7px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(2px)}}
  .f-msg{font-size:13px;height:16px}
  .f-row{display:flex;gap:8px}
  .f-b{border:1px solid var(--ink);padding:6px 14px;font-size:13px;background:var(--card)}
  .f-b:hover{background:var(--ink);color:var(--paper)}
  .f-pw{display:flex;align-items:center;border:1px solid var(--line);width:76%;background:var(--card)}
  .f-pw .f-in{border:none;padding:10px 12px}
  .f-eye{width:44px;height:42px;display:grid;place-items:center;position:relative}
  .f-eye span{position:absolute;transition:opacity .25s,transform .3s cubic-bezier(.5,1.6,.4,1)}
  .f-eye .o2{opacity:0;transform:scale(.6)}
  .f-eye.on .o1{opacity:0;transform:scale(.6)}.f-eye.on .o2{opacity:1;transform:none}
  .f-list{width:78%;display:flex;flex-direction:column;gap:6px}
  .f-item{display:flex;justify-content:space-between;align-items:center;padding:9px 12px;border:1px solid var(--line);background:var(--card);font-size:14px;transition:opacity .3s,transform .3s}
  .f-item.gone{opacity:0;transform:translateX(30px)}
  .f-toast{position:absolute;left:50%;bottom:16px;display:flex;align-items:center;gap:16px;background:var(--ink);color:var(--paper);padding:9px 14px;font-size:13px;transform:translate(-50%,140%);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
  .f-toast.show{transform:translate(-50%,0)}
  .f-toast button{color:var(--paper);text-decoration:underline;text-underline-offset:3px}
  .f-toast i{position:absolute;left:0;bottom:0;height:2px;background:var(--accent);width:100%;transform-origin:left}
  .f-snap{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;width:84%;padding:14px calc(50% - 29px);scrollbar-width:none;mask-image:linear-gradient(90deg,transparent,#000 25%,#000 75%,transparent)}
  .f-snap::-webkit-scrollbar{display:none}
  .f-snap div{flex:none;scroll-snap-align:center;width:58px;height:58px;border:1px solid var(--line);display:grid;place-items:center;font-size:15px;background:var(--card);transition:background .25s,color .25s,transform .25s}
  .f-snap div.on{background:var(--ink);color:var(--paper);transform:scale(1.12)}
  `);

  add({
    name: 'Floating label', desc: 'The label lifts above the input and shrinks on focus.',
    build(s) {
      s.innerHTML = `<label class="f-field"><input class="f-in" placeholder=" "><span class="f-lbl">Your full name</span><span class="f-line"></span></label>`;
      return { stop() { s.querySelector('input').value = ''; } };
    },
  });

  add({
    name: 'Character counter', desc: 'The count warns you as you near the limit and turns red when full.',
    build(s) {
      s.innerHTML = `<div class="f-field"><input class="f-in" placeholder="Write a short bio" maxlength="80" style="padding-top:10px"><div class="f-bar"><i></i></div><div class="f-cnt"><span>Bio</span><b>0 / 80</b></div></div>`;
      const inp = s.querySelector('input'), b = s.querySelector('b'), bar = s.querySelector('.f-bar i');
      inp.oninput = () => {
        const n = inp.value.length;
        b.textContent = `${n} / 80`;
        b.className = n >= 80 ? 'full' : n >= 60 ? 'warn' : '';
        bar.style.width = (n / 80) * 100 + '%';
        bar.style.background = n >= 80 ? 'var(--accent)' : n >= 60 ? '#b26b00' : 'var(--ink)';
      };
      return { stop() { inp.value = ''; inp.oninput(); } };
    },
  });

  add({
    name: 'Inline validation', desc: 'The input shakes red on error and turns green on success.',
    build(s) {
      s.innerHTML = `<div class="f-val"><input class="f-in" placeholder="name@company.com"><div class="f-msg"></div><div class="f-row"><button class="f-b bad">Check · fail</button><button class="f-b good">Check · pass</button></div></div>`;
      const inp = s.querySelector('input'), msg = s.querySelector('.f-msg');
      const run = (ok) => {
        inp.classList.remove('bad', 'good'); void inp.offsetWidth;
        inp.classList.add(ok ? 'good' : 'bad');
        msg.textContent = ok ? 'Looks good.' : 'Enter a valid email address.';
        msg.style.color = ok ? '#1f7a4d' : 'var(--accent)';
      };
      s.querySelector('.bad').onclick = () => run(false);
      s.querySelector('.good').onclick = () => run(true);
      inp.onkeydown = (e) => { if (e.key === 'Enter') run(/\S+@\S+\.\S+/.test(inp.value)); };
      return { stop() { inp.classList.remove('bad', 'good'); msg.textContent = ''; } };
    },
  });

  add({
    name: 'Password reveal', desc: 'The eye icon crossfades and the field type toggles cleanly.',
    build(s) {
      s.innerHTML = `<div class="f-pw"><input class="f-in" type="password" value="motion-2026"><button class="f-eye" aria-label="Show password"><span class="o1">${icon('eye')}</span><span class="o2">${icon('eyeoff')}</span></button></div>`;
      const inp = s.querySelector('input'), b = s.querySelector('.f-eye');
      b.onclick = () => { const on = inp.type === 'password'; inp.type = on ? 'text' : 'password'; b.classList.toggle('on', on); };
      return { stop() { inp.type = 'password'; b.classList.remove('on'); } };
    },
  });

  add({
    name: 'Undo toast', desc: 'A toast slides in after a destructive action and dismisses itself.',
    build(s) {
      const names = ['Quarterly report', 'Brand guidelines', 'Launch checklist'];
      s.innerHTML = `<div class="f-list">${names.map((n) => `<div class="f-item"><span>${n}</span><button aria-label="Delete">${icon('trash', 16)}</button></div>`).join('')}</div><div class="f-toast"><span>Item deleted</span><button>Undo</button><i></i></div>`;
      const toast = s.querySelector('.f-toast'), bar = toast.querySelector('i');
      let last = null, t = 0, anim = null;
      const hide = () => { toast.classList.remove('show'); if (last) last.remove(); last = null; };
      s.querySelectorAll('.f-item button').forEach((b) => (b.onclick = () => {
        if (last) last.remove();
        last = b.closest('.f-item');
        last.classList.add('gone');
        setTimeout(() => last && (last.style.display = 'none'), 300);
        toast.classList.add('show');
        anim && anim.cancel();
        anim = bar.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: 4000 });
        clearTimeout(t); t = setTimeout(hide, 4000);
      }));
      toast.querySelector('button').onclick = () => {
        if (last) { last.style.display = ''; requestAnimationFrame(() => last.classList.remove('gone')); last = null; }
        toast.classList.remove('show'); clearTimeout(t);
      };
      return { stop() { clearTimeout(t); toast.classList.remove('show'); s.querySelectorAll('.f-item').forEach((i) => { i.style.display = ''; i.classList.remove('gone'); }); last = null; } };
    },
  });

  add({
    name: 'Scroll snap picker', desc: 'Items lock into position with a native-app feel.',
    build(s) {
      s.innerHTML = `<div class="f-snap">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => `<div>${d}</div>`).join('')}</div>`;
      const sc = s.querySelector('.f-snap'), items = [...sc.children];
      const mark = () => {
        const r = sc.getBoundingClientRect(), mid = r.left + r.width / 2;
        let best = null, bd = 1e9;
        items.forEach((it) => { const b = it.getBoundingClientRect(), d = Math.abs(b.left + b.width / 2 - mid); if (d < bd) { bd = d; best = it; } });
        items.forEach((it) => it.classList.toggle('on', it === best));
      };
      sc.addEventListener('scroll', mark, { passive: true });
      items.forEach((it) => (it.onclick = () => sc.scrollTo({ left: it.offsetLeft - sc.clientWidth / 2 + it.offsetWidth / 2, behavior: 'smooth' })));
      requestAnimationFrame(mark);
    },
  });
})();
