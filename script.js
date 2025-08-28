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
const phrases = [
    'PROFESSIONELL . ZUVERLÄSSIG . MEISTERHAFT',
    'Ihr Schutz ist mein Handwerk.',
    'Sicherheit aus Giengen: Persönlich, direkt und qualifiziert.'
  ];
  const twEl = document.getElementById('typewriter');
  const cursor = document.querySelector('.cursor');
  let pIndex = 0,
    cIndex = 0,
    deleting = false;
  function typeLoop() {
    if (!twEl) return;
    const cur = phrases[pIndex];
    if (!deleting) {
      twEl.textContent = cur.slice(0, ++cIndex);
      if (cIndex === cur.length) {
        deleting = true;
        setTimeout(typeLoop, 2000); // Etwas längere Pause nach dem Motto
        return;
      }
    } else {
      twEl.textContent = cur.slice(0, --cIndex);
      if (cIndex === 0) {
        deleting = false;
        pIndex = (pIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 28 : 48);
  }
  typeLoop();
  if (cursor) {
    setInterval(() => cursor.classList.toggle('hidden'), 500);
  }

/* ===== Scroll Animations ===== */
const observer=new IntersectionObserver((entries)=>{
  for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}
},{threshold:0.2});
document.querySelectorAll('.animate-on-scroll').forEach(el=>observer.observe(el));

/* ===== Map Lazy Load (Consent Button) ===== */
const loadMapBtn = document.getElementById('load-map-btn');
const mapHolder = document.querySelector('.map-placeholder-new');

function injectMap() {
  if (!mapHolder || mapHolder.dataset.loaded === 'true') return;

  const iframe = document.createElement('iframe');

  // --- HIER IST DER KORREKTE LINK FÜR DEINE ADRESSE ---
  iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2617.587823552084!2d10.232338776856018!3d48.61899141641029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4799158356f91f1b%3A0x199c922a9697f48a!2sElbeweg%208%2C%2089537%20Giengen%20an%20der%20Brenz!5e0!3m2!1sde!2sde!4v1724841668411!5m2!1sde!2sde"; 
  
  // Diese Attribute sorgen dafür, dass die Karte den Container ausfüllt und korrekt angezeigt wird.
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.style.border = 0;
  iframe.allowFullscreen = true;
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  // --- ENDE ---

  mapHolder.appendChild(iframe);
  mapHolder.querySelector('.map-overlay-new')?.remove();
  mapHolder.dataset.loaded = 'true';
}

loadMapBtn?.addEventListener('click', injectMap);

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

/* ===== AUFKLAPPBARE LEISTUNGS-KARTEN (MOBIL) ===== */
document.querySelectorAll('.leistungen-grid .leistungs-item').forEach(card => {
    card.addEventListener('click', () => {
      // Diese Funktion wird nur auf mobilen Geräten ausgeführt
      if (window.innerWidth <= 768) {
        card.classList.toggle('is-open');
      }
    });
  });


  /* ====================================================== */
/* --- COOKIE CONSENT LOGIC --- */
/* ====================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-consent-banner');
    const overlay = document.getElementById('cookie-consent-overlay');
    const acceptAllBtn = document.getElementById('cookie-accept-all');
    const saveSelectionBtn = document.getElementById('cookie-save-selection');
    const marketingCheckbox = document.getElementById('cookie-marketing');

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const setCookie = (name, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
    };

    const hideBanner = () => {
        if (banner) banner.classList.add('hidden');
        if (overlay) overlay.classList.add('hidden');
    };

    const showBanner = () => {
        if (banner) banner.classList.remove('hidden');
        if (overlay) overlay.classList.remove('hidden');
    };

    const handleConsent = (consent) => {
        if (consent.marketing) {
            // Marketing-Skripte hier initialisieren
            initializeMap();
        }
    };

    const saveConsent = (consent) => {
        setCookie('usd_cookie_consent', JSON.stringify(consent), 365);
        hideBanner();
        handleConsent(consent);
    };

    acceptAllBtn?.addEventListener('click', () => {
        if (marketingCheckbox) marketingCheckbox.checked = true;
        const consent = {
            essential: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };
        saveConsent(consent);
    });

    saveSelectionBtn?.addEventListener('click', () => {
        const consent = {
            essential: true,
            marketing: marketingCheckbox ? marketingCheckbox.checked : false,
            timestamp: new Date().toISOString()
        };
        saveConsent(consent);
    });

    // Initial check
    const existingConsent = getCookie('usd_cookie_consent');
    if (existingConsent) {
        handleConsent(JSON.parse(existingConsent));
    } else {
        showBanner();
    }
});