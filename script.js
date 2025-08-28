/* ===== Viewport Fix (optional für Mobile-VH) ===== */
function setVh(){const vh=window.innerHeight*0.01;document.documentElement.style.setProperty('--vh',`${vh}px`);}
setVh();window.addEventListener('resize',setVh);window.addEventListener('orientationchange',setVh);

/* ===== Mobile Navigation ===== */
const hamburger=document.getElementById('hamburger-button');
const nav=document.getElementById('main-nav');

function closeNav(){
  nav.classList.remove('is-active');
  hamburger.classList.remove('is-active');
  document.body.classList.remove('mobile-nav-open');
  hamburger.setAttribute('aria-expanded','false');
}
function openNav(){
  nav.classList.add('is-active');
  hamburger.classList.add('is-active');
  document.body.classList.add('mobile-nav-open');
  hamburger.setAttribute('aria-expanded','true');
}
hamburger?.addEventListener('click',()=>{
  const expanded=hamburger.getAttribute('aria-expanded')==='true';
  expanded?closeNav():openNav();
});
nav?.addEventListener('click',(e)=>{
  if(e.target.matches('a')) closeNav();
});
window.addEventListener('resize',()=>{ if(window.innerWidth>768) closeNav(); });

/* ===== Typewriter ===== */
const phrases=['Sicherheit ohne Kompromisse.','Diskret. Zuverlässig. Professionell.','Meisterbetrieb – Planung bis Einsatz.'];
const twEl=document.getElementById('typewriter');
const cursor=document.querySelector('.cursor');
let pIndex=0,cIndex=0,deleting=false;
function typeLoop(){
  if(!twEl) return;
  const cur=phrases[pIndex];
  if(!deleting){
    twEl.textContent=cur.slice(0,++cIndex);
    if(cIndex===cur.length){deleting=true;setTimeout(typeLoop,1400);return;}
  }else{
    twEl.textContent=cur.slice(0,--cIndex);
    if(cIndex===0){deleting=false;pIndex=(pIndex+1)%phrases.length;}
  }
  setTimeout(typeLoop,deleting?28:48);
}
typeLoop();
if(cursor){setInterval(()=>cursor.classList.toggle('hidden'),500);}

/* ===== Scroll Animations ===== */
const observer=new IntersectionObserver((entries)=>{
  for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}
},{threshold:0.2});
document.querySelectorAll('.animate-on-scroll').forEach(el=>observer.observe(el));

/* ===== Map Lazy Load (Consent Button) ===== */
const loadMapBtn=document.getElementById('load-map-btn');
const mapHolder=document.querySelector('.map-placeholder-new');
function injectMap(){
  if(!mapHolder||mapHolder.dataset.loaded==='true') return;
  const iframe=document.createElement('iframe');
  iframe.src='https://www.google.com/maps/embed?pb=...';
  iframe.loading='lazy';
  iframe.referrerPolicy='no-referrer-when-downgrade';
  mapHolder.appendChild(iframe);
  mapHolder.querySelector('.map-overlay-new')?.remove();
  mapHolder.dataset.loaded='true';
}
loadMapBtn?.addEventListener('click',injectMap);

/* ===== Form Handling (Dummy) ===== */
const form=document.getElementById('contact-form');
const submitBtn=document.getElementById('submit-button');
const privacy=document.getElementById('privacy-policy');
const messages=document.getElementById('form-messages');
function setMessage(type,text){
  if(!messages) return;
  messages.className='form-messages-new '+type;
  messages.textContent=text;
}
privacy?.addEventListener('change',()=>{ submitBtn.disabled=!privacy.checked; });
if(form){
  form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    if(!privacy?.checked){setMessage('error','Bitte Datenschutz bestätigen.');return;}
    const data=Object.fromEntries(new FormData(form).entries());
    try{
      setMessage('success','Wird gesendet …');
      // emailjs.init('YOUR_PUBLIC_KEY');
      // await emailjs.send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID',data);
      await new Promise(res=>setTimeout(res,600));
      setMessage('success','Danke! Ihre Anfrage wurde übermittelt.');
      form.reset(); submitBtn.disabled=true;
    }catch(err){
      console.error(err);
      setMessage('error','Fehler beim Senden. Bitte später erneut versuchen.');
    }
  });
}

/* ===== ESC zum Schließen des Menüs ===== */
document.addEventListener('keydown',(e)=>{
  if(e.key==='Escape'&&document.body.classList.contains('mobile-nav-open')){
    closeNav(); hamburger?.focus();
  }
});