var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
document.querySelectorAll('.rv,.triangle').forEach(function(el){io.observe(el);});

/* envoi lead vers n8n */
var PATRIM_WEBHOOK='https://outils.iaba.tech/webhook/patrimlia-lead';
var EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function patrimUTM(){try{var q=new URLSearchParams(location.search);return{utm_source:q.get('utm_source')||'',utm_medium:q.get('utm_medium')||'',utm_campaign:q.get('utm_campaign')||''};}catch(e){return{utm_source:'',utm_medium:'',utm_campaign:''};}}
function patrimSend(d,ok,err){
  var payload={nom:d.nom||'',email:d.email||'',pays:d.pays||'',tranche:d.tranche||'',objectif:d.objectif||'',site_web:d.site_web||'',page:location.href,attribution:patrimUTM()};
  fetch(PATRIM_WEBHOOK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(function(r){if(r.ok){ok&&ok();}else{err&&err();}})
    .catch(function(){err&&err();});
}

/* Google Ads : balise de base + conversion lead */
var PATRIM_AW='AW-18517396949';
(function(){try{window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+PATRIM_AW;document.head.appendChild(s);gtag('js',new Date());gtag('config',PATRIM_AW);}catch(e){}})();
function patrimConversion(){try{if(window.gtag)gtag('event','conversion',{send_to:PATRIM_AW+'/yfRDCLibrp8dENWb5P1E',value:1.0,currency:'EUR'});}catch(e){}}

/* hero slider */
(function(){
  var rng=document.getElementById('rng'),tfill=document.getElementById('tfill'),now=document.getElementById('now'),prot=document.getElementById('prot'),seg=document.getElementById('seg'),capk=document.getElementById('capk'),h1=document.getElementById('h1'),sub=document.getElementById('sub'),cta=document.getElementById('cta'),bubble=document.getElementById('bubble'),bv=document.getElementById('bv'),ring=document.getElementById('ring'),hint=document.getElementById('hint'),grades=[document.querySelector('.g0'),document.querySelector('.g1'),document.querySelector('.g2'),document.querySelector('.g3')],marks=document.querySelectorAll('.mark');
  if(!rng)return;
  function cap(p){if(p<=25)return 250+(p/25)*250;if(p<=50)return 500+((p-25)/25)*500;if(p<=80)return 1000+((p-50)/30)*2000;return 3000+((p-80)/20)*2000;}
  function euro(k){return (Math.round(k)*1000).toLocaleString('fr-FR')+' €';}
  var SEG=[{n:'Investisseur prévoyant',range:'de 250 000 € à 500 000 €',h:'Votre capital, <span class="thin">hors de portée.</span>',s:'Dès 250 000 €, c\'est le droit luxembourgeois qui protège votre épargne. Pas un plafond de garantie de 70 000 €.',c:'Voir la stratégie à partir de 250 000 €'},
  {n:'Patrimoine établi',range:'de 500 000 € à 1 M€',h:'La protection des <span class="thin">grandes fortunes.</span>',s:'Triangle de sécurité, créancier de premier rang. À ce niveau, votre patrimoine change de catégorie, pas seulement de contrat.',c:'Voir ma stratégie patrimoine établi'},
  {n:'Grande fortune',range:'de 1 M€ à 3 M€',h:'Diversifier, <span class="thin">c\'est défendre.</span>',s:'Multidevises, fonds dédiés, transmission optimisée. Une architecture patrimoniale complète sur un seul contrat.',c:'Accéder à la stratégie grande fortune'},
  {n:'Famille & Family office',range:'3 M€ et au-delà',h:'L\'architecture <span class="thin">d\'une famille.</span>',s:'Fonds internes dédiés (FID, FAS), gouvernance familiale, un interlocuteur dédié à votre lignée.',c:'Parler à un conseiller family office'}];
  function idx(k){if(k<500)return 0;if(k<1000)return 1;if(k<3000)return 2;return 3;}
  var cur=-1;
  function render(){var p=+rng.value,k=cap(p),i=idx(k),s=SEG[i];tfill.style.width=Math.max(p,4)+'%';var lx=Math.min(Math.max(p,4),97)+'%';bubble.style.left=lx;ring.style.left=lx;now.textContent=euro(k);prot.textContent=euro(k);bv.textContent=euro(k);
    if(i!==cur){cur=i;grades.forEach(function(g,j){g.classList.toggle('on',j===i);});seg.textContent=s.n;capk.textContent=s.range;h1.innerHTML=s.h;sub.textContent=s.s;cta.textContent=s.c;marks.forEach(function(m){m.classList.toggle('on',+m.dataset.b===i);});var sc=document.getElementById('slidecta');if(sc)sc.textContent='Mon étude · '+s.range;window.__patrimTranche=s.range;}}
  var touched=false;function engage(){if(touched)return;touched=true;bubble.classList.remove('nudge');ring.style.display='none';if(hint)hint.style.opacity='0';}
  rng.addEventListener('input',function(){engage();render();});marks.forEach(function(m){m.addEventListener('click',function(){engage();rng.value=m.dataset.p;render();});});render();
  function demo(){var start=performance.now(),dur=1300,from=36,to=52;function step(t){if(touched)return;var kk=(t-start)/dur;if(kk>=1){rng.value=from;render();return;}var e=kk<.5?(kk*2):(2-kk*2);var ease=e<.5?2*e*e:-1+(4-2*e)*e;rng.value=from+(to-from)*ease;render();requestAnimationFrame(step);}requestAnimationFrame(step);}
  setTimeout(demo,1100);
})();

/* triangle */
(function(){var steps=document.querySelectorAll('.tpanel .step'),nodes=document.querySelectorAll('.tnode');
  function pick(k){steps.forEach(function(s){s.classList.toggle('on',+s.dataset.k===k);});nodes.forEach(function(n){n.classList.toggle('on',+n.dataset.k===k);});}
  steps.forEach(function(s){s.addEventListener('mouseenter',function(){pick(+s.dataset.k);});s.addEventListener('click',function(){pick(+s.dataset.k);});});
  nodes.forEach(function(n){n.addEventListener('click',function(){pick(+n.dataset.k);});n.addEventListener('mouseenter',function(){pick(+n.dataset.k);});});})();

/* duel */
(function(){var DATA={fr:{v:'70 000 €',w:7,col:'var(--rust)',tag:'930 000 € exposés.',tagc:'var(--rust)',sub:'garantie plafonnée à 70 000 €, et retraits gelables (loi Sapin 2).',rows:[['Garantie en cas de défaillance','Plafond 70 000 €','bad'],['Retraits en cas de crise','Gelables, loi Sapin 2','bad'],['Vos actifs','Au bilan de l\'assureur','bad'],['Fonds dédiés multidevises','Limités','bad']]},lx:{v:'1 000 000 €',w:100,col:'var(--green)',tag:'100 % protégé.',tagc:'#49c187',sub:'créancier de 1er rang, actifs ségrégués, hors risque de gel.',rows:[['Garantie en cas de défaillance','Intégrale, 1er rang','good'],['Retraits en cas de crise','Toujours disponibles','good'],['Vos actifs','Ségrégués, hors bilan','good'],['Fonds dédiés multidevises','Oui, sur-mesure','good']]}};
  var dv=document.getElementById('dv'),fb=document.getElementById('fb'),vtag=document.getElementById('vtag'),vsub=document.getElementById('vsub'),rows=document.getElementById('rows'),tbtns=document.querySelectorAll('.toggle button');
  var chk='<svg viewBox="0 0 24 24" fill="none" stroke="#49c187" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',crs='<svg viewBox="0 0 24 24" fill="none" stroke="#c86a46" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  function setDuel(t){var d=DATA[t];dv.textContent=d.v;fb.style.width=Math.max(d.w,4)+'%';fb.style.background=d.col;vtag.textContent=d.tag;vtag.style.color=d.tagc;vsub.textContent=d.sub;rows.innerHTML=d.rows.map(function(r){return '<div class="r"><span class="k">'+r[0]+'</span><span class="v '+r[2]+'">'+(r[2]==='good'?chk:crs)+r[1]+'</span></div>';}).join('');tbtns.forEach(function(b){b.classList.toggle('on',b.dataset.t===t);});}
  tbtns.forEach(function(b){b.addEventListener('click',function(){setDuel(b.dataset.t);});});setDuel('fr');})();

/* wizard : 2 étapes (objectif + coordonnées), tranche reprise du slider */
(function(){var panes=document.querySelectorAll('.wpane'),steps=document.querySelectorAll('.wstep');
  if(!panes.length) return;
  function sync(){var t=window.__patrimTranche;if(!t)return;document.querySelectorAll('.wpane [data-wtranche]').forEach(function(el){el.textContent=t;});var h=document.querySelector('.wpane input[name=tranche]');if(h)h.value=t;}
  function show(n){panes.forEach(function(p){p.hidden=(+p.dataset.pane!==n);});steps.forEach(function(s){s.classList.toggle('on',+s.dataset.s<=Math.min(n,1));});}
  panes[0].querySelectorAll('.opt').forEach(function(b){b.addEventListener('click',function(){window.__patrimObjectif=b.dataset.v||'';sync();show(1);});});
  var back=document.querySelector('[data-back]');if(back)back.addEventListener('click',function(){show(0);});
  var sub=document.getElementById('submit');if(sub)sub.addEventListener('click',function(){
    var p1=panes[1];
    var texts=p1.querySelectorAll('input[type=text]');
    var nom=texts[0]?texts[0].value.trim():'';
    var paysEl=p1.querySelector('#f-pays');var pays=paysEl?paysEl.value.trim():(texts[1]?texts[1].value.trim():'');
    var emEl=p1.querySelector('input[type=email]');var email=emEl?emEl.value.trim():'';
    var hid=p1.querySelector('input[name=tranche]');var tranche=hid&&hid.value?hid.value:(window.__patrimTranche||'');
    if(!nom){if(texts[0])texts[0].focus();return;}
    if(!EMAIL_RE.test(email)){if(emEl)emEl.focus();return;}
    sub.disabled=true;var lbl=sub.textContent;sub.textContent='Envoi…';
    patrimSend({nom:nom,email:email,pays:pays,tranche:tranche,objectif:window.__patrimObjectif||''},
      function(){patrimConversion();show(2);steps.forEach(function(s){s.classList.add('on');});},
      function(){sub.disabled=false;sub.textContent=lbl;alert('Un souci est survenu lors de l\'envoi. Réessayez, ou écrivez-nous à contact@iaba.tech.');});
  });
  var hcta=document.getElementById('cta');if(hcta)hcta.addEventListener('click',function(){sync();show(0);});
  sync();})();

/* modal popup + cta flottant + cta de section */
(function(){var modal=document.getElementById('modal');if(!modal)return;
  var form=modal.querySelector('form'),done=modal.querySelector('.mdone');
  function open(e){if(e)e.preventDefault();var t=window.__patrimTranche;if(t){modal.querySelectorAll('[data-mtranche]').forEach(function(el){el.textContent=t;});var h=modal.querySelector('input[name=tranche]');if(h)h.value=t;}modal.classList.add('open');document.body.style.overflow='hidden';}
  function close(){modal.classList.remove('open');document.body.style.overflow='';}
  modal.addEventListener('click',function(e){if(e.target===modal)close();});
  var x=modal.querySelector('.x');if(x)x.addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  ['slidecta','methodecta','fab'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('click',open);});
  document.querySelectorAll('.js-open-modal').forEach(function(el){el.addEventListener('click',open);});
  if(form)form.addEventListener('submit',function(e){e.preventDefault();
    var texts=form.querySelectorAll('input[type=text]');
    var nom=texts[0]?texts[0].value.trim():'';
    var pays=texts[1]?texts[1].value.trim():'';
    var emEl=form.querySelector('input[type=email]');var email=emEl?emEl.value.trim():'';
    var hid=form.querySelector('input[name=tranche]');var tranche=hid&&hid.value?hid.value:(window.__patrimTranche||'');
    var btn=form.querySelector('button[type=submit]');
    if(!nom){if(texts[0])texts[0].focus();return;}
    if(!EMAIL_RE.test(email)){if(emEl)emEl.focus();return;}
    var lbl=btn?btn.textContent:'';if(btn){btn.disabled=true;btn.textContent='Envoi…';}
    patrimSend({nom:nom,email:email,pays:pays,tranche:tranche,objectif:window.__patrimObjectif||''},
      function(){patrimConversion();var hd=modal.querySelector('.mhead');if(hd)hd.style.display='none';form.style.display='none';if(done)done.hidden=false;},
      function(){if(btn){btn.disabled=false;btn.textContent=lbl;}alert('Un souci est survenu lors de l\'envoi. Réessayez, ou écrivez-nous à contact@iaba.tech.');});
  });
  var fab=document.getElementById('fab');if(fab)window.addEventListener('scroll',function(){fab.classList.toggle('show',window.scrollY>600);},{passive:true});
})();