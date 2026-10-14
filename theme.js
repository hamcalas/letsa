/* تم: فقط خودکار / روشن / تیره. در localStorage مرورگر ذخیره می‌شود. */
(function () {
  var d = document.documentElement, mount = document.getElementById('theme-slot'); if (!mount) return;
  var IC = {
    auto: '<path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM8 21h8M12 17v4"/>',
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    dark: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>'
  };
  var MODES = [['auto', 'خودکار (مطابق گوشی)'], ['light', 'روشن'], ['dark', 'تیره']];
  function svg(n) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + IC[n] + '</svg>'; }
  function get(k, v) { try { return localStorage.getItem(k) || v; } catch (e) { return v; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var mode = get('ss_theme', mount.dataset.mode || 'auto');
  try { localStorage.removeItem('ss_accent'); } catch (e) {}
  d.removeAttribute('data-accent');
  var meta = document.querySelector('meta[name=theme-color]'), base = meta && meta.content;
  var wrap = document.createElement('span'); wrap.className = 'theme-wrap';
  var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'theme-btn';
  btn.setAttribute('aria-label', 'تغییر حالت نمایش'); btn.setAttribute('aria-haspopup', 'true');
  var pop = document.createElement('div'); pop.className = 'theme-pop'; pop.hidden = true; pop.setAttribute('role', 'menu');
  pop.innerHTML = MODES.map(function (m) { return '<button type="button" role="menuitemradio" data-m="' + m[0] + '">' + svg(m[0]) + m[1] + '</button>'; }).join('');
  wrap.appendChild(btn); wrap.appendChild(pop); mount.appendChild(wrap);
  function apply() {
    if (mode === 'auto') d.removeAttribute('data-theme'); else d.setAttribute('data-theme', mode);
    var dark = mode === 'dark' || (mode === 'auto' && matchMedia('(prefers-color-scheme:dark)').matches);
    if (meta) meta.content = dark ? '#13161a' : base;
    btn.innerHTML = svg(dark ? 'dark' : 'light');
    pop.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-checked', b.dataset.m === mode ? 'true' : 'false'); });
  }
  btn.onclick = function (e) { e.stopPropagation(); pop.hidden = !pop.hidden; };
  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) pop.hidden = true; });
  pop.onclick = function (e) { var t = e.target.closest('button'); if (!t) return; mode = t.dataset.m; set('ss_theme', mode); apply(); pop.hidden = true; };
  var mq = matchMedia('(prefers-color-scheme:dark)'); mq.addEventListener && mq.addEventListener('change', apply);
  apply();
})();
