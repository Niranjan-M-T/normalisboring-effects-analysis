/**
 * LA KOVA — Dripping Architectural Typography Engine
 * Exact recreation of the footer letter-stretching & stem-morphing effect
 */

gsap.registerPlugin(ScrollTrigger);

let lenis;
let dripTimeline;

// 1. Lenis Smooth Scroll Setup
function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// 2. Custom Magnetic Cursor
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const cursorText = cursor?.querySelector('.cursor-text');
  if (!cursor || window.innerWidth < 900) return;

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const pos = { x: mouse.x, y: mouse.y };
  const xSet = gsap.quickSetter(cursor, 'x', 'px');
  const ySet = gsap.quickSetter(cursor, 'y', 'px');

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  gsap.ticker.add(() => {
    pos.x += (mouse.x - pos.x) * 0.2;
    pos.y += (mouse.y - pos.y) * 0.2;
    xSet(pos.x);
    ySet(pos.y);
  });

  document.querySelectorAll('.expand-target, .pill-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorText.textContent = el.getAttribute('data-text') || 'View';
      cursorText.style.opacity = '1';
      gsap.to(cursor, { width: 75, height: 75, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      cursorText.style.opacity = '0';
      gsap.to(cursor, { width: 14, height: 14, duration: 0.25 });
    });
  });
}

// 3. Intro Line Reveal
function initIntro() {
  gsap.to('.reveal-line', {
    y: '0%',
    duration: 1.1,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.2
  });
}

// 4. THE MASTER DRIPPING & STRETCHING LETTER ENGINE
function initDripLetterEngine() {
  const dripSection = document.getElementById('drip-footer-section');
  
  // Mathematical calibration:
  // Stems with height 180px scaled by 4.2x expand downward by: 180 * (4.2 - 1) = 576px
  const dropDelta = 576;
  const standardStemScale = 4.2;
  const oStemScale = 5.8; // (120px * 4.8 = 576px)

  // Master Drip Scrubbed Timeline
  dripTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: dripSection,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1, // Fluid scroll synchronization
      invalidateOnRefresh: true
    }
  });

  // A. Stretch All Standard 180px Vertical Stems Downward
  dripTimeline.to('.stem-l, .stem-a1-left, .stem-a1-right, .stem-k, .stem-k-leg, .stem-v-left, .stem-v-right, .stem-a2-left, .stem-a2-right', {
    scaleY: standardStemScale,
    transformOrigin: 'top center',
    ease: 'none',
    duration: 1
  }, 0);

  // B. Stretch the "O" Arch Columns (120px base) to match 576px drop
  dripTimeline.to('.stem-o-left, .stem-o-right', {
    scaleY: oStemScale,
    transformOrigin: 'top center',
    ease: 'none',
    duration: 1
  }, 0);

  // C. Drop Bottom Feet, Curves & Serifs in Perfect Mathematical Lockstep
  dripTimeline.to('.drop-l, .drop-a1, .drop-k-stem, .drop-k-leg, .drop-o, .drop-v, .drop-a2', {
    y: dropDelta,
    ease: 'none',
    duration: 1
  }, 0);

  // D. Slide Crossbars (at half distance for optical balance)
  dripTimeline.to('.drop-a1-bar, .drop-a2-bar', {
    y: dropDelta * 0.45,
    ease: 'none',
    duration: 1
  }, 0);

  // E. Reveal Featured Project Card ("LA SOLANA") as letters open up the frame (matching Screenshot 5)
  dripTimeline.fromTo('#projectCard', 
    { opacity: 0, y: 50, scale: 0.94 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.55 // Triggers halfway through the stretch
  );
}

// 5. Interactive Controls
function initControls() {
  const dripReplay = document.getElementById('dripReplay');
  const themeToggle = document.getElementById('themeToggle');

  // Trigger manual smooth drip animation
  dripReplay.addEventListener('click', () => {
    document.getElementById('drip-footer-section').scrollIntoView({ behavior: 'smooth' });
    
    gsap.fromTo('.stem-part', 
      { scaleY: 1 }, 
      { scaleY: 4.2, duration: 1.8, ease: 'power2.inOut', yoyo: true, repeat: 1 }
    );
    gsap.fromTo('.drop-part', 
      { y: 0 }, 
      { y: 576, duration: 1.8, ease: 'power2.inOut', yoyo: true, repeat: 1 }
    );
    gsap.fromTo('#projectCard',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.6, yoyo: true, repeat: 1 }
    );
  });

  // Theme Toggle (Light vs Dark)
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    if (isDark) {
      document.body.style.backgroundColor = '#0D0D0D';
      document.querySelectorAll('.drip-fill').forEach(p => p.setAttribute('fill', '#ECE4DA'));
      document.querySelectorAll('.site-header, .fixed-watermark').forEach(el => el.style.color = '#ECE4DA');
      document.querySelector('.footer-drip-section').style.backgroundColor = '#0D0D0D';
    } else {
      document.body.style.backgroundColor = '#ECE4DA';
      document.querySelectorAll('.drip-fill').forEach(p => p.setAttribute('fill', '#0D0D0D'));
      document.querySelector('.footer-drip-section').style.backgroundColor = '#ECE4DA';
    }
  });
}

// Master Initialization
window.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initCustomCursor();
  initIntro();
  initDripLetterEngine();
  initControls();
});
