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
