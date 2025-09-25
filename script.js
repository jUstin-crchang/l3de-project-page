
function openLightbox(src, isVideo=false){
  const lb = document.querySelector('.lightbox');
  const wrap = document.querySelector('.lightbox-inner');
  wrap.innerHTML = '';
  if(isVideo){
    const v = document.createElement('video');
    v.src = src; v.controls = true; v.autoplay = true; v.playsInline = true; v.style.width='100%';
    wrap.appendChild(v);
  }else{
    const img = document.createElement('img');
    img.src = src; img.style.width='100%';
    wrap.appendChild(img);
  }
  lb.classList.add('open');
}
function closeLightbox(){ document.querySelector('.lightbox').classList.remove('open'); }

document.addEventListener('click', (e)=>{
  const t = e.target.closest('[data-lb]');
  if(t){
    e.preventDefault();
    openLightbox(t.getAttribute('data-src'), t.getAttribute('data-type')==='video');
  }
});


// ---- Grad-CAM Carousel ----
(function(){
  const root = document.getElementById('gradcam-carousel');
  if(!root) return;
  const slides = Array.from(root.querySelectorAll('.carousel-slide'));
  const dotsWrap = root.querySelector('.carousel-dots');
  const prevBtn = root.querySelector('.carousel-btn.prev');
  const nextBtn = root.querySelector('.carousel-btn.next');
  const intervalMs = parseInt(root.getAttribute('data-interval') || '3500', 10);

  let idx = 0, timer = null;

  function renderDots(){
    dotsWrap.innerHTML = '';
    slides.forEach((_, i)=>{
      const b = document.createElement('button');
      if(i===idx) b.classList.add('active');
      b.setAttribute('aria-label', 'Go to slide ' + (i+1));
      b.addEventListener('click', ()=>{ go(i); });
      dotsWrap.appendChild(b);
    });
  }
  function show(i, dir=1){
    slides.forEach((el, k)=> {
      if(k===i){
        el.classList.add('active');
        el.classList.remove('enter-from-left','enter-from-right');
        el.offsetWidth; // reflow
        el.classList.add(dir>0 ? 'enter-from-right' : 'enter-from-left');
      }else{
        el.classList.remove('active','enter-from-left','enter-from-right');
      }
    });
    Array.from(dotsWrap.children).forEach((el, k)=> el.classList.toggle('active', k===i));
  }
  function go(i){
    const nextIdx = (i + slides.length) % slides.length;
    const dir = (nextIdx > idx || (idx===slides.length-1 && nextIdx===0)) ? 1 : -1;
    idx = nextIdx;
    show(idx, dir);
    restart();
  }
  function next(){ go(idx+1); }
  function prev(){ go(idx-1); }

  function start(){ stop(); timer = setInterval(next, intervalMs); }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }
  function restart(){ start(); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  window.addEventListener('visibilitychange', ()=>{ document.hidden ? stop() : start(); });

  renderDots();
  show(idx);
  start();
})();
