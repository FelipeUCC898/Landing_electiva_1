/**
 * script.js — Hoja de Vida
 * Interactividad siguiendo el patrón del proyecto principal
 *
 * Módulos:
 *  1. Animaciones reveal en scroll
 *  2. Animación de barras de habilidades
 *  3. Scroll suave
 */

'use strict';

/* ============================================================
   1. ANIMACIONES REVEAL AL SCROLL
============================================================ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Delay escalonado para las secciones
  elements.forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`;
  });

  // Observer para activar animaciones cuando sean visibles
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
   2. ANIMACIÓN DE BARRAS DE HABILIDADES
============================================================ */
(function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  if (!skillBars.length) return;

  // Observer para animar cuando sean visibles
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const progress = bar.getAttribute('data-progress');
        
        // Animar el ancho con un pequeño delay
        setTimeout(() => {
          bar.style.width = progress + '%';
        }, 150);
        
        // Dejar de observar después de animar
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => observer.observe(bar));
})();

/* ============================================================
   3. SCROLL SUAVE (refuerzo para navegadores antiguos)
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
