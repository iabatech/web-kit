/* Patrimlia — mise en relation (nouvelle DA). Questionnaire -> webhook n8n + conversion Google Ads.
   Capture identique à app.js (même webhook, même payload, même conversion). */
(function(){
 var AW='AW-18517396949', HOOK='https://outils.iaba.tech/webhook/patrimlia-lead';
 try{window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+AW;document.head.appendChild(s);gtag('js',new Date());gtag('config',AW);}catch(e){}
 function conv(){try{if(window.gtag)gtag('event','conversion',{send_to:AW+'/yfRDCLibrp8dENWb5P1E',value:1.0,currency:'EUR'});}catch(e){}}
 function utm(){try{var q=new URLSearchParams(location.search);return{utm_source:q.get('utm_source')||'',utm_medium:q.get('utm_medium')||'',utm_campaign:q.get('utm_campaign')||''};}catch(e){return{};}}
 var EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
 function init(){
  var box=document.querySelector('.pq'); if(!box) return;
  var steps=box.querySelectorAll('.pq-step'), objectif='', tranche=box.getAttribute('data-tranche')||'';
  function show(n){steps.forEach(function(st){st.hidden=(+st.getAttribute('data-s')!==n);});}
  box.querySelectorAll('.pq-opt').forEach(function(b){b.addEventListener('click',function(){objectif=b.getAttribute('data-v')||'';show(1);});});
  var back=box.querySelector('.pq-back'); if(back)back.addEventListener('click',function(){show(0);});
  var sb=box.querySelector('.pq-submit');
  if(sb)sb.addEventListener('click',function(){
    var nom=(box.querySelector('#pq-nom').value||'').trim();
    var email=(box.querySelector('#pq-email').value||'').trim();
    var tel=(box.querySelector('#pq-tel').value||'').trim();
    var pays=(box.querySelector('#pq-pays').value||'').trim();
    var consent=box.querySelector('#pq-consent').checked;
    if(!nom){box.querySelector('#pq-nom').focus();return;}
    if(!EMAIL.test(email)){box.querySelector('#pq-email').focus();return;}
    if(tel.replace(/[^0-9]/g,'').length<6){box.querySelector('#pq-tel').focus();return;}
    if(!consent){box.querySelector('#pq-consent').focus();return;}
    sb.disabled=true; var lbl=sb.textContent; sb.textContent='Envoi…';
    var payload={nom:nom,email:email,tel:tel,pays:pays,tranche:tranche,objectif:objectif,consentement:consent,page:location.href,attribution:utm()};
    fetch(HOOK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      .then(function(r){if(r.ok){conv();show(2);}else{throw 0;}})
      .catch(function(){sb.disabled=false;sb.textContent=lbl;alert("Un souci est survenu lors de l'envoi. Réessayez, ou écrivez-nous à contact@iaba.tech.");});
  });
  try{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.style.opacity=1;e.target.style.transform='none';io.unobserve(e.target);}});},{threshold:.12});}catch(e){}
 }
 if(document.readyState!=='loading')init();else document.addEventListener('DOMContentLoaded',init);
})();
