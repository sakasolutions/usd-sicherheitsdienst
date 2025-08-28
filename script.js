document.addEventListener('DOMContentLoaded', function() {

    // ======================================================
    // TEIL 1: NEUE NAVIGATION (Desktop & Mobil)
    // ======================================================
    const hamburgerButton = document.getElementById('hamburger-button');
    const mainNav = document.getElementById('main-nav');
    const body = document.body;

    if (hamburgerButton && mainNav) {
        // Menü öffnen/schließen beim Klick auf den Button
        hamburgerButton.addEventListener('click', function() {
            mainNav.classList.toggle('is-active');
            this.classList.toggle('is-active');
            body.classList.toggle('mobile-nav-open');

            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });

        // Menü schließen, wenn ein Link geklickt wird (wichtig für mobile Ansicht)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-active')) {
                    mainNav.classList.remove('is-active');
                    hamburgerButton.classList.remove('is-active');
                    body.classList.remove('mobile-nav-open');
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // ======================================================
    // TEIL 2: TYPEWRITER-EFFEKT FÜR DEN HERO-BEREICH
    // ======================================================
    const mottoElement = document.getElementById('typewriter');
    const cursorElement = document.querySelector('.cursor');
    
    if (mottoElement && cursorElement) {
        const mottoText = "professionell - verlässlich - meisterhaft";
        const typingSpeed = 120;
        const erasingSpeed = 70;
        const pauseDuration = 5000;
        const initialDelay = 1000;
        let charIndex = 0;

        function type() {
            cursorElement.style.display = 'inline'; 
            if (charIndex < mottoText.length) {
                mottoElement.textContent += mottoText.charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(erase, pauseDuration);
            }
        }

        function erase() {
            cursorElement.style.display = 'inline'; 
            if (charIndex > 0) {
                mottoElement.textContent = mottoText.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingSpeed);
            } else {
                setTimeout(type, typingSpeed);
            }
        }
        setTimeout(type, initialDelay);
    }

    // ======================================================
    // TEIL 3: SCROLL-ANIMATIONEN FÜR ALLE SEKTIONEN
    // ======================================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll, .timeline-animated, .fade-in');
    elementsToAnimate.forEach(el => observer.observe(el));


    // ======================================================
    // TEIL 4: OPTIONALES SMOOTH-SCROLLING FÜR ANKER-LINKS
    // ======================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                // Berücksichtigt die Höhe des fixierten Headers für präzises Scrollen
                const headerOffset = document.querySelector('.main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ======================================================
    // TEIL 5: KONTAKTSEKTION FUNKTIONALITÄT
    // ======================================================
    initContactForm();
    initGoogleMapsConsent();

});


/* ---------------------------------- */
/* Kontaktformular mit EmailJS        */
/* ---------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const submitButton = document.getElementById("submit-button");
  const checkbox = document.getElementById("privacy-policy");
  const messageBox = document.getElementById("form-messages");

  if (!form || !submitButton || !checkbox || !messageBox) return;

  // HIER DEINE EMAILJS DATEN EINTRAGEN
  const EMAILJS_PUBLIC_KEY = "DEIN_PUBLIC_KEY";
  const EMAILJS_SERVICE_ID = "DEIN_SERVICE_ID";
  const EMAILJS_ADMIN_TEMPLATE_ID = "DEIN_TEMPLATE_ID_FUER_DICH"; // E-Mail, die du bekommst
  const EMAILJS_CUSTOMER_TEMPLATE_ID = "DEIN_TEMPLATE_ID_FUER_KUNDEN"; // Bestätigungsmail an den Kunden

  emailjs.init(EMAILJS_PUBLIC_KEY);

  function toggleSubmitButton() {
    submitButton.disabled = !checkbox.checked;
  }

  toggleSubmitButton();
  checkbox.addEventListener("change", toggleSubmitButton);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (submitButton.disabled) return;

    submitButton.disabled = true;
    messageBox.className = "form-messages-new";
    messageBox.textContent = "Sende Nachricht...";
    messageBox.style.display = "block";

    // Zuerst E-Mail an dich senden
    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_ADMIN_TEMPLATE_ID, form)
      .then(() => {
        // Danach die Bestätigungsmail an den Kunden
        return emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE_ID, form);
      })
      .then(() => {
        messageBox.className = "form-messages-new success";
        messageBox.textContent = "✅ Ihre Anfrage wurde erfolgreich gesendet. Sie erhalten eine Bestätigungsmail.";
        form.reset();
        toggleSubmitButton();
      })
      .catch((error) => {
        console.error("EmailJS-Fehler:", error);
        messageBox.className = "form-messages-new error";
        messageBox.textContent = "❌ Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.";
        submitButton.disabled = false; // Button wieder aktivieren
      });
  });
}

/* ---------------------------------- */
/* Google Maps Consent                */
/* ---------------------------------- */
function initGoogleMapsConsent() {
  const container = document.querySelector(".map-placeholder-new");
  const button = document.getElementById("load-map-btn");

  if (!button || !container) return;

  button.addEventListener("click", () => {
      // HIER DEINEN GOOGLE MAPS EMBED-CODE (nur die URL aus dem src-Attribut) EINFÜGEN
      const iframeSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5158.722870353673!2d10.213817059993739!3d48.61464551518879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47993f0ee3dbd8e9%3A0xede20d6a5c4e4478!2sElbeweg%208%2C%2089537%20Giengen%20an%20der%20Brenz!5e1!3m2!1sde!2sde!4v1756323546615!5m2!1sde!2sde";

      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", iframeSrc); 
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("loading", "lazy");
      iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");

      container.innerHTML = "";
      container.appendChild(iframe);
  });
}