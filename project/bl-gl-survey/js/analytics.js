
(function () {

  function track(name, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, params || {});
  }

  var sent = {};
  function once(key) {
    if (sent[key]) return false;
    sent[key] = true;
    return true;
  }

  var SECTIONS = [
    { name: 'intro',      sel: '#intro .hero__title' },
    { name: 'works',      sel: '#works .works-sec__head' },
    { name: 'chapter_01', sel: '#ch1 .chapter__head' },
    { name: 'chapter_02', sel: '#ch2 .chapter__head' },
    { name: 'chapter_03', sel: '#ch3 .chapter__head' },
    { name: 'chapter_04', sel: '#outro .chapter__head' }
  ];
  var DWELL = 1000;

  function initSectionView() {
    if (!('IntersectionObserver' in window)) return;

    var timers = {};
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var name = entry.target.getAttribute('data-ga-section');
        if (entry.isIntersecting) {
          timers[name] = setTimeout(function () {
            if (!once('section:' + name)) return;
            track('section_view', { section_name: name });
            obs.unobserve(entry.target);
          }, DWELL);
        } else {
          clearTimeout(timers[name]);
        }
      });
    }, {
      threshold: 0,

      rootMargin: '0px 0px -25% 0px'
    });

    SECTIONS.forEach(function (item) {
      var el = document.querySelector(item.sel);
      if (!el) return;
      el.setAttribute('data-ga-section', item.name);
      obs.observe(el);
    });
  }
  initSectionView();

  var quizRestored = {};
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-quiz-item][data-quiz-done]'),
    function (item) { quizRestored[item.getAttribute('data-quiz-id')] = true; }
  );

  var SIMPLE = [
    ['[data-copy]', 'copy_email'],
    ['#navToggle',  'nav_menu_open'],
    ['#navLinks a', 'nav_chapter_click'],
    ['#toTop',      'back_to_top']
  ];

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var opt = t.closest('[data-quiz-opt]');
    if (opt) {
      var item = opt.closest('[data-quiz-item]');
      var qid = item && item.getAttribute('data-quiz-id');
      if (qid && !quizRestored[qid] && once('quiz:' + qid)) {
        track('interaction', { interaction_name: 'quiz_' + qid + '_answer' });
      }
      return;
    }

    var term = t.closest('.gloss__term');
    if (term) {
      if (term.getAttribute('aria-expanded') === 'true') {
        var gid = (term.getAttribute('aria-controls') || 'gloss').replace(/^gloss-/, '');
        if (once('gloss:' + gid)) {
          track('interaction', { interaction_name: 'gloss_' + gid });
        }
      }
      return;
    }

    for (var i = 0; i < SIMPLE.length; i++) {
      if (t.closest(SIMPLE[i][0])) {
        track('interaction', { interaction_name: SIMPLE[i][1] });
        return;
      }
    }
  });

  document.addEventListener('click', function (e) {
    var card = e.target.closest ? e.target.closest('[data-work]') : null;
    if (!card) return;
    if (!card.classList.contains('is-flipped')) return;

    var row = card.closest('[data-works-row]');
    var name = card.querySelector('.work__name');

    track('work_card_flip', {
      category: row && row.classList.contains('works__row--gl') ? 'GL' : 'BL',
      title: name ? name.textContent.trim() : '(untitled)'
    });
  });

  var CTA_CLICKS = [
    { location: 'nav',       sel: '.nav__dl' },
    { location: 'guide',     sel: '.guide__note__lead a' },

    { location: 'outro_pdf', sel: '.sgate-f a' }
  ];

  var CTA_VIEWS = [
    { location: 'guide',     sel: '.guide__note--band' },
    { location: 'outro_pdf', sel: '#pdf-preview' }
  ];

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    for (var i = 0; i < CTA_CLICKS.length; i++) {
      if (e.target.closest(CTA_CLICKS[i].sel)) {
        track('report_cta_click', { location: CTA_CLICKS[i].location });
        return;
      }
    }
  });

  function initCtaView() {
    if (!('IntersectionObserver' in window)) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var loc = entry.target.getAttribute('data-ga-cta');
        if (once('cta:' + loc)) track('report_cta_view', { location: loc });
        obs.unobserve(entry.target);
      });

    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    CTA_VIEWS.forEach(function (item) {
      var el = document.querySelector(item.sel);
      if (!el) return;
      el.setAttribute('data-ga-cta', item.location);
      obs.observe(el);
    });
  }
  initCtaView();

})();
