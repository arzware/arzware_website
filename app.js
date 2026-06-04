/**
 * ============================================================
 *  Arzware – Mascot-Driven Interactive Website
 *  app.js  ·  Production build
 * ============================================================
 *
 *  Dependencies (loaded before this script):
 *    - GSAP 3.12.7
 *    - ScrollTrigger plugin
 *
 *  All code is wrapped in an IIFE and gated behind a
 *  `prefers-reduced-motion` check so users who opt out of
 *  animations get a fully functional, instantly-visible page.
 * ============================================================
 */

(function () {
  'use strict';

  // ----------------------------------------------------------
  //  0.  ENVIRONMENT CHECKS
  // ----------------------------------------------------------

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const isMobile  = window.innerWidth < 768;
  const isTablet  = window.innerWidth >= 768 && window.innerWidth < 980;

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // ----------------------------------------------------------
  //  UTILITY: debounce helper
  // ----------------------------------------------------------

  function debounce(fn, ms) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  // ----------------------------------------------------------
  //  UTILITY: visibility-aware rAF wrapper
  //  Automatically pauses the loop when the tab is hidden.
  // ----------------------------------------------------------

  function createLoop(callback) {
    let id;
    let running = true;

    function tick() {
      if (!running) return;
      if (!document.hidden) callback();
      id = requestAnimationFrame(tick);
    }

    id = requestAnimationFrame(tick);

    return {
      stop()  { running = false; cancelAnimationFrame(id); },
      start() { if (!running) { running = true; tick(); } },
    };
  }

  // ----------------------------------------------------------
  //  1.  MASCOT ENTRANCE ANIMATION
  // ----------------------------------------------------------

  function initMascotEntrance() {
    const mascotImg = document.querySelector('.mascot-hero__image');
    const glow      = document.querySelector('.mascot-hero__glow');
    const thinSpan  = document.querySelector('.hero h1 .thin');
    const strongSpan = document.querySelector('.hero h1 .strong');
    const heroCopy  = document.querySelector('.hero p');
    var heroMeta  = document.querySelector('.hero-meta');

    // Disable the CSS keyframe animation so GSAP takes over
    if (mascotImg) mascotImg.style.animationName = 'none';

    if (prefersReducedMotion) {
      // Immediately show everything — no animation
      [mascotImg, glow, thinSpan, strongSpan, heroCopy, heroMeta].forEach(
        function (el) {
          if (el) {
            el.style.opacity = 1;
            el.style.transform = 'none';
          }
        }
      );
      return;
    }

    // Set initial hidden state for elements GSAP will reveal
    gsap.set([thinSpan, strongSpan, heroCopy, heroMeta].filter(Boolean), {
      opacity: 0,
      y: 30,
    });

    var tl = gsap.timeline({ delay: 0.3 });

    // Step 1 – Mascot rockets in
    if (mascotImg) {
      gsap.set(mascotImg, { y: '120vh', scale: 0.3, rotation: 15, opacity: 0 });
      tl.to(mascotImg, {
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'elastic.out(1, 0.6)',
      });
    }

    // Step 2 – Glow blooms behind mascot
    if (glow) {
      gsap.set(glow, { opacity: 0, scale: 0.5 });
      tl.to(
        glow,
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
        0.4
      );
    }

    // Step 3 – Headline spans stagger in
    var headlineSpans = [thinSpan, strongSpan].filter(Boolean);
    if (headlineSpans.length) {
      tl.to(
        headlineSpans,
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
        0.3
      );
    }

    // Step 4 – Hero copy paragraph
    if (heroCopy) {
      tl.to(
        heroCopy,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        0.6
      );
    }

    // Step 5 – Hero meta
    if (heroMeta) {
      tl.to(
        heroMeta,
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        0.8
      );
    }
  }

  // ----------------------------------------------------------
  //  2.  CURSOR TRACKING (desktop only)
  // ----------------------------------------------------------

  function initCursorTracking() {
    if (isMobile || isTablet || prefersReducedMotion) return;

    var hero = document.getElementById('mascot-hero');
    if (!hero) return;

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var currentX = 0;
    var currentY = 0;
    var targetX  = 0;
    var targetY  = 0;

    document.addEventListener(
      'mousemove',
      function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      },
      { passive: true }
    );

    // Reset when mouse leaves viewport
    document.addEventListener('mouseleave', function () {
      mouseX = window.innerWidth / 2;
      mouseY = window.innerHeight / 2;
    });

    createLoop(function () {
      var rect    = hero.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top  + rect.height / 2;

      // Map mouse offset to rotation targets (±5 Y, ±4 X)
      targetX = ((mouseX - centerX) / window.innerWidth) * 10;
      targetY = ((mouseY - centerY) / window.innerHeight) * -8;

      // Clamp
      targetX = Math.max(-5, Math.min(5, targetX));
      targetY = Math.max(-4, Math.min(4, targetY));

      // Smooth lerp
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      hero.style.transform =
        'translateY(-50%) perspective(800px) rotateY(' +
        currentX.toFixed(3) +
        'deg) rotateX(' +
        currentY.toFixed(3) +
        'deg)';
    });
  }

  // ----------------------------------------------------------
  //  3.  SCROLL COMPANION
  // ----------------------------------------------------------

  function initScrollCompanion() {
    if (prefersReducedMotion) return;

    var companion = document.getElementById('mascot-companion');
    var hero      = document.querySelector('.hero');
    if (!companion || !hero) return;

    // Show / hide based on hero position
    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom top+=100',
      onEnter: function () {
        companion.classList.add('active');
        // Stop hero particles when companion takes over
        if (window.__mascotParticles) window.__mascotParticles.stop();
      },
      onLeaveBack: function () {
        companion.classList.remove('active');
        if (window.__mascotParticles) window.__mascotParticles.start();
      },
    });

    // Scroll-velocity tilt reaction
    var lastScroll        = window.scrollY;
    var companionRotation = 0;

    createLoop(function () {
      var currentScroll = window.scrollY;
      var velocity      = currentScroll - lastScroll;
      lastScroll        = currentScroll;

      var targetRotation = Math.max(-8, Math.min(8, velocity * 0.5));
      companionRotation += (targetRotation - companionRotation) * 0.1;

      if (companion.classList.contains('active')) {
        companion.style.transform =
          'rotate(' + companionRotation.toFixed(3) + 'deg)';
      }
    });
  }

  // ----------------------------------------------------------
  //  4.  PARTICLE JET TRAIL SYSTEM
  // ----------------------------------------------------------

  function initParticles() {
    if (prefersReducedMotion || isMobile) return;

    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    var ctx        = canvas.getContext('2d');
    var particles  = [];
    var isEmitting = true;

    var colors = ['#8ee9ff', '#5ddfff', '#b7a0ff', '#ffbd64', '#ffffff'];
    var MAX_PARTICLES = 60;

    // ---- resize handler (debounced) ----
    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', debounce(resize, 150));

    // ---- factory ----
    function createParticle() {
      return {
        x: canvas.width / 2 + (Math.random() - 0.5) * 30,
        y: canvas.height * 0.62,
        vx: (Math.random() - 0.5) * 2.5,
        vy: Math.random() * 3 + 1.5,
        life: 1,
        decay: Math.random() * 0.015 + 0.008,
        size: Math.random() * 4 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    }

    // ---- render loop ----
    createLoop(function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Emit new particles
      if (isEmitting && particles.length < MAX_PARTICLES) {
        var emitCount = 2 + (Math.random() > 0.5 ? 1 : 0); // 2–3
        for (var i = 0; i < emitCount; i++) {
          particles.push(createParticle());
        }
      }

      // Update & draw (backwards iteration for safe splice)
      for (var j = particles.length - 1; j >= 0; j--) {
        var p = particles[j];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.03;   // gentle downward acceleration
        p.vx *= 0.99;   // air friction
        p.life -= p.decay;
        p.size *= 0.997; // slow shrink

        if (p.life <= 0) {
          particles.splice(j, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle   = p.color;
        ctx.globalAlpha = p.life * 0.6;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    });

    // Expose start/stop so other systems can control emission
    window.__mascotParticles = {
      stop:  function () { isEmitting = false; },
      start: function () { isEmitting = true; },
    };
  }

  // ----------------------------------------------------------
  //  5.  SECTION-AWARE SCROLL ANIMATIONS
  // ----------------------------------------------------------

  function initSectionAnimations() {
    if (prefersReducedMotion) {
      // Make everything visible immediately
      document.querySelectorAll('.intro-label, .intro-right, .intro-right h2, .intro-right p, .service-grid, .service').forEach(function(el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      var mi = document.getElementById('mascot-intro');
      if (mi) { mi.style.opacity = '1'; mi.style.transform = 'none'; }
      return;
    }

    // ---- Intro Section ----
    var introLabel = document.querySelector('.intro-label');
    var introH2    = document.querySelector('.intro-right h2');
    var introPs    = document.querySelectorAll('.intro-right p');
    var introLink  = document.querySelector('.intro-right .text-link');
    var mascotIntro = document.getElementById('mascot-intro');

    // Set initial hidden states explicitly
    if (introLabel) gsap.set(introLabel, { x: -50, opacity: 0 });
    if (introH2) gsap.set(introH2, { y: 40, opacity: 0 });
    if (introPs.length) gsap.set(introPs, { y: 30, opacity: 0 });
    if (introLink) gsap.set(introLink, { y: 20, opacity: 0 });

    // Intro label slides in from left
    if (introLabel) {
      ScrollTrigger.create({
        trigger: '.intro',
        start: 'top 82%',
        once: true,
        onEnter: function () {
          gsap.to(introLabel, {
            x: 0, opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
          });
        },
      });
    }

    // Mascot intro — elastic rocket entrance
    if (mascotIntro) {
      ScrollTrigger.create({
        trigger: '.intro',
        start: 'top 78%',
        once: true,
        onEnter: function () {
          gsap.to(mascotIntro, {
            x: 0, scale: 1, rotation: 0, opacity: 1,
            duration: 1.2,
            ease: 'elastic.out(1, 0.55)',
            delay: 0.25,
          });
        },
      });
    }

    // Intro right column content
    var introRightEls = [introH2].concat(Array.from(introPs)).concat(introLink ? [introLink] : []).filter(Boolean);
    if (introRightEls.length) {
      ScrollTrigger.create({
        trigger: '.intro',
        start: 'top 75%',
        once: true,
        onEnter: function () {
          gsap.to(introRightEls, {
            y: 0, opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
          });
        },
      });
    }

    // ---- Work / Projects Section ----
    var workSection = document.querySelector('.work');
    if (workSection) {
      // Counter animation (e.g. '01')
      var counterEl = document.querySelector('.count strong');
      if (counterEl) {
        var counterTarget = parseInt(counterEl.textContent, 10);
        if (!isNaN(counterTarget)) {
          ScrollTrigger.create({
            trigger: workSection,
            start: 'top 70%',
            once: true,
            onEnter: function () {
              animateCounter(counterEl, 0, counterTarget, 1);
            },
          });
        }
      }

      // Project headings — explicit set + to
      var projectHeadings = workSection.querySelectorAll('.project h3, .project h2');
      if (projectHeadings.length) {
        gsap.set(projectHeadings, { y: 30, opacity: 0 });
        ScrollTrigger.create({
          trigger: workSection,
          start: 'top 70%',
          once: true,
          onEnter: function () {
            gsap.to(projectHeadings, {
              y: 0, opacity: 1,
              duration: 0.6, stagger: 0.12,
              ease: 'power3.out',
            });
          },
        });
      }

      // Rule divider width animation
      var rules = workSection.querySelectorAll('.rule');
      rules.forEach(function (rule) {
        var ruleWidth = rule.offsetWidth || 120;
        gsap.set(rule, { width: 0 });
        ScrollTrigger.create({
          trigger: rule,
          start: 'top 85%',
          once: true,
          onEnter: function () {
            gsap.to(rule, { width: ruleWidth, duration: 0.8, ease: 'power2.inOut' });
          },
        });
      });
    }

    // ---- Metric counter (e.g. '3×') ----
    var metricEl = document.querySelector('.metric b');
    if (metricEl) {
      var metricText  = metricEl.textContent.trim();
      var metricMatch = metricText.match(/^(\d+)/);
      if (metricMatch) {
        var metricNum    = parseInt(metricMatch[1], 10);
        var metricSuffix = metricText.replace(/^\d+/, '');
        ScrollTrigger.create({
          trigger: metricEl,
          start: 'top 85%',
          once: true,
          onEnter: function () {
            animateCounter(metricEl, 0, metricNum, 0.8, metricSuffix);
          },
        });
      }
    }

    // ---- Paper (light-themed) section ----
    var paperSection = document.querySelector('.paper');
    if (paperSection) {
      ScrollTrigger.create({
        trigger: paperSection,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter:     function () { document.body.classList.add('in-light-section'); },
        onLeave:     function () { document.body.classList.remove('in-light-section'); },
        onEnterBack: function () { document.body.classList.add('in-light-section'); },
        onLeaveBack: function () { document.body.classList.remove('in-light-section'); },
      });
    }

    // ---- Services — explicit set + to (fixes blurred box bug) ----
    var serviceGrid  = document.querySelector('.service-grid');
    var serviceCards = document.querySelectorAll('.service');

    if (serviceGrid && serviceCards.length) {
      // Service-grid opacity is 0 in CSS; individual cards also start hidden
      gsap.set(serviceCards, { y: 50, opacity: 0 });

      ScrollTrigger.create({
        trigger: '.services',
        start: 'top 72%',
        once: true,
        onEnter: function () {
          // Reveal the grid background first
          gsap.to(serviceGrid, { opacity: 1, duration: 0.3, ease: 'power2.out' });
          // Then stagger the cards in
          gsap.to(serviceCards, {
            y: 0, opacity: 1,
            duration: 0.6, stagger: 0.12,
            ease: 'power3.out',
            delay: 0.1,
          });
        },
      });
    }

    // ---- Contact ----
    var mascotContact = document.getElementById('mascot-contact');
    if (mascotContact) {
      ScrollTrigger.create({
        trigger: '.contact',
        start: 'top 70%',
        once: true,
        onEnter: function () {
          mascotContact.classList.add('visible');
        },
      });
    }

    var formFields = document.querySelectorAll('.field input, .field textarea');
    if (formFields.length) {
      gsap.set(formFields, { y: 20, opacity: 0 });
      ScrollTrigger.create({
        trigger: '.contact',
        start: 'top 65%',
        once: true,
        onEnter: function () {
          gsap.to(formFields, {
            y: 0, opacity: 1,
            duration: 0.5, stagger: 0.08,
            ease: 'power2.out',
          });
        },
      });
    }
  }

  // ----------------------------------------------------------
  //  6.  NUMBER COUNTER UTILITY
  // ----------------------------------------------------------

  /**
   * Animate a numeric counter from `start` to `end` inside `el`.
   * @param {HTMLElement} el       Target element
   * @param {number}      start    Starting number
   * @param {number}      end      Ending number
   * @param {number}      duration Seconds
   * @param {string}      suffix   Optional suffix (e.g. '×')
   */
  function animateCounter(el, start, end, duration, suffix) {
    suffix = suffix || '';
    var obj = { val: start };
    gsap.to(obj, {
      val: end,
      duration: duration,
      ease: 'power1.out',
      onUpdate: function () {
        el.textContent = Math.round(obj.val) + suffix;
      },
    });
  }

  // ----------------------------------------------------------
  //  7.  ENHANCED REVEAL SYSTEM (ScrollTrigger batch)
  // ----------------------------------------------------------

  function initRevealSystem() {
    if (prefersReducedMotion) {
      // Instantly reveal everything
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('revealed');
        el.style.opacity   = 1;
        el.style.transform = 'none';
      });
      return;
    }

    // Default reveals (fade up)
    ScrollTrigger.batch('.reveal:not(.from-left):not(.from-right)', {
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          onComplete: function () {
            batch.forEach(function (el) { el.classList.add('revealed'); });
          },
        });
      },
      start: 'top 85%',
      once: true,
    });

    // From-left reveals
    ScrollTrigger.batch('.reveal.from-left', {
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          onComplete: function () {
            batch.forEach(function (el) { el.classList.add('revealed'); });
          },
        });
      },
      start: 'top 85%',
      once: true,
    });

    // From-right reveals
    ScrollTrigger.batch('.reveal.from-right', {
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          onComplete: function () {
            batch.forEach(function (el) { el.classList.add('revealed'); });
          },
        });
      },
      start: 'top 85%',
      once: true,
    });
  }

  // ----------------------------------------------------------
  //  8.  HOVER MICRO-INTERACTIONS
  // ----------------------------------------------------------

  function initHoverInteractions() {
    if (prefersReducedMotion) return;

    // ---- Service card hover ----
    var serviceCards = document.querySelectorAll('.service');
    serviceCards.forEach(function (card) {
      var mascotCard = card.querySelector('.mascot-card');

      card.addEventListener('mouseenter', function () {
        gsap.to(card, { scale: 1.01, duration: 0.25, ease: 'power2.out' });
        if (mascotCard) {
          gsap.to(mascotCard, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
        }
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(card, { scale: 1, duration: 0.25, ease: 'power2.out' });
        if (mascotCard) {
          gsap.to(mascotCard, { opacity: 0, scale: 0.6, duration: 0.25 });
        }
      });
    });

    // ---- CTA button ripple ----
    var visitBtns = document.querySelectorAll('.visit');
    visitBtns.forEach(function (btn) {
      btn.addEventListener('mouseenter', function (e) {
        var ripple = document.createElement('span');
        ripple.className = 'btn-ripple';

        var rect = btn.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top  = (e.clientY - rect.top) + 'px';

        btn.appendChild(ripple);

        // Clean up after animation completes
        ripple.addEventListener('animationend', function () {
          ripple.remove();
        });
      });
    });

    // ---- Nav last-child hover wink ----
    var navLastLink = document.querySelector('.nav a:last-child');
    var companion   = document.getElementById('mascot-companion');
    if (navLastLink && companion) {
      navLastLink.addEventListener('mouseenter', function () {
        if (companion.classList.contains('active')) {
          gsap.to(companion, {
            scale: 1.15,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          });
        }
      });
    }
  }

  // ----------------------------------------------------------
  //  9.  CONTACT FORM INTERACTIONS
  // ----------------------------------------------------------

  function initContactForm() {
    // ---- Field focus class ----
    var fields = document.querySelectorAll('.field input, .field textarea');
    fields.forEach(function (input) {
      input.addEventListener('focus', function () {
        input.closest('.field').classList.add('focused');
      });
      input.addEventListener('blur', function () {
        if (!input.value.trim()) {
          input.closest('.field').classList.remove('focused');
        }
      });
    });

    // ---- Form submit visual feedback ----
    var form = document.querySelector('.form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var self = this;

      // Spawn celebratory gold particle burst at mascot-contact
      if (!prefersReducedMotion) {
        spawnCelebrationBurst();
      }

      // Animate form out
      gsap.to(form, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: function () {
          // Show success message
          showFormSuccess(form);

          // After a short delay, actually trigger the mailto
          setTimeout(function () {
            triggerMailto(self);
          }, 3000);
        },
      });
    });
  }

  /**
   * Burst of gold particles at the contact mascot position.
   */
  function spawnCelebrationBurst() {
    var mascotContact = document.getElementById('mascot-contact');
    if (!mascotContact) return;

    var rect   = mascotContact.getBoundingClientRect();
    var cx     = rect.left + rect.width / 2;
    var cy     = rect.top  + rect.height / 2;
    var colors = ['#ffbd64', '#ffd700', '#ffec80', '#ffa726', '#ffffff'];
    var count  = 30;

    for (var i = 0; i < count; i++) {
      var dot = document.createElement('span');
      dot.className = 'celebration-particle';
      dot.style.left = cx + 'px';
      dot.style.top  = cy + 'px';
      dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(dot);

      // Animate with GSAP
      var angle    = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
      var distance = 60 + Math.random() * 100;

      gsap.to(dot, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 40,
        opacity: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: 'power3.out',
        onComplete: function () { dot.remove(); },
      });
    }
  }

  /**
   * Replace the form with a success message.
   */
  function showFormSuccess(formEl) {
    var wrapper = document.createElement('div');
    wrapper.className = 'form-success';
    wrapper.innerHTML =
      '<div class="form-success__icon">🎉</div>' +
      '<h3 class="form-success__title">Message sent!</h3>' +
      '<p class="form-success__text">Thanks for reaching out. We\'ll get back to you soon.</p>';

    formEl.style.display = 'none';
    formEl.parentNode.insertBefore(wrapper, formEl.nextSibling);

    gsap.from(wrapper, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out',
    });
  }

  /**
   * Build a mailto link from the form data and open it.
   */
  function triggerMailto(formEl) {
    var data    = new FormData(formEl);
    var subject = encodeURIComponent('Arzware project inquiry');
    var body    = encodeURIComponent(
      'Name: '    + (data.get('name')    || '') + '\n' +
      'Email: '   + (data.get('email')   || '') + '\n' +
      'Project: ' + (data.get('project') || '')
    );
    window.location.href = 'mailto:arzware.lb@gmail.com?subject=' + subject + '&body=' + body;
  }

  // ----------------------------------------------------------
  //  10.  SMOOTH SCROLL FOR ANCHOR LINKS
  // ----------------------------------------------------------

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        // Use native smooth scroll (GSAP ScrollToPlugin not loaded)
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    });
  }

  // ----------------------------------------------------------
  //  11.  NAV SCROLL BEHAVIOUR
  // ----------------------------------------------------------

  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var lastY = 0;

    // Throttled via rAF
    var ticking = false;
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            var y = window.scrollY;
            // Add scrolled class for visual style change
            nav.classList.toggle('scrolled', y > 50);
            lastY = y;
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // ----------------------------------------------------------
  //  12.  PERFORMANCE: window resize handler
  // ----------------------------------------------------------

  function initResizeHandler() {
    var debouncedRefresh = debounce(function () {
      ScrollTrigger.refresh();
    }, 150);

    window.addEventListener('resize', debouncedRefresh, { passive: true });
  }

  // ----------------------------------------------------------
  //  BOOT
  // ----------------------------------------------------------

  function boot() {
    initMascotEntrance();
    initCursorTracking();
    initParticles();
    initScrollCompanion();
    initSectionAnimations();
    initRevealSystem();
    initHoverInteractions();
    initContactForm();
    initSmoothScroll();
    initNavScroll();
    initResizeHandler();
  }

  // Kick off after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
