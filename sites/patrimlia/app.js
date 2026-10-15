var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
document.querySelectorAll('.rv,.triangle').forEach(function(el){io.observe(el);});

/* hero slider */
(function(){
  var rng=document.getElementById('rng'),tfill=document.getElementById('tfill'),now=document.getElementById('now'),prot=document.getElementById('prot'),seg=document.getElementById('seg'),capk=document.getElementById('capk'),h1=document.getElementById('h1'),sub=document.getElementById('sub'),cta=document.getElementById('cta'),bubble=document.getElementById('bubble'),bv=document.getElementById('bv'),ring=document.getElementById('ring'),hint=document.getElementById('hint'),grades=[document.querySelector('.g0'),document.querySelector('.g1'),document.querySelector('.g2'),document.querySelector('.g3')],marks=document.querySelectorAll('.mark');
  function cap(p){if(p<=25)return 250+(p/25)*250;if(p<=50)return 500+((p-25)/25)*500;if(p<=80)return 1000+((p-50)/30)*2000;return 3000+((p-80)/20)*2000;}
  function euro(k){return (Math.round(k)*1000).toLocaleString('fr-FR')+' €';}
  var SEG=[{n:'Investisseur prévoyant',range:'de 250 000 € à 500 000 €',h:'Votre capital, <span class="thin">hors de portée.</span>',s:'Dès 250 000 €, c\'est le droit luxembourgeois qui protège votre épargne. Pas un plafond de garantie de 70 000 €.',c:'Voir la stratégie à partir de 250 000 €'},
  {n:'Patrimoine établi',range:'de 500 000 € à 1 M€',h:'La protection des <span class="thin">grandes fortunes.</span>',s:'Triangle de sécurité, créancier de premier rang. À ce niveau, votre patrimoine change de catégorie, pas seulement de contrat.',c:'Voir ma stratégie patrimoine établi'},
  {n:'Grande fortune',range:'de 1 M€ à 3 M€',h:'Diversifier, <span class="thin">c\'est défendre.</span>',s:'Multidevises, fonds dédiés, transmission optimisée. Une architecture patrimoniale complète sur un seul contrat.',c:'Accéder à la stratégie grande fortune'},
  {n:'Famille & Family office',range:'3 M€ et au-delà',h:'L\'architecture <span class="thin">d\'une famille.</span>',s:'Fonds internes dédiés (FID, FAS), gouvernance familiale, un interlocuteur dédié à votre lignée.',c:'Parler à un conseiller family office'}];
  function idx(k){if(k<500)return 0;if(k<1000)return 1;if(k<3000)return 2;return 3;}
  var cur=-1;
  function render(){var p=+rng.value,k=cap(p),i=idx(k),s=SEG[i];tfill.style.width=Math.max(p,4)+'%';var lx=Math.min(Math.max(p,4),97)+'%';bubble.style.left=lx;ring.style.left=lx;now.textContent=euro(k);prot.textContent=euro(k);bv.textContent=euro(k);
    if(i!==cur){cur=i;grades.forEach(function(g,j){g.classList.toggle('on',j===i);});seg.textContent=s.n;capk.textContent=s.range;h1.innerHTML=s.h;sub.textContent=s.s;cta.textContent=s.c;marks.forEach(function(m){m.classList.toggle('on',+m.dataset.b===i);});}}
  var touched=false;function engage(){if(touched)return;touched=true;bubble.classList.remove('nudge');ring.style.display='none';if(hint)hint.style.opacity='0';}
  rng.addEventListener('input',function(){engage();render();});marks.forEach(function(m){m.addEventListener('click',function(){engage();rng.value=m.dataset.p;render();});});render();
  function demo(){var start=performance.now(),dur=1300,from=36,to=52;function step(t){if(touched)return;var kk=(t-start)/dur;if(kk>=1){rng.value=from;render();return;}var e=kk<.5?(kk*2):(2-kk*2);var ease=e<.5?2*e*e:-1+(4-2*e)*e;rng.value=from+(to-from)*ease;render();requestAnimationFrame(step);}requestAnimationFrame(step);}
  setTimeout(demo,1100);
})();

/* triangle */
(function(){var steps=document.querySelectorAll('.tpanel .step'),nodes=document.querySelectorAll('.node');
  function pick(k){steps.forEach(function(s){s.classList.toggle('on',+s.dataset.k===k);});nodes.forEach(function(n){n.classList.toggle('on',+n.dataset.k===k);});}
  steps.forEach(function(s){s.addEventListener('mouseenter',function(){pick(+s.dataset.k);});s.addEventListener('click',function(){pick(+s.dataset.k);});});
  nodes.forEach(function(n){n.addEventListener('click',function(){pick(+n.dataset.k);});n.addEventListener('mouseenter',function(){pick(+n.dataset.k);});});})();

/* duel */
(function(){var DATA={fr:{v:'70 000 €',w:7,col:'var(--rust)',tag:'930 000 € exposés.',tagc:'var(--rust)',sub:'garantie plafonnée à 70 000 €, et retraits gelables (loi Sapin 2).',rows:[['Garantie en cas de défaillance','Plafond 70 000 €','bad'],['Retraits en cas de crise','Gelables, loi Sapin 2','bad'],['Vos actifs','Au bilan de l\'assureur','bad'],['Fonds dédiés multidevises','Limités','bad']]},lx:{v:'1 000 000 €',w:100,col:'var(--green)',tag:'100 % protégé.',tagc:'#49c187',sub:'créancier de 1er rang, actifs ségrégués, hors risque de gel.',rows:[['Garantie en cas de défaillance','Intégrale, 1er rang','good'],['Retraits en cas de crise','Toujours disponibles','good'],['Vos actifs','Ségrégués, hors bilan','good'],['Fonds dédiés multidevises','Oui, sur-mesure','good']]}};
  var dv=document.getElementById('dv'),fb=document.getElementById('fb'),vtag=document.getElementById('vtag'),vsub=document.getElementById('vsub'),rows=document.getElementById('rows'),tbtns=document.querySelectorAll('.toggle button');
  var chk='<svg viewBox="0 0 24 24" fill="none" stroke="#49c187" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',crs='<svg viewBox="0 0 24 24" fill="none" stroke="#c86a46" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  function setDuel(t){var d=DATA[t];dv.textContent=d.v;fb.style.width=Math.max(d.w,4)+'%';fb.style.background=d.col;vtag.textContent=d.tag;vtag.style.color=d.tagc;vsub.textContent=d.sub;rows.innerHTML=d.rows.map(function(r){return '<div class="r"><span class="k">'+r[0]+'</span><span class="v '+r[2]+'">'+(r[2]==='good'?chk:crs)+r[1]+'</span></div>';}).join('');tbtns.forEach(function(b){b.classList.toggle('on',b.dataset.t===t);});}
  tbtns.forEach(function(b){b.addEventListener('click',function(){setDuel(b.dataset.t);});});setDuel('fr');})();

/* wizard */
(function(){var panes=document.querySelectorAll('.wpane'),steps=document.querySelectorAll('.wstep');
  function show(n){panes.forEach(function(p){p.hidden=(+p.dataset.pane!==n);});steps.forEach(function(s){s.classList.toggle('on',+s.dataset.s<=Math.min(n,2));});}
  panes[0].querySelectorAll('.opt').forEach(function(b){b.addEventListener('click',function(){show(1);});});
  panes[1].querySelectorAll('.opt').forEach(function(b){b.addEventListener('click',function(){show(2);});});
  document.querySelector('[data-back]').addEventListener('click',function(){show(1);});
  document.getElementById('submit').addEventListener('click',function(){show(3);steps.forEach(function(s){s.classList.add('on');});});
  var hcta=document.getElementById('cta');if(hcta)hcta.addEventListener('click',function(){show(1);});})();