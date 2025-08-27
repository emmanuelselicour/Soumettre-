// BULBES: 9 bulbes par seconde
(function(){
  const container = document.querySelector('.bulbes');
  if (!container) return;

  function makeBulbe(){
    const b = document.createElement('div');
    b.className = 'bulbe';
    const size = Math.random() * 60 + 20; // 20px -> 80px
    b.style.width = b.style.height = size + 'px';
    b.style.left = (Math.random() * 100) + '%';
    const hue = 200 + Math.floor(Math.random()*50); // bleu variant
    const alpha = 0.12 + Math.random() * 0.25;
    b.style.background = `radial-gradient(circle at 30% 30%, rgba(${0},${120},${255},${alpha}), rgba(0,0,0,0))`;
    b.style.background = `rgba(0,123,255,${alpha})`;
    b.style.bottom = '-40px';
    b.style.filter = `blur(${Math.random()*6 + 2}px)`;
    b.style.opacity = 0.9;
    b.style.animationDuration = (8 + Math.random()*6) + 's';
    container.appendChild(b);
    setTimeout(()=>{ b.remove(); }, 14000); // sécurité
  }

  // 9 par seconde
  setInterval(()=> {
    // create 1 bulbe (but interval set to 1000/9)
    makeBulbe();
  }, 1000 / 9);
})();
