/* ─────────────────────────────────────────────────────────────
   Interactions · app
   Builds the index, the canvas grid, the right panel and search.
   Only one interaction plays at a time; nothing runs before play.
   ───────────────────────────────────────────────────────────── */
(function () {
  const { list, icon } = IX;
  const $ = (s, r = document) => r.querySelector(s);
  const pad = (i) => String(i + 1).padStart(3, '0');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // demo styles
  const st = document.createElement('style');
  st.textContent = IX._css.join('\n');
  document.head.appendChild(st);

  const grid = $('#grid'), listEl = $('#list'), right = $('#right'), canvasEl = $('#canvas');
  $('#count').textContent = list.length;

  let selected = -1, playing = -1;

  /* ── model ── */
  const items = list.map((def, i) => {
    const P = {};
    (def.controls || []).forEach((c) => { if ('value' in c) P[c.key] = c.value; });
    return { def, i, P, inst: null, built: false, reads: null, cell: null, stage: null, li: null };
  });

  /* ── left index ── */
  listEl.innerHTML = items.map((it) => `<li><button class="li" data-i="${it.i}"><span class="n">${pad(it.i)}</span><span>${esc(it.def.name)}</span><span class="d"></span></button></li>`).join('');
  items.forEach((it) => (it.li = listEl.children[it.i].firstChild));
  listEl.addEventListener('click', (e) => { const b = e.target.closest('.li'); if (b) select(+b.dataset.i, true); });

  /* ── canvas cells ── */
  grid.innerHTML = items.map((it) => `
    <article class="cell" id="ix-${pad(it.i)}" data-i="${it.i}">
      <header class="cell-h"><span class="n">${pad(it.i)}</span><h3>${esc(it.def.name)}</h3></header>
      <div class="sw"><div class="stage" inert></div><div class="cover" aria-hidden="true"></div></div>
      <footer class="cell-f"><p>${esc(it.def.desc)}</p><button class="play" aria-label="Play ${esc(it.def.name)}">${icon('play', 16)}</button></footer>
    </article>`).join('');
  items.forEach((it) => { it.cell = grid.children[it.i]; it.stage = $('.stage', it.cell); });

  grid.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell'); if (!cell) return;
    const i = +cell.dataset.i;
    if (e.target.closest('.play')) { toggle(i); return; }
    if (i !== selected) select(i, false);
  });

  /* lazy build: create each demo when it comes near the viewport */
  const build = (it) => {
    if (it.built) return;
    it.built = true;
    const api = {
      read(o) { it.reads = Object.assign(it.reads || {}, o); if (selected === it.i) paintReads(it); },
      set(k, v) { it.P[k] = v; if (selected === it.i) syncControl(k, v); },
    };
    try { it.inst = it.def.build(it.stage, it.P, api) || {}; }
    catch (err) { console.error(it.def.name, err); it.stage.innerHTML = '<p style="color:var(--muted);font-size:13px">Could not load this demo.</p>'; it.inst = {}; }
  };
  const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { build(items[+e.target.dataset.i]); io.unobserve(e.target); } }), { root: canvasEl, rootMargin: '600px 0px' });
  items.forEach((it) => io.observe(it.cell));

  /* columns: 4 when there is room, otherwise 3 (2 / 1 only on small screens) */
  const fitCols = () => {
    const w = canvasEl.clientWidth;
    const cols = w >= 1180 ? 4 : w >= 640 ? 3 : w >= 420 ? 2 : 1;
    document.documentElement.style.setProperty('--cols', cols);
  };
  new ResizeObserver(fitCols).observe(canvasEl);
  fitCols();

  /* ── play / stop ── */
  function setPlayUI(it, on) {
    it.cell.classList.toggle('is-playing', on);
    it.stage.inert = !on;
    it.li.classList.toggle('on', on);
    const b = $('.play', it.cell);
    b.innerHTML = icon(on ? 'pause' : 'play', 16);
    b.setAttribute('aria-label', (on ? 'Stop ' : 'Play ') + it.def.name);
    if (selected === it.i) paintPlayBtn(it);
  }
  function play(i) {
    if (playing === i) return;
    if (playing > -1) stop(playing);
    const it = items[i];
    build(it);
    playing = i;
    setPlayUI(it, true);
    try { it.inst.start && it.inst.start(); } catch (e) { console.error(e); }
    if (selected !== i) select(i, false);
  }
  function stop(i) {
    const it = items[i];
    try { it.inst && it.inst.stop && it.inst.stop(); } catch (e) { console.error(e); }
    setPlayUI(it, false);
    if (playing === i) playing = -1;
  }
  const toggle = (i) => (playing === i ? stop(i) : play(i));

  /* ── selection + right panel ── */
  function select(i, scroll) {
    if (selected > -1) { items[selected].cell.classList.remove('is-sel'); items[selected].li.classList.remove('sel'); }
    selected = i;
    const it = items[i];
    build(it);
    it.cell.classList.add('is-sel');
    it.li.classList.add('sel');
    it.li.scrollIntoView({ block: 'nearest' });
    if (scroll) it.cell.scrollIntoView({ block: 'center', behavior: 'smooth' });
    renderPanel(it);
    right.classList.add('show');
  }

  function renderPanel(it) {
    const d = it.def, cs = d.controls || [];
    right.innerHTML = `
      <div class="panel-head"><span>Selected</span><span>${pad(it.i)} / ${pad(items.length - 1)}</span></div>
      <div class="rp-head">
        <div class="n">${pad(it.i)}</div>
        <h2>${esc(d.name)}</h2>
        <p>${esc(d.desc)}</p>
        <button class="rp-play"></button>
      </div>
      <section class="rp-sec"><h4>Controls</h4>${cs.length ? cs.map(ctlHTML).join('') : '<p class="rp-none">This interaction has no extra controls.</p>'}</section>
      <section class="rp-sec rp-read" hidden><h4>Live values</h4><dl></dl></section>`;
    paintPlayBtn(it);
    $('.rp-play', right).onclick = () => toggle(it.i);
    // wire controls
    cs.forEach((c) => {
      const root = right.querySelector(`[data-k="${c.key}"]`);
      if (!root) return;
      if (c.type === 'range') {
        const inp = $('input', root), out = $('output', root);
        inp.value = it.P[c.key];
        inp.oninput = () => { const v = +inp.value; it.P[c.key] = v; out.textContent = fmt(c, v); it.inst && it.inst.update && it.inst.update(c.key, v); };
      } else if (c.type === 'choice') {
        root.querySelectorAll('.seg button').forEach((b) => (b.onclick = () => {
          root.querySelectorAll('.seg button').forEach((x) => x.classList.toggle('on', x === b));
          it.P[c.key] = b.dataset.v; it.inst && it.inst.update && it.inst.update(c.key, b.dataset.v);
        }));
      } else if (c.type === 'toggle') {
        const b = $('.tgl', root);
        b.onclick = () => { const v = b.getAttribute('aria-checked') !== 'true'; b.setAttribute('aria-checked', v); it.P[c.key] = v; it.inst && it.inst.update && it.inst.update(c.key, v); };
      } else if (c.type === 'text') {
        const inp = $('input', root);
        inp.oninput = () => { it.P[c.key] = inp.value; it.inst && it.inst.update && it.inst.update(c.key, inp.value); };
      }
    });
    right.querySelectorAll('.btn[data-act]').forEach((b) => (b.onclick = () => { if (playing !== it.i) play(it.i); it.inst && it.inst.act && it.inst.act(b.dataset.act); }));
    if (it.reads) paintReads(it);
  }

  const fmt = (c, v) => {
    const dec = c.step && c.step < 1 ? (String(c.step).split('.')[1] || '').length : 0;
    return Number(v).toFixed(dec) + (c.unit ? (c.unit === '×' || c.unit === 's' ? c.unit : ' ' + c.unit) : '');
  };

  function ctlHTML(c) {
    const it = items[selected], v = it.P[c.key];
    if (c.type === 'range') return `<div class="ctl" data-k="${c.key}"><div class="ctl-l"><label>${esc(c.label)}</label><output>${fmt(c, v)}</output></div><input type="range" min="${c.min}" max="${c.max}" step="${c.step || 1}" aria-label="${esc(c.label)}"></div>`;
    if (c.type === 'choice') return `<div class="ctl" data-k="${c.key}"><div class="ctl-l"><label>${esc(c.label)}</label></div><div class="seg" role="radiogroup">${c.options.map((o) => `<button data-v="${esc(o)}" class="${o === v ? 'on' : ''}">${esc(o)}</button>`).join('')}</div></div>`;
    if (c.type === 'toggle') return `<div class="ctl" data-k="${c.key}"><button class="tgl" role="switch" aria-checked="${!!v}">${esc(c.label)}<i></i></button></div>`;
    if (c.type === 'text') return `<div class="ctl" data-k="${c.key}"><div class="ctl-l"><label>${esc(c.label)}</label></div><input class="ctl-text" type="text" value="${esc(v)}" aria-label="${esc(c.label)}"></div>`;
    if (c.type === 'button') return `<button class="btn" data-act="${c.key}" style="margin:0 6px 6px 0">${esc(c.label)}</button>`;
    return '';
  }

  function syncControl(k, v) {
    const it = items[selected], c = (it.def.controls || []).find((x) => x.key === k);
    const root = right.querySelector(`[data-k="${k}"]`);
    if (!c || !root) return;
    if (c.type === 'range') { $('input', root).value = v; $('output', root).textContent = fmt(c, v); }
  }

  function paintPlayBtn(it) {
    const b = $('.rp-play', right); if (!b) return;
    const on = playing === it.i;
    b.classList.toggle('on', on);
    b.innerHTML = `${icon(on ? 'pause' : 'play', 14)}${on ? 'Stop' : 'Play'}`;
  }

  let readRaf = 0;
  function paintReads(it) {
    if (readRaf) return;
    readRaf = requestAnimationFrame(() => {
      readRaf = 0;
      const sec = $('.rp-read', right); if (!sec || !it.reads || selected !== it.i) return;
      sec.hidden = false;
      $('dl', sec).innerHTML = Object.entries(it.reads).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
    });
  }

  // small screens: the right panel is a bottom drawer; tap its header to tuck it away
  right.addEventListener('click', (e) => { if (e.target.closest('.panel-head') && window.innerWidth <= 860) right.classList.remove('show'); });

  right.innerHTML = `<div class="panel-head"><span>Selected</span><span></span></div><p class="rp-empty">Select an interaction from the index or the canvas. Its details and any extra controls show up here.</p>`;

  /* ── search: elastic open, fuzzy ranking ── */
  const sx = $('#sx'), panel = $('.sx-panel', sx), input = $('#sxInput'), res = $('#sxRes'), meta = $('#sxMeta'), openBtn = $('#searchOpen');
  let results = [], active = 0, isOpen = false;

  const lev = (a, b) => {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const m = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) m[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return m[a.length][b.length];
  };
  const words = (s) => s.toLowerCase().match(/[a-z0-9]+/g) || [];
  const index = items.map((it) => ({ it, nw: words(it.def.name), dw: words(it.def.desc), num: pad(it.i) }));

  // score one token against a word list; returns [score, matchedWord]
  const tokScore = (t, ws) => {
    let best = [0, null];
    for (const w of ws) {
      let sc = 0;
      if (w === t) sc = 10;
      else if (w.startsWith(t)) sc = 8;
      else if (t.length >= 3 && w.includes(t)) sc = 5;
      else if (t.length >= 3) { const lim = t.length >= 6 ? 2 : 1, d = lev(t, w.slice(0, t.length + 1)) ; if (d <= lim || lev(t, w) <= lim) sc = 3 - (d > 1 ? 1 : 0); }
      if (sc > best[0]) best = [sc, w];
    }
    return best;
  };

  function runSearch(q) {
    const toks = words(q);
    if (!toks.length) { results = index.map((e) => ({ e, score: 0, hits: [] })); }
    else {
      results = [];
      for (const e of index) {
        let total = 0, hits = [], ok = true;
        for (const t of toks) {
          if (/^\d+$/.test(t) && e.num.endsWith(t.padStart(3, '0'))) { total += 12; continue; }
          const [ns, nw] = tokScore(t, e.nw), [ds, dw] = tokScore(t, e.dw);
          const sc = Math.max(ns * 3, ds);
          if (!sc) { ok = false; break; }
          total += sc; hits.push(ns * 3 >= ds ? nw : dw, t);
        }
        if (ok) results.push({ e, score: total, hits });
      }
      results.sort((a, b) => b.score - a.score || a.e.it.i - b.e.it.i);
    }
    active = 0;
    paintResults(toks);
  }

  const hl = (text, marks) => {
    if (!marks.length) return esc(text);
    const re = new RegExp('(' + marks.filter(Boolean).map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).sort((a, b) => b.length - a.length).join('|') + ')', 'gi');
    return esc(text).replace(re, '<mark>$1</mark>');
  };

  function paintResults(toks) {
    meta.textContent = toks.length ? `${results.length} result${results.length === 1 ? '' : 's'}` : `All ${results.length} interactions`;
    if (!results.length) { res.innerHTML = `<li class="empty">Nothing matches “${esc(input.value)}”. Try another word.</li>`; return; }
    res.innerHTML = results.map((r, k) => `<li role="option" data-i="${r.e.it.i}" class="${k === active ? 'act' : ''}"><span class="n">${r.e.num}</span><b>${hl(r.e.it.def.name, r.hits)}</b><small>${hl(r.e.it.def.desc, r.hits)}</small></li>`).join('');
  }
  const moveActive = (d) => {
    if (!results.length) return;
    active = (active + d + results.length) % results.length;
    [...res.children].forEach((li, k) => li.classList.toggle('act', k === active));
    res.children[active].scrollIntoView({ block: 'nearest' });
  };

  function openSearch() {
    if (isOpen) return;
    isOpen = true;
    sx.hidden = false;
    input.value = '';
    runSearch('');
    // elastic: the panel springs out of the search icon
    const b = openBtn.getBoundingClientRect(), p = panel.getBoundingClientRect();
    const dx = b.left + b.width / 2 - (p.left + p.width / 2), dy = b.top + b.height / 2 - p.top;
    const sxk = IX.springKeys(0, 1, { k: 210, c: 15, frames: 54 });
    panel.animate(sxk.map((q) => ({ transform: `translate(${dx * (1 - q)}px,${dy * (1 - q)}px) scale(${0.08 + 0.92 * q},${0.1 + 0.9 * Math.min(1.08, q)})`, opacity: Math.min(1, q * 3) })), { duration: 900, easing: 'linear' });
    $('.sx-back', sx).animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
    setTimeout(() => input.focus(), 30);
  }
  function closeSearch() {
    if (!isOpen) return;
    isOpen = false;
    const b = openBtn.getBoundingClientRect(), p = panel.getBoundingClientRect();
    const dx = b.left + b.width / 2 - (p.left + p.width / 2), dy = b.top + b.height / 2 - p.top;
    const a = panel.animate([{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px,${dy}px) scale(.08,.1)`, opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.6,0,.8,.4)' });
    $('.sx-back', sx).animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260 });
    a.onfinish = () => { sx.hidden = true; openBtn.focus(); };
  }
  const choose = (i) => { closeSearch(); select(i, true); };

  openBtn.onclick = openSearch;
  sx.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeSearch(); const li = e.target.closest('li[data-i]'); if (li) choose(+li.dataset.i); });
  input.addEventListener('input', () => runSearch(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
    else if (e.key === 'Enter' && results[active]) choose(results[active].e.it.i);
  });
  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if (e.key === 'Escape' && isOpen) closeSearch();
    else if (!isOpen && !typing && (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) { e.preventDefault(); openSearch(); }
  });
})();
