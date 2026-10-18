(function(){

  'use strict';
  document.documentElement.classList.add('js');
  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euro = function(n){ return Math.round(n).toLocaleString('fr-FR').replace(/\s/g, ' ') + ' €'; };

/* notes de conception */
try{

  var bn = $('#btn-notes');
  bn.addEventListener('click', function(){
    var on = document.body.classList.toggle('notes');
    bn.setAttribute('aria-pressed', on ? 'true' : 'false');
    bn.textContent = on ? 'Masquer les notes de conception' : 'Afficher les notes de conception';
  });
}catch(e){}

/* en-tête */
try{

  var top = $('#top');
  var onScroll = function(){ top.classList.toggle('ombre', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  var mb = $('#menu-btn'), mp = $('#menu-panel');
  mb.addEventListener('click', function(){
    var o = mp.classList.toggle('ouvert'); mb.setAttribute('aria-expanded', o ? 'true' : 'false');
  });
  $$('#menu-panel a').forEach(function(a){ a.addEventListener('click', function(){ mp.classList.remove('ouvert'); mb.setAttribute('aria-expanded','false'); }); });
}catch(e){}

/* apparition */
try{

  if ('IntersectionObserver' in window && !reduit){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    $$('.rv').forEach(function(el){ io.observe(el); });
  } else { $$('.rv').forEach(function(el){ el.classList.add('in'); }); }
}catch(e){}

/* bouton collant mobile */
try{

  var col = $('#collant');
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ col.classList.toggle('vu', !es[0].isIntersecting); }, {threshold:0}).observe($('#hero'));
  }
}catch(e){}

/* animation du tri */
try{

  var scene = $('#tri-scene');
  var N = 22, ret = [4, 11, 17];
  var elim = [1,2,3,1,0,2,3,1,2,3,1,0,1,3,2,1,3,0,2,1,3,2];
  var cartes = [
    {i:'A', n:'[Cabinet A] · Paris', s:'Vente d’entreprise, transmission', o:'ORIAS n° [·] vérifié le [date]'},
    {i:'B', n:'[Cabinet B] · Lyon', s:'Fonds dédiés au-delà de 1 M€', o:'ORIAS n° [·] vérifié le [date]'},
    {i:'C', n:'[Cabinet C] · Luxembourg', s:'Résidents français et frontaliers', o:'Agrément [·] vérifié le [date]'}
  ];
  var barres = [], minuteurs = [];
  function construireTri(){
    scene.innerHTML = ''; barres = [];
    for (var k = 0; k < N; k++){
      var b = document.createElement('div');
      b.className = 'barre';
      b.style.top = (k * 17.4) + 'px';
      b.style.width = (42 + ((k * 37) % 55)) + '%';
      var ci = ret.indexOf(k);
      if (ci > -1){
        var c = cartes[ci];
        b.innerHTML = '<div class="carte-in"><span class="ini">' + c.i + '</span><div><b>' + c.n + '</b><span>' + c.s + '</span><i>' + c.o + '</i></div></div>';
      }
      scene.appendChild(b); barres.push(b);
    }
  }
  function etat(fin){
    $$('.chip').forEach(function(ch){ ch.classList.toggle('on', fin); });
    barres.forEach(function(b, k){
      var ci = ret.indexOf(k);
      b.classList.add('vu');
      if (ci > -1){ b.classList.add('retenu','carte'); b.style.top = (ci * 128) + 'px'; }
      else { b.classList.add('part'); }
    });
  }
  function jouerTri(){
    minuteurs.forEach(clearTimeout); minuteurs = [];
    construireTri();
    $$('.chip').forEach(function(ch){ ch.classList.remove('on'); });
    if (reduit){ etat(true); return; }
    barres.forEach(function(b, k){ minuteurs.push(setTimeout(function(){ b.classList.add('vu'); }, 60 + k * 45)); });
    [1,2,3].forEach(function(f){
      minuteurs.push(setTimeout(function(){
        $('.chip[data-c="' + f + '"]').classList.add('on');
        barres.forEach(function(b, k){ if (ret.indexOf(k) < 0 && elim[k] <= f) b.classList.add('out'); });
      }, 1200 + (f - 1) * 900));
    });
    minuteurs.push(setTimeout(function(){
      barres.forEach(function(b, k){ if (ret.indexOf(k) > -1) b.classList.add('retenu'); });
    }, 4000));
    minuteurs.push(setTimeout(function(){
      barres.forEach(function(b, k){
        var ci = ret.indexOf(k);
        if (ci > -1){ b.classList.add('carte'); b.style.top = (ci * 128) + 'px'; }
        else { b.classList.add('part'); }
      });
    }, 4800));
  }
  $('#tri-rejouer').addEventListener('click', jouerTri);
  jouerTri();
}catch(e){}

/* vidéo en code */
try{

  var plans = [
    {d:0, t:'Vous avez plus de 250 000 € à placer.'},
    {d:5, t:'En France, la garantie s’arrête à 70 000 € par compagnie.'},
    {d:11, t:'Au Luxembourg, vos actifs sont gardés à part, chez une banque dépositaire.'},
    {d:17, t:'Patrimlia choisit jusqu’à trois cabinets vérifiés pour votre situation.'},
    {d:24, t:'Vous choisissez qui vous rappelle.'}
  ];
  var DUREE = 30, ecoule = 0, enCours = false, dernier = 0, planActif = -1;
  var scenes = $$('.scene'), st = $('#v-st'), prog = $('#v-prog'), tps = $('#v-temps'), vb = $('#v-play'), compte = $('#v-compte');
  function mmss(s){ s = Math.floor(s); return '0:' + (s < 10 ? '0' : '') + s; }
  function rendre(){
    var p = 0; for (var i = 0; i < plans.length; i++){ if (ecoule >= plans[i].d) p = i; }
    if (p !== planActif){
      planActif = p;
      scenes.forEach(function(s, i){ s.classList.toggle('on', i === p); });
      st.textContent = plans[p].t;
    }
    if (p === 0){ var r = Math.min(1, ecoule / 3.2); compte.textContent = euro(1200000 * (1 - Math.pow(1 - r, 3))); }
    prog.style.width = (ecoule / DUREE * 100) + '%';
    tps.textContent = mmss(ecoule) + ' / 0:30';
  }
  function boucle(ts){
    if (!enCours) return;
    if (dernier) ecoule += (ts - dernier) / 1000;
    dernier = ts;
    if (ecoule >= DUREE){ ecoule = DUREE; rendre(); pause(true); return; }
    rendre(); requestAnimationFrame(boucle);
  }
  function lire(){ if (ecoule >= DUREE){ ecoule = 0; planActif = -1; } enCours = true; dernier = 0; majBouton(); requestAnimationFrame(boucle); }
  function pause(fin){ enCours = false; majBouton(fin); }
  function majBouton(fin){
    var lab = enCours ? 'Pause' : (fin ? 'Revoir' : 'Lire');
    vb.querySelector('span').textContent = lab;
    vb.setAttribute('aria-label', lab + ' la vidéo');
    vb.querySelector('svg').innerHTML = enCours ? '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>' : '<path d="M7 4v16l13-8z"/>';
  }
  vb.addEventListener('click', function(){ enCours ? pause() : lire(); });
  rendre(); compte.textContent = euro(1200000);
}catch(e){}

/* calculette */
try{

  var cm = $('#c-montant'), caff = $('#c-montant-aff'), cexp = $('#c-expose'), ctxt = $('#c-res-txt'), ccouv = $('#c-couvert');
  var nComp = 1, affiche = 930000, anim = null;
  function calc(){
    var m = +cm.value, couvert = Math.min(m, 70000 * nComp), exp = m - couvert;
    caff.textContent = euro(m);
    ctxt.textContent = 'au-dessus de la garantie, sur ' + euro(m) + ' placés auprès ' + (nComp === 1 ? 'd’une compagnie.' : 'de ' + nComp + ' compagnies.');
    ccouv.style.width = Math.max(2, couvert / m * 100) + '%';
    if (anim) cancelAnimationFrame(anim);
    var de = affiche, t0 = null;
    if (reduit){ affiche = exp; cexp.textContent = euro(exp); return; }
    var pas = function(ts){ if (!t0) t0 = ts; var r = Math.min(1, (ts - t0) / 450); affiche = de + (exp - de) * (1 - Math.pow(1 - r, 3)); cexp.textContent = euro(affiche); if (r < 1) anim = requestAnimationFrame(pas); };
    anim = requestAnimationFrame(pas);
  }
  cm.addEventListener('input', calc);
  $$('.seg button').forEach(function(b){ b.addEventListener('click', function(){
    nComp = +b.getAttribute('data-n');
    $$('.seg button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    calc();
  }); });
  calc();
}catch(e){}

/* triangle */
try{

  var textes = {
    ass: '<h3>La compagnie d’assurance</h3><p style="margin-top:8px">Elle gère votre contrat et vos arbitrages. Les actifs qui représentent votre épargne ne restent pas à son bilan : ils sont déposés chez une banque dépositaire.</p>',
    dep: '<h3>La banque dépositaire</h3><p style="margin-top:8px">Elle conserve ces actifs, séparés de ceux de l’assureur. L’assureur ne peut pas en disposer seul : une convention le lie à la banque et à l’autorité de contrôle.</p>',
    caa: '<h3>Le Commissariat aux Assurances</h3><p style="margin-top:8px">L’autorité de contrôle luxembourgeoise. Elle veille à la séparation des actifs et peut les bloquer si l’assureur est en difficulté. Les souscripteurs passent alors avant ses autres créanciers sur ces actifs.</p>'
  };
  var panneau = $('#p-tri');
  function choisir(k){
    panneau.innerHTML = textes[k];
    $$('.onglets button').forEach(function(b){ b.setAttribute('aria-selected', b.getAttribute('data-k') === k ? 'true' : 'false'); });
    $$('.noeud').forEach(function(n){ n.classList.toggle('actif', n.getAttribute('data-k') === k); });
    panneau.setAttribute('aria-labelledby', 't-' + k);
  }
  $$('.onglets button').forEach(function(b){ b.addEventListener('click', function(){ choisir(b.getAttribute('data-k')); }); });
  $$('.noeud').forEach(function(n){
    n.addEventListener('click', function(){ choisir(n.getAttribute('data-k')); });
    n.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); choisir(n.getAttribute('data-k')); } });
  });
  choisir('ass');
  if (reduit){ ['#pt1','#pt2'].forEach(function(s){ var c = $(s); if (c) c.parentNode.removeChild(c); }); }
}catch(e){}

/* parcours */
try{

  var Q = [
    {q:'Quel montant envisagez-vous de placer ?', o:['250 000 à 500 000 €','500 000 € à 1 M€','1 à 3 M€','Plus de 3 M€'], w:'Tous les cabinets ne travaillent pas les mêmes montants. Au-delà de 1 M€, certains proposent des fonds dédiés, d’autres non.'},
    {q:'Qu’est-ce qui vous amène ?', o:['Je vends mon entreprise','J’ai reçu un héritage ou une donation','Je pars à l’étranger, ou j’en reviens','Mon contrat français me pose question','Je prépare la transmission'], w:'Chaque cabinet a ses spécialités. Une vente d’entreprise et une succession ne demandent pas le même accompagnement.'},
    {q:'Où résidez-vous fiscalement ?', o:['En France','En Belgique','En Suisse','Ailleurs'], w:'La fiscalité du contrat est celle de votre pays de résidence. Nous choisissons des cabinets qui la connaissent.'},
    {q:'Quand souhaitez-vous agir ?', o:['Dans le mois','D’ici 3 à 6 mois','Je me renseigne'], w:'Pour vous présenter des cabinets disponibles au bon moment, sans vous presser.'}
  ];
  var pourquoi = [
    'accompagne des dirigeants après une vente d’entreprise.',
    'aide des héritiers à décider sans se presser.',
    'suit des clients qui changent de pays.',
    'reprend des contrats existants et en compare les frais.',
    'rédige des clauses bénéficiaires sur mesure.'
  ];
  var R = [], etape = 0, choix = {}, dernierFocus = null;
  var voile = $('#voile'), contenu = $('#f-contenu'), fEt = $('#f-etape'), fProg = $('#f-prog');
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function ouvrir(tranche){
    dernierFocus = document.activeElement;
    R = []; choix = {}; etape = 0;
    if (tranche !== undefined && tranche !== null){ R[0] = Q[0].o[tranche]; etape = 1; }
    voile.classList.add('ouvert'); voile.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    afficher();
  }
  function fermer(){
    voile.classList.remove('ouvert'); voile.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    if (dernierFocus && dernierFocus.focus) dernierFocus.focus();
  }
  function afficher(){
    if (etape < Q.length){
      var q = Q[etape];
      fEt.textContent = 'Question ' + (etape + 1) + ' sur ' + Q.length;
      fProg.style.width = (etape / Q.length * 100) + '%';
      var h = '<div class="f-corps"><div class="f-q"><h2 id="f-titre" tabindex="-1">' + esc(q.q) + '</h2><div class="opts">';
      q.o.forEach(function(o, i){ h += '<button type="button" class="opt" data-i="' + i + '" aria-pressed="' + (R[etape] === o ? 'true' : 'false') + '"><span>' + esc(o) + '</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E1E33" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button>'; });
      h += '</div>' + (etape > 0 ? '<button type="button" class="lien-btn" id="f-retour" style="align-self:flex-start">Question précédente</button>' : '') + '</div>';
      h += '<aside class="f-aide"><b style="color:var(--encre)">Pourquoi cette question ?</b><p>' + esc(q.w) + '</p><p class="small" style="border-top:1px solid var(--filet);padding-top:10px">Vos réponses servent seulement à choisir les cabinets. Rien n’est transmis sans votre accord.</p></aside></div>';
      contenu.innerHTML = h;
      $$('.opt', contenu).forEach(function(b){ b.addEventListener('click', function(){ R[etape] = q.o[+b.getAttribute('data-i')]; etape++; afficher(); }); });
      var rt = $('#f-retour'); if (rt) rt.addEventListener('click', function(){ etape--; afficher(); });
      $('#f-titre').focus();
    } else if (etape === Q.length){ afficherSelection(); }
    else { afficherMerci(); }
  }
  function afficherSelection(){
    fEt.textContent = 'Votre sélection'; fProg.style.width = '100%';
    var p = Math.max(0, Q[1].o.indexOf(R[1]));
    var h = '<div style="display:flex;flex-direction:column;gap:20px"><div style="display:flex;flex-direction:column;gap:10px"><h2 id="f-titre" tabindex="-1">Votre sélection : trois cabinets pour votre projet</h2><div class="recap">';
    R.forEach(function(r){ h += '<span>' + esc(r) + '</span>'; });
    h += '</div><p class="small">Démonstration : cabinets d’exemple. Pour chaque cabinet, cochez les deux cases si vous souhaitez qu’il vous appelle. Les autres ne recevront rien.</p></div>';
    cartes.forEach(function(c, i){
      h += '<div class="cab" id="cab' + i + '"><div class="cab-h"><span class="ini">' + c.i + '</span><div><b>' + esc(c.n) + '</b><i>' + esc(c.o) + '</i><span><strong style="color:var(--encre)">Pourquoi lui pour vous :</strong> ' + esc(i === 0 ? pourquoi[p] : (i === 1 ? 'spécialiste des fonds dédiés au-delà de 1 M€.' : 'installé au Luxembourg, suit des résidents français.')) + '</span></div></div>';
      h += '<label class="case"><input type="checkbox" data-c="' + i + '" data-t="tr"><span>Je demande à Patrimlia de transmettre mes réponses et mes coordonnées à ' + esc(c.n.split(' · ')[0]) + '.</span></label>';
      h += '<label class="case"><input type="checkbox" data-c="' + i + '" data-t="ap"><span>J’accepte d’être appelé par ' + esc(c.n.split(' · ')[0]) + ' au sujet de l’assurance vie luxembourgeoise, pendant 12 mois au plus. Je peux retirer cet accord à tout moment.</span></label></div>';
    });
    h += '<form id="f-form" novalidate style="display:flex;flex-direction:column;gap:16px;border-top:1px solid var(--filet);padding-top:20px"><h3>Comment ces cabinets peuvent-ils vous joindre ?</h3><div class="champs">';
    h += '<div class="champ"><label for="f-pre">Prénom</label><input id="f-pre" autocomplete="given-name"></div>';
    h += '<div class="champ"><label for="f-tel">Téléphone</label><input id="f-tel" type="tel" autocomplete="tel" inputmode="tel"></div>';
    h += '<div class="champ"><label for="f-mail">Email</label><input id="f-mail" type="email" autocomplete="email"></div>';
    h += '<div class="champ"><label for="f-cr">Quand préférez-vous être appelé ?</label><select id="f-cr"><option>En journée, en semaine</option><option>En fin de journée</option><option>Le samedi matin</option></select></div></div>';
    h += '<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center"><button type="submit" class="btn btn-plein" id="f-env" disabled>Envoyer</button><span class="small" id="f-aide" aria-live="polite">Cochez les deux cases d’au moins un cabinet.</span></div>';
    h += '<button type="button" class="lien-btn" id="f-retour" style="align-self:flex-start">Modifier mes réponses</button></form></div>';
    contenu.innerHTML = h;
    $('#f-titre').focus();
    var maj = function(){
      var n = 0;
      cartes.forEach(function(c, i){
        var tr = $('input[data-c="' + i + '"][data-t="tr"]', contenu).checked, ap = $('input[data-c="' + i + '"][data-t="ap"]', contenu).checked;
        choix[i] = tr && ap; if (choix[i]) n++;
        $('#cab' + i).classList.toggle('choisi', tr || ap);
      });
      var pre = $('#f-pre').value.trim(), tel = $('#f-tel').value.replace(/\D/g, ''), mail = $('#f-mail').value.trim();
      var champsOk = pre.length > 0 && tel.length >= 9 && /.+@.+\..+/.test(mail);
      var env = $('#f-env'), aide = $('#f-aide');
      env.disabled = !(n > 0 && champsOk);
      env.textContent = n <= 1 ? 'Envoyer à ce cabinet' : 'Envoyer à ces ' + n + ' cabinets';
      if (n === 0) env.textContent = 'Envoyer';
      aide.textContent = n === 0 ? 'Cochez les deux cases d’au moins un cabinet.' : (champsOk ? 'Aucun engagement. Premier échange sans frais.' : 'Il manque votre prénom, votre téléphone ou votre email.');
    };
    $$('input, select', contenu).forEach(function(el){ el.addEventListener('input', maj); el.addEventListener('change', maj); });
    $('#f-form').addEventListener('submit', function(e){ e.preventDefault(); if (!$('#f-env').disabled){ etape = Q.length + 1; afficher(); } });
    $('#f-retour').addEventListener('click', function(){ etape = 0; afficher(); });
    maj();
  }
  function afficherMerci(){
    fEt.textContent = 'Terminé';
    var n = 0; for (var k in choix){ if (choix[k]) n++; }
    var h = '<div style="display:flex;flex-direction:column;gap:18px;max-width:640px"><h2 id="f-titre" tabindex="-1">C’est noté : ' + (n === 1 ? 'un cabinet va vous appeler' : n + ' cabinets vont vous appeler') + '</h2>';
    h += '<p>Vous allez recevoir un email avec le nom de chaque cabinet, son numéro ORIAS, et votre fiche « Préparer votre premier rendez-vous » : les six questions à poser et les documents à réunir.</p>';
    h += '<p class="small">Démonstration : rien n’a été envoyé.</p>';
    h += '<div class="panneau" style="display:flex;flex-direction:column;gap:12px"><b style="color:var(--encre)">Une question en échange : qu’est-ce qui vous a décidé ?</b><div class="seg" id="f-dec">';
    ['Le calcul de la garantie','Choisir moi-même le cabinet','La charte de sélection','Autre chose'].forEach(function(t){ h += '<button type="button" aria-pressed="false">' + t + '</button>'; });
    h += '</div><span class="small" id="f-merci" aria-live="polite"></span></div><button type="button" class="btn btn-trait" id="f-fin" style="align-self:flex-start">Revenir à la page</button></div>';
    contenu.innerHTML = h;
    $('#f-titre').focus();
    $$('#f-dec button').forEach(function(b){ b.addEventListener('click', function(){ $$('#f-dec button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); $('#f-merci').textContent = 'Merci, c’est noté.'; }); });
    $('#f-fin').addEventListener('click', fermer);
  }
  $$('[data-ouvrir]').forEach(function(b){ b.addEventListener('click', function(){ ouvrir(null); }); });
  $$('.montant').forEach(function(b){ b.addEventListener('click', function(){ ouvrir(+b.getAttribute('data-tranche')); }); });
  $('#c-cta').addEventListener('click', function(){
    var m = +cm.value; ouvrir(m < 500000 ? 0 : m < 1000000 ? 1 : m <= 3000000 ? 2 : 3);
  });
  $('#fermer').addEventListener('click', fermer);
  voile.addEventListener('click', function(e){ if (e.target === voile) fermer(); });
  document.addEventListener('keydown', function(e){
    if (!voile.classList.contains('ouvert')) return;
    if (e.key === 'Escape'){ fermer(); return; }
    if (e.key === 'Tab'){
      var f = $$('button, input, select, a[href], [tabindex]:not([tabindex="-1"])', $('#fenetre')).filter(function(x){ return !x.disabled && x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]){ e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]){ e.preventDefault(); f[0].focus(); }
    }
  });
}catch(e){}
})();
