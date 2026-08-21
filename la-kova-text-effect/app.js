/**
 * LA KOVA — Dripping Typography Engine
 * Left Project Card + Unified Vector Canvas + Isolated "O" Full Archway Drip
 */

gsap.registerPlugin(ScrollTrigger);

let lenis;
let dripTimeline;

// 1. Lenis Smooth Scroll with Safe Fallback
function initSmoothScroll() {
  try {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  } catch (err) {
    console.warn('Lenis fallback active: using native smooth scroll', err);
  }
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

  document.querySelectorAll('.expand-target, .pill-btn, .project-image-wrap').forEach((el) => {
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

// 4. THE MASTER DRIP ENGINE (ISOLATED TO "O" & SUBTLE "V")
function initDripLetterEngine() {
  const dripSection = document.getElementById('drip-footer-section');
  
  // Mathematical calibration:
  // "O" Column height = 155px. At scaleY = 5.2, drop delta = 155 * (5.2 - 1) = 651px.
  const oDropDelta = 651;
  const oStemScale = 5.2;

  // "V" Stem height = 260px. At scaleY = 1.5, drop delta = 260 * 0.5 = 130px.
  const vDropDelta = 130;
  const vStemScale = 1.5;

  // Master Drip Scrub Timeline
  dripTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: dripSection,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.1, // Smooth inertia scrub
      invalidateOnRefresh: true
    }
  });

  // A. Stretch the "O" Vertical Arch Columns (Full Drip)
  dripTimeline.to('.o-stem-left, .o-stem-right', {
    scaleY: oStemScale,
    transformOrigin: 'top center',
    ease: 'none',
    duration: 1
  }, 0);

  // B. Drop the "O" Bottom Arch Cap in Lockstep
  dripTimeline.to('#oDropGroup', {
    y: oDropDelta,
    ease: 'none',
    duration: 1
  }, 0);

  // C. Stretch the "V" Legs (Subtle Drip)
  dripTimeline.to('.v-stem-left, .v-stem-right', {
    scaleY: vStemScale,
    transformOrigin: 'top center',
    ease: 'none',
    duration: 1
  }, 0);

  // D. Drop the "V" Bottom Vertex (Subtle Drip)
  dripTimeline.to('#vDropGroup', {
    y: vDropDelta,
    ease: 'none',
    duration: 1
  }, 0);

  // E. Reveal the Left-Aligned Featured Project Card ("LA SOLANA")
  dripTimeline.fromTo('#projectCard', 
    { opacity: 0, y: 45, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.45,
      ease: 'power2.out'
    }, 0.35 // Fades in smoothly as O begins to drip
  );
}

// 5. Interactive Controls
function initControls() {
  const dripReplay = document.getElementById('dripReplay');
  const themeToggle = document.getElementById('themeToggle');

  // Trigger manual smooth drip animation
  dripReplay.addEventListener('click', () => {
    document.getElementById('drip-footer-section').scrollIntoView({ behavior: 'smooth' });
    
    // Play full bounce drip
    gsap.fromTo('.o-stem-left, .o-stem-right', 
      { scaleY: 1 }, 
      { scaleY: 5.2, duration: 1.8, ease: 'power2.inOut', yoyo: true, repeat: 1 }
    );
    gsap.fromTo('#oDropGroup', 
      { y: 0 }, 
      { y: 651, duration: 1.8, ease: 'power2.inOut', yoyo: true, repeat: 1 }
    );
    gsap.fromTo('.v-stem-left, .v-stem-right', 
      { scaleY: 1 }, 
      { scaleY: 1.5, duration: 1.8, ease: 'power2.inOut', yoyo: true, repeat: 1 }
    );
    gsap.fromTo('#vDropGroup', 
      { y: 0 }, 
      { y: 130, duration: 1.8, ease: 'power2.inOut', yoyo: true, repeat: 1 }
    );
    gsap.fromTo('#projectCard',
      { opacity: 0, y: 45 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.4, yoyo: true, repeat: 1 }
    );
  });

  // Theme Toggle (Light vs Dark)
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    if (isDark) {
      document.body.style.backgroundColor = '#0D0D0D';
      document.querySelectorAll('.k-fill').forEach(p => p.setAttribute('fill', '#ECE4DA'));
      document.querySelectorAll('.site-header, .fixed-watermark').forEach(el => el.style.color = '#ECE4DA');
      document.querySelector('.footer-drip-section').style.backgroundColor = '#0D0D0D';
    } else {
      document.body.style.backgroundColor = '#ECE4DA';
      document.querySelectorAll('.k-fill').forEach(p => p.setAttribute('fill', '#0D0D0D'));
      document.querySelectorAll('.site-header, .fixed-watermark').forEach(el => el.style.color = '#0D0D0D');
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
