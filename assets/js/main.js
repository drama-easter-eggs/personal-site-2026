/* Mei-Ling Chen — site behaviour.
   Three small jobs: the highlighter marks, the mobile menu, the year. */

(function () {
  'use strict';

  /* ---- 1. Highlighter marks draw themselves in on scroll ---- */
  var marks = document.querySelectorAll('[data-mark]');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
