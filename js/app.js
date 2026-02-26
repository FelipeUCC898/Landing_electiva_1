/**
 * app.js — Notion Landing Page
 * Developer 3: feature/interactividad-js
 *
 * Módulos:
 *  1. Menú responsive (hamburger)
 *  2. Scroll suave entre secciones
 *  3. Header scroll effect
 *  4. Animaciones reveal en scroll
 *  5. Validación de formulario
 *  6. Contador animado (hero)
 *  7. Modal emergente (CTA)
 */

'use strict';

/* ============================================================
   1. MENÚ RESPONSIVE
============================================================ */
(function initMenu() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburger || !mobileMenu) return;

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', !open);
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Cerrar al hacer clic en un enlace
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      toggleMenu(false);
    }
  });
})();

/* ============================================================
   2. SCROLL SUAVE (refuerzo para navegadores que no soportan
      scroll-behavior: smooth en CSS)
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ============================================================
   3. HEADER — efecto al hacer scroll
============================================================ */
(function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handler = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', handler, { passive: true });
  handler(); // estado inicial
})();

/* ============================================================
   4. ANIMACIONES REVEAL AL SCROLL
============================================================ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Delay escalonado para grupos de tarjetas
  document.querySelectorAll('.beneficios-grid .reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
  });
  document.querySelectorAll('.testimonios-grid .reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // se activa sólo una vez
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. VALIDACIÓN DE FORMULARIO
============================================================ */
(function initFormValidation() {
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const success   = document.getElementById('form-success');

  if (!form) return;

  // Utilidades
  const getField  = id => document.getElementById(id);
  const getError  = id => document.getElementById(`${id}-error`);
  const showError = (id, msg) => {
    const field = getField(id);
    const error = getError(id);
    field.classList.add('error');
    if (error) error.textContent = msg;
  };
  const clearError = (id) => {
    const field = getField(id);
    const error = getError(id);
    field.classList.remove('error');
    if (error) error.textContent = '';
  };

  const rules = {
    nombre:  { required: true, minLen: 2, label: 'El nombre' },
    email:   { required: true, email: true, label: 'El correo' },
    mensaje: { required: true, minLen: 10, label: 'El mensaje' },
  };

  function validateField(id) {
    const field = getField(id);
    const rule  = rules[id];
    if (!field || !rule) return true;

    const val = field.value.trim();

    if (rule.required && !val) {
      showError(id, `${rule.label} es obligatorio.`);
      return false;
    }
    if (rule.minLen && val.length < rule.minLen) {
      showError(id, `${rule.label} debe tener al menos ${rule.minLen} caracteres.`);
      return false;
    }
    if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showError(id, 'Ingresa un correo válido (ej: ana@empresa.com).');
      return false;
    }

    clearError(id);
    return true;
  }

  // Validación en tiempo real (blur)
  Object.keys(rules).forEach(id => {
    const field = getField(id);
    if (field) {
      field.addEventListener('blur', () => validateField(id));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(id);
      });
    }
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const valid = Object.keys(rules)
      .map(id => validateField(id))
      .every(Boolean);

    if (!valid) return;

    // Simular envío
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensaje →';
      form.reset();

      if (success) {
        success.classList.add('show');
        success.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
          success.classList.remove('show');
          success.setAttribute('aria-hidden', 'true');
        }, 5000);
      }
    }, 1500);
  });
})();

/* ============================================================
   6. CONTADOR ANIMADO
============================================================ */
(function initCounter() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1500;
      const start    = performance.now();

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   7. MODAL EMERGENTE
============================================================ */
(function initModal() {
  const overlay  = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const modalCta = document.getElementById('modal-cta');

  if (!overlay) return;

  let shown = false;

  function openModal() {
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Mostrar al 60% de scroll
  window.addEventListener('scroll', () => {
    if (shown) return;
    const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrollPct > 0.60) {
      shown = true;
      openModal();
    }
  }, { passive: true });

  // Cerrar botón
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Cerrar al hacer clic fuera del modal
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) closeModal();
  });

  // CTA dentro del modal lleva al formulario y cierra
  if (modalCta) {
    modalCta.addEventListener('click', () => closeModal());
  }
})();

/* ============================================================
   EVENTO BOTÓN CTA PRINCIPAL (interactivo)
============================================================ */
(function initCtaEvent() {
  const ctaMain      = document.getElementById('cta-main');
  const ctaSecondary = document.getElementById('cta-secondary');

  function handleCta(e) {
    e.currentTarget.textContent = '🚀 ¡Vamos!';
    setTimeout(() => {
      e.currentTarget.textContent =
        e.currentTarget.id === 'cta-main'
          ? 'Empieza gratis — sin tarjeta'
          : 'Crear mi cuenta gratis →';
    }, 2000);
  }

  if (ctaMain)      ctaMain.addEventListener('click', handleCta);
  if (ctaSecondary) ctaSecondary.addEventListener('click', handleCta);
})();


/* ============================================================
   8. NAVBAR BEHAVIOR - Dev 2
   Comportamiento dinámico del navbar al hacer scroll
============================================================ */
(function initNavbarBehavior() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 80; // Punto donde cambia el estilo

  function updateNavbarStyle() {
    const scrollY = window.scrollY;
    
    if (scrollY > SCROLL_THRESHOLD) {
      header.classList.add('navbar-scrolled');
    } else {
      header.classList.remove('navbar-scrolled');
    }
  }

  // Escuchar scroll con throttle para mejor rendimiento
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNavbarStyle();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Estado inicial
  updateNavbarStyle();
})();
