/* تم: خودکار / روشن / تیره + رنگ تأکید. فقط در localStorage مرورگر ذخیره می‌شود. */
(function () {
  var d = document.documentElement, mount = document.getElementById('theme-slot'); if (!mount) return;
  var ACC = [['blue', '#2563eb', 'آبی'], ['green', '#16a34a', 'سبز'], ['purple', '#7c3aed', 'بنفش'], ['orange', '#ea580c', 'نارنجی'], ['rose', '#e11d48', 'سرخابی']];
  var MODES = [['auto', 'خودکار', '🌓'], ['light', 'روشن', '☀️'], ['dark', 'تیره', '🌙']];
  function get(k, v) { try { return localStorage.getItem(k) || v; } catch (e) { return v; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var mode = get('ss_theme', mount.dataset.mode || 'auto'), acc = get('ss_accent', '');
  var meta = document.querySelector('meta[name=theme-color]'), base = meta && meta.content;
  function apply() {
    if (mode === 'auto') d.removeAttribute('data-theme'); else d.setAttribute('data-theme', mode);
    if (acc) d.setAttribute('data-accent', acc); else d.removeAttribute('data-accent');
    if (meta) { var dark = mode === 'dark' || (mode === 'auto' && matchMedia('(prefers-color-scheme:dark)').matches);
      meta.content = dark ? '#121316' : base; }
    btn.textContent = (MODES.filter(function (m) { return m[0] === mode; })[0] || MODES[0])[2];
  }
  var wrap = document.createElement('span'); wrap.className = 'theme-wrap';
  var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'theme-btn';
  btn.setAttribute('aria-label', 'تغییر تم'); btn.setAttribute('aria-haspopup', 'true');
  var pop = document.createElement('div'); pop.className = 'theme-pop'; pop.hidden = true;
  var h = '<b>حالت نمایش</b><div class="tp-row">';
  MODES.forEach(function (m) { h += '<button type="button" data-m="' + m[0] + '">' + m[2] + ' ' + m[1] + '</button>'; });
  h += '</div><b>رنگ</b><div class="tp-row">';
  ACC.forEach(function (a) { h += '<button type="button" class="sw" data-a="' + a[0] + '" title="' + a[2] + '" style="background:' + a[1] + '"></button>'; });
  h += '</div>';
  pop.innerHTML = h; wrap.appendChild(btn); wrap.appendChild(pop); mount.appendChild(wrap);
  btn.onclick = function (e) { e.stopPropagation(); pop.hidden = !pop.hidden; };
  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) pop.hidden = true; });
  pop.onclick = function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.dataset.m) { mode = t.dataset.m; set('ss_theme', mode); }
    if (t.dataset.a) { acc = t.dataset.a === acc ? '' : t.dataset.a; set('ss_accent', acc); }
    apply();
  };
  matchMedia('(prefers-color-scheme:dark)').addEventListener && matchMedia('(prefers-color-scheme:dark)').addEventListener('change', apply);
  apply();
})();
