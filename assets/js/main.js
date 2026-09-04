/* Mei-Ling Chen — site behaviour.
   Five small jobs: 筆觸造型、螢光筆進場、scroll reveal、導覽區塊指示、
   手機選單、年份。 */

(function () {
  'use strict';

  var marks = document.querySelectorAll('[data-mark]');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1a. Fit the wobble to each mark's length ----
     筆觸的 SVG 是 preserveAspectRatio='none'，會被拉滿整段文字，所以固定週期
     數的話越長的一筆抖得越鬆。這裡按字數重算週期數，讓波長不隨長度改變：
     不管畫在四個字還是二十個字上，抖動的疏密都一樣。
     （style.css 裡那條 8 週期的路徑只是 JS 接手前的預設值。） */
  var WAVE = { h: 24, cy: 12, thick: 13, amp: 4, seg: 20 };   /* seg = 半週期寬 */
  var DENSITY = 1;   /* 每個漢字幾個起伏。1 = 波長 ~1em；改大變密，改小變疏。 */

  function wavePath(periods, flip) {
    var w = WAVE, half = w.seg, ctl = Math.round(half * 0.35), n = periods * 2;
    var sgn = flip ? -1 : 1;
    var mid = function (i) { return w.cy + sgn * (i % 2 === 0 ? w.amp : -w.amp); };
    var d = 'M0 ' + (mid(0) - w.thick / 2);
    var i, x1, yb;
    for (i = 0; i < n; i++) {                                  /* 上緣，左→右 */
      x1 = (i + 1) * half; yb = mid(i + 1) - w.thick / 2;
      d += i === 0
        ? 'C' + ctl + ' ' + (mid(0) - w.thick / 2) + ' ' + (x1 - ctl) + ' ' + yb + ' ' + x1 + ' ' + yb
        : 'S' + (x1 - ctl) + ' ' + yb + ' ' + x1 + ' ' + yb;
    }
    d += 'L' + n * half + ' ' + (mid(n) + w.thick / 2);
    for (i = n - 1; i >= 0; i--) {                             /* 下緣，右→左 */
      x1 = i * half; yb = mid(i) + w.thick / 2;
      d += i === n - 1
        ? 'C' + ((i + 1) * half - ctl) + ' ' + (mid(n) + w.thick / 2) + ' ' + (x1 + ctl) + ' ' + yb + ' ' + x1 + ' ' + yb
        : 'S' + (x1 + ctl) + ' ' + yb + ' ' + x1 + ' ' + yb;
    }
    return d + 'Z';
  }

  var teal = (getComputedStyle(document.documentElement)
    .getPropertyValue('--teal') || '#5cb2a0').trim();

  marks.forEach(function (m) {
    var len = (m.textContent || '').replace(/\s/g, '').length;
    var periods = Math.max(3, Math.min(40, Math.round(len * DENSITY)));
    var flip = m.classList.contains('mark--b');
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " +
      (periods * WAVE.seg * 2) + ' ' + WAVE.h + "' preserveAspectRatio='none'>" +
      "<path d='" + wavePath(periods, flip) + "' fill='" + teal + "'/></svg>";
    m.style.backgroundImage =
      'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, '%27') + '")';
  });

  /* ---- 1b. Marks draw themselves in on scroll ---- */

  if (reduced || !('IntersectionObserver' in window)) {
    marks.forEach(function (m) { m.classList.add('is-marked'); });
  } else {
    var seen = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-marked');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6, rootMargin: '0px 0px -10% 0px' });

    marks.forEach(function (m) { seen.observe(m); });
  }

  /* ---- 1c. Scroll reveal ----
     這一串選擇器要跟 style.css 的 MOTION 區塊一致（兩邊都改）。
     :not() 的那些容器不自己進場，交給裡面的每一列。 */

  var REVEAL = [
    '.eyebrow',
    '.col > *:where(:not(.threads, .cases, .counters, .cv, .teach, .talks, .cards, .lenses, .fit))',
    '.threads > *',
    '.cases > *',
    '.counters__item',
    '.cv > *',
    '.teach > *',
    '.talks > *',
    '.cards > *',
    '.lenses > *',
    '.fit__col > *:where(:not(.fit__list))',
    '.fit__list > *',
    '.contact__panel > *'
  ].join(', ');

  var units = document.querySelectorAll(REVEAL);
  var STEP = 55;      /* 錯開一階的毫秒 */
  var STEP_MAX = 5;   /* 最多錯開幾階——七項的清單再等下去就變成在看動畫 */

  if (reduced || !('IntersectionObserver' in window)) {
    units.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var rise = new IntersectionObserver(function (entries, obs) {
      /* 錯開量不寫死在 nth-child，而是看「這一批同時進到畫面的有幾個」：
         卡片一次進來四張就依序錯開，慢慢捲的時候每一列都是 i = 0，
         不會有那種明明已經看到了卻還在等的假延遲。 */
      var batch = entries
        .filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

      batch.forEach(function (entry, i) {
        var el = entry.target;
        if (i) {
          el.style.transitionDelay = Math.min(i, STEP_MAX) * STEP + 'ms';
          /* 進完場就把 delay 收掉，不然 email 那類還有 hover 的元素
             會連 hover 都慢半拍。 */
          el.addEventListener('transitionend', function done() {
            el.style.transitionDelay = '';
            el.removeEventListener('transitionend', done);
          });
        }
        el.classList.add('is-in');
        obs.unobserve(el);
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

    units.forEach(function (el) { rise.observe(el); });
  }

  /* ---- 1d. 導覽的區塊指示 ----
     .eyebrow 是 sticky 的，讓你知道「這一節是什麼」；
     這裡補的是「整頁走到哪」。用視窗中線附近那一帶判斷目前的區塊，
     命中的那一項底下畫一道 teal 短線（樣式在 style.css）。
     桌機版 .nav__links-cta 是收起來的，所以右端的「聊聊」也一起納入：
     捲到 Contact 時它換成 sand 底，等於「你已經在這了」。 */

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"], .nav__cta[href^="#"]'));

  if (navLinks.length && 'IntersectionObserver' in window) {
    var targets = [], byId = {};

    navLinks.forEach(function (a) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (!el || byId[el.id]) return;
      byId[el.id] = a;
      targets.push(el);
    });

    var here = {};

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) here[entry.target.id] = 1;
        else delete here[entry.target.id];
      });

      /* 兩節交界時可能同時命中，取文件順序上比較前面的那一節 */
      var current = null;
      targets.forEach(function (el) { if (!current && here[el.id]) current = el.id; });

      navLinks.forEach(function (a) {
        if (current && a.getAttribute('href') === '#' + current) {
          a.setAttribute('aria-current', 'location');
        } else {
          a.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    targets.forEach(function (el) { spy.observe(el); });
  }

  /* ---- 2. Mobile menu ---- */
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  if (toggle && links) {
    var setOpen = function (open) {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!links.classList.contains('is-open')) return;
      if (e.target.closest('.nav')) return;
      setOpen(false);
    });
  }

  /* ---- 3. Year ---- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
