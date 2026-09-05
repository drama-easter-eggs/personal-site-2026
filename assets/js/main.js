/* Mei-Ling Chen — site behaviour.
   scroll reveal、導覽區塊指示、Hero 問句輪播、手機選單、年份。
   （螢光筆的波形與流動全在 style.css，不需要 JS。） */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Scroll reveal ----
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

  /* ---- 1e. Hero 問句輪播 ----
     「人們為什麼」不動，只換後半句。六句都已經在 DOM 裡（.hero__rotator 是 grid，
     六句疊在同一格），所以這裡只負責換 class，不碰文字、不量高度。

     順序：每一輪把六句洗牌，照洗完的順序播一次，一輪之內不重複；
     播完再洗下一輪，並確保新的第一句不等於上一輪的最後一句
     （不然會看起來像卡住沒換）。

     節奏：一句停 4.6 秒，換句是「舊的原地淡出 → 新的上浮 14px 淡入」，
     跟全站同一個手勢。畫面看不到（捲走了、切到別的分頁）就停在當下這一句，
     回來才繼續——不讓看不見的地方一直在動。 */

  var rotator = document.querySelector('[data-rotator]');
  var lines = rotator
    ? Array.prototype.slice.call(rotator.querySelectorAll('[data-line]'))
    : [];

  if (lines.length > 1) {
    var HOLD = 4600;                  /* 一句停留多久（讀完一句問題的時間） */
    var OUT = reduced ? 0 : 620;      /* 淡出時間，對齊 CSS 的 --dur-rise */

    var order = [], at = 0, prevLast = -1;
    var current = null, timer = null, inView = true;

    var shuffle = function () {
      var i, j, t, n = lines.length;
      order = [];
      for (i = 0; i < n; i++) order.push(i);
      for (i = n - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        t = order[i]; order[i] = order[j]; order[j] = t;
      }
      /* 跟上一輪的最後一句撞頭就換掉第一個位置 */
      if (order[0] === prevLast) {
        j = 1 + Math.floor(Math.random() * (n - 1));
        t = order[0]; order[0] = order[j]; order[j] = t;
      }
      at = 0;
    };

    var idle = function () { return document.hidden || !inView; };

    var stop = function () {
      if (timer === null) return;
      window.clearTimeout(timer);
      timer = null;
    };

    var tick = function () {
      timer = null;
      if (idle()) return;             /* 停在目前這一句，resume() 會接回去 */

      if (at >= order.length) {
        prevLast = order[order.length - 1];
        shuffle();
      }

      var next = lines[order[at]];
      var out = current;
      at += 1;

      out.classList.remove('is-active');
      out.classList.add('is-leaving');
      /* 這兩個短 timer 不進 timer 變數：換句一旦開始就讓它換完，
         中途被暫停也不會停在「舊的已淡出、新的還沒進場」的空白。 */
      window.setTimeout(function () { out.classList.remove('is-leaving'); }, OUT + 80);
      window.setTimeout(function () { next.classList.add('is-active'); }, OUT);

      current = next;
      timer = window.setTimeout(tick, OUT + HOLD);
    };

    var resume = function () {
      if (idle() || timer !== null) return;
      timer = window.setTimeout(tick, HOLD);
    };

    /* 第一句：先把 transition 關掉再上 is-active，
       否則它會跟 .hero__rotator 的載入動畫疊成上浮兩次。 */
    shuffle();
    current = lines[order[0]];
    at = 1;
    current.style.transition = 'none';
    current.classList.add('is-active');
    void current.offsetWidth;
    current.style.transition = '';

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else resume();
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) resume();
        else stop();
      }, { threshold: 0 }).observe(rotator);
    }

    resume();
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
