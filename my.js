/* شخصی‌سازی سمت کاربر؛ همه‌چیز فقط در localStorage مرورگر (هیچ داده‌ای به سرور نمی‌رود). */
(function () {
  var m = document.getElementById('my'); if (!m) return;
  var K = 'ss_my_v1', st;
  try { st = JSON.parse(localStorage.getItem(K)) || {}; } catch (e) { st = {}; }
  st.read = st.read || {}; st.mark = st.mark || {}; st.topics = st.topics || {}; st.days = st.days || [];
  function save() { try { localStorage.setItem(K, JSON.stringify(st)); } catch (e) {} }
  function J(a, d) { try { return JSON.parse(m.getAttribute(a)) || d; } catch (e) { return d; } }
  var P = m.dataset.prefix || '', kind = m.dataset.kind, date = m.dataset.date, latest = m.dataset.latest;
  var t = new Date(), today = t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2);
  var fa = function (n) { return String(n).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; }); };

  var css = document.createElement('style');
  css.textContent = '.my-bar{background:var(--card,#f5f6f8);border:1px solid var(--bd,#e5e7eb);border-radius:10px;padding:10px 14px;margin:0 0 14px;font-size:.92rem;line-height:1.9}' +
    '.my-bar a{color:var(--acc,#2563eb)}.my-bar button,.my-btn{font:inherit;cursor:pointer;border:1px solid var(--bd,#e5e7eb);background:transparent;color:inherit;border-radius:8px;padding:2px 10px}' +
    '.my-btn[aria-pressed=true]{background:var(--acc,#2563eb);color:#fff;border-color:transparent}.my-new{color:var(--acc,#2563eb);font-weight:700}' +
    '#list a.my-read{opacity:.6}#list a.my-read::after{content:" ✓"}';
  document.head.appendChild(css);

  document.querySelectorAll('.ev[data-date]').forEach(function (li) { if (li.dataset.date < today) li.hidden = true; });
  var box = document.querySelector('.ev-box'); if (box && !box.querySelector('.ev:not([hidden])')) box.hidden = true;

  if (st.days.indexOf(today) < 0) { st.days.push(today); st.days = st.days.slice(-90); }
  var streak = 0, c = new Date(t);
  for (;;) { var k = c.getFullYear() + '-' + ('0' + (c.getMonth() + 1)).slice(-2) + '-' + ('0' + c.getDate()).slice(-2);
    if (st.days.indexOf(k) < 0) break; streak++; c.setDate(c.getDate() - 1); }

  function mark() {
    document.querySelectorAll('#list a[href*="/d/"]').forEach(function (a) {
      var d = (a.getAttribute('href').match(/\/d\/(\d{4}-\d{2}-\d{2})/) || [])[1];
      if (d && st.read[d]) a.classList.add('my-read');
    });
  }
  function btn(txt, pressed, fn) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'my-btn'; b.textContent = txt;
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false'); b.onclick = fn; return b;
  }

  if (kind === 'day' && date) {
    st.read[date] = 1;
    var dh = document.querySelector('article .dh');
    if (dh) {
      var bar0 = document.createElement('div'); bar0.className = 'acts'; bar0.setAttribute('role', 'group'); bar0.setAttribute('aria-label', 'اقدام‌ها');
      var I = function (p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
      var IC = { star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
        link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>', send: '<path d="M21 3L3 10.5l6.5 2.5L12 20z"/><path d="M21 3L9.5 13"/>', chat: '<path d="M21 12a8 8 0 0 1-11.7 7L3 21l2-6A8 8 0 1 1 21 12z"/>' };
      var ab = function (ic, txt, fn, href) {
        var e = document.createElement(href ? 'a' : 'button'); e.className = 'ab'; if (href) { e.href = href; e.target = '_blank'; e.rel = 'noopener nofollow'; } else { e.type = 'button'; e.onclick = fn; }
        e.innerHTML = I(IC[ic]) + '<span>' + txt + '</span>'; bar0.appendChild(e); return e; };
      var setBm = function (b) { var on = !!st.mark[date]; b.querySelector('span').textContent = on ? 'نشانک‌شده' : 'نشانک'; b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.querySelector('svg').setAttribute('fill', on ? 'currentColor' : 'none'); };
      var bm = ab('star', 'نشانک', function () { if (st.mark[date]) delete st.mark[date]; else st.mark[date] = m.dataset.label || date; setBm(bm); save(); }); setBm(bm);
      if (m.dataset.url) {
        var u = m.dataset.url, ttl = m.dataset.title || document.title, tx = m.dataset.text || '', enc = encodeURIComponent, msg = ttl + (tx ? '\n' + tx : '');
        if (navigator.share) ab('share', 'اشتراک‌گذاری', function () { navigator.share({ title: ttl, text: tx, url: u }).catch(function () {}); });
        ab('link', 'کپی لینک', function () { var sp = this.querySelector('span'); (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () { sp.textContent = 'کپی شد ✓'; }, function () { prompt('لینک:', u); }); });
        ab('send', 'تلگرام', null, 'https://t.me/share/url?url=' + enc(u) + '&text=' + enc(msg));
        ab('chat', 'واتساپ', null, 'https://wa.me/?text=' + enc(msg + '\n' + u));
      }
      dh.insertAdjacentElement('afterend', bar0);
    }
  }
  if (kind === 'topic' && m.dataset.topic) {
    var slug = m.dataset.topic, h = document.querySelector('main h1');
    var fb = btn(st.topics[slug] ? '✓ دنبال می‌کنید' : '+ دنبال‌کردن این موضوع', !!st.topics[slug], function () {
      if (st.topics[slug]) delete st.topics[slug]; else st.topics[slug] = { l: m.dataset.label || slug, s: latest || '' };
      fb.textContent = st.topics[slug] ? '✓ دنبال می‌کنید' : '+ دنبال‌کردن این موضوع'; fb.setAttribute('aria-pressed', st.topics[slug] ? 'true' : 'false'); save();
    });
    if (h) h.parentNode.insertBefore(fb, h.nextSibling);
    if (st.topics[slug]) { st.topics[slug].s = latest || st.topics[slug].s; }
  }
  if (kind === 'home') {
    var recent = J('data-recent', {}), tinfo = J('data-topics', {}), keys = Object.keys(recent).sort();
    var fresh = st.last ? keys.filter(function (d) { return d > st.last; }) : [];
    var bar = document.createElement('div'); bar.className = 'my-bar'; var parts = [];
    if (streak > 1) parts.push('🔥 ' + fa(streak) + ' روز پیاپی سر زدید');
    if (fresh.length) parts.push('<span class="my-new">' + fa(fresh.length) + ' خلاصه‌ی جدید</span> از آخرین بازدید: ' +
      fresh.slice(-5).reverse().map(function (d) { return '<a href="' + P + '/d/' + d + '/">' + recent[d] + '</a>'; }).join('، '));
    var fol = Object.keys(st.topics).map(function (s) {
      var info = tinfo[s], isNew = info && info[1] > (st.topics[s].s || '');
      return '<a href="' + P + '/t/' + encodeURIComponent(s) + '/">' + st.topics[s].l + '</a>' + (isNew ? ' <span class="my-new">(جدید)</span>' : '');
    });
    if (fol.length) parts.push('موضوع‌های شما: ' + fol.join('، '));
    var mk = Object.keys(st.mark).sort().reverse().slice(0, 5);
    if (mk.length) parts.push('نشانک‌ها: ' + mk.map(function (d) { return '<a href="' + P + '/d/' + d + '/">' + st.mark[d] + '</a>'; }).join('، '));
    if (parts.length) {
      bar.innerHTML = parts.join('<br>') + '<br><button type="button" id="my-clear">پاک‌کردن اطلاعات من</button> <small>(فقط روی همین دستگاه ذخیره شده)</small>';
      var main = document.querySelector('main'); if (main) main.insertBefore(bar, main.firstChild);
      document.getElementById('my-clear').onclick = function () { try { localStorage.removeItem(K); } catch (e) {} bar.remove(); };
    }
    if (latest) st.last = latest;
  }
  save(); mark();
})();
