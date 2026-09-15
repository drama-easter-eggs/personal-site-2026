(function () {
  'use strict';

  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motionPreference.matches;

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
    '.contact__head',
    '.contact__social',
    '.contact__act > *'
  ].join(', ');

  var units = document.querySelectorAll(REVEAL);
  var STEP = 55;
  var STEP_MAX = 5;

  if (reduced || !('IntersectionObserver' in window)) {
    units.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var rise = new IntersectionObserver(function (entries, obs) {

      var batch = entries
        .filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

      batch.forEach(function (entry, i) {
        var el = entry.target;
        if (i) {
          el.style.transitionDelay = Math.min(i, STEP_MAX) * STEP + 'ms';

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

  var scenes = Array.prototype.slice.call(document.querySelectorAll('[data-scene]'));

  if (scenes.length && !reduced) {
    var live = [];
    var queued = false;

    var paint = function () {
      queued = false;
      var vh = window.innerHeight;
      for (var i = 0; i < live.length; i++) {
        var box = live[i].getBoundingClientRect();

        var travel = box.height - vh;
        var p = travel > 0 ? -box.top / travel : 1;
        live[i].style.setProperty('--p', (p < 0 ? 0 : p > 1 ? 1 : p).toFixed(4));
      }
    };

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

      listen(live.length > 0);
      if (live.length) queue();
    }, { threshold: 0 });

    scenes.forEach(function (el) { sceneWatch.observe(el); });

    window.addEventListener('resize', queue, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(queue);
    }
    paint();
  }

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

      var current = null;
      targets.forEach(function (el) { if (!current && here[el.id]) current = el.id; });

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

  var rotator = document.querySelector('[data-rotator]');
  var lines = rotator
    ? Array.prototype.slice.call(rotator.querySelectorAll('[data-line]'))
    : [];

  if (lines.length > 1) {
    var CYCLE = 4000;
    var OUT = reduced ? 0 : 620;
    var HOLD = Math.max(0, CYCLE - OUT);

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
      if (idle()) return;

      if (at >= order.length) {
        prevLast = order[order.length - 1];
        shuffle();
      }

      var next = lines[order[at]];
      var out = current;
      at += 1;

      out.classList.remove('is-active');
      out.classList.add('is-leaving');

      window.setTimeout(function () { out.classList.remove('is-leaving'); }, OUT + 80);
      window.setTimeout(function () { next.classList.add('is-active'); }, OUT);

      current = next;
      timer = window.setTimeout(tick, OUT + HOLD);
    };

    var resume = function () {
      if (idle() || timer !== null) return;
      timer = window.setTimeout(tick, HOLD);
    };

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
      index.textContent = 'RESEARCH STORY ' + disc.dataset.story + ' / ' + head.querySelector('.case__topic').textContent;
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
      body.append(title, wrap);
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

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && pendingCase) cancelPending();
    });
    openCaseFromHash();
  }

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

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
