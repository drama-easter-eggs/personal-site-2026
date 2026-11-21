
var SLWL_PAGES = (function(){
  var pages = [];
  for (var i = 1; i <= 73; i++) {
    pages.push('img/report-wall/page-' + (i < 10 ? '0' + i : i) + '.webp');
  }
  return pages;
})();

(function(){
  function build(root){
    var pages = SLWL_PAGES;
    if(!pages || !pages.length) return;

    var attr = function(k,d){ var v=root.getAttribute(k); return (v===null||v==='')?d:v; };
    var plane = root.querySelector('.slwl-plane');
    var clip  = root.querySelector('.slwl-clip');
    var over  = root.querySelector('.slwl-over');
    var badge = root.querySelector('.slwl-badge');
    var cta   = root.querySelector('.slwl-cta');

    plane.setAttribute('aria-hidden','true');

    root.style.setProperty('--slwl-h', attr('data-height','clamp(380px,46vw,620px)'));
    root.style.setProperty('--slwl-tilt', attr('data-tilt','16'));

    var title = attr('data-title',''), sub = attr('data-sub','');
    var href  = attr('data-href',''),  ctaTxt = attr('data-cta','');
    if(title || sub){
      over.hidden = false;
      root.querySelector('.slwl-t').textContent = title;
      root.querySelector('.slwl-s').textContent = sub;
    }
    if(ctaTxt && href){ cta.hidden=false; cta.textContent=ctaTxt; cta.href=href; }
    if(attr('data-badge','')){ badge.hidden=false; badge.textContent=attr('data-badge',''); }

    if(href && !ctaTxt){
      var lk = document.createElement('a');
      lk.className = 'slwl-link'; lk.href = href;
      lk.setAttribute('aria-label', title || '查看完整報告');
      root.appendChild(lk);
    }

    var baseSpeed = parseFloat(attr('data-speed','90')) || 90;

    function colCount(){
      var w = root.clientWidth;
      if(w < 420) return 4;
      if(w < 640) return 5;
      if(w < 900) return 6;
      if(w < 1250) return 7;
      return 8;
    }

    var built = -1;
    function render(){
      var n = colCount();
      if(n === built) return;
      built = n;
      plane.innerHTML = '';

      var buckets = [];
      for(var c=0;c<n;c++) buckets.push([]);
      for(var i=0;i<pages.length;i++) buckets[i % n].push(pages[i]);

      function fill(half, list){
        for(var k=0;k<list.length;k++){
          var card = document.createElement('div');
          card.className = 'slwl-card';
          var im = document.createElement('img');
          im.src = list[k];
          im.alt = '';
          im.loading = 'lazy'; im.decoding = 'async';
          card.appendChild(im);
          half.appendChild(card);
        }
      }

      var pairs = [];
      for(var c=0;c<n;c++){
        var col = document.createElement('div');
        col.className = 'slwl-col' + (c % 2 ? ' slwl-rev' : '');

        col.style.setProperty('--slwl-d', (baseSpeed * (0.82 + (c % 3) * 0.19)).toFixed(1) + 's');
        col.style.animationDelay = (-c * 7) + 's';

        var hA = document.createElement('div'); hA.className='slwl-half';
        var hB = document.createElement('div'); hB.className='slwl-half';
        hB.setAttribute('aria-hidden','true');
        fill(hA, buckets[c]);
        fill(hB, buckets[c]);
        col.appendChild(hA); col.appendChild(hB);
        plane.appendChild(col);
        pairs.push({a:hA, b:hB, list:buckets[c]});
      }

      var need = plane.offsetHeight, guard = 0;
      for(var q=0;q<pairs.length;q++){
        while(pairs[q].a.offsetHeight < need && guard++ < 40){
          fill(pairs[q].a, pairs[q].list);
          fill(pairs[q].b, pairs[q].list);
        }
      }
    }

    render();
    if(window.ResizeObserver) new ResizeObserver(render).observe(root);
    else window.addEventListener('resize', render);

    if(window.IntersectionObserver){
      var io = new IntersectionObserver(function(es){
        es.forEach(function(en){
          var cols = plane.querySelectorAll('.slwl-col');
          for(var i=0;i<cols.length;i++) cols[i].style.animationPlayState = en.isIntersecting ? 'running' : 'paused';
        });
      }, {threshold:0});
      io.observe(clip);
    }
  }

  function init(){
    var roots = document.querySelectorAll('.slwl');
    for(var i=0;i<roots.length;i++) build(roots[i]);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
