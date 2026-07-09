/* ============================================================
   script.js — Premium Birthday Website
   Manjila Shrestha · Friendship Edition
   ============================================================ */

(() => {
  'use strict';

  /* ---------- Configuration ---------- */
  const CONFIG = {
    starCount: 90,
    sparkleCount: 25,
    balloonCount: 10,
    balloonColors: ['#AFCDE7', '#AFC8A4', '#F3D58C', '#E6C7E9', '#FAE8A0', '#D4B7D8'],
    shootingStarInterval: 4000,
    typingSpeed: 28,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };

  /* ---------- State ---------- */
  const state = {
    audio: null,
    musicPlaying: false,
    celebrationStarted: false,
    giftOpened: false,
    candlesBlown: false,
  };

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    createStars();
    createSparkles();
    startShootingStars();
    setupDoor();
    setupInvitation();
    setupMusicButton();
    setupGallery();
    setupExpandableCard();
    setupScrollReveals();
    createEndingStars();
    setupGiftAndCake();
    setupParallax();
  }

  /* ============================================================
     BACKGROUND EFFECTS
     ============================================================ */

  // Stars
  function createStars() {
    const layer = document.getElementById('starsLayer');
    if (!layer) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < CONFIG.starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty('--dur', `${1.5 + Math.random() * 2.5}s`);
      star.style.setProperty('--delay', `${Math.random() * 3}s`);
      frag.appendChild(star);
    }
    layer.appendChild(frag);
  }

  // Sparkles
  function createSparkles() {
    const layer = document.getElementById('sparklesLayer');
    if (!layer) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < CONFIG.sparkleCount; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.setProperty('--dur', `${2.5 + Math.random() * 3}s`);
      s.style.setProperty('--delay', `${Math.random() * 3}s`);
      frag.appendChild(s);
    }
    layer.appendChild(frag);
  }

  // Shooting stars
  function startShootingStars() {
    const layer = document.getElementById('shootingStarsLayer');
    if (!layer) return;
    const spawn = () => {
      if (CONFIG.reducedMotion) return;
      const star = document.createElement('div');
      star.className = 'shooting-star';
      star.style.left = `${Math.random() * 70}%`;
      star.style.top = `${Math.random() * 40}%`;
      layer.appendChild(star);
      setTimeout(() => star.remove(), 1100);
    };
    setInterval(spawn, CONFIG.shootingStarInterval);
    setTimeout(spawn, 800);
  }

  // Balloons (only after celebration starts)
  function createBalloons() {
    const layer = document.getElementById('balloonsLayer');
    if (!layer) return;
    for (let i = 0; i < CONFIG.balloonCount; i++) {
      spawnBalloon(layer, i * 500);
    }
    // Keep spawning
    setInterval(() => spawnBalloon(layer, 0), 2000);
  }

  function spawnBalloon(layer, delay) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const color = CONFIG.balloonColors[Math.floor(Math.random() * CONFIG.balloonColors.length)];
    const size = 30 + Math.random() * 30;
    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.2}px`;
    balloon.style.left = `${Math.random() * 100}%`;
    balloon.style.background = `radial-gradient(circle at 30% 30%, ${color}aa, ${color} 60%, ${color}88)`;
    balloon.style.setProperty('--balloon-color', color);
    balloon.style.setProperty('--dur', `${12 + Math.random() * 8}s`);
    balloon.style.setProperty('--delay', `${delay / 1000}s`);
    layer.appendChild(balloon);
    setTimeout(() => balloon.remove(), 22000 + delay);
  }

  // Confetti burst
  function burstConfetti(count = 80, originX = 50, originY = 30) {
    const layer = document.getElementById('confettiLayer');
    if (!layer) return;
    const colors = ['#AFCDE7', '#AFC8A4', '#F3D58C', '#E6C7E9', '#FFF8F0', '#FAE8A0', '#D4B7D8'];
    for (let i = 0; i < count; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = `${originX + (Math.random() - 0.5) * 30}%`;
      c.style.top = `${originY}%`;
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      const w = 6 + Math.random() * 8;
      const h = 8 + Math.random() * 10;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      c.style.setProperty('--dur', `${2.5 + Math.random() * 2}s`);
      c.style.setProperty('--delay', `${Math.random() * 0.3}s`);
      // random horizontal drift via transform in animation
      const drift = (Math.random() - 0.5) * 200;
      c.style.setProperty('transform', `translateX(${drift}px)`);
      layer.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }
  }

  /* ============================================================
     SECTION 1 — DOOR
     ============================================================ */
  function setupDoor() {
    const door = document.getElementById('door');
    const doorFrame = document.getElementById('doorFrame');
    if (!door || !doorFrame) return;

    const openDoor = () => {
      if (door.classList.contains('open')) return;
      door.classList.add('open');
      doorFrame.classList.add('opening');
      // Start background music on first user interaction (bypasses autoplay restrictions)
      startMusic();
      // Transition to invitation after door opens
      setTimeout(() => {
        transitionScreen('screenDoor', 'screenInvite');
      }, 1200);
    };

    door.addEventListener('click', openDoor);
    door.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDoor();
      }
    });
  }

  /* ============================================================
     SECTION 2 — INVITATION
     ============================================================ */
  function setupInvitation() {
    const btn = document.getElementById('inviteContinue');
    if (!btn) return;

    btn.addEventListener('click', () => {
      transitionScreen('screenInvite', 'screenCelebration', () => {
        startCelebration();
      });
    });
  }

  /* ============================================================
     SCREEN TRANSITIONS
     ============================================================ */
  function transitionScreen(fromId, toId, callback) {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    if (!from || !to) return;

    from.classList.remove('active');
    setTimeout(() => {
      to.classList.add('active');
      if (toId === 'screenCelebration') {
        // Move scroll to top
        window.scrollTo({ top: 0, behavior: 'auto' });
        // Hide the previous fixed-position screens to prevent mobile scroll conflicts
        setTimeout(() => {
          from.style.display = 'none';
          const door = document.getElementById('screenDoor');
          if (door) door.style.display = 'none';
        }, 500);
      }
      if (callback) setTimeout(callback, 400);
    }, 800);
  }

  /* ============================================================
     SECTION 3 — CELEBRATION
     ============================================================ */
  function startCelebration() {
    if (state.celebrationStarted) return;
    state.celebrationStarted = true;

    // Confetti burst
    burstConfetti(120, 50, 20);
    setTimeout(() => burstConfetti(80, 30, 40), 400);
    setTimeout(() => burstConfetti(80, 70, 40), 800);

    // Balloons
    createBalloons();

    // Create scroll indicators between sections
    createSectionIndicators();

    // Hero heading letter animation
    setTimeout(() => animateHeading(), 200);

    // Typing greeting
    setTimeout(() => typeGreeting(), 1400);
  }

  // Heading letter-by-letter animation
  function animateHeading() {
    const heading = document.getElementById('heroHeading');
    if (!heading) return;
    const text = heading.textContent;
    heading.innerHTML = '';
    const chars = Array.from(text);
    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'heading-char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${i * 0.07}s`;
      heading.appendChild(span);

      // Skip sparkle burst for space characters only
      if (char === ' ' || char === '\u00A0') return;

      // Sparkle burst appears when this character reaches its peak (35% into 0.8s animation)
      createSparkleBurst(span, i);
    });
  }

  // Creates a golden sparkle burst at a character's position
  function createSparkleBurst(container, charIndex) {
    if (CONFIG.reducedMotion) return;

    const burst = document.createElement('div');
    burst.className = 'heading-sparkle';

    const baseDelay = charIndex * 0.07 + 0.28;
    const particleCount = 6 + Math.floor(Math.random() * 4); // 6-9 particles
    const colors = ['#F3D58C', '#FAE8A0', '#FFE44D', '#FFF5CC', '#FFFFFF'];

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'heading-sparkle-particle';

      const size = 2 + Math.random() * 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;

      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.background = color;
      p.style.boxShadow = `0 0 ${4 + Math.random() * 4}px ${color}`;

      // Random scatter direction, biased upward
      const angle = Math.random() * Math.PI * 2;
      const distance = 14 + Math.random() * 26;
      const sx = Math.cos(angle) * distance;
      const sy = Math.sin(angle) * distance - 10;
      p.style.setProperty('--sx', `${sx}px`);
      p.style.setProperty('--sy', `${sy}px`);

      p.style.setProperty('--dur', `${0.35 + Math.random() * 0.35}s`);
      p.style.animationDelay = `${baseDelay + Math.random() * 0.15}s`;

      burst.appendChild(p);
    }

    container.appendChild(burst);

    // Clean up after all particles have animated
    const maxDelay = baseDelay + 0.15 + 0.7;
    setTimeout(() => {
      if (burst.parentNode) burst.remove();
    }, maxDelay * 1000 + 100);
  }

  // Typing greeting
  function typeGreeting() {
    const target = document.getElementById('typingContent');
    const textWrap = document.querySelector('.typing-text');
    if (!target) return;

    const greeting = "Hey Manjila! 🎉 So today's the day — happy birthday! I wanted to put together something simple and cheerful to celebrate you. Hope this brings a little joy to your day. Enjoy!";

    let i = 0;
    const type = () => {
      if (i < greeting.length) {
        const ch = greeting[i];
        target.textContent += ch;
        i++;
        let delay = CONFIG.typingSpeed;
        if (ch === '.') delay = 280;
        else if (ch === ',') delay = 150;
        else if (ch === '—') delay = 180;
        else delay = CONFIG.typingSpeed + Math.random() * 20;
        setTimeout(type, delay);
      } else {
        textWrap.classList.add('done');
        // Final confetti sparkle
        burstConfetti(40, 50, 50);
      }
    };
    type();
  }

  /* ============================================================
     MUSIC
     ============================================================ */
  function ensureAudio() {
    if (state.audio) return;
    try {
      const audio = new Audio('BESTHAPPYBITHDAYMUSIC.mp3');
      audio.loop = true;
      audio.volume = 0.35;
      audio.preload = 'auto';
      audio.addEventListener('error', () => {
        // Hide music button if file missing
        const btn = document.getElementById('musicBtn');
        if (btn) btn.style.display = 'none';
      });
      state.audio = audio;
    } catch (e) {
      console.warn('Audio init failed:', e);
    }
  }

  function setupMusicButton() {
    const btn = document.getElementById('musicBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      ensureAudio();
      if (!state.audio) return;
      if (state.musicPlaying) {
        state.audio.pause();
        state.musicPlaying = false;
        btn.classList.remove('playing');
      } else {
        state.audio.play().then(() => {
          state.musicPlaying = true;
          btn.classList.add('playing');
        }).catch(() => {
          // Autoplay may still be blocked
        });
      }
    });
  }

  function startMusic() {
    ensureAudio();
    if (!state.audio) return;
    state.audio.play().then(() => {
      state.musicPlaying = true;
      const btn = document.getElementById('musicBtn');
      if (btn) btn.classList.add('playing');
    }).catch(() => {
      // Autoplay blocked — user can click button
    });
  }

  /* ============================================================
     BLOW WIND & PARTICLES
     ============================================================ */

  // Creates wind gust lines that sweep across the cake
  function createBlowGust() {
    if (CONFIG.reducedMotion) return;
    const stage = document.querySelector('.gift-stage');
    if (!stage) return;

    const gust = document.createElement('div');
    gust.className = 'blow-gust';

    for (let i = 0; i < 10; i++) {
      const line = document.createElement('div');
      line.className = 'blow-gust-line';
      line.style.top = `${20 + Math.random() * 60}%`;
      line.style.width = `${50 + Math.random() * 90}px`;
      line.style.animationDelay = `${Math.random() * 0.2}s`;
      const tilt = (Math.random() - 0.5) * 20;
      line.style.setProperty('--tilt', `${tilt}deg`);
      gust.appendChild(line);
    }

    stage.appendChild(gust);
    setTimeout(() => gust.remove(), 1500);
  }

  // Creates a burst of small particles flying out from the candles
  function createBlowParticles() {
    if (CONFIG.reducedMotion) return;
    const stage = document.querySelector('.gift-stage');
    if (!stage) return;

    const colors = ['#ff6600', '#ff9900', '#ffe44d', '#fff5cc', '#ffffff', '#ff4400', '#ffcc00'];
    const count = 35;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'blow-particle';
      const size = 2 + Math.random() * 6;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.background = color;
      p.style.boxShadow = `0 0 ${4 + Math.random() * 4}px ${color}`;
      p.style.left = `${40 + Math.random() * 20}%`;
      p.style.top = `${35 + Math.random() * 25}%`;
      const dx = (Math.random() - 0.5) * 220;
      const dy = -(40 + Math.random() * 100);
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);
      p.style.setProperty('--dur', `${0.4 + Math.random() * 0.6}s`);
      p.style.animationDelay = `${Math.random() * 0.25}s`;
      stage.appendChild(p);
      setTimeout(() => p.remove(), 2500);
    }
  }

  // Creates additional floating smoke puffs for a more voluminous effect
  function createExtraSmoke() {
    if (CONFIG.reducedMotion) return;
    const stage = document.querySelector('.gift-stage');
    if (!stage) return;

    const count = 14;
    for (let i = 0; i < count; i++) {
      const puff = document.createElement('div');
      const size = 18 + Math.random() * 34;
      puff.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at 40% 40%, rgba(210,210,210,0.65), rgba(190,190,190,0.25), transparent);
        border-radius: 50%;
        filter: blur(${6 + Math.random() * 8}px);
        pointer-events: none;
        z-index: 12;
        left: ${36 + Math.random() * 28}%;
        top: ${28 + Math.random() * 24}%;
      `;

      const dx = (Math.random() - 0.5) * 140;
      const dy = -(50 + Math.random() * 130);
      const dur = 2.2 + Math.random() * 2.4;
      const delay = Math.random() * 0.6;

      puff.animate([
        { opacity: 0, transform: 'translate(0, 0) scale(0.3)' },
        { opacity: 0.65, transform: `translate(${dx * 0.2}px, ${dy * 0.2}px) scale(1.2)`, offset: 0.12 },
        { opacity: 0.45, transform: `translate(${dx * 0.45}px, ${dy * 0.5}px) scale(2.4)`, offset: 0.4 },
        { opacity: 0.2, transform: `translate(${dx * 0.7}px, ${dy * 0.8}px) scale(3.8)`, offset: 0.7 },
        { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(5.5)` }
      ], {
        duration: dur * 1000,
        delay: delay * 1000,
        easing: 'ease-out',
        fill: 'forwards'
      });

      stage.appendChild(puff);
      setTimeout(() => puff.remove(), (dur + delay + 0.5) * 1000);
    }
  }

  /* ============================================================
     GIFT & CAKE
     ============================================================ */
  function setupGiftAndCake() {
    const gift = document.getElementById('giftContainer');
    const cake = document.getElementById('cakeContainer');
    const blowBtn = document.getElementById('blowCandlesBtn');
    const wishText = document.getElementById('wishText');
    if (!gift || !cake) return;

    const openGift = () => {
      if (state.giftOpened) return;
      state.giftOpened = true;
      gift.classList.add('open');
      // Confetti burst from gift
      const rect = gift.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth * 100;
      const y = (rect.top + rect.height / 2) / window.innerHeight * 100;
      burstConfetti(100, x, y);
      setTimeout(() => burstConfetti(60, x, y), 200);

      // Reveal cake
      setTimeout(() => {
        cake.classList.add('revealed');
        cake.setAttribute('aria-hidden', 'false');
      }, 500);

      // Show blow button
      setTimeout(() => {
        blowBtn.classList.add('visible');
      }, 1200);
    };

    gift.addEventListener('click', openGift);
    gift.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGift();
      }
    });

    // Blow candles
    if (blowBtn) {
      blowBtn.addEventListener('click', () => {
        if (state.candlesBlown) return;
        state.candlesBlown = true;
        const candles = document.querySelectorAll('.candle');

        // 1. Wind gust swoosh across the cake
        createBlowGust();

        // 2. Extra floating smoke puffs for pronounced volume
        createExtraSmoke();

        // 3. Particle burst from candles
        createBlowParticles();

        // 4. Stretch flames sideways (wind effect) before extinguishing
        candles.forEach((c, i) => {
          setTimeout(() => c.classList.add('blowing'), i * 60);
        });

        // 5. After wind passes, extinguish candles
        setTimeout(() => {
          candles.forEach((c, i) => {
            c.classList.remove('blowing');
            setTimeout(() => c.classList.add('blown'), i * 60);
          });
        }, 500);

        // Confetti burst after candles are out
        setTimeout(() => {
          const rect = cake.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth * 100;
          const y = (rect.top + rect.height / 2) / window.innerHeight * 100;
          burstConfetti(120, x, y);
          setTimeout(() => burstConfetti(60, x, y), 200);
        }, 700);

        // Wish text appears
        setTimeout(() => {
          wishText.classList.add('visible');
        }, 1100);

        blowBtn.style.opacity = '0.5';
        blowBtn.style.pointerEvents = 'none';
      });
    }
  }

  /* ============================================================
     GALLERY MODAL
     ============================================================ */
  function setupGallery() {
    const items = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = modal?.querySelector('.modal-close');
    if (!items.length || !modal) return;

    items.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Memory';
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { modalImg.src = ''; }, 400);
    };

    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  /* ============================================================
     EXPANDABLE CARD
     ============================================================ */
  function setupExpandableCard() {
    const card = document.getElementById('finalCard');
    const toggle = document.getElementById('finalToggle');
    if (!card || !toggle) return;

    toggle.addEventListener('click', () => {
      const expanded = card.classList.toggle('expanded');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  /* ============================================================
     SCROLL REVEALS
     ============================================================ */
  function setupScrollReveals() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  /* ============================================================
     SCROLL INDICATORS
     ============================================================ */
  function createSectionIndicators() {
    const celebration = document.getElementById('screenCelebration');
    if (!celebration) return;

    // All sections that should get a scroll indicator after them
    const sectionSelector = '.hero-section, .wish-section, .gift-section, .memories-section, .final-section';
    const sections = celebration.querySelectorAll(sectionSelector);
    if (!sections.length) return;

    const indicators = [];

    sections.forEach((section) => {
      const indicator = document.createElement('div');
      indicator.className = 'section-indicator';

      const dot = document.createElement('div');
      dot.className = 'section-indicator-dot';

      const arrow = document.createElement('div');
      arrow.className = 'section-indicator-arrow';
      arrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';

      indicator.appendChild(dot);
      indicator.appendChild(arrow);

      // Insert after the current section
      section.parentNode.insertBefore(indicator, section.nextSibling);
      indicators.push(indicator);

      // Observe the indicator to toggle visibility via IntersectionObserver
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateIndicatorVisibility(indicator);
          } else {
            indicator.classList.remove('visible');
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px -30px 0px'
      });

      observer.observe(indicator);
    });

    // Single consolidated scroll listener to fade indicators near the bottom
    const updateIndicatorVisibility = (indicator) => {
      const ending = document.querySelector('.ending-section');
      if (!ending) {
        indicator.classList.add('visible');
        return;
      }
      const endingRect = ending.getBoundingClientRect();
      const vh = window.innerHeight;

      if (endingRect.top < vh + 200) {
        indicator.classList.remove('visible');
        indicator.classList.add('fade-end');
      } else {
        indicator.classList.add('visible');
        indicator.classList.remove('fade-end');
      }
    };

    const refreshAllIndicators = () => {
      indicators.forEach(ind => {
        if (ind.classList.contains('fade-end') || ind.classList.contains('visible')) {
          updateIndicatorVisibility(ind);
        }
      });
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          refreshAllIndicators();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================================
     ENDING STARS
     ============================================================ */
  function createEndingStars() {
    const container = document.getElementById('endingStars');
    if (!container) return;
    for (let i = 0; i < 25; i++) {
      const star = document.createElement('div');
      star.className = 'ending-star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty('--dur', `${1.5 + Math.random() * 2}s`);
      star.style.setProperty('--delay', `${Math.random() * 2}s`);
      container.appendChild(star);
    }
  }

  /* ============================================================
     SUBTLE PARALLAX
     ============================================================ */
  function setupParallax() {
    if (CONFIG.reducedMotion) return;
    const glow = document.querySelector('.hero-glow');
    const heading = document.querySelector('.hero-heading');
    if (!glow && !heading) return;

    let ticking = false;
    window.addEventListener('mousemove', (e) => {
      if (!state.celebrationStarted) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        if (glow) glow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        if (heading) heading.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        ticking = false;
      });
    });
  }

})();
