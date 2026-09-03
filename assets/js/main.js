/* Mei-Ling Chen — site behaviour.
   Three small jobs: the highlighter marks, the mobile menu, the year. */

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
