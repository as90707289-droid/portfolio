/* =========================
   Modern Portfolio JavaScript
   ========================= */
(() => {
  'use strict';

  // ELEMENTS
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.right ul');
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav .right ul li a');
  const backToTop = document.getElementById('backToTop');
  const progress = document.createElement('div');
  progress.id = 'progress';
  document.body.prepend(progress);

  /* ========== MENU TOGGLE (mobile) ========== */
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      // Only toggle on small screens
      if (window.innerWidth <= 786) {
        navMenu.classList.toggle('show');
      }
    });

    // Auto-close when clicking a nav link (mobile only)
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 786) {
          navMenu.classList.remove('show');
        }
      });
    });

    // Optional: reset menu state if window resized back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 786) {
        navMenu.classList.remove('show');
      }
    });
  }

  /* ========== SMOOTH SCROLL ========== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', anchor.getAttribute('href'));
      }
    });
  });

  /* ========== SCROLL BEHAVIOR (header, backToTop, progress) ========== */
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;

    // Header shadow
    header.classList.toggle('scrolled', y > 24);

    // Back-to-top visibility
    if (backToTop) {
      backToTop.classList.toggle('show', y > window.innerHeight / 2);
    }

    // Progress bar
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const scrollable = docHeight - window.innerHeight;
    const pct = scrollable > 0 ? (y / scrollable) * 100 : 0;
    progress.style.width = `${pct}%`;

    // Active nav link
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ========== ACTIVE NAV HIGHLIGHT ========== */
  function updateActiveNav() {
    const OFFSET = 140;
    let current = null;

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= OFFSET) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ========== SCROLL REVEAL (IntersectionObserver) ========== */
  const revealElements = document.querySelectorAll(
    '.reveal, #education li, .skills-list li, .project-card'
  );

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // run once per element
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ========== BACK TO TOP ========== */
  if (backToTop) {
    backToTop.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========== Typed.js INIT (if available) ========== */
  if (window.Typed && document.querySelector('#element')) {
    try {
      const el = document.querySelector('#element');
      if (!el.dataset.typed) {
        new Typed('#element', {
          strings: ['Front-End Developer', 'Web Developer', 'React Enthusiast'],
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 1400,
          loop: true
        });
        el.dataset.typed = '1';
      }
    } catch (err) {
      console.warn('Typed init error:', err);
    }
  }

  /* ========== Theme Toggle Support (optional) ========== */
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const root = document.documentElement;
    const saved = localStorage.getItem('theme-mode');
    if (saved === 'light') root.classList.add('light-mode');

    themeToggle.addEventListener('click', () => {
      root.classList.toggle('light-mode');
      localStorage.setItem(
        'theme-mode',
        root.classList.contains('light-mode') ? 'light' : 'dark'
      );
    });
  }

  /* ========== Accessibility + Performance ========== */
  document.body.addEventListener('keyup', e => {
    if (e.key === 'Tab') document.body.classList.add('user-is-tabbing');
  }, { once: true });

  document.querySelectorAll('img:not([loading])')
    .forEach(img => img.setAttribute('loading', 'lazy'));
})();

/* =========================
   FORM SUBMISSION (Google Sheet)
   ========================= */
const scriptURL = "https://script.google.com/macros/s/AKfycbzKemy_KVLkDLCapNQIWqiyO0CArMjLHdLUa4UtkWQYFvW1_q1eXj9SohMtcO_k-goi/exec"; 
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById("msg");

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(response => {
        msg.innerHTML = "✅ Message sent successfully!";
        msg.style.color = "green";
        setTimeout(() => msg.innerHTML = "", 4000);
        form.reset();
      })
      .catch(error => {
        console.error('Error!', error.message);
        msg.innerHTML = "❌ Error sending message. Try again.";
        msg.style.color = "red";
      });
  });
}
