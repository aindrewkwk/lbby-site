// ── Nav scroll effect ──────────────────────────────────────────────
const nav = document.getElementById('nav') || document.querySelector('.nav');

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Active nav link based on scroll position ───────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ── Close mobile nav on link click ─────────────────────────────────
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.remove('open');
  });
});

// ── Scroll-triggered animations ────────────────────────────────────
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.anim-fade-up').forEach(el => {
  animObserver.observe(el);
});

// ── Smooth scroll for anchor links ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    }
  });
});

// ── Docs sidebar active state on scroll ────────────────────────────
const docsLinks = document.querySelectorAll('.docs-sidebar a');
const docsSections = [];

docsLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    const section = document.querySelector(href);
    if (section) docsSections.push({ link, section });
  }
});

if (docsSections.length > 0) {
  const docsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        docsLinks.forEach(l => l.classList.remove('active'));
        const match = docsSections.find(s => s.section === entry.target);
        if (match) match.link.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });

  docsSections.forEach(s => docsObserver.observe(s.section));
}

// ── i18n (basic — Vietnamese for nav/features) ─────────────────────
const LBBY_I18N = {
  vi: {
    "nav.features": "Tính năng",
    "nav.download": "Tải về",
    "nav.docs": "Tài liệu",
    "nav.changelog": "Nhật ký",
    "nav.license": "Giấy phép",
  },
  en: {
    "nav.features": "Features",
    "nav.download": "Download",
    "nav.docs": "Docs",
    "nav.changelog": "Changelog",
    "nav.license": "License",
  }
};

function getLang() {
  return localStorage.getItem("lbby-lang") || "en";
}

function setLang(lang) {
  localStorage.setItem("lbby-lang", lang);
  document.documentElement.lang = lang;
  const label = document.getElementById('lang-label');
  if (label) label.textContent = lang === 'en' ? 'VI' : 'EN';
  const dict = LBBY_I18N[lang];
  if (!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
}

function toggleLang() {
  setLang(getLang() === 'en' ? 'vi' : 'en');
}

document.addEventListener('DOMContentLoaded', () => setLang(getLang()));
