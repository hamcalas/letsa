/* نصب PWA: کارت بزرگ پایین صفحه + دکمه‌ی همیشگی در هدر/ناوبری پایین/هیرو (حتی بعد از «بعداً»). */
(function () {
  var R = document.documentElement, ua = navigator.userAgent || '', K = 'ss_inst_snooze';
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) return;
  var ios = /iphone|ipad|ipod/i.test(ua), inapp = /Telegram|Instagram|FBAN|FBAV|Line\/|; wv\)|Eitaa|Bale|Rubika/i.test(ua);
  var ev = null, sheet = null, back = null;
  function snoozed() { try { return Date.now() - (+localStorage.getItem(K) || 0) < 3 * 864e5; } catch (e) { return false; } }
  function icon() { var l = document.querySelector('link[rel=apple-touch-icon]'); return l ? l.href : ''; }
  function close(snooze) {
    if (snooze) { try { localStorage.setItem(K, Date.now()); } catch (e) {} }
    sheet && sheet.remove(); back && back.remove(); sheet = back = null;
  }
  function open() {
    if (sheet) return;
    var name = (document.querySelector('meta[name="apple-mobile-web-app-title"]') || {}).content || document.title;
    var how = ios ? '<ul><li>۱) دکمه‌ی اشتراک‌گذاری ⬆️ پایین سافاری را بزنید</li><li>۲) «Add to Home Screen» را انتخاب کنید</li></ul>'
      : inapp ? '<ul><li>این مرورگر درون‌برنامه‌ای است و نصب را پشتیبانی نمی‌کند.</li><li>منوی ⋮ ← «باز کردن در Chrome» و دوباره امتحان کنید.</li></ul>'
      : ev ? '' : '<ul><li>منوی ⋮ مرورگر ← «Install app / نصب برنامه»</li></ul>';
    back = document.createElement('div'); back.className = 'inst-back'; back.onclick = function () { close(true); };
    sheet = document.createElement('div'); sheet.className = 'inst-sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'نصب برنامه');
    sheet.innerHTML = '<div class="ih">' + (icon() ? '<img src="' + icon() + '" alt="">' : '') +
      '<div><h3>نصب «' + name + '»</h3><p>دسترسی یک‌لمسی از صفحه‌ی اصلی گوشی، بدون نوار آدرس، و باز شدن حتی بدون اینترنت.</p></div></div>' + how +
      '<div class="ia">' + (ev ? '<button type="button" class="btn" id="inst-go">نصب برنامه</button>' : '') +
      '<button type="button" class="btn ghost" id="inst-later">' + (ev ? 'بعداً' : 'متوجه شدم') + '</button></div>';
    document.body.appendChild(back); document.body.appendChild(sheet);
    var go = sheet.querySelector('#inst-go');
    if (go) go.onclick = function () { var e = ev; ev = null; close(false); e.prompt(); e.userChoice.then(function (c) { if (c.outcome !== 'accepted') { ev = e; } }); };
    sheet.querySelector('#inst-later').onclick = function () { close(true); };
  }
  addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); ev = e; R.classList.add('can-install');
    if (!snoozed()) setTimeout(open, 2500);
  });
  addEventListener('appinstalled', function () { ev = null; R.classList.remove('can-install'); close(false); });
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-install]'); if (!t) return;
    e.preventDefault(); open();
  });
  if (ios || inapp) { R.classList.add('can-install'); addEventListener('load', function () { if (!snoozed()) setTimeout(open, 5000); }); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(true); });
})();
