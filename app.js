/* YourFaceTalk — shared front-end behaviour (loaded on every page) */
(function () {
  // Reveal on scroll
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (e.isIntersecting) {
        setTimeout(function () { e.target.classList.add('visible'); }, i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  window.revealObserver = obs;
  window.observeReveals = function (root) {
    (root || document).querySelectorAll('.reveal:not(.visible)').forEach(function (el) { obs.observe(el); });
  };
  window.observeReveals();

  // Nav compact on scroll (class-based; keeps responsive padding intact)
  var nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('nav-scrolled', window.scrollY > 80);
    });
  }

  // Active nav highlight for in-page anchors
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  if (sections.length) {
    window.addEventListener('scroll', function () {
      var cur = '';
      sections.forEach(function (s) { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
      navLinks.forEach(function (a) { a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--gold)' : ''; });
    });
  }

  // Mobile hamburger
  (function () {
    var hamburger = document.querySelector('.hamburger');
    var navLinksEl = document.querySelector('.nav-links');
    if (!hamburger || !navLinksEl) return;
    function setBars(open) {
      var b = hamburger.querySelectorAll('span');
      b[0].style.transform = open ? 'translateY(8px) rotate(45deg)' : '';
      b[1].style.opacity = open ? '0' : '';
      b[2].style.transform = open ? 'translateY(-8px) rotate(-45deg)' : '';
    }
    function toggle() {
      var o = navLinksEl.classList.toggle('mobile-open');
      hamburger.classList.toggle('is-open', o);
      setBars(o);
    }
    hamburger.addEventListener('click', toggle);
    hamburger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinksEl.classList.remove('mobile-open');
        hamburger.classList.remove('is-open');
        setBars(false);
      });
    });
  })();

  // Services dropdown (hover on desktop via CSS; click/tap toggle for touch + a11y)
  (function () {
    var toggles = document.querySelectorAll('.has-dropdown .dropdown-toggle');
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var li = btn.closest('.has-dropdown');
        var open = li.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.has-dropdown')) {
        document.querySelectorAll('.has-dropdown.open').forEach(function (li) {
          li.classList.remove('open');
          li.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
        });
      }
    });
  })();
})();

/* ═══════════════════════════════════════════════════════════
   АВТО-ОТГОВОР ПО ИМЕЙЛ (EmailJS) — безплатна алтернатива
   на платения autoresponse на Formspree.

   Изпраща автоматичен имейл до човека, който е пуснал запитване,
   че ще се свържем с него до 24 часа. Запитването към Елина
   продължава да идва както досега през Formspree.

   ЕДНОКРАТНА НАСТРОЙКА (≈5 мин, безплатно до ~200 имейла/месец):
   1) Регистрирай се в https://www.emailjs.com
   2) Email Services → Add New Service → свържи Gmail
        → копирай "Service ID"
   3) Email Templates → Create New Template със следните полета:
        To Email:  {{to_email}}
        From Name: {{from_name}}
        Reply To:  {{reply_to}}
        Subject:   {{subject}}
        Content:   {{message}}
        → Save → копирай "Template ID"
   4) Account → General → копирай "Public Key"
   5) Попълни трите стойности по-долу (между кавичките). Готово!

   Докато стойностите са "YOUR_..." нищо не се чупи —
   формите работят нормално, само авто-отговорът е изключен.
═══════════════════════════════════════════════════════════ */
var EMAILJS_CONFIG = {
  publicKey:  'NwmWrr5wrZSMkhKMY',
  serviceId:  'service_w4fmyyq',
  templateId: 'template_70dtfdp'
};

(function () {
  if (typeof emailjs === 'undefined') return;
  if (EMAILJS_CONFIG.publicKey.indexOf('YOUR_') === 0) return;
  try { emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey }); } catch (e) {}
})();

/* Автоматичен имейл до клиента.
   sendAutoReply(name, email)                    → стандартен отговор за запитване (24 часа)
   sendAutoReply(name, email, subject, message)  → персонализиран (напр. обратна връзка) */
window.sendAutoReply = function (name, email, subject, message) {
  if (typeof emailjs === 'undefined') return;
  if (!email) return;
  if (EMAILJS_CONFIG.serviceId.indexOf('YOUR_') === 0) return;
  if (EMAILJS_CONFIG.templateId.indexOf('YOUR_') === 0) return;
  var greeting = name ? ('Здравейте, ' + name) : 'Здравейте';
  subject = subject || 'Благодарим за вашето запитване — YourFaceTalk';
  message = message || (greeting + ',\n\n' +
    'Благодарим Ви за запитването! Получихме съобщението Ви и ще се свържем с Вас по имейл до 24 часа.\n\n' +
    'Поздрави,\nЕлина — YourFaceTalk\nyourfacetalk@gmail.com');
  try {
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
      to_email: email,
      to_name: name || '',
      from_name: 'YourFaceTalk',
      reply_to: 'yourfacetalk@gmail.com',
      subject: subject,
      message: message
    });
  } catch (e) {}
};
