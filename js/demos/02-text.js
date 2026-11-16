/* Text · 17 interactions */
(function () {
  const { add, css } = IX;

  css(`
  .t-w{font-size:26px;line-height:1.2;text-align:center;padding:0 18px;color:var(--ink);cursor:default}
  .t-grad{background:linear-gradient(90deg,var(--ink) 0 50%,var(--accent) 75%,var(--ink) 100%);background-size:220% 100%;background-position:0 0;-webkit-background-clip:text;background-clip:text;color:transparent;transition:background-position .8s cubic-bezier(.2,.8,.2,1)}
  .t-grad:hover{background-position:100% 0}
  .t-hl{background:linear-gradient(var(--hl),var(--hl)) no-repeat 0 85%/0% 40%;transition:background-size .5s cubic-bezier(.2,.8,.2,1);padding:0 2px}
  .t-hl:hover{background-size:100% 40%}
  .t-glow{transition:color .3s,text-shadow .3s}
  .t-glow:hover{color:var(--accent);text-shadow:0 0 14px rgba(232,70,43,.45)}
  .t-ghost{position:relative;display:inline-block}
  .t-ghost::after{content:attr(data-t);position:absolute;inset:0;color:var(--accent);clip-path:inset(0 100% 0 0);transition:clip-path .6s cubic-bezier(.65,0,.35,1)}
  .t-ghost:hover::after{clip-path:inset(0 0 0 0)}
  .t-box{position:relative;display:inline-block;padding:2px 8px;transition:color .4s}
  .t-box::before{content:"";position:absolute;inset:0;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.65,0,.35,1);z-index:-1}
  .t-box:hover{color:var(--paper)}.t-box:hover::before{transform:scaleX(1)}
  .t-strike{position:relative;display:inline-block;transition:color .3s}
  .t-strike::after{content:"";position:absolute;left:-2px;right:-2px;top:55%;height:2px;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.65,0,.35,1)}
  .t-strike:hover{color:var(--muted)}.t-strike:hover::after{transform:scaleX(1)}
  .t-weight{transition:letter-spacing .4s,text-shadow .4s}
  .t-weight:hover{letter-spacing:-.02em;text-shadow:.5px 0 0 currentColor,-.5px 0 0 currentColor,0 .4px 0 currentColor}
  .t-lift{display:inline-block;transition:transform .45s cubic-bezier(.2,.8,.2,1),text-shadow .45s,letter-spacing .45s}
  .t-lift:hover{transform:translateY(-6px);letter-spacing:.04em;text-shadow:0 12px 14px rgba(20,20,20,.25)}
  .t-blur{filter:blur(4px);transition:filter .35s ease}
  .t-blur:hover{filter:none}
  .t-stag span,.t-rot span{display:inline-block;transition:transform .4s cubic-bezier(.5,1.6,.4,1),color .3s}
  .t-stag:hover span{transform:translateY(-8px);color:var(--accent)}
  .t-rot:hover span:nth-child(odd){transform:rotate(-12deg)}
  .t-rot:hover span:nth-child(even){transform:rotate(12deg)}
  .t-links{display:flex;flex-direction:column;gap:12px;font-size:20px;align-items:center}
  .t-u{position:relative}
  .t-u::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:1.5px;background:var(--ink);transform:scaleX(0);transform-origin:right;transition:transform .4s cubic-bezier(.65,0,.35,1)}
  .t-u:hover::after{transform:scaleX(1);transform-origin:left}
  .t-flick.lit{animation:tFlick 1.1s linear}
  @keyframes tFlick{0%,19%,23%,54%,56%,100%{color:var(--accent);text-shadow:0 0 12px rgba(232,70,43,.6)}20%,22%,55%{color:var(--muted);text-shadow:none}}
  .t-retype::after{content:"";display:inline-block;width:2px;height:.9em;background:var(--ink);margin-left:3px;vertical-align:-2px;animation:tCaret 1s steps(1) infinite}
  @keyframes tCaret{50%{opacity:0}}
  .t-para{font-size:17px;line-height:1.55;padding:0 22px;text-align:left}
  .t-para span{display:inline-block;transition:transform .25s cubic-bezier(.5,1.6,.4,1),color .2s;color:var(--muted)}
  .t-para span:hover{transform:scale(1.25);color:var(--ink)}
  `);

  const simple = (name, desc, html) => add({ name, desc, build(s) { s.innerHTML = `<div class="t-w">${html}</div>`; } });
  const letters = (w) => [...w].map((c) => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');

  simple('Gradient sweep', 'A colour gradient sweeps across the text through background-clip.', `<span class="t-grad">Hover this text</span>`);
  simple('Highlight', 'A tinted marker sweeps in from the left behind a phrase.', `A <span class="t-hl">highlighted phrase</span> in a sentence`);
  simple('Soft glow', 'The colour shifts and a soft text-shadow blooms on hover.', `<span class="t-glow">Soft glow on hover</span>`);
  simple('Ghost fill', 'A coloured copy paints over the original from the left using clip-path.', `<span class="t-ghost" data-t="Read the full story">Read the full story</span>`);
  simple('Box sweep', 'A solid background scales in from the left behind the text.', `<span class="t-box">Design system</span>`);
  simple('Strikethrough', 'A line draws across on hover to show something is being removed.', `<span class="t-strike">This feature is deprecated</span>`);
  simple('Weight shift', 'The text thickens and its tracking tightens on hover.', `<span class="t-weight">Regular to bold</span>`);
  simple('Shadow lift', 'The text rises and its tracking opens, giving a physical lift.', `<span class="t-lift">Floating headline</span>`);
  simple('Blur focus', 'Starts blurred and snaps sharp on hover, like a lens focusing.', `<span class="t-blur">Unfocused text</span>`);
  simple('Stagger', 'Characters lift and change colour one after another.', `<span class="t-stag">${letters('Design')}</span>`);
  simple('Wobble', 'Odd and even characters tilt in opposite directions.', `<span class="t-rot">${letters('Wobble')}</span>`);
  simple('Underline draw', 'A 1.5px line slides in from left to right on hover.', `<div class="t-links"><a class="t-u">Read the docs</a><a class="t-u">View changelog</a><a class="t-u">Open in new tab</a></div>`);

  // stagger delays
  IX.css(`.t-stag span:nth-child(1){transition-delay:0s}.t-stag span:nth-child(2){transition-delay:.04s}.t-stag span:nth-child(3){transition-delay:.08s}.t-stag span:nth-child(4){transition-delay:.12s}.t-stag span:nth-child(5){transition-delay:.16s}.t-stag span:nth-child(6){transition-delay:.2s}`);

  add({
    name: 'Scramble', desc: 'Letters cycle randomly before resolving back to the real word.',
    build(s) {
      const word = 'Innovation', pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      s.innerHTML = `<div class="t-w"><span class="sc">${word}</span></div>`;
      const el = s.querySelector('.sc');
      let id = 0;
      const run = () => {
        clearInterval(id);
        let f = 0;
        id = setInterval(() => {
          el.textContent = [...word].map((c, i) => (i < f / 3 ? c : pool[(Math.random() * pool.length) | 0])).join('');
          if (++f > word.length * 3) { clearInterval(id); el.textContent = word; }
        }, 35);
      };
      el.onmouseenter = run;
      return { start: run, stop() { clearInterval(id); el.textContent = word; } };
    },
  });

  add({
    name: 'Neon flicker', desc: 'The text flashes with a neon-sign flicker on hover.',
    build(s) {
      s.innerHTML = `<div class="t-w"><span class="t-flick">Hover to flicker</span></div>`;
      const el = s.querySelector('.t-flick');
      el.onmouseenter = () => { el.classList.remove('lit'); void el.offsetWidth; el.classList.add('lit'); };
    },
  });

  add({
    name: 'Retype', desc: 'The text erases itself and a new phrase types in its place.',
    build(s) {
      const phrases = ['Ship fast.', 'Learn faster.', 'Iterate daily.'];
      s.innerHTML = `<div class="t-w"><span class="t-retype">${phrases[0]}</span></div>`;
      const el = s.querySelector('.t-retype');
      let t = 0, pi = 0, txt = phrases[0], phase = 'hold', hold = 0;
      const step = () => {
        const target = phrases[(pi + 1) % phrases.length];
        if (phase === 'hold') { if (++hold > 18) { phase = 'erase'; hold = 0; } }
        else if (phase === 'erase') { txt = txt.slice(0, -1); if (!txt) phase = 'type'; }
        else { txt = target.slice(0, txt.length + 1); if (txt === target) { phase = 'hold'; pi = (pi + 1) % phrases.length; } }
        el.textContent = txt;
        t = setTimeout(step, phase === 'erase' ? 45 : phase === 'type' ? 85 : 100);
      };
      return {
        start() { clearTimeout(t); step(); },
        stop() { clearTimeout(t); pi = 0; txt = phrases[0]; phase = 'hold'; hold = 0; el.textContent = txt; },
      };
    },
  });

  add({
    name: 'Cursor gradient', desc: 'The text colour moves along a spectrum with your cursor’s horizontal position.',
    build(s) {
      s.innerHTML = `<div class="t-w" style="width:100%;height:100%;display:grid;place-items:center"><span class="cg">Move cursor here</span></div>`;
      const w = s.firstChild, el = s.querySelector('.cg');
      w.onmousemove = (e) => {
        const r = w.getBoundingClientRect(), p = (e.clientX - r.left) / r.width;
        el.style.color = `hsl(${Math.round(p * 300)} 70% 42%)`;
      };
      w.onmouseleave = () => (el.style.color = '');
    },
  });

  add({
    name: 'Word pop', desc: 'Hover any word in the paragraph and it scales up and darkens on its own.',
    build(s) {
      const txt = 'Hover any individual word in this paragraph. It scales up and darkens independently of its neighbours.';
      s.innerHTML = `<p class="t-para">${txt.split(' ').map((w) => `<span>${w}</span>`).join(' ')}</p>`;
    },
  });
})();
