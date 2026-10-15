/* ============================================================
   iaba motion engine
   Smooth scroll (Lenis) + chorégraphie au scroll (GSAP ScrollTrigger).
   Piloté par attributs, aucun JS à écrire par page :
     data-reveal="0.1"      -> apparition (fade + montée), delай optionnel
     data-reveal-group      -> apparition en cascade des enfants
     data-parallax="0.3"    -> parallaxe vertical (force 0..1)
     data-tilt              -> inclinaison 3D au survol (pointeur)
     data-count="1000000"   -> compteur animé à l'entrée
     data-pin (section)     -> épingle + scrub la timeline interne (signature)
   Progressive enhancement : sans JS ou sans GSAP, tout reste visible et lisible.
   ============================================================ */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fmtEuro(n){ return Math.round(n).toLocaleString('fr-FR') + ' €'; }

  // tilt marche sans GSAP (pointeur pur)
  function initTilt(){
    document.querySelectorAll('[data-tilt]').forEach(function(el){
      var max = parseFloat(el.dataset.tilt) || 6;
      el.addEventListener('pointermove', function(e){
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5;
        var py = (e.clientY - r.top) / r.height - .5;
        el.style.transform = 'perspective(1000px) rotateY(' + (px*max) + 'deg) rotateX(' + (-py*max) + 'deg)';
        el.style.setProperty('--mx', (px*100+50)+'%');
        el.style.setProperty('--my', (py*100+50)+'%');
      });
      el.addEventListener('pointerleave', function(){ el.style.transform = ''; });
    });
  }

  function init(){
    initTilt();
    if (reduce || !window.gsap) { document.documentElement.classList.add('no-motion'); return; }
    gsap.registerPlugin(ScrollTrigger);

    // smooth scroll
    if (window.Lenis){
      var lenis = new Lenis({ duration: 1.1, easing: function(t){ return Math.min(1, 1.001 - Math.pow(2, -10*t)); } });
      function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      lenis.on('scroll', ScrollTrigger.update);
    }

    // reveal simple
    gsap.utils.toArray('[data-reveal]').forEach(function(el){
      var d = parseFloat(el.dataset.reveal) || 0;
      gsap.from(el, { opacity:0, y:34, duration:.95, delay:d, ease:'power3.out',
        scrollTrigger:{ trigger:el, start:'top 86%' } });
    });

    // reveal en cascade
    gsap.utils.toArray('[data-reveal-group]').forEach(function(g){
      gsap.from(g.children, { opacity:0, y:30, duration:.85, ease:'power3.out', stagger:.1,
        scrollTrigger:{ trigger:g, start:'top 82%' } });
    });

    // parallaxe
    gsap.utils.toArray('[data-parallax]').forEach(function(el){
      var s = parseFloat(el.dataset.parallax) || .25;
      gsap.to(el, { yPercent:-s*100, ease:'none',
        scrollTrigger:{ trigger:el.closest('section')||el.parentElement, start:'top bottom', end:'bottom top', scrub:true } });
    });

    // compteurs
    gsap.utils.toArray('[data-count]').forEach(function(el){
      var end = parseFloat(el.dataset.count)||0, euro = el.dataset.count && el.hasAttribute('data-euro');
      var o = { v:0 };
      gsap.to(o, { v:end, duration:1.6, ease:'power2.out',
        scrollTrigger:{ trigger:el, start:'top 88%' },
        onUpdate:function(){ el.textContent = euro ? fmtEuro(o.v) : Math.round(o.v).toLocaleString('fr-FR'); } });
    });

    // signature : section épinglée + scrub (capital qui monte en altitude)
    var pin = document.querySelector('[data-pin]');
    if (pin){
      var num = pin.querySelector('[data-pin-num]');
      var bar = pin.querySelector('[data-pin-bar]');
      var peak = pin.querySelector('[data-pin-peak]');
      var o = { v:70000 };
      var tl = gsap.timeline({ scrollTrigger:{ trigger:pin, start:'top top', end:'+=140%', scrub:.6, pin:true } });
      tl.to(o, { v:1000000, ease:'none', onUpdate:function(){ if(num) num.textContent = fmtEuro(o.v); } }, 0)
        .fromTo(bar, { scaleX:.07 }, { scaleX:1, ease:'none' }, 0)
        .fromTo(peak, { yPercent:18, opacity:.5 }, { yPercent:0, opacity:1, ease:'none' }, 0);
    }

    ScrollTrigger.refresh();
  }

  if (document.readyState !== 'loading') setTimeout(init, 60);
  else document.addEventListener('DOMContentLoaded', init);
})();
