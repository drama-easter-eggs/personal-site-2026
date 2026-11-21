
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initCopyButtons() {
    var buttons = document.querySelectorAll('[data-copy]');
    Array.prototype.forEach.call(buttons, function (btn) {
      var toast = btn.querySelector('.btn-cta__toast');
      var timer = null;

      function showToast() {
        if (!toast) return;
        clearTimeout(timer);
        toast.classList.remove('is-shown');

        void toast.offsetWidth;
        toast.classList.add('is-shown');
        timer = setTimeout(function () { toast.classList.remove('is-shown'); }, 1800);
      }

      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(showToast, showToast);
          return;
        }
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try { document.execCommand('copy'); } catch (e) {  }
        document.body.removeChild(ta);
        showToast();
      });
    });
  }
  initCopyButtons();

  function initGlossary() {
    var glosses = document.querySelectorAll('.gloss');
    Array.prototype.forEach.call(glosses, function (gloss) {
      var term = gloss.querySelector('.gloss__term');
      var body = gloss.querySelector('.gloss__body');
      if (!term || !body) return;

      gloss.classList.add('is-ready');
      term.setAttribute('aria-expanded', 'false');

      term.addEventListener('click', function () {
        var isOpen = gloss.hasAttribute('data-open');
        if (isOpen) gloss.removeAttribute('data-open');
        else gloss.setAttribute('data-open', '');
        term.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      });
    });
  }
  initGlossary();

  function scaleCharts() {
    var groups = document.querySelectorAll('.chart, .versus > div');
    Array.prototype.forEach.call(groups, function (group) {
      var fills = group.querySelectorAll('.fill');
      if (!fills.length) return;

      var values = Array.prototype.map.call(fills, function (fill) {
        return parseFloat(fill.style.getPropertyValue('--v')) || 0;
      });
      var max = Math.max.apply(null, values);
      if (!max) return;

      Array.prototype.forEach.call(fills, function (fill, i) {
        fill.style.width = (values[i] / max * 100).toFixed(2) + '%';
      });
    });
  }
  scaleCharts();

  var animTargets = document.querySelectorAll('.chart, .versus, .stack, .reveal');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    Array.prototype.forEach.call(animTargets, function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(animTargets, function (el) { revealObserver.observe(el); });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      Array.prototype.forEach.call(animTargets, function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) el.classList.add('in');
      });
    });
  }

  var navLinks = document.getElementById('navLinks');
  var navToggle = document.getElementById('navToggle');
  var links = navLinks ? navLinks.querySelectorAll('a') : [];
  var sections = [];

  Array.prototype.forEach.call(links, function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) sections.push({ id: id, el: section, link: link });
  });

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  Array.prototype.forEach.call(links, function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  function setActive(id) {
    sections.forEach(function (s) {
      if (s.id === id) s.link.setAttribute('aria-current', 'true');
      else s.link.removeAttribute('aria-current');
    });
  }

  var progress = document.getElementById('progress');
  var toTop = document.getElementById('toTop');
  var ticking = false;

  var sceneWash = document.querySelector('[data-scene-wash]');
  var sceneTarget = document.querySelector('[data-scene-target]');
  var sceneCircle = document.querySelector('[data-scene-circle]');
  var sceneSection = sceneWash ? sceneWash.closest('.chapter--scene') : null;
  var scenePin = sceneSection ? sceneSection.querySelector('.scene-pin') : null;
  var navH = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 0;
  var sceneCircleMaxScale = 1;

  function measureSceneCircle() {
    if (!sceneCircle) return;
    var base = sceneCircle.offsetWidth;
    if (!base) return;
    var reach = Math.max(window.innerWidth, window.innerHeight) * 2.4;
    sceneCircleMaxScale = reach / base;
  }
  measureSceneCircle();

  function updateScene() {
    if (reduceMotion || !sceneWash || !sceneTarget) return;
    var viewH = window.innerHeight;
    var rect = sceneTarget.getBoundingClientRect();
    var span = viewH - navH;
    var enter = span > 0 ? (viewH - rect.top) / span : 0;
    enter = Math.max(0, Math.min(1, enter));

    var exit = 0;
    if (sceneSection && span > 0) {
      var sect = sceneSection.getBoundingClientRect();
      exit = Math.max(0, Math.min(1, (viewH - sect.bottom) / span));
    }
    var fade = 1 - exit;

    var wash = enter * fade;
    sceneWash.style.opacity = wash.toFixed(3);

    if (scenePin) {
      var handoff = Math.max(0, Math.min(1, (1 - enter) / 0.15));
      scenePin.style.opacity = (handoff * fade).toFixed(3);
    }
    if (sceneCircle) {
      var scale = 1 + enter * (sceneCircleMaxScale - 1);
      sceneCircle.style.transform = 'scale(' + scale.toFixed(3) + ')';
    }
  }

  var heroArt = document.querySelector('[data-hero-art]');
  var heroLayers = heroArt
    ? Array.prototype.slice.call(heroArt.querySelectorAll('[data-hero-layer]')).map(function (el) {
        var depth = parseFloat(
          window.getComputedStyle(el).getPropertyValue('--depth')
        );
        return { el: el, depth: depth || 0, last: null };
      })
    : [];

  var HERO_PARALLAX_RANGE = 220;

  var HERO_GRAB_REACH = 44;

  var heroSpan = 0;

  var heroScale = 1;

  function measureHeroArt() {
    if (!heroArt) return;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var rect = heroArt.getBoundingClientRect();
    heroSpan = rect.top + scrollTop + rect.height;
    heroScale = Math.min(1, rect.width / 580);
  }
  measureHeroArt();

  function updateHeroArt() {
    if (reduceMotion || !heroLayers.length || heroSpan <= 0) return;

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var p = Math.max(0, Math.min(1, scrollTop / heroSpan));
    var reach = HERO_PARALLAX_RANGE * heroScale;

    heroLayers.forEach(function (layer) {
      var shift = Math.round(p * layer.depth * reach * 10) / 10;
      if (shift === layer.last) return;
      layer.last = shift;
      layer.el.style.setProperty('--shift', shift + 'px');
    });
  }

  function heroGrabOffset(el) {

    var m = window.getComputedStyle(el).transform;
    if (!m || m === 'none') return { x: 0, y: 0 };
    var nums = m.replace(/^matrix(3d)?\(/, '').replace(/\)$/, '').split(',');
    return nums.length === 16
      ? { x: parseFloat(nums[12]) || 0, y: parseFloat(nums[13]) || 0 }
      : { x: parseFloat(nums[4]) || 0, y: parseFloat(nums[5]) || 0 };
  }

  function initHeroGrab() {
    if (!heroArt || !window.PointerEvent) return;

    Array.prototype.forEach.call(
      heroArt.querySelectorAll('[data-hero-grab]'),
      function (el) {
        var holding = null;
        var originX = 0;
        var originY = 0;

        el.addEventListener('pointerdown', function (e) {
          if (holding !== null || e.button > 0) return;
          holding = e.pointerId;
          var at = heroGrabOffset(el);

          originX = e.clientX - at.x;
          originY = e.clientY - at.y;
          el.classList.remove('is-returning');
          el.classList.add('is-held');
          el.style.setProperty('--dx', at.x.toFixed(1) + 'px');
          el.style.setProperty('--dy', at.y.toFixed(1) + 'px');
          if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
        });

        el.addEventListener('pointermove', function (e) {
          if (e.pointerId !== holding) return;
          var dx = e.clientX - originX;
          var dy = e.clientY - originY;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0) {

            var reach = HERO_GRAB_REACH * heroScale;
            var pull = (reach * Math.tanh(dist / reach)) / dist;
            dx *= pull;
            dy *= pull;
          }
          el.style.setProperty('--dx', dx.toFixed(1) + 'px');
          el.style.setProperty('--dy', dy.toFixed(1) + 'px');
        });

        function release(e) {
          if (e.pointerId !== holding) return;
          holding = null;
          el.classList.remove('is-held');
          el.classList.add('is-returning');
          el.style.setProperty('--dx', '0px');
          el.style.setProperty('--dy', '0px');
        }
        el.addEventListener('pointerup', release);

        el.addEventListener('pointercancel', release);

        el.addEventListener('transitionend', function (e) {
          if (e.propertyName === 'transform' && holding === null) {
            el.classList.remove('is-returning');
          }
        });
      }
    );
  }
  initHeroGrab();

  function onScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) {
      progress.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + '%';
    }

    if (toTop) {
      toTop.classList.toggle('is-on', scrollTop > window.innerHeight * 0.8);
    }

    var marker = scrollTop + 120;
    var current = sections.length ? sections[0].id : null;
    sections.forEach(function (s) {
      if (s.el.offsetTop <= marker) current = s.id;
    });
    if (current) setActive(current);

    updateScene();
    updateHeroArt();
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    scaleCharts();
    measureSceneCircle();
    measureHeroArt();
    onScroll();
  });

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  var quoteBodies = Array.prototype.slice.call(
    document.querySelectorAll('[data-quote-cycle-body]')
  );

  var danmakuLines = quoteBodies.map(function (body) {
    return (body.getAttribute('data-danmaku-short') || body.textContent)
      .replace(/^\u300c/, '').replace(/\u300d$/, '').trim();
  });

  var activeQuoteIndex = -1;

  var quoteCycleRoot = document.querySelector('[data-quote-cycle]');

  if (quoteCycleRoot && !reduceMotion) {
    var quoteItems = Array.prototype.map.call(
      quoteCycleRoot.querySelectorAll('[data-quote-cycle-item]'),
      function (item, i) {
        var body = item.querySelector('[data-quote-cycle-body]');

        return { item: item, body: body, text: body.textContent, source: i };
      }
    );

    for (var qi = quoteItems.length - 1; qi > 0; qi -= 1) {
      var qj = Math.floor(Math.random() * (qi + 1));
      var qtmp = quoteItems[qi];
      quoteItems[qi] = quoteItems[qj];
      quoteItems[qj] = qtmp;
    }

    if (quoteItems.length) {
      quoteCycleRoot.classList.add('is-cycling');

      var quoteTimer = null;
      var quoteRunning = false;
      var quoteIndex = 0;

      var typeQuote = function (i) {
        var q = quoteItems[i];
        activeQuoteIndex = q.source;
        Array.prototype.forEach.call(quoteItems, function (other, idx) {
          other.item.classList.toggle('is-current', idx === i);
          if (idx === i) other.item.classList.remove('is-typed');
        });
        var chars = q.text.split('');

        q.item.classList.toggle('is-long', chars.length > 40 && chars.length <= 72);
        q.item.classList.toggle('is-xlong', chars.length > 72);

        var step = Math.max(24, Math.min(46, Math.round(3600 / chars.length)));
        var hold = 1800 + chars.length * 22;
        var ci = 0;
        q.body.textContent = '';
        clearTimeout(quoteTimer);

        (function typeChar() {
          if (!quoteRunning) return;
          ci += 1;
          q.body.textContent = chars.slice(0, ci).join('');
          if (ci < chars.length) {
            quoteTimer = setTimeout(typeChar, step);
          } else {
            q.item.classList.add('is-typed');
            quoteTimer = setTimeout(function () {
              quoteIndex = (i + 1) % quoteItems.length;
              typeQuote(quoteIndex);
            }, hold);
          }
        })();
      };

      var startQuoteCycle = function () {
        if (quoteRunning) return;
        quoteRunning = true;
        typeQuote(quoteIndex);
      };
      var stopQuoteCycle = function () {
        quoteRunning = false;
        clearTimeout(quoteTimer);
      };

      if ('IntersectionObserver' in window) {
        var quoteVisObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) startQuoteCycle();
            else stopQuoteCycle();
          });
        }, { threshold: 0.4 });
        quoteVisObserver.observe(quoteCycleRoot);
      } else {
        startQuoteCycle();
      }
    }
  }

  var danmakuRoot = document.querySelector('[data-danmaku]');

  if (danmakuRoot && danmakuLines.length && !reduceMotion) {
    var DM_SPEED = 74;
    var DM_GAP_MIN = 190;
    var DM_GAP_MAX = 560;
    var DM_LANE_H = 72;

    var dmLanes = [];
    var dmDeck = [];
    var dmRunning = false;
    var dmResizeTimer = null;

    var dmRefill = function () {
      dmDeck = danmakuLines.map(function (_, i) { return i; });
      for (var i = dmDeck.length - 1; i > 0; i -= 1) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = dmDeck[i];
        dmDeck[i] = dmDeck[j];
        dmDeck[j] = tmp;
      }
    };

    var dmRecent = [];
    var DM_RECENT = Math.min(6, Math.max(1, danmakuLines.length - 2));

    var dmDraw = function () {
      if (!dmDeck.length) dmRefill();
      var idx = dmDeck.pop();
      var skipped = [];

      while ((idx === activeQuoteIndex || dmRecent.indexOf(idx) !== -1) &&
             dmDeck.length && skipped.length < 5) {
        skipped.push(idx);
        idx = dmDeck.pop();
      }
      while (skipped.length) dmDeck.unshift(skipped.pop());
      dmRecent.push(idx);
      if (dmRecent.length > DM_RECENT) dmRecent.shift();
      return idx;
    };

    var dmBuildLanes = function () {
      var h = danmakuRoot.clientHeight;
      var n = Math.max(3, Math.min(9, Math.round(h / DM_LANE_H)));

      var base = danmakuRoot.clientWidth < 560 ? 12 : 14;
      dmLanes = [];
      for (var i = 0; i < n; i += 1) {

        var offCentre = Math.abs((i + 0.5) / n - 0.5);
        dmLanes.push({
          y: (i + 0.5) / n * h,
          size: base + Math.round(Math.random() * 4),
          speed: DM_SPEED * (0.82 + Math.random() * 0.36),
          dim: offCentre < 0.16 ? 0.5 : (offCentre < 0.3 ? 0.78 : 1),
          primed: false,
          timer: null
        });
      }
    };

    var dmSpawn = function (lane) {
      if (!dmRunning) return;
      var stageW = danmakuRoot.clientWidth;
      var el = document.createElement('span');
      el.className = 'danmaku__item';
      el.textContent = danmakuLines[dmDraw()];
      el.style.setProperty('--dm-size', lane.size + 'px');

      el.style.setProperty('--dm-lane-op', 'calc(var(--dm-op) * ' + lane.dim + ')');
      el.style.top = Math.round(lane.y - lane.size * 0.62) + 'px';
      danmakuRoot.appendChild(el);

      var w = el.offsetWidth;

      var from = lane.primed ? stageW : Math.round(stageW / 2);
      if (!lane.primed) {
        el.classList.add('is-first');
        lane.primed = true;
      }
      el.style.setProperty('--dm-start', from + 'px');
      el.style.setProperty('--dm-dur', ((from + w) / lane.speed).toFixed(2) + 's');
      el.classList.add('is-running');
      el.addEventListener('animationend', function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      });

      var gap = DM_GAP_MIN + Math.random() * (DM_GAP_MAX - DM_GAP_MIN);
      lane.timer = setTimeout(function () { dmSpawn(lane); }, ((w + gap) / lane.speed) * 1000);
    };

    var startDanmaku = function () {
      if (dmRunning) return;
      dmRunning = true;
      danmakuRoot.classList.remove('is-paused');
      if (!dmLanes.length) dmBuildLanes();

      dmLanes.forEach(function (lane, i) {
        clearTimeout(lane.timer);
        lane.timer = setTimeout(function () { dmSpawn(lane); }, i * 260 + Math.random() * 420);
      });
    };

    var stopDanmaku = function () {
      dmRunning = false;
      danmakuRoot.classList.add('is-paused');
      dmLanes.forEach(function (lane) { clearTimeout(lane.timer); });
    };

    window.addEventListener('resize', function () {
      clearTimeout(dmResizeTimer);
      dmResizeTimer = setTimeout(function () {
        var wasRunning = dmRunning;
        stopDanmaku();
        danmakuRoot.textContent = '';
        dmLanes = [];
        if (wasRunning) startDanmaku();
      }, 220);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) startDanmaku();
          else stopDanmaku();
        });
      }, { threshold: 0 }).observe(danmakuRoot);
    } else {
      startDanmaku();
    }
  }

  function initWorks() {
    var wall = document.querySelector('[data-works]');
    if (!wall) return;

    var rows = Array.prototype.slice.call(wall.querySelectorAll('[data-works-row]'));
    if (!rows.length) return;

    var speed = parseFloat(wall.getAttribute('data-works-speed')) || 46;
    if (window.innerWidth <= 640) speed *= 0.72;

    var openCard = null;

    function closeOpen() {
      if (!openCard) return;
      var key = openCard.getAttribute('data-work-key');
      Array.prototype.forEach.call(
        wall.querySelectorAll('[data-work-key="' + key + '"]'),
        function (el) { el.classList.remove('is-flipped'); el.setAttribute('aria-pressed', 'false'); }
      );
      var row = openCard.closest('[data-works-row]');
      if (row) row.classList.remove('is-open');
      openCard = null;
    }

    function open(card) {
      closeOpen();
      var key = card.getAttribute('data-work-key');
      Array.prototype.forEach.call(
        wall.querySelectorAll('[data-work-key="' + key + '"]'),
        function (el) { el.classList.add('is-flipped'); el.setAttribute('aria-pressed', 'true'); }
      );
      var row = card.closest('[data-works-row]');
      if (row) row.classList.add('is-open');
      openCard = card;
    }

    rows.forEach(function (row, rowIndex) {
      var group = row.querySelector('[data-works-group]');
      var track = row.querySelector('.works__track');
      if (!group || !track) return;

      Array.prototype.forEach.call(group.querySelectorAll('[data-work]'), function (card, i) {
        card.setAttribute('data-work-key', rowIndex + '-' + i);
        card.setAttribute('aria-pressed', 'false');
      });

      if (!reduceMotion) {
        var clone = group.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('data-works-group');
        Array.prototype.forEach.call(clone.querySelectorAll('[data-work]'), function (card) {
          card.tabIndex = -1;
        });
        track.appendChild(clone);
      }

      function measure() {
        if (reduceMotion) return;
        var span = group.getBoundingClientRect().width;
        if (!span) return;
        row.style.setProperty('--works-span', span + 'px');
        row.style.setProperty('--works-dur', (span / speed) + 's');
      }
      measure();

      window.addEventListener('load', measure);
      row._worksMeasure = measure;

      var DRAG_MIN = 6;
      var DRAG_VMAX = 4;
      var DRAG_DECAY = 0.94;

      var manual = false;
      var dragging = false;
      var px = 0;
      var vx = 0;
      var glideRaf = 0;
      var lastGlideT = 0;
      var moved = 0;
      var pid = null;
      var lastPx = 0;
      var lastPt = 0;

      function rowVar(name) {
        return parseFloat(window.getComputedStyle(row).getPropertyValue(name)) || 0;
      }

      function trackX() {
        var m = window.getComputedStyle(track).transform;
        var hit = m && m.match(/matrix(3d)?\(([^)]+)\)/);
        if (!hit) return 0;
        var n = hit[2].split(',').map(parseFloat);
        return hit[1] ? n[12] : n[4];
      }

      function wrapX(x) {
        var span = rowVar('--works-span');
        if (!span) return x;
        x = x % span;
        return x > 0 ? x - span : x;
      }
      function applyX() { track.style.transform = 'translate3d(' + px + 'px,0,0)'; }

      function toManual() {
        if (manual) return;
        px = wrapX(trackX());
        manual = true;
        track.style.animation = 'none';
        applyX();
      }
      function toAuto() {
        if (!manual) return;
        manual = false;
        var span = rowVar('--works-span');
        var dur = rowVar('--works-dur');
        track.style.animation = '';
        track.style.transform = '';
        if (span && dur) {
          var progress = -px / span;
          if (row.getAttribute('data-works-dir') === 'right') progress = 1 - progress;
          track.style.animationDelay = (-progress * dur) + 's';
        }
      }
      function settle() {
        if (glideRaf) { cancelAnimationFrame(glideRaf); glideRaf = 0; }
        toAuto();
      }
      row._worksSettle = settle;

      function glide(t) {
        if (!manual) { glideRaf = 0; return; }
        var dt = lastGlideT ? Math.min(t - lastGlideT, 50) : 16.7;
        lastGlideT = t;
        px = wrapX(px + vx * dt);
        applyX();
        vx *= Math.pow(DRAG_DECAY, dt / 16.7);

        if (Math.abs(vx) <= Math.max(speed / 1000, 0.02)) {
          glideRaf = 0;
          toAuto();
          return;
        }
        glideRaf = requestAnimationFrame(glide);
      }

      function onDown(e) {
        if (e.button) return;
        if (!rowVar('--works-span')) return;
        if (glideRaf) { cancelAnimationFrame(glideRaf); glideRaf = 0; }
        dragging = true;
        pid = e.pointerId;
        moved = 0;
        vx = 0;
        row._dragged = false;
        lastPx = e.clientX;
        lastPt = e.timeStamp;
        row.classList.add('is-held');
      }

      function onMove(e) {
        if (!dragging || e.pointerId !== pid) return;
        var dx = e.clientX - lastPx;
        var dt = Math.max(e.timeStamp - lastPt, 1);
        lastPx = e.clientX;
        lastPt = e.timeStamp;
        moved += Math.abs(dx);
        if (moved < DRAG_MIN) return;
        if (!manual) {
          toManual();
          row.classList.add('is-dragging');
          row._dragged = true;
        }
        px = wrapX(px + dx);
        applyX();

        vx = vx ? vx * 0.7 + (dx / dt) * 0.3 : dx / dt;
      }

      function onUp(e) {
        if (!dragging || (e && e.pointerId !== pid)) return;
        dragging = false;
        pid = null;
        row.classList.remove('is-held');
        row.classList.remove('is-dragging');
        if (!manual) return;
        vx = Math.max(-DRAG_VMAX, Math.min(DRAG_VMAX, vx));
        lastGlideT = 0;
        if (Math.abs(vx) < 0.02) { toAuto(); return; }
        glideRaf = requestAnimationFrame(glide);
      }

      if (!reduceMotion) {
        row.addEventListener('pointerdown', onDown);

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
      }
    });

    wall.addEventListener('dragstart', function (e) { e.preventDefault(); });

    wall.addEventListener('click', function (e) {
      var card = e.target.closest ? e.target.closest('[data-work]') : null;
      if (!card || !wall.contains(card)) return;

      var dragRow = card.closest('[data-works-row]');
      if (dragRow && dragRow._dragged) { dragRow._dragged = false; return; }

      var key = card.getAttribute('data-work-key');
      var origin = wall.querySelector('[data-works-group] [data-work-key="' + key + '"]') || card;
      if (openCard === origin) closeOpen();
      else open(origin);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openCard) closeOpen();
    });

    var FIT_STEPS = [[1, 1.75], [0.94, 1.7], [0.88, 1.62], [0.82, 1.56], [0.76, 1.5], [0.72, 1.45]];
    function fitBackText() {
      Array.prototype.forEach.call(wall.querySelectorAll('.work__change'), function (el) {
        el.style.fontSize = '';
        el.style.lineHeight = '';
        var base = parseFloat(getComputedStyle(el).fontSize) || 13;
        for (var i = 0; i < FIT_STEPS.length; i++) {
          el.style.fontSize = (base * FIT_STEPS[i][0]).toFixed(2) + 'px';
          el.style.lineHeight = String(FIT_STEPS[i][1]);
          if (el.scrollHeight <= el.clientHeight) break;
        }
      });
    }
    fitBackText();
    window.addEventListener('load', fitBackText);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitBackText);

    var imgsWoken = false;
    function wakeImages() {
      if (imgsWoken) return;
      imgsWoken = true;
      Array.prototype.forEach.call(wall.querySelectorAll('.work__img'), function (img) {
        img.loading = 'eager';
      });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          wall.classList.toggle('is-idle', !entry.isIntersecting);
          if (entry.isIntersecting) wakeImages();

          else rows.forEach(function (row) { if (row._worksSettle) row._worksSettle(); });
        });
      }, { threshold: 0 }).observe(wall);
    } else {
      wakeImages();
    }

    var demoDone = reduceMotion;
    var demoTimers = [];

    function demoClear() {
      demoTimers.forEach(clearTimeout);
      demoTimers = [];
      Array.prototype.forEach.call(wall.querySelectorAll('.is-demo'), function (el) {
        el.classList.remove('is-demo');
      });
    }

    function demoCancel() {
      demoDone = true;
      demoClear();
    }

    function demoPick(row) {
      var best = null;
      var bestSeen = 0;
      Array.prototype.forEach.call(row.querySelectorAll('[data-work]'), function (card) {
        var r = card.getBoundingClientRect();
        var seen = Math.min(r.right, window.innerWidth) - Math.max(r.left, 0);
        if (seen > bestSeen) { bestSeen = seen; best = card; }
      });
      if (!best) return null;
      return bestSeen >= best.getBoundingClientRect().width - 2 ? best : null;
    }

    function demoRun(row) {
      if (demoDone || openCard) return;
      var card = demoPick(row);
      if (!card) return;
      demoDone = true;

      var pair = wall.querySelectorAll(
        '[data-work-key="' + card.getAttribute('data-work-key') + '"]');
      row.classList.add('is-demo');
      Array.prototype.forEach.call(pair, function (el) { el.classList.add('is-demo'); });
      demoTimers.push(setTimeout(function () {
        Array.prototype.forEach.call(pair, function (el) { el.classList.remove('is-demo'); });

        demoTimers.push(setTimeout(function () { row.classList.remove('is-demo'); }, 620));
      }, 1250));
    }

    if (!demoDone && 'IntersectionObserver' in window) {
      var demoRow = rows[0];
      var demoObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || demoDone) return;

          demoTimers.push(setTimeout(function () {
            var r = demoRow.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) demoRun(demoRow);
            if (demoDone) demoObs.disconnect();
          }, 500));
        });
      }, { threshold: 0.6 });
      demoObs.observe(demoRow);
    }

    ['pointerdown', 'focusin', 'keydown'].forEach(function (type) {
      wall.addEventListener(type, demoCancel);
    });

    var worksResizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(worksResizeTimer);
      worksResizeTimer = setTimeout(function () {

        rows.forEach(function (row) {
          if (row._worksSettle) row._worksSettle();
          if (row._worksMeasure) row._worksMeasure();
        });
        fitBackText();
      }, 160);
    });
  }
  initWorks();

  function initShout() {
    var shout = document.querySelector('[data-shout]');
    if (!shout) return;

    var allItems = Array.prototype.slice.call(shout.querySelectorAll('.shout__item'));
    var closer = shout.querySelector('[data-shout-close]');
    if (!allItems.length) return;

    function light(el) { el.classList.add('is-in'); }

    function showVisible() {
      allItems.forEach(function (el) { if (el.offsetParent !== null) light(el); });
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      allItems.forEach(light);
      if (closer) light(closer);
      return;
    }

    var GAP_FIRST = 620;
    var GAP_DECAY = 0.84;
    var GAP_MIN = 90;
    var HOLD = 1000;
    var started = false;

    function run() {
      if (started) return;
      started = true;
      var t = 0;
      allItems.filter(function (el) { return el.offsetParent !== null; })
        .forEach(function (el, i) {
          setTimeout(function () { light(el); }, t);
          t += Math.max(GAP_MIN, GAP_FIRST * Math.pow(GAP_DECAY, i));
        });
      if (closer) setTimeout(function () { light(closer); }, t + HOLD);
    }

    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        run();
      });
    }, { threshold: 0.25 }).observe(shout);

    var shoutResizeTimer;
    window.addEventListener('resize', function () {
      if (!started) return;
      clearTimeout(shoutResizeTimer);
      shoutResizeTimer = setTimeout(showVisible, 200);
    });
  }
  initShout();

  function initQuiz() {
    var QUIZ_ENDPOINT = '';
    var QUIZ_STORE = 'blgl-quiz-v1';

    function readSaved() {
      try {
        var raw = window.localStorage.getItem(QUIZ_STORE);
        var obj = raw ? JSON.parse(raw) : null;
        return (obj && typeof obj === 'object') ? obj : {};
      } catch (e) { return {}; }
    }
    function writeSaved(qid, key) {
      try {
        var obj = readSaved();
        obj[qid] = key;
        window.localStorage.setItem(QUIZ_STORE, JSON.stringify(obj));
      } catch (e) {  }
    }

    function el(tag, cls, text) {
      var node = document.createElement(tag);
      if (cls) node.className = cls;
      if (text != null) node.textContent = text;
      return node;
    }

    function renderPoll(item, tallies) {
      var qid = item.getAttribute('data-quiz-id');
      var row = qid && tallies ? tallies[qid] : null;
      if (!row) return;

      var opts = item.querySelectorAll('[data-quiz-opt]');
      var mine = item.getAttribute('data-quiz-picked');
      var total = 0;
      Array.prototype.forEach.call(opts, function (opt) {
        var n = Number(row[opt.getAttribute('data-quiz-key')]);
        if (n > 0) total += n;
      });
      if (!total) return;

      var poll = item.querySelector('[data-quiz-poll]');
      if (!poll) {
        poll = el('div', 'quiz__poll');
        poll.setAttribute('data-quiz-poll', '');
        var ans = item.querySelector('[data-quiz-ans]');
        if (ans && ans.parentNode) ans.parentNode.insertBefore(poll, ans.nextSibling);
        else item.appendChild(poll);
      }
      poll.textContent = '';

      var head = el('p', 'quiz__poll-head', '其他讀者這樣猜');
      head.appendChild(el('span', 'quiz__poll-n', '共 ' + total.toLocaleString('en-US') + ' 人押過這一題'));
      poll.appendChild(head);

      var fills = [];
      Array.prototype.forEach.call(opts, function (opt) {
        var key = opt.getAttribute('data-quiz-key');
        var n = Number(row[key]) > 0 ? Number(row[key]) : 0;
        var pct = n / total * 100;
        var isMine = key === mine;

        var bar = el('div', 'bar' + (isMine ? ' bar--peak' : ''));
        var label = el('div', 'bar__label', opt.textContent.replace(/（[^）]*）/g, '').trim());
        if (isMine) label.appendChild(el('small', null, '你選的'));
        var track = el('div', 'bar__track');
        var fill = el('span', 'fill ' + (isMine ? 'fill--hl' : 'fill--mute'));
        track.appendChild(fill);
        bar.appendChild(label);
        bar.appendChild(track);
        bar.appendChild(el('div', 'bar__val', pct.toFixed(1) + '%'));
        poll.appendChild(bar);
        fills.push([fill, pct]);
      });

      function paint() {
        fills.forEach(function (pair) { pair[0].style.width = pair[1].toFixed(2) + '%'; });
      }
      if (reduceMotion || !window.requestAnimationFrame) paint();
      else window.requestAnimationFrame(function () { window.requestAnimationFrame(paint); });
    }

    var quizzes = document.querySelectorAll('[data-quiz]');
    Array.prototype.forEach.call(quizzes, function (quiz) {
      var items = quiz.querySelectorAll('[data-quiz-item]');
      if (!items.length) return;

      quiz.classList.add('is-ready');
      var left = items.length;
      var saved = readSaved();

      function applyTallies(data) {
        if (!data || !data.tallies) return;
        Array.prototype.forEach.call(items, function (item) {
          if (item.hasAttribute('data-quiz-done')) renderPoll(item, data.tallies);
        });
      }
      function ask(options) {
        if (!QUIZ_ENDPOINT || !window.fetch) return;
        fetch(QUIZ_ENDPOINT, options)
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(applyTallies)
          .catch(function () {  });
      }

      function settle(item, opt, restoring) {
        item.setAttribute('data-quiz-done', '');
        item.setAttribute('data-quiz-picked', opt.getAttribute('data-quiz-key') || '');

        var opts = item.querySelectorAll('[data-quiz-opt]');
        var right = opt.hasAttribute('data-quiz-correct');
        Array.prototype.forEach.call(opts, function (o) {
          o.setAttribute('aria-disabled', 'true');
          var mark = '';
          if (o.hasAttribute('data-quiz-correct')) { o.classList.add('is-correct'); mark = '（正解）'; }
          else if (o === opt) { o.classList.add('is-wrong'); mark = '（你選的）'; }
          if (!mark) return;
          var sr = el('span', 'sr-only', mark);
          o.appendChild(sr);
        });

        var verdict = item.querySelector('[data-quiz-verdict]');
        if (verdict) verdict.textContent = opt.getAttribute('data-quiz-say') || (right ? '答對了！' : '這次沒猜中。');

        left -= 1;
        if (left === 0) quiz.setAttribute('data-quiz-all-done', '');

        var qid = item.getAttribute('data-quiz-id');
        var key = opt.getAttribute('data-quiz-key');
        if (restoring || !qid || !key) return;
        writeSaved(qid, key);
        ask({
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ q: qid, opt: key })
        });
      }

      var restored = false;
      Array.prototype.forEach.call(items, function (item) {
        var opts = item.querySelectorAll('[data-quiz-opt]');
        var qid = item.getAttribute('data-quiz-id');
        var prev = qid ? saved[qid] : null;

        if (prev) {
          var was = null;
          Array.prototype.forEach.call(opts, function (o) {
            if (o.getAttribute('data-quiz-key') === prev) was = o;
          });
          if (was) { settle(item, was, true); restored = true; }
        }

        Array.prototype.forEach.call(opts, function (opt) {
          opt.addEventListener('click', function () {
            if (item.hasAttribute('data-quiz-done')) return;
            settle(item, opt, false);
          });
        });
      });

      if (restored) ask({ headers: { accept: 'application/json' } });
    });
  }
  initQuiz();

  function initHashLanding() {
    var raw = location.hash.slice(1);
    if (!raw) return;
    var id = raw;
    try { id = decodeURIComponent(raw); } catch (e) {  }
    var target = document.getElementById(id) || document.getElementById(raw);
    if (!target) return;
    var land = function () {
      target.scrollIntoView({ block: 'start', behavior: 'auto' });
    };
    if (document.readyState === 'complete') requestAnimationFrame(land);
    else window.addEventListener('load', function () { requestAnimationFrame(land); });
  }
  initHashLanding();

  onScroll();
})();
