
(function(){
  function build(root){
    var attr = function(k,d){ var v=root.getAttribute(k); return (v===null||v==='')?d:v; };
    var box  = root.querySelector('.sgate-box');
    var foot = root.querySelector('.sgate-f');
    var pub  = attr('data-substack','').replace(/\/+$/,'');

    root.querySelector('.sgate-t').textContent = attr('data-gate-title','完整報告，訂閱後直接寄到你的信箱');

    var subEl = root.querySelector('.sgate-s');
    var lines = attr('data-gate-sub','').split('\n');
    for(var li=0; li<lines.length; li++){
      var line = lines[li].trim();
      if(!line) continue;
      var para = document.createElement('p');
      para.textContent = line;
      subEl.appendChild(para);
    }

    if(pub){
      var fr = document.createElement('iframe');
      fr.className = 'sgate-embed';
      fr.src = pub + '/embed?transparent=1';
      fr.title = attr('data-gate-title','訂閱電子報');
      fr.setAttribute('frameborder','0');
      fr.setAttribute('scrolling','no');
      fr.style.background = 'transparent';
      box.appendChild(fr);

      var H0 = parseInt(attr('data-substack-height','150'), 10) || 150;
      var W0 = parseInt(attr('data-substack-width','480'), 10);
      if(isNaN(W0)) W0 = 480;
      function fitEmbed(){
        var w = box.clientWidth;
        var k = W0 > 0 ? Math.min(1, w / W0) : 1;
        if(k < 1){
          fr.style.width = W0 + 'px';
          fr.style.transform = 'scale(' + k.toFixed(4) + ')';
        }else{
          fr.style.width = '100%';
          fr.style.transform = 'none';
        }
        fr.style.height = H0 + 'px';
        box.style.height = Math.round(H0 * k) + 'px';
      }
      fitEmbed();
      if(window.ResizeObserver) new ResizeObserver(fitEmbed).observe(box);
      else window.addEventListener('resize', fitEmbed);

      var alt = document.createElement('a');
      alt.href = pub + '/subscribe';
      alt.target = '_blank'; alt.rel = 'noopener';
      alt.textContent = attr('data-gate-alt','看不到訂閱框？點這裡在新分頁訂閱');
      foot.appendChild(alt);
    }else{
      box.innerHTML = '<div class="sgate-ph">示範模式：把 data-substack 填成你的 Substack 網址'
                     + '（例如 https://yourname.substack.com），這裡就會換成真正的訂閱框。</div>';
    }
  }

  function init(){
    var roots = document.querySelectorAll('.sgate');
    for(var i=0;i<roots.length;i++) build(roots[i]);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
