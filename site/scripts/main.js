/* ============================================================
   SPORT TECHNIC MANDELIEU — Interactions
   ============================================================ */

(() => {
  'use strict';

  const $  = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

  const isReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;

  // ---------- READY ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  function boot() {
    initYear();
    initOpenNow();
    initLoader();
    initSmoothScroll();
    initCursor();
    initNavScroll();
    initHeroLetterIndices();
    initRevealWords();
    initMagnetic();
    initReviewsRail();

    // Wait for GSAP to be loaded (it's deferred), then init scroll effects
    waitFor(() => window.gsap && window.ScrollTrigger).then(() => {
      gsap.registerPlugin(ScrollTrigger);
      initHeroScrollVideo();
      initRevealOnScroll();
      initCounters();
    });
  }

  function waitFor(cond, timeout = 8000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      (function check() {
        if (cond()) return resolve();
        if (Date.now() - start > timeout) return reject(new Error('timeout'));
        requestAnimationFrame(check);
      })();
    });
  }

  // ---------- LOADER ----------
  function initLoader() {
    const loader = $('#loader');
    if (!loader) return;
    const hide = () => {
      loader.classList.add('is-hidden');
      setTimeout(() => loader.remove(), 800);
    };
    if (document.readyState === 'complete') {
      setTimeout(hide, 350);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 350), { once: true });
    }
  }

  // ---------- YEAR ----------
  function initYear() {
    const el = $('#year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ---------- OPEN NOW ----------
  function initOpenNow() {
    const el = $('#open-now');
    if (!el) return;
    const now = new Date();
    const day = now.getDay(); // 0 Sun, 1 Mon, ..., 6 Sat
    const minutes = now.getHours() * 60 + now.getMinutes();
    let open = false;
    if (day >= 1 && day <= 5) {
      const m = 8 * 60, n = 12 * 60, a = 14 * 60, b = 18 * 60;
      open = (minutes >= m && minutes < n) || (minutes >= a && minutes < b);
    }
    el.innerHTML = open
      ? '<span style="color:var(--gold)">●</span> Ouvert maintenant'
      : '<span style="color:var(--txt-500)">●</span> Fermé — réouverture prochaine';
  }

  // ---------- SMOOTH SCROLL (Lenis) ----------
  function initSmoothScroll() {
    if (isReducedMotion || !window.Lenis) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: t => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    window.__lenis = lenis;

    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // GSAP <-> Lenis bridge
    const tryBridge = () => {
      if (window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        setTimeout(tryBridge, 100);
      }
    };
    tryBridge();

    // Anchor links
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      });
    });
  }

  // ---------- CUSTOM CURSOR ----------
  function initCursor() {
    if (isTouch) return;
    const cursor = $('#cursor');
    if (!cursor) return;

    const dot = $('.cursor__dot', cursor);
    const ring = $('.cursor__ring', cursor);

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    let dx = mx, dy = my;

    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function tick() {
      dx += (mx - dx) * 0.45;
      dy += (my - dy) * 0.45;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${dx}px,${dy}px)`;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(tick);
    }
    tick();

    const hoverables = 'a,button,[data-magnetic],.review,.spec-card,.step,.stat';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverables)) cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverables)) cursor.classList.remove('is-hover');
    });
  }

  // ---------- NAV SCROLL STATE ----------
  function initNavScroll() {
    const nav = $('.nav');
    if (!nav) return;
    let last = -1;
    function update() {
      const y = scrollY;
      const scrolled = y > 60;
      if (scrolled !== last) { nav.classList.toggle('is-scrolled', scrolled); last = scrolled; }
    }
    update();
    addEventListener('scroll', update, { passive: true });
  }

  // ---------- HERO TITLE LETTER INDICES ----------
  function initHeroLetterIndices() {
    let i = 0;
    $$('.hero__title .word > span').forEach(s => {
      s.style.setProperty('--i', i++);
    });
  }

  // ---------- REVEAL WORDS WRAPPING ----------
  function initRevealWords() {
    $$('.reveal-words').forEach(node => {
      // Walk text nodes only (preserve <em>, <strong>, <br>, <span class="dim">)
      walk(node);
    });

    function walk(node) {
      const children = Array.from(node.childNodes);
      for (const child of children) {
        if (child.nodeType === Node.TEXT_NODE) {
          wrapTextNode(child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.tagName === 'BR') continue;
          walk(child);
        }
      }
    }

    function wrapTextNode(text) {
      const parts = text.nodeValue.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      for (const p of parts) {
        if (!p) continue;
        if (/^\s+$/.test(p)) {
          frag.appendChild(document.createTextNode(p));
        } else {
          const w = document.createElement('span');
          w.className = 'rev-word';
          const inner = document.createElement('span');
          inner.textContent = p;
          w.appendChild(inner);
          frag.appendChild(w);
        }
      }
      text.parentNode.replaceChild(frag, text);
    }

    // Stagger delays
    $$('.reveal-words').forEach(node => {
      const inners = $$('.rev-word > span', node);
      inners.forEach((s, i) => { s.style.transitionDelay = (i * 30) + 'ms'; });
    });
  }

  // ---------- HERO VIDEO + SCROLL TEXT NARRATIVE ----------
  // Desktop : video.currentTime is driven by scroll position (cinematic scrub).
  // Mobile  : video loops in background ; only the 3 text panels are scroll-driven.
  function initHeroScrollVideo() {
    const hero = $('#hero');
    const sticky = $('.hero__sticky');
    const video = $('#hero-video');
    const layers = $$('.hero__layer');
    const progressLabel = $('#hero-progress');
    if (!hero || !video) return;

    // Mobile detection — touch/coarse pointer is the strongest signal,
    // viewport-width fallback only when innerWidth is reliable (>0).
    const detectMobile = () => {
      if (matchMedia('(hover: none) and (pointer: coarse)').matches) return true;
      const w = window.innerWidth || document.documentElement.clientWidth || 0;
      return w > 0 && w <= 900;
    };
    let isMobileHero = detectMobile();

    // ----- video source + playback mode -----
    const desktopSrc = video.dataset.srcDesktop;
    const mobileSrc  = video.dataset.srcMobile;

    function setupVideoFor(mode) {
      const wantSrc = mode === 'mobile' ? mobileSrc : desktopSrc;
      if (video.src.endsWith(wantSrc)) return; // already correct
      video.src = wantSrc;
      if (mode === 'mobile') {
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('autoplay', '');
        // Try to play immediately; if autoplay is blocked (iOS Low Power Mode),
        // queue a play() on the first user interaction.
        const tryPlay = () => video.play().catch(() => {
          const onceTouch = () => {
            video.play().catch(() => {});
            removeEventListener('touchstart', onceTouch);
            removeEventListener('pointerdown', onceTouch);
          };
          addEventListener('touchstart', onceTouch, { once: true, passive: true });
          addEventListener('pointerdown', onceTouch, { once: true, passive: true });
        });
        tryPlay();
      } else {
        video.loop = false;
        video.removeAttribute('autoplay');
        video.pause();
      }
    }
    setupVideoFor(isMobileHero ? 'mobile' : 'desktop');

    // Defensive: enforce pixel dimensions so layout math is reliable
    const sizeHero = () => {
      const vh = Math.max(window.innerHeight, document.documentElement.clientHeight, 600);
      const factor = isMobileHero ? 2.5 : 3;
      hero.style.height = (vh * factor) + 'px';
      if (sticky) sticky.style.height = vh + 'px';
    };
    sizeHero();

    // Re-evaluate on resize / orientation change
    let resizeRaf;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        const wasMobile = isMobileHero;
        isMobileHero = detectMobile();
        if (wasMobile !== isMobileHero) setupVideoFor(isMobileHero ? 'mobile' : 'desktop');
        sizeHero();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
    };
    addEventListener('resize', onResize);
    addEventListener('orientationchange', onResize);

    // ----- desktop scrub warm-up (ignored on mobile) -----
    if (!isMobileHero) {
      const warmUp = () => {
        const p = video.play();
        if (p && p.then) p.then(() => { video.pause(); video.currentTime = 0; }).catch(() => {});
        removeEventListener('pointerdown', warmUp);
        removeEventListener('touchstart', warmUp);
      };
      addEventListener('pointerdown', warmUp, { once: true, passive: true });
      addEventListener('touchstart', warmUp, { once: true, passive: true });
    }

    let targetTime = 0;
    let smoothTime = 0;
    let duration = 0;
    let ready = false;

    function setupReady() {
      duration = video.duration || 15;
      ready = true;
    }
    if (video.readyState >= 1 && video.duration) setupReady();
    else video.addEventListener('loadedmetadata', setupReady, { once: true });

    // ----- scroll handler: drives text layers always; drives video time on desktop only -----
    let lastP = -1;
    function updateHeroProgress() {
      const rect = hero.getBoundingClientRect();
      const heroH = hero.offsetHeight;
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      const totalScroll = heroH - vh;
      if (totalScroll <= 0) return;
      const scrolled = Math.max(0, -rect.top);
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));

      if (!isMobileHero && ready) {
        targetTime = p * duration;
        try { video.currentTime = targetTime; } catch (_) {}
      }

      toggleLayer(layers[0], p < 0.33);
      toggleLayer(layers[1], p >= 0.38 && p < 0.72);
      toggleLayer(layers[2], p >= 0.78);

      if (progressLabel && Math.abs(p - lastP) > 0.005) {
        progressLabel.textContent = String(Math.round(p * 100)).padStart(2, '0') + ' / 100';
        lastP = p;
      }
    }

    addEventListener('scroll', updateHeroProgress, { passive: true });
    if (window.__lenis) window.__lenis.on('scroll', updateHeroProgress);
    updateHeroProgress();

    function toggleLayer(el, on) {
      if (!el) return;
      el.classList.toggle('is-visible', on);
    }

    // Smooth interpolation only on desktop (scrub mode)
    function tick() {
      if (!isMobileHero && ready) {
        const delta = targetTime - smoothTime;
        smoothTime += delta * 0.18;
        if (Math.abs(delta) > 0.005) {
          try { video.currentTime = smoothTime; } catch (_) {}
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // Final layout settle (fonts, etc.)
    addEventListener('load', () => {
      sizeHero();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }, { once: true });
    setTimeout(() => {
      sizeHero();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }, 800);
  }

  // ---------- REVEAL ON SCROLL (IntersectionObserver — bulletproof) ----------
  function initRevealOnScroll() {
    if (isReducedMotion) {
      $$('.reveal-words,.reveal').forEach(n => n.classList.add('is-revealed'));
      return;
    }

    // Tag elements that should fade-in
    $$('.spec-card,.step,.stat,.review,.info-block,.section__head').forEach(el => {
      el.classList.add('reveal');
    });

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });

    const targets = $$('.reveal-words, .reveal');
    targets.forEach(el => io.observe(el));

    // Safety net: if IO never fires for an element (e.g. very tall element above
    // the fold), force-reveal everything that's at least partly above the viewport
    // bottom after a short delay.
    setTimeout(() => {
      targets.forEach(el => {
        if (el.classList.contains('is-revealed')) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('is-revealed');
      });
    }, 600);
  }

  // ---------- MAGNETIC BUTTONS ----------
  function initMagnetic() {
    if (isTouch || isReducedMotion) return;
    const STRENGTH = 0.25;

    $$('[data-magnetic]').forEach(el => {
      let raf;
      const enter = () => { el.style.transition = 'transform 600ms cubic-bezier(.2,.8,.2,1)'; };
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
        const y = (e.clientY - (r.top + r.height / 2)) * STRENGTH;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${x}px, ${y}px)`;
        });
      };
      const leave = () => { el.style.transform = 'translate(0,0)'; };
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
    });
  }

  // ---------- COUNTERS (IntersectionObserver-driven) ----------
  function initCounters() {
    const stats = $$('.stat');
    if (!stats.length) return;

    // Pre-set static suffix (e.g. "/5") so layout doesn't jump
    stats.forEach(stat => {
      const suffix = stat.dataset.suffix || '';
      const sNum = $('.stat__num', stat);
      if (suffix && stat.dataset.divisor && !$('b', sNum)) {
        const b = document.createElement('b');
        b.textContent = suffix;
        sNum.appendChild(b);
      }
    });

    const animate = (stat) => {
      const target = parseInt(stat.dataset.count, 10);
      const divisor = parseFloat(stat.dataset.divisor || '1');
      const out = $('i', stat);
      const dur = 1600;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      function step(now) {
        const t = Math.min(1, (now - start) / dur);
        const v = ease(t) * target;
        const value = v / divisor;
        out.textContent = divisor === 1 ? Math.round(value) : value.toFixed(1).replace('.', ',');
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.4 });

    stats.forEach(s => io.observe(s));
  }

  // ---------- REVIEWS RAIL ----------
  function initReviewsRail() {
    const rail = $('#reviewsRail');
    if (!rail) return;
    const prev = $('[data-rail-prev]');
    const next = $('[data-rail-next]');
    const step = () => Math.round(rail.clientWidth * 0.7);
    prev?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
    next?.addEventListener('click', () => rail.scrollBy({ left:  step(), behavior: 'smooth' }));
  }

})();
