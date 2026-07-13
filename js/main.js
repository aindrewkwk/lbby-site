// ── Lbby Website — Main JavaScript ─────────────────────────────
// Theme toggle, language toggle, scroll reveal, nav behavior
// Aligned with rstudio.live interaction patterns
// ─────────────────────────────────────────────────────────────
(function() {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 768;
  var html = document.documentElement;

  /* ── Theme Toggle ────────────────────────────────────────────── */
  var themeToggle = document.getElementById('theme-toggle');
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('lbby-theme'); } catch(e) {}
  var currentTheme = savedTheme || 'dark';

  function setTheme(theme) {
    currentTheme = theme;
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('lbby-theme', theme); } catch(e) {}
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    document.dispatchEvent(new CustomEvent('lbby:themechange', { detail: { theme: theme } }));
  }

  setTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
  }

  /* ── Nav ─────────────────────────────────────────────────────── */
  var nav = document.getElementById('nav');
  var hamburger = document.getElementById('hamburger');
  var dropdown = document.getElementById('nav-dropdown');

  window.addEventListener('scroll', function() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  if (hamburger && dropdown) {
    hamburger.addEventListener('click', function() {
      var expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      dropdown.classList.toggle('open');
      document.body.classList.toggle('nav-open', !expanded);
    });
    // Close on link click
    dropdown.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
        document.body.classList.remove('nav-open');
      });
    });
    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        hamburger.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
        document.body.classList.remove('nav-open');
      }
    });
  }

  // Active link tracking
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  function updateActiveLink() {
    var scrollY = window.scrollY + 120;
    sections.forEach(function(s) {
      if (scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight) {
        navLinks.forEach(function(l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + s.id);
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── Kinetic page variables ─────────────────────────────────── */
  function updateKineticVars() {
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var progress = Math.min(1, Math.max(0, window.scrollY / max));
    html.style.setProperty('--scroll-y', String(Math.round(window.scrollY)));
    html.style.setProperty('--scroll-progress', progress.toFixed(4));
  }

  if (!reducedMotion) {
    updateKineticVars();
    window.addEventListener('scroll', updateKineticVars, { passive: true });
    window.addEventListener('resize', updateKineticVars);
  }

  /* ── Language Toggle ─────────────────────────────────────────── */
  var currentLang = 'en';
  var langToggle = document.getElementById('lang-toggle');
  var langLabel = langToggle ? langToggle.querySelector('.lang-label') : null;

  function getNested(obj, path) {
    return path.split('.').reduce(function(acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  }

  function setLang(lang) {
    try { localStorage.setItem('lbby-lang', lang); } catch(e) {}
    html.lang = lang === 'vi' ? 'vi' : 'en';

    var dict = lang === 'vi' ? window.LBBY_I18N_VI : window.LBBY_I18N_EN;
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var val = getNested(dict, key);
      if (val !== null) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      var val = getNested(dict, key);
      if (val !== null) el.innerHTML = val;
    });

    if (langLabel) langLabel.textContent = lang === 'vi' ? 'VI' : 'EN';

    if (dict.meta) {
      if (dict.meta.title) document.title = dict.meta.title;
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && dict.meta.desc) metaDesc.setAttribute('content', dict.meta.desc);
    }

    document.dispatchEvent(new CustomEvent('lbby:langchange', { detail: { lang: lang } }));
  }

  if (langToggle) {
    langToggle.addEventListener('click', function() {
      var current = localStorage.getItem('lbby-lang') || 'en';
      setLang(current === 'en' ? 'vi' : 'en');
    });
  }

  /* ── Smooth scroll for anchor links ──────────────────────────── */
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');
    if (!id || id === '#') return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    if (history.pushState) {
      history.pushState(null, '', id);
    }
  });

  /* ── Scroll Reveal ───────────────────────────────────────────── */
  if (!reducedMotion) {
    var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(function(el) { obs.observe(el); });
  } else {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function(el) {
      el.classList.add('visible');
    });
  }

  /* ── Hero Parallax (desktop only) ────────────────────────────── */
  if (!reducedMotion && !isMobile) {
    var heroContent = document.querySelector('.hero__content');
    var hero = document.querySelector('.hero');
    if (heroContent && hero) {
      hero.addEventListener('mousemove', function(e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        heroContent.style.transform = 'translate(' + (x * -4) + 'px, ' + (y * -4) + 'px)';
      });
      hero.addEventListener('mouseleave', function() {
        heroContent.style.transform = 'translate(0,0)';
        heroContent.style.transition = 'transform 0.4s ease-out';
        setTimeout(function() { heroContent.style.transition = ''; }, 400);
      });
    }
  }

  /* ── Bootstrap ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    var current = localStorage.getItem('lbby-lang') || 'en';
    setLang(current);
  });
})();
