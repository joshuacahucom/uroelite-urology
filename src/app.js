/* UroElite static site — tiny vanilla runtime replacing the original React bundle. */
(function () {
  var d = document, w = window;
  var BOOKING_URL = 'https://schedule.uroeliteurology.com/widget/booking/1WgOJFGMAdXu2MXvcGYC';
  var VIDEO_URL = 'https://storage.googleapis.com/msgsndr/ZstQsqmIBAZmPwq6WMQP/media/5d1e8b38-3431-4fb6-a705-6cb9fb90dda1.mp4';
  var X_ICON = function (cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x ' + cls + '" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
  };
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  function swap(el, from, to) {
    from.split(' ').forEach(function (c) { if (c) el.classList.remove(c); });
    to.split(' ').forEach(function (c) { if (c) el.classList.add(c); });
  }
  function ss(k, v) { try { return v === undefined ? sessionStorage.getItem(k) : sessionStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- Booking modal ---------- */
  var modal = null, prevOverflow = '';
  function closeBooking() {
    if (!modal) return;
    modal.remove(); modal = null;
    d.body.style.overflow = prevOverflow;
    d.removeEventListener('keydown', escClose);
  }
  function escClose(e) { if (e.key === 'Escape') closeBooking(); }
  function openBooking() {
    if (modal) return;
    modal = d.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Book an appointment');
    modal.innerHTML =
      '<div class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" data-close></div>' +
      '<div class="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-3xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">' +
      '<div class="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-[#14494E]"><div class="flex items-center gap-2.5"><span class="inline-flex items-center gap-2 text-white font-bold text-sm sm:text-base">Book an Appointment</span></div>' +
      '<button aria-label="Close booking modal" data-close class="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors touch-manipulation">' + X_ICON('w-5 h-5') + '</button></div>' +
      '<div class="flex-1 overflow-y-auto overscroll-contain"><iframe src="' + BOOKING_URL + '" title="Book an Appointment" class="w-full min-h-[520px] sm:min-h-[600px] border-0" loading="eager" style="width:100%"></iframe></div></div>';
    d.body.appendChild(modal);
    prevOverflow = d.body.style.overflow;
    d.body.style.overflow = 'hidden';
    d.addEventListener('keydown', escClose);
    var btn = $('button[data-close]', modal); if (btn) btn.focus();
  }

  /* ---------- Mobile menu ---------- */
  var menuOpen = false, menuIcon = null;
  function toggleMenu(btn) {
    var header = btn.closest('header');
    menuOpen = !menuOpen;
    btn.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
    if (!menuIcon) menuIcon = btn.innerHTML;
    btn.innerHTML = menuOpen ? X_ICON('w-6 h-6') : menuIcon;
    var panel = $('[data-mobile-menu]', header);
    if (!menuOpen) { if (panel) panel.remove(); return; }
    panel = d.createElement('div');
    panel.setAttribute('data-mobile-menu', '');
    panel.className = 'lg:hidden bg-white border-b border-slate-200 px-5 py-3 flex flex-col gap-1 text-sm font-medium text-slate-700 shadow-lg max-h-[75vh] overflow-y-auto overscroll-contain';
    var html = '';
    $$('nav a', header).forEach(function (a) {
      var active = a.getAttribute('aria-current') === 'page';
      html += '<a href="' + a.getAttribute('href') + '" class="text-left py-3.5 px-2 rounded-lg hover:bg-slate-50 hover:text-[#14494E] transition-colors touch-manipulation' +
        (active ? ' text-[#14494E] font-semibold bg-slate-50' : '') + '"' + (active ? ' aria-current="page"' : '') + '>' + a.textContent + '</a>';
    });
    html += '<button data-book class="btn-primary mt-4 mb-2 self-stretch justify-center py-3">Book Now</button>';
    panel.innerHTML = html;
    header.appendChild(panel);
  }

  /* ---------- Accordions (Radix-compatible markup) ---------- */
  function setState(item, state) {
    item.setAttribute('data-state', state);
    $$('[data-state]', item).forEach(function (el) { el.setAttribute('data-state', state); });
  }
  function closeItem(item) {
    var btn = $('button[aria-controls]', item), region = d.getElementById(btn.getAttribute('aria-controls'));
    region.style.setProperty('--radix-collapsible-content-height', region.scrollHeight + 'px');
    setState(item, 'closed');
    btn.setAttribute('aria-expanded', 'false');
    setTimeout(function () { if (item.getAttribute('data-state') === 'closed') region.hidden = true; }, 200);
  }
  function openItem(item) {
    var btn = $('button[aria-controls]', item), region = d.getElementById(btn.getAttribute('aria-controls'));
    region.hidden = false;
    region.style.setProperty('--radix-collapsible-content-height', region.scrollHeight + 'px');
    setState(item, 'open');
    btn.setAttribute('aria-expanded', 'true');
  }
  function toggleAcc(btn) {
    var item = btn.closest('h3').parentElement;
    if (btn.getAttribute('aria-expanded') === 'true') return closeItem(item);
    Array.prototype.forEach.call(item.parentElement.children, function (sib) {
      if (sib !== item && sib.getAttribute('data-state') === 'open') closeItem(sib);
    });
    openItem(item);
  }

  /* ---------- Reviews carousel ---------- */
  function initCarousel() {
    var prev = $('button[aria-label="Previous review"]');
    if (!prev) return;
    var wrap = prev.parentElement;
    var track = $('.transition-transform', wrap);
    var dots = $$('button[aria-label^="Go to review"]');
    var n = track.children.length, i = 0, paused = false;
    var ON = 'w-8 bg-[#14494E]', OFF = 'w-2 bg-slate-300 hover:bg-slate-400';
    function go(k) {
      i = (k + n) % n;
      track.style.transform = 'translateX(-' + i * 100 + '%)';
      dots.forEach(function (dot, j) { swap(dot, j === i ? OFF : ON, j === i ? ON : OFF); });
    }
    prev.addEventListener('click', function () { go(i - 1); });
    $('button[aria-label="Next review"]').addEventListener('click', function () { go(i + 1); });
    dots.forEach(function (dot, j) { dot.addEventListener('click', function () { go(j); }); });
    wrap.addEventListener('mouseenter', function () { paused = true; });
    wrap.addEventListener('mouseleave', function () { paused = false; });
    setInterval(function () { if (!paused && !d.hidden) go(i + 1); }, 4500);
  }

  /* ---------- Filters: services / faqs / blog ---------- */
  function initFilters() {
    var group = $('[data-filter-group]');
    if (!group) return;
    var kind = group.getAttribute('data-filter-group');
    var btns = $$('button[data-filter]', group);
    var ON = 'bg-[#14494E] text-white';
    var OFF = btns[1].getAttribute('data-off');
    var input = $('input[data-search]');
    var items = $$('[data-item]');
    var list = items.length ? items[0].parentElement : null;
    var cat = 'All', q = '';
    var empty = null;
    function text(el, s) { var x = $(s, el); return x ? x.textContent.toLowerCase() : ''; }
    function apply() {
      var shown = 0, ql = q.toLowerCase();
      items.forEach(function (el) {
        var ok;
        if (kind === 'services') {
          var name = text(el, 'h3');
          ok = (name.indexOf(ql) > -1 || text(el, 'p').indexOf(ql) > -1) && (cat === 'All' || name.indexOf(cat.toLowerCase()) > -1);
        } else if (kind === 'faqs') {
          ok = (text(el, 'button').indexOf(ql) > -1 || text(el, '[role=region]').indexOf(ql) > -1) && (cat === 'All' || el.getAttribute('data-cat') === cat);
        } else {
          ok = cat === 'All' || el.getAttribute('data-cat') === cat;
        }
        el.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      if (kind !== 'blog') {
        if (!shown && !empty) {
          empty = d.createElement('p');
          empty.className = 'text-center text-slate-500 py-12';
          empty.textContent = kind === 'faqs' ? 'No FAQs match your search.' : 'No conditions match your search.';
          list.parentElement.insertBefore(empty, list.nextSibling);
        } else if (shown && empty) { empty.remove(); empty = null; }
      }
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        cat = b.getAttribute('data-filter');
        btns.forEach(function (o) { swap(o, o === b ? OFF : ON, o === b ? ON : OFF); });
        apply();
      });
    });
    if (input) input.addEventListener('input', function () { q = input.value; apply(); });
  }

  /* ---------- Newsletter toast ---------- */
  function toast(title, desc) {
    var ol = $('ol[data-toasts]');
    if (!ol) return;
    var li = d.createElement('li');
    li.setAttribute('role', 'status');
    li.setAttribute('data-state', 'open');
    li.className = 'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md p-6 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full border bg-background text-foreground';
    li.innerHTML = '<div class="grid gap-1"><div class="text-sm font-semibold"></div><div class="text-sm opacity-90"></div></div>' +
      '<button type="button" aria-label="Close" class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2">' + X_ICON('h-4 w-4') + '</button>';
    li.children[0].children[0].textContent = title;
    li.children[0].children[1].textContent = desc;
    li.querySelector('button').onclick = function () { li.remove(); };
    ol.appendChild(li);
    setTimeout(function () { li.remove(); }, 5000);
  }
  function initForms() {
    $$('form[data-subscribe]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = $('input', f);
        if (inp.value) { toast('Subscribed!', 'You’ll receive our latest urology health articles.'); inp.value = ''; }
      });
    });
  }

  /* ---------- Scroll-to-top ---------- */
  function initTop() {
    var b = $('button[aria-label="Scroll to top"]');
    if (!b) return;
    var shown = false, ON = 'opacity-100 translate-y-0 pointer-events-auto', OFF = 'opacity-0 translate-y-4 pointer-events-none';
    function check() {
      var s = w.scrollY > 400;
      if (s !== shown) { shown = s; swap(b, s ? OFF : ON, s ? ON : OFF); }
    }
    w.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ---------- Home: auto-open booking once after scrolling past hero ---------- */
  function initAutoBooking() {
    var hero = d.getElementById('hero-section');
    if (!hero || ss('autoBookingShown') === '1') return;
    function onScroll() {
      if (w.scrollY > hero.offsetTop + hero.offsetHeight - 100) {
        ss('autoBookingShown', '1');
        w.removeEventListener('scroll', onScroll);
        openBooking();
      }
    }
    w.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Deferred third parties (load on first interaction) ---------- */
  var interacted = false, onInteract = [];
  function whenInteracted(fn) { interacted ? fn() : onInteract.push(fn); }
  function fireInteraction() {
    if (interacted) return;
    interacted = true;
    EVENTS.forEach(function (e) { w.removeEventListener(e, fireInteraction, opts); });
    onInteract.forEach(function (fn) { try { fn(); } catch (e) { /* ignore */ } });
  }
  var EVENTS = ['scroll', 'pointerdown', 'pointermove', 'touchstart', 'keydown', 'wheel'];
  var opts = { passive: true };
  EVENTS.forEach(function (e) { w.addEventListener(e, fireInteraction, opts); });

  function loadThirdParties() {
    // LeadConnector chat widget
    var s = d.createElement('script');
    s.src = 'https://widgets.leadconnectorhq.com/loader.js';
    s.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js');
    s.setAttribute('data-widget-id', '6a7aaa533bbada17430c9396');
    s.async = true;
    d.body.appendChild(s);
    // Meta pixel
    !(function (f, b, e, v, n, t, s2) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s2 = b.getElementsByTagName(e)[0]; s2.parentNode.insertBefore(t, s2);
    })(w, d, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    w.fbq('init', '1553933022405527');
    w.fbq('track', 'PageView');
  }

  function initHeroVideo() {
    var hero = d.getElementById('hero-section');
    if (!hero) return;
    var c = navigator.connection;
    if (c && c.saveData) return;
    var img = $('img', hero);
    var v = d.createElement('video');
    v.autoplay = v.loop = v.muted = v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    v.preload = 'auto';
    v.className = 'absolute inset-0 w-full h-full object-cover';
    v.innerHTML = '<source src="' + VIDEO_URL + '" type="video/mp4">';
    img.parentNode.insertBefore(v, img.nextSibling);
  }

  /* Lazy iframes (maps + embedded booking): inserted when visible after first interaction */
  function initIframes() {
    var holders = $$('[data-iframe]');
    if (!holders.length) return;
    function mount(h) {
      var a = JSON.parse(h.getAttribute('data-iframe'));
      var f = d.createElement('iframe');
      Object.keys(a).forEach(function (k) { f.setAttribute(k, a[k]); });
      h.replaceWith(f);
    }
    whenInteracted(function () {
      if (!('IntersectionObserver' in w)) return holders.forEach(mount);
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); mount(en.target); } });
      }, { rootMargin: '400px' });
      holders.forEach(function (h) { io.observe(h); });
    });
    holders.forEach(function (h) {
      var b = $('button', h);
      if (b) b.addEventListener('click', function () { mount(h); });
    });
  }

  /* ---------- Real booking confirmation notice (from the booking widget's postMessage) ---------- */
  function mask(n) { n = String(n).trim(); return n.length <= 2 ? n[0] + '*' : n.slice(0, 2) + '****'.slice(0, Math.min(n.length - 2, 4)); }
  function showBooked(name) {
    var old = $('[data-booked]'); if (old) old.remove();
    var el = d.createElement('div');
    el.setAttribute('data-booked', '');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.className = 'fixed bottom-4 left-3 right-3 z-[90] max-w-[15rem] sm:max-w-xs animate-in slide-in-from-bottom-4 fade-in duration-300';
    el.innerHTML = '<div class="relative bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-lg p-2.5 flex items-center gap-2.5 ring-1 ring-slate-900/5">' +
      '<div class="relative shrink-0"><div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14494E] to-[#1C6269] text-white flex items-center justify-center shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#7fd4d9]" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg></div>' +
      '<span class="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C56A4E] opacity-75"></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C56A4E] ring-2 ring-white"></span></span></div>' +
      '<div class="flex-1 min-w-0"><div class="flex items-center gap-1.5 mb-0.5"><span class="text-[11px] font-bold text-slate-900 truncate"></span><span class="text-[9px] font-semibold text-[#14494E] bg-[#14494E]/10 px-1.5 py-0.5 rounded-full shrink-0">Confirmed</span></div>' +
      '<p class="text-[11px] text-slate-600 leading-snug truncate"><span class="font-semibold text-slate-900">Just scheduled an appointment!</span></p>' +
      '<div class="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-medium"><span class="flex items-center gap-0.5 truncate">Cebu City</span><span class="shrink-0">•</span><span class="shrink-0">Just now</span></div></div>' +
      '<button aria-label="Dismiss notification" class="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors shrink-0">' + X_ICON('w-3.5 h-3.5') + '</button></div>';
    $('.truncate', el).textContent = mask(name);
    $('button', el).onclick = function () { el.remove(); };
    d.body.appendChild(el);
  }
  w.addEventListener('message', function (e) {
    try {
      var ok = false, who = 'A patient', m = e.data;
      if (Array.isArray(m)) {
        ok = m[0] === 'msgsndr-booking-complete' || m[0] === 'booking_complete';
        if (typeof m[2] === 'string') { try { var j = JSON.parse(m[2]); who = j.first_name || j.full_name || who; } catch (x) { /* ignore */ } }
      } else if (m && typeof m === 'object') {
        ok = m.event === 'msgsndr-booking-complete' || m.event === 'booking_complete' || m.type === 'booking_complete';
        who = m.name || m.first_name || who;
      }
      if (ok) showBooked(who);
    } catch (x) { /* ignore */ }
  });

  /* ---------- Delegated clicks ---------- */
  d.addEventListener('click', function (e) {
    var t = e.target.closest('button, [data-close]');
    if (!t) return;
    if (t.hasAttribute('data-close')) return closeBooking();
    if (t.hasAttribute('data-book')) return openBooking();
    if (t.hasAttribute('data-menu')) return toggleMenu(t);
    if (t.hasAttribute('data-acc')) return toggleAcc(t);
    if (t.getAttribute('aria-label') === 'Scroll to top') return w.scrollTo({ top: 0, behavior: 'smooth' });
  });

  initCarousel();
  initFilters();
  initForms();
  initTop();
  initAutoBooking();
  initIframes();
  whenInteracted(loadThirdParties);
  whenInteracted(initHeroVideo);
})();
