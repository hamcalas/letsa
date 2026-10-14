/* رابط عمومی: نوار پیشرفت مطالعه، دکمه‌ی بازگشت به بالا، سایه‌ی هدر، ظاهرشدن نرم کارت‌ها. */
(function () {
  var CS = document.currentScript, P = ''; try { P = new URL(CS.src).pathname.replace(/\/ui\.js$/, ''); } catch (e) {}
  var d = document, w = window, hd = d.querySelector('header.top');

  /* سلام بر اساس ساعت + شمارش معکوس مهلت‌ها (فقط سمت کاربر) */
  var faN = function (n) { return String(n).replace(/\d/g, function (x) { return '۰۱۲۳۴۵۶۷۸۹'[x]; }); };
  var g = d.querySelector('[data-greet]');
  if (g) { var hr = new Date().getHours(); g.textContent = hr < 5 ? 'شب بخیر' : hr < 11 ? 'صبح بخیر' : hr < 14 ? 'ظهر بخیر' : hr < 20 ? 'عصر بخیر' : 'شب بخیر'; }
  d.querySelectorAll('[data-cd]').forEach(function (el) {
    var p = el.dataset.cd.split('-'), n = new Date(), t = new Date(+p[0], p[1] - 1, +p[2]), n0 = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    var k = Math.round((t - n0) / 864e5), box = el.closest('.next');
    if (k < 0) { if (box) box.hidden = true; return; }
    el.textContent += k === 0 ? ' · امروز' : k === 1 ? ' · فردا' : ' · ' + faN(k) + ' روز دیگر';
  });
  var bar = d.createElement('div'); bar.className = 'rp'; bar.setAttribute('aria-hidden', 'true'); d.body.appendChild(bar);
  var up = d.createElement('button'); up.type = 'button'; up.className = 'up'; up.setAttribute('aria-label', 'بازگشت به بالا');
  up.innerHTML = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m0 0l6-6m-6 6l6 6"/></svg>';
  up.onclick = function () { w.scrollTo({ top: 0, behavior: 'smooth' }); }; d.body.appendChild(up);
  var tick = false;
  function on() {
    tick = false;
    var h = d.documentElement, max = h.scrollHeight - h.clientHeight, y = w.pageYOffset || h.scrollTop;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    up.classList.toggle('on', y > 700); hd && hd.classList.toggle('sd', y > 8);
  }
  w.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(on); } }, { passive: true });
  on();

  /* جستجوی تمام‌صفحه (موبایل) / پنجره‌ی میانی (دسکتاپ): دکمه‌های data-search، Ctrl+K و «/» */
  var so = null, ss = null, tm;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lib() { return new Promise(function (ok) { if (w.SchoolSummary) return ok(new w.SchoolSummary(location.origin + P));
    var s = d.createElement('script'); s.src = P + '/school-summary.js'; s.onload = function () { ok(new w.SchoolSummary(location.origin + P)); }; d.head.appendChild(s); }); }
  function card(r) { var ts = (r.topics || []).slice(0, 2).map(function (t) { return '<em>' + esc(t) + '</em>'; }).join('');
    return '<a class="rc" href="' + P + '/d/' + r.date + '/"><span class="rt"><b>' + esc(r.date_fa || r.date) + '</b><small>' + esc((r.excerpt || '').slice(0, 140)) + '</small>' + ts + '</span></a>'; }
  function show(html) { so.querySelector('.sr').innerHTML = html; }
  function closeSearch(fromPop) { if (!so) return; so.remove(); so = null; d.documentElement.style.overflow = '';
    if (!fromPop && history.state && history.state.so) history.back(); }
  function openSearch() {
    if (so) return;
    so = d.createElement('div'); so.className = 'so'; so.setAttribute('role', 'dialog'); so.setAttribute('aria-label', 'جستجو');
    so.innerHTML = '<div class="sp"><div class="sb"><input type="search" placeholder="جستجو در همه‌ی خلاصه‌ها… (مثلاً امتحان)" aria-label="جستجو" enterkeyhint="search" autocomplete="off"><button type="button" class="ib" aria-label="بستن">✕</button></div><div class="sr"><p class="mut">در حال بارگذاری…</p></div></div>';
    d.body.appendChild(so); d.documentElement.style.overflow = 'hidden'; history.pushState({ so: 1 }, '');
    var inp = so.querySelector('input'); inp.focus();
    so.querySelector('.ib').onclick = function () { closeSearch(); };
    so.addEventListener('click', function (e) { if (e.target === so) closeSearch(); });
    function recent() { lib().then(function (x) { ss = x; return x.index(); }).then(function (ds) {
      show('<div class="sh2">آخرین خلاصه‌ها</div>' + ds.slice(0, 10).map(card).join('')); }).catch(function () { show('<p class="mut">جستجو در دسترس نیست.</p>'); }); }
    recent();
    inp.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(function () { var v = inp.value.trim(); if (!v) return recent();
      lib().then(function (x) { return x.search(v, { limit: 25 }); }).then(function (rs) {
        show(rs.length ? '<div class="sh2">' + rs.length + ' نتیجه</div>' + rs.map(card).join('') : '<p class="mut">موردی پیدا نشد؛ کلمه‌ی ساده‌تری امتحان کنید.</p>'); })
        .catch(function () { show('<p class="mut">جستجو در دسترس نیست.</p>'); }); }, 250); });
  }
  w.addEventListener('popstate', function () { if (so) closeSearch(true); });
  d.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[data-search]'); if (t) { e.preventDefault(); openSearch(); } });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearch();
    var tg = (e.target.tagName || '').toLowerCase();
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && tg !== 'input' && tg !== 'textarea')) { e.preventDefault(); openSearch(); }
  });
  var els = d.querySelectorAll('.rv');
  if (!('IntersectionObserver' in w)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (e, i) { e.style.transitionDelay = Math.min(i % 6, 5) * 50 + 'ms'; io.observe(e); });
  setTimeout(function () { d.querySelectorAll('.rv:not(.in)').forEach(function (e) { e.classList.add('in'); }); }, 2500);
})();
