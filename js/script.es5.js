"use strict";

/**
 * Eclat Synergy — Main JavaScript
 * Navbar scroll, mobile menu, dropdowns, scroll reveal,
 * FAQ accordion, counter animation, WhatsApp FAB
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initDropdowns();
  initScrollReveal();
  initFAQ();
  initCounters();
  initYear();
});

/* ── Year ──────────────────────────────────────────────────────── */
function initYear() {
  document.querySelectorAll('.js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ── Navbar scroll effect ──────────────────────────────────────── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, {
    passive: true
  });
}

/* ── Mobile hamburger ──────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-menu');
  if (!hamburger || !menu) return;
  hamburger.addEventListener('click', () => {
    const open = menu.classList.toggle('mobile-open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('menu-open', open);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('mobile-open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });
}

/* ── Dropdown menus ────────────────────────────────────────────── */
function initDropdowns() {
  document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
    const next = toggle.nextElementSibling;
    if (!next) return;
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = next.classList.contains('open') || next.classList.contains('is-open');
      closeAllMenus();
      if (!isOpen) {
        next.classList.add(next.classList.contains('mega-menu') ? 'is-open' : 'open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Hover open for mega menu on desktop
  document.querySelectorAll('.has-mega-menu').forEach(li => {
    const toggle = li.querySelector('.nav-dropdown-toggle');
    const menu = li.querySelector('.mega-menu');
    if (!toggle || !menu) return;
    li.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 769) {
        closeAllMenus();
        menu.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
    li.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 769) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', () => closeAllMenus());

  // Keyboard: Escape closes
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllMenus();
  });
}
function closeAllMenus() {
  document.querySelectorAll('.nav-dropdown.open').forEach(d => {
    var _d$previousElementSib;
    d.classList.remove('open');
    (_d$previousElementSib = d.previousElementSibling) === null || _d$previousElementSib === void 0 || _d$previousElementSib.setAttribute('aria-expanded', 'false');
  });
  document.querySelectorAll('.mega-menu.is-open').forEach(m => {
    var _m$previousElementSib;
    m.classList.remove('is-open');
    (_m$previousElementSib = m.previousElementSibling) === null || _m$previousElementSib === void 0 || _m$previousElementSib.setAttribute('aria-expanded', 'false');
  });
}

/* ── Scroll reveal ─────────────────────────────────────────────── */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── FAQ accordion ─────────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq-question').forEach(b => {
        var _b$nextElementSibling;
        b.setAttribute('aria-expanded', 'false');
        (_b$nextElementSibling = b.nextElementSibling) === null || _b$nextElementSibling === void 0 || _b$nextElementSibling.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer === null || answer === void 0 || answer.classList.add('open');
      }
    });
  });
}

/* ── Counter animation ─────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1800;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, {
    threshold: 0.5
  });
  counters.forEach(c => observer.observe(c));
}

/* ── Smooth scroll for anchor links ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  });
});
