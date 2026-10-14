/* دکمه‌ی نصب PWA: اندروید/کروم (beforeinstallprompt)، راهنمای iOS و مرورگرهای درون‌برنامه‌ای. */
(function () {
  var ua = navigator.userAgent || '', dismissed = 0;
  try { dismissed = +localStorage.getItem('ss_inst_x') || 0; } catch (e) {}
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) return; // قبلاً نصب شده
  var ios = /iphone|ipad|ipod/i.test(ua), inapp = /Telegram|Instagram|FBAN|FBAV|Line\/|; wv\)|Eitaa|Bale|Rubika/i.test(ua);
  var ev = null, bar;
  var css = document.createElement('style');
  css.textContent = '.inst{position:fixed;inset-inline:12px;bottom:12px;z-index:50;background:var(--card,#f5f6f8);color:var(--fg,#111);border:1px solid var(--bd,#e5e7eb);border-radius:14px;padding:10px 14px;box-shadow:0 6px 24px rgba(0,0,0,.18);display:flex;gap:10px;align-items:center;font-size:14px;line-height:1.7;max-width:520px;margin:0 auto}' +
    '.inst button{font:inherit;cursor:pointer;border-radius:8px;border:1px solid var(--bd,#ddd);background:transparent;color:inherit;padding:4px 12px}.inst .go{background:var(--acc,#2563eb);color:#fff;border-color:transparent}.inst span{flex:1}';
  document.head.appendChild(css);
  function show(msg, action) {
    if (bar || Date.now() - dismissed < 7 * 864e5) return;
    bar = document.createElement('div'); bar.className = 'inst'; bar.setAttribute('role', 'dialog');
    bar.innerHTML = '<span>' + msg + '</span>';
    if (action) { var g = document.createElement('button'); g.className = 'go'; g.textContent = 'نصب'; g.onclick = action; bar.appendChild(g); }
    var x = document.createElement('button'); x.textContent = '✕'; x.setAttribute('aria-label', 'بستن');
    x.onclick = function () { try { localStorage.setItem('ss_inst_x', Date.now()); } catch (e) {} bar.remove(); };
    bar.appendChild(x); document.body.appendChild(bar);
  }
  addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); ev = e;
    setTimeout(function () { show('📲 برنامه را نصب کنید تا خلاصه‌ی هر روز یک‌لمسی و حتی آفلاین باز شود.', function () {
      ev.prompt(); ev.userChoice.then(function () { ev = null; bar && bar.remove(); }); }); }, 4000);
  });
  addEventListener('appinstalled', function () { bar && bar.remove(); });
  // دکمه‌ی دستی در هر عنصر با data-install (مثلاً صفحه‌ی عیب‌یابی/فوتر)
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-install]'); if (!t) return;
    e.preventDefault();
    if (ev) { ev.prompt(); return; }
    alert(ios ? 'در سافاری: دکمه‌ی اشتراک‌گذاری ⬆️ ← «Add to Home Screen»' :
      inapp ? 'این مرورگر درون‌برنامه‌ای است؛ لینک را در Chrome باز کنید و از منوی ⋮ گزینه‌ی «Install app / نصب برنامه» را بزنید.' :
      'از منوی مرورگر (⋮) گزینه‌ی «Install app / افزودن به صفحه‌ی اصلی» را بزنید. اگر نیست، صفحه‌ی /pwa-check/ علت را نشان می‌دهد.');
  });
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (ev) return;
      if (ios) show('📲 برای نصب: دکمه‌ی اشتراک‌گذاری ⬆️ را بزنید و «Add to Home Screen» را انتخاب کنید.');
      else if (inapp) show('📲 برای نصب، این صفحه را در Chrome باز کنید (منوی ⋮ ← باز کردن در مرورگر).');
    }, 6000);
  });
})();
