/* رابط عمومی: نوار پیشرفت مطالعه، دکمه‌ی بازگشت به بالا، سایه‌ی هدر، ظاهرشدن نرم کارت‌ها. */
(function () {
  var d = document, w = window, hd = d.querySelector('header.top');
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
  var els = d.querySelectorAll('.rv');
  if (!('IntersectionObserver' in w)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (e, i) { e.style.transitionDelay = Math.min(i % 6, 5) * 50 + 'ms'; io.observe(e); });
  setTimeout(function () { d.querySelectorAll('.rv:not(.in)').forEach(function (e) { e.classList.add('in'); }); }, 2500);
})();
