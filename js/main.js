/**
 * Lbby Website — Main JavaScript
 * Phase 5: Core interactivity and i18n
 */

(function () {
  'use strict';

  /* ================================================================
     1. Theme
     ================================================================ */
  function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    // Restore saved preference
    const saved = localStorage.getItem('lbby-theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }

    updateThemeAria();
    updateThemeFavicon();

    toggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('lbby-theme', next);
      updateThemeAria();
      updateThemeFavicon();
      document.dispatchEvent(new CustomEvent('lbby:themechange', { detail: { theme: next } }));
    });
  }

  function updateThemeAria() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function updateThemeFavicon() {
    const link = document.getElementById('favicon');
    if (!link) return;
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    link.setAttribute('href', theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg');
  }

  /* ================================================================
     2. Nav scroll state
     ================================================================ */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ================================================================
     3. Hamburger / mobile nav
     ================================================================ */
  function initHamburger() {
    const btn = document.getElementById('hamburger');
    const dropdown = document.getElementById('nav-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      dropdown.classList.toggle('open');
    });

    // Close when a link inside is clicked
    dropdown.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        btn.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        btn.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
      }
    });
  }

  /* ================================================================
     4. Smooth scroll for anchor links
     ================================================================ */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });

      // Update URL without reload
      if (history.pushState) {
        history.pushState(null, '', id);
      }
    });
  }

  /* ================================================================
     5. Reveal-on-scroll animations
     ================================================================ */
  function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ================================================================
     6. Active nav link highlighting
     ================================================================ */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ================================================================
     7 & 8. Internationalisation (i18n)
     ================================================================ */
  function initI18n() {
    var saved = localStorage.getItem('lbby-lang') || 'en';
    setLang(saved);

    var toggle = document.getElementById('lang-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      var current = localStorage.getItem('lbby-lang') || 'en';
      var next = current === 'en' ? 'vi' : 'en';
      setLang(next);
    });
  }

  function setLang(lang) {
    localStorage.setItem('lbby-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    var dict = lang === 'vi' ? window.LBBY_I18N_VI : window.LBBY_I18N_EN;
    if (!dict) return;

    // Helper: resolve nested key like "meta.title" → dict.meta.title
    function get(obj, path) {
      return path.split('.').reduce(function (acc, key) {
        return acc && acc[key] !== undefined ? acc[key] : null;
      }, obj);
    }

    // textContent
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = get(dict, key);
      if (val !== null) el.textContent = val;
    });

    // innerHTML (for rich text)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var val = get(dict, key);
      if (val !== null) el.innerHTML = val;
    });

    // Language label
    var label = document.querySelector('.lang-label');
    if (label) label.textContent = lang === 'vi' ? 'VI' : 'EN';

    // Document metadata
    if (dict.meta) {
      if (dict.meta.title) document.title = dict.meta.title;
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && dict.meta.desc) metaDesc.setAttribute('content', dict.meta.desc);
    }

    // Dispatch event
    document.dispatchEvent(new CustomEvent('lbby:langchange', { detail: { lang: lang } }));
  }

  /* ================================================================
     Bootstrap on DOMContentLoaded
     ================================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNav();
    initHamburger();
    initSmoothScroll();
    initReveal();
    initActiveNav();
    initI18n();
  });
})();
