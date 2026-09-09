/* Mei-Ling Chen — site behaviour.
   scroll reveal、scroll-linked 場景（--p）、導覽區塊指示、
   Hero 問句輪播、案例翻卡與閱讀 dialog、手機選單、年份。
   （螢光筆的波形與流動全在 style.css，不需要 JS。） */

(function () {
  'use strict';

  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motionPreference.matches;

  /* Count up once on entry; retain the final value without motion or JS. */
  var countValues = document.querySelectorAll('[data-count]');
  if (!reduced && 'IntersectionObserver' in window) {
    var counts = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        var el = entry.target;
        var target = Number(el.dataset.count);
        var started;
        function tick(now) {
          if (started === undefined) started = now;
          var progress = motionPreference.matches ? 1 : Math.min((now - started) / 1400, 1);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    countValues.forEach(function (el) { counts.observe(el); });
  }

  /* ---- 1. Scroll reveal ----
     這一串選擇器要跟 style.css 的 MOTION 區塊一致（兩邊都改）。
     :not() 的那些容器不自己進場，交給裡面的每一列。 */

  var REVEAL = [
    '.eyebrow',
    '.col > *:where(:not(.threads, .cases, .cv, .talks, .cards, .posts, .reach-stages, .teaching))',
    '.threads > *',
    '.cases > *',
    '.cv > *',
    '.teaching__header',
    '.teaching__topics > *',
    '.teaching__examples-head',
    '.talks > *',
    '.cards > *',
    '.posts > *',
    '.reach-stages > *',
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

  /* ---- 1b. Scroll-linked 場景：把捲動位置換算成 --p（0 → 1） ----
     現在只有一塊在用，而且是「motion 就是那句話本身」的那種用法，
     不是進場動畫：

       MOMENT 01（.vfield）  五個領域站在同一圈上，讀完之後一起收回正中央
                             那顆圓，圓裡的提問換成那一句，最後插圖從圓的
                             右下角浮出來、壓出圓外
                             ＝ many industries → one recurring human need

     做法是那一塊自己是一段比視窗高的「跑道」（CSS 的 height），
     裡面一格 sticky 的舞台。--p ＝ 跑道已經走完的比例，
     所有位移、縮放、透明度都由 CSS 從 --p 推出來，JS 只寫這一個數字。
     機制寫成通吃 [data-scene] 的，所以再多一塊場不用改這裡。

     為什麼不用 CSS 的 scroll-driven animation（animation-timeline: view()）：
     Firefox 還沒有，而這一塊是這一版的骨幹，不能在某個瀏覽器上整塊消失。

     降級：
       reduced-motion  完全不建 observer、不寫 --p。CSS 那邊 .vfield 退回
                       正常流的兩層索引、不 pin，靜態讀起來是完整的
       沒有 JS         同上 */

  var scenes = Array.prototype.slice.call(document.querySelectorAll('[data-scene]'));

  if (scenes.length && !reduced) {
    var live = [];          /* 目前在畫面上的場景，只算這幾個 */
    var queued = false;

    var paint = function () {
      queued = false;
      var vh = window.innerHeight;
      for (var i = 0; i < live.length; i++) {
        var box = live[i].getBoundingClientRect();
        /* 跑道比視窗高出來的那一段就是 pin 的行程。行程 ≤ 0（例如視窗
           比跑道還高）時不硬算，直接給終局，否則會除以零。 */
        var travel = box.height - vh;
        var p = travel > 0 ? -box.top / travel : 1;
        live[i].style.setProperty('--p', (p < 0 ? 0 : p > 1 ? 1 : p).toFixed(4));
      }
    };

    /* 一帧只算一次。scroll 事件在觸控裝置上一次滑動會來幾十次，
       每次都量 getBoundingClientRect 會逼出多餘的 layout。 */
    var queue = function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(paint);
    };

    var watching = false;
    var listen = function (on) {
      if (on === watching) return;
      watching = on;
      if (on) window.addEventListener('scroll', queue, { passive: true });
      else window.removeEventListener('scroll', queue);
    };

    var sceneWatch = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var at = live.indexOf(entry.target);
        if (entry.isIntersecting) { if (at < 0) live.push(entry.target); }
        else if (at >= 0) live.splice(at, 1);
      });
      /* 畫面上一個場景都沒有就把 scroll 監聽拆掉——整頁大部分的位置
         都不在這兩塊裡面，不需要一直算。 */
      listen(live.length > 0);
      if (live.length) queue();
    }, { threshold: 0 });

    scenes.forEach(function (el) { sceneWatch.observe(el); });

    /* 轉向、換視窗大小都會改變行程長度；字型晚到會改變前面所有段落的行數，
       進而改變跑道的位置。兩個時機都重算一次。 */
    window.addEventListener('resize', queue, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(queue);
    }
    paint();
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

      /* 章際交界（.turn 那段停頓）落在判斷帶上時，一節都不命中。
         這時維持上一個指示不動——把它清掉會讓導覽的短線在翻章時閃一下，
         而「翻章」正是最需要知道自己在哪的時候。 */
      if (!current) return;

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
     「人們為什麼」不動，只換後半句。四句都已經在 DOM 裡（.hero__rotator 是 grid，
     四句疊在同一格），所以這裡只負責換 class，不碰文字、不量高度。

     順序：每一輪把四句洗牌，照洗完的順序播一次，一輪之內不重複；
     播完再洗下一輪，並確保新的第一句不等於上一輪的最後一句
     （不然會看起來像卡住沒換）。

     節奏：一句停 6.5 秒；減少動態時停在當前問句，換句是「舊的原地淡出 → 新的上浮 14px 淡入」，
     跟全站同一個手勢。畫面看不到（捲走了、切到別的分頁）就停在當下這一句，
     回來才繼續——不讓看不見的地方一直在動。 */

  var rotator = document.querySelector('[data-rotator]');
  var lines = rotator
    ? Array.prototype.slice.call(rotator.querySelectorAll('[data-line]'))
    : [];

  if (lines.length > 1) {
    var HOLD = 6500;                  /* 一句停留多久（讀完一句問題的時間） */
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

    var idle = function () { return document.hidden || !inView || motionPreference.matches; };

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
    current = reduced ? lines[0] : lines[order[0]];
    at = 1;
    current.style.transition = 'none';
    current.classList.add('is-active');
    void current.offsetWidth;
    current.style.transition = '';

    motionPreference.addEventListener('change', function () {
      if (motionPreference.matches) stop();
      else resume();
    });

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

  /* ---- 1f. Selected Work: flip a card into its reading dialog ----
     The original details markup remains usable without JS / dialog support.
     Move (do not duplicate) each story, preserving its text and markup. */
  var discs = Array.prototype.slice.call(document.querySelectorAll('[data-case]'));
  if (discs.length && typeof HTMLDialogElement !== 'undefined' && HTMLDialogElement.prototype.showModal) {
    var caseEntries = [];
    var activeCase = null;
    var pendingCase = null;
    var openingTimer = null;
    var closingTimer = null;
    var returnHash = '';
    var savedOverflow = '';
    var savedBodyOverflow = '';

    var cancelPending = function () {
      window.clearTimeout(openingTimer);
      if (pendingCase) pendingCase.row.classList.remove('is-opening');
      pendingCase = null;
    };
    var finishClose = function (restoreHash, restoreFocus) {
      window.clearTimeout(closingTimer);
      if (!activeCase) return;
      var entry = activeCase;
      activeCase = null;
      entry.dialog.close();
      entry.dialog.classList.remove('is-closing');
      entry.row.classList.remove('is-active', 'is-opening');
      entry.head.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = savedOverflow;
      document.body.style.overflow = savedBodyOverflow;
      if (restoreHash && location.hash === '#' + entry.row.id) {
        history.replaceState(null, '', location.pathname + location.search + returnHash);
      }
      if (restoreFocus) entry.head.focus({ preventScroll: true });
    };
    var closeCase = function () {
      cancelPending();
      if (!activeCase || activeCase.dialog.classList.contains('is-closing')) return;
      if (motionPreference.matches) { finishClose(true, true); return; }
      activeCase.dialog.classList.add('is-closing');
      closingTimer = window.setTimeout(function () { finishClose(true, true); }, 180);
    };
    var openCase = function (entry, fromHash) {
      cancelPending();
      if (activeCase === entry) return;
      if (activeCase) finishClose(false, false);
      returnHash = /^#case-/.test(location.hash) ? '#work' : location.hash;
      var reveal = function () {
        pendingCase = null;
        activeCase = entry;
        savedOverflow = document.documentElement.style.overflow;
        savedBodyOverflow = document.body.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        entry.dialog.showModal();
        entry.panel.scrollTop = 0;
        entry.title.focus({ preventScroll: true });
        entry.head.setAttribute('aria-expanded', 'true');
        entry.row.classList.remove('is-opening');
        entry.row.classList.add('is-active');
        if (!fromHash) history.replaceState(null, '', '#' + entry.row.id);
      };
      if (motionPreference.matches || fromHash) { reveal(); return; }
      pendingCase = entry;
      entry.row.classList.add('is-opening');
      openingTimer = window.setTimeout(reveal, 320);
    };

    discs.forEach(function (disc) {
      var row = disc.parentNode;
      var head = disc.querySelector('.case__head');
      var wrap = disc.querySelector('.case__wrap');
      if (!head || !wrap) return;
      var dialog = document.createElement('dialog');
      dialog.className = 'case-modal';
      dialog.id = row.id + '-modal';
      dialog.setAttribute('aria-labelledby', row.id + '-title');
      var bar = document.createElement('div');
      bar.className = 'case-modal__bar';
      var index = document.createElement('span');
      index.className = 'case-modal__index';
      index.textContent = head.querySelector('.case__no').textContent + ' / SELECTED WORK';
      var close = document.createElement('button');
      close.type = 'button';
      close.className = 'case-modal__close';
      close.innerHTML = '<span aria-hidden="true">×</span>';
      close.title = '關閉案例';
      close.setAttribute('aria-label', '關閉案例，回到卡片');
      bar.append(index, close);
      var body = document.createElement('div');
      body.className = 'case-modal__body';
      var title = document.createElement('h2');
      title.className = 'case-modal__title';
      title.id = row.id + '-title';
      title.tabIndex = -1;
      title.innerHTML = head.querySelector('.case__q').innerHTML;
      var intro = document.createElement('div');
      intro.className = 'case-modal__intro';
      head.querySelectorAll('.case__line').forEach(function (line) {
        var p = document.createElement('p');
        p.textContent = line.textContent;
        intro.appendChild(p);
      });
      body.append(title, intro, wrap);
      var panel = document.createElement('div');
      panel.className = 'case-modal__panel';
      panel.append(bar, body);
      dialog.appendChild(panel);
      document.body.appendChild(dialog);
      disc.open = false;
      head.setAttribute('role', 'button');
      head.setAttribute('aria-haspopup', 'dialog');
      head.setAttribute('aria-controls', dialog.id);
      head.setAttribute('aria-expanded', 'false');
      var entry = { row: row, head: head, dialog: dialog, panel: panel, title: title };
      caseEntries.push(entry);
      head.addEventListener('click', function (event) {
        event.preventDefault();
        if (pendingCase === entry) { cancelPending(); return; }
        openCase(entry, false);
      });
      close.addEventListener('click', closeCase);
      dialog.addEventListener('cancel', function (event) { event.preventDefault(); closeCase(); });
      // Both ends of a pointer gesture must be outside the dialog to dismiss it.
      var startedOutside = false;
      var isOutside = function (event) {
        var rect = panel.getBoundingClientRect();
        return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      };
      dialog.addEventListener('pointerdown', function (event) { startedOutside = event.target === dialog && isOutside(event); });
      dialog.addEventListener('click', function (event) {
        if (event.target === dialog && startedOutside && isOutside(event)) closeCase();
        startedOutside = false;
      });
    });
    var openCaseFromHash = function () {
      var entry = caseEntries.find(function (item) { return '#' + item.row.id === location.hash; });
      if (entry) openCase(entry, true);
      else { cancelPending(); finishClose(false, false); }
    };
    window.addEventListener('hashchange', openCaseFromHash);
    // Escape can also cancel the brief card flip before the dialog opens.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && pendingCase) cancelPending();
    });
    openCaseFromHash();
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
