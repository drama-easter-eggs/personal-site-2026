/* Mei-Ling Chen — site behaviour.
   scroll reveal、scroll-linked 場景（--p）、人 × 的軸、導覽區塊指示、
   Hero 問句輪播、案例就地展開、手機選單、年份。
   （螢光筆的波形與流動、翻轉那一片色塊的刷入，全在 style.css。） */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Scroll reveal ----
     這一串選擇器要跟 style.css 的 MOTION 區塊一致（兩邊都改）。
     :not() 的那些容器不自己進場，交給裡面的每一列。 */

  var REVEAL = [
    '.eyebrow',
    '.col > *:where(:not(.threads, .cases, .cv, .talks, .pairs, .lenses, .fit, .teaching))',
    '.threads > *',
    '.cases > *',
    '.cv > *',
    '.teaching__header',
    '.teaching__topics > *',
    '.teaching__examples-head',
    '.talks > *',
    '.pairs > *',
    '.lenses__list > *',
    '.fit__ask > *',
    '.fit__says > *',
    '.fit__aside > *',
    '.turn__folio',
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
     兩塊在用，而且都是「motion 就是那句話本身」的那種用法，不是進場動畫：

       MOMENT 01（.vfield）  27 個關鍵字往中心收、退成背景 → 只剩一句
                             ＝ many worlds → one recurring question
       MOMENT 03（.turnover） 巨大的「我」退開、巨大的「你」接上來
                             ＝ 敘事主體從我換成你

     做法是每一塊自己是一段比視窗高的「跑道」（CSS 的 height），
     裡面一格 sticky 的舞台。--p ＝ 跑道已經走完的比例，
     所有位移、縮放、透明度都由 CSS 從 --p 推出來，JS 只寫這一個數字。

     為什麼不用 CSS 的 scroll-driven animation（animation-timeline: view()）：
     Firefox 還沒有，而這兩塊是這一版的骨幹，不能在某個瀏覽器上整塊消失。

     降級：
       reduced-motion  完全不建 observer、不寫 --p。CSS 那邊 .vfield 退回
                       正常流的兩層索引、.turnover 停在 --p: 1 的終局構圖，
                       兩塊都不 pin，靜態讀起來是完整的
       沒有 JS         同上（--p 的預設值就是那個終局） */

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

  /* ---- 1c. 人 × 的軸（MOMENT 05） ----
     三個研究方向共用同一個「人」。桌機上那個「人」是真的不動的（CSS 的
     sticky），這裡只負責告訴 CSS「現在讀到第幾個方向」，換的只有後面那個詞。
     那就是這一節要被看見的東西：中心不變，鏡片換。

     判斷帶跟導覽指示同一條（視窗中線附近）。離開判斷帶時不清掉 data-at：
     清掉會讓那個詞閃一下消失，而「人 ×」在那一刻反而應該留著。
     沒有 JS 時 CSS 讓整根軸不顯示，右欄的 h3（人 × 系統）照樣讀得到。 */

  var lensBox = document.querySelector('[data-lenses]');
  var lensRows = lensBox
    ? Array.prototype.slice.call(lensBox.querySelectorAll('[data-lens]'))
    : [];

  if (lensRows.length && 'IntersectionObserver' in window) {
    var lensAt = {};

    var lensSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var i = lensRows.indexOf(entry.target);
        if (entry.isIntersecting) lensAt[i] = 1;
        else delete lensAt[i];
      });
      /* 兩則同時命中判斷帶時取文件順序上比較前面的那一則 */
      for (var i = 0; i < lensRows.length; i++) {
        if (lensAt[i]) {
          lensBox.setAttribute('data-at', String(i));
          return;
        }
      }
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    lensRows.forEach(function (el) { lensSpy.observe(el); });
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

  /* ---- 1f. Selected Work：案例就地展開 ----
     元素是原生 <details>，所以沒有這段 JS 也能開合。這裡只多做三件事：

     ① 補間。<details> 原生是瞬間開關，這裡用 grid-template-rows 0fr → 1fr
        （不用 max-height 猜數字）。收合時要撐到動畫跑完才把 open 關掉，
        否則內容會在第一幀就消失。
     ② 網址。展開時把 hash 換成該案例的 id，載入時 hash 命中就自動展開——
        「把案例 03 傳給客戶」因此成立，不必為了分享另外開一個頁面。
        只碰 #case- 開頭的 hash，不會把 #work 這種區塊錨點吃掉。
     ③ 收合後把捲動位置錨回原處。內容變短、頁面觸底時瀏覽器會夾住 scrollY，
        整頁會往下抽一段；量一下摘要的位移補回去就好。

     可以同時展開多則，不做互斥手風琴：互斥會在你往下讀時把上面那則收掉，
     畫面自己跳一下，比多開幾則更擾人。 */

  var discs = Array.prototype.slice.call(document.querySelectorAll('[data-case]'));

  if (discs.length) {
    var hashOf = function (d) {
      var row = d.parentNode;
      return row && row.id ? row.id : '';
    };

    /* 網址代表「最上面那則展開中的案例」。一則都沒開就把 #case- 收掉。 */
    var syncHash = function () {
      var open = null;
      discs.forEach(function (d) { if (!open && d.open) open = d; });
      var id = open ? hashOf(open) : '';

      if (id) {
        if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
      } else if (/^#case-/.test(location.hash)) {
        history.replaceState(null, '', location.pathname + location.search);
      }
    };

    var keepInPlace = function (head, before) {
      var delta = head.getBoundingClientRect().top - before;
      if (Math.abs(delta) < 1) return;
      /* html 有 scroll-behavior: smooth，這裡要的是瞬間補位，不是捲動 */
      window.scrollTo({ top: window.pageYOffset + delta, behavior: 'instant' });
    };

    /* 動畫進行中的那一則記在這裡：collapse 要跑完才會把 open 關掉，
       所以動畫期間不能拿 d.open 當作「現在是開還是關」——
       want 才是「這一次要走到哪個狀態」。 */
    var busy = {};

    var run = function (d, open) {
      var wrap = d.querySelector('.case__wrap');
      var head = d.querySelector('.case__head');
      var id = hashOf(d);

      /* 上一次的動畫還沒跑完就又被按了：先把它結掉再開新的。
         不這樣做的話，連按兩下的第二下會被丟掉，看起來像沒反應。 */
      if (busy[id]) busy[id].finish();

      var before = head.getBoundingClientRect().top;

      if (!wrap || reduced) {
        d.open = open;
        if (!open) keepInPlace(head, before);
        syncHash();
        return;
      }

      d.classList.add('is-moving');
      if (open) d.open = true;        /* 先掛上去才量得到、也才動得起來 */

      wrap.style.gridTemplateRows = open ? '0fr' : '1fr';
      void wrap.offsetHeight;         /* 逼出一次 reflow，否則兩個值會被合成一個 */
      wrap.style.gridTemplateRows = open ? '1fr' : '0fr';

      var fallback = null;

      var finish = function () {
        busy[id] = null;
        wrap.removeEventListener('transitionend', onEnd);
        window.clearTimeout(fallback);
        if (!open) d.open = false;
        wrap.style.gridTemplateRows = '';
        d.classList.remove('is-moving');
        if (!open) keepInPlace(head, before);
        syncHash();
      };

      var onEnd = function (e) {
        if (e.target === wrap && e.propertyName === 'grid-template-rows') finish();
      };

      busy[id] = { finish: finish, want: open };
      wrap.addEventListener('transitionend', onEnd);
      /* transitionend 沒來（分頁被切走、瀏覽器不轉這個屬性）也要收得了尾 */
      fallback = window.setTimeout(finish, 700);
    };

    discs.forEach(function (d) {
      var head = d.querySelector('.case__head');
      if (!head) return;

      /* 攔下原生開合，改走上面的補間。鍵盤的 Enter / Space 在 <summary> 上
         一樣會派送 click，所以這一條同時涵蓋滑鼠與鍵盤。 */
      head.addEventListener('click', function (e) {
        e.preventDefault();
        var id = hashOf(d);
        var now = busy[id] ? busy[id].want : d.open;
        run(d, !now);
      });

      /* Ctrl+F 找到收合中的字時，瀏覽器會自己把 <details> 打開（不經過 click），
         這條讓那種情況下的網址也跟著對。 */
      d.addEventListener('toggle', function () {
        if (!d.classList.contains('is-moving')) syncHash();
      });
    });

    /* 帶著 #case-xxx 進來就展開那一則並捲到位。
       hashchange 那一條管的是「站內連到某一則案例」——同頁換 hash 不會重新載入，
       所以只在載入時跑一次還不夠。 */
    var openFromHash = function (smooth) {
      var landed = location.hash.slice(1);
      if (!/^case-/.test(landed)) return;
      var row = document.getElementById(landed);
      var target = row && row.querySelector('[data-case]');
      if (!target) return;
      if (!target.open) run(target, true);
      /* 載入時瀏覽器已經捲過一次，但那是圖片與字型都還沒就位時算的位置，
         常常差好幾百 px。自己再捲一次（scroll-margin-top 會讓它停在導覽下方）。 */
      row.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'instant' });
    };

    /* 捲兩次：load（圖片就位）之後一次，字型換上去之後再一次。
       中文字型晚到會把上面所有段落的行數改掉，只捲第一次會差好幾百 px。
       openFromHash 對已經展開的那一則只會重捲，不會再開一次。 */
    window.addEventListener('load', function () {
      openFromHash(false);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { openFromHash(false); });
      }
    });
    window.addEventListener('hashchange', function () { openFromHash(true); });
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
