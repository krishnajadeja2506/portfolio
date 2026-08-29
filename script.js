/* ============================================================
   KRISHNA JADEJA — script.js
   ============================================================ */
'use strict';

const wait = ms => new Promise(r => setTimeout(r, ms));

/* ═══════════════════════════════════════════════════════
   1. BUBBLE SYSTEM  (ambient blobs + rising bubbles)
   ═══════════════════════════════════════════════════════ */
(function initBubbles() {
  const wrap = document.querySelector('.bg-bubbles');
  if (!wrap) return;

  const teals  = ['rgba(45,157,143,.40)','rgba(95,191,179,.36)','rgba(29,157,143,.30)','rgba(140,220,210,.34)'];
  const peaches= ['rgba(224,122,95,.36)','rgba(242,166,138,.38)','rgba(210,100,75,.30)','rgba(255,180,150,.32)'];
  const pick   = arr => arr[Math.floor(Math.random() * arr.length)];

  /* ── Ambient blobs: 8 large blobs spread across full page height ── */
  const blobs = [
    {color:'rgba(95,191,179,.30)',  w:580,h:520,top:'-5%', left:'55%', anim:'blob-a',dur:22,del:0},
    {color:'rgba(224,122,95,.28)',  w:420,h:420,top:'5%',  left:'-4%', anim:'blob-b',dur:19,del:3},
    {color:'rgba(45,157,143,.26)',  w:500,h:460,top:'32%', left:'62%', anim:'blob-c',dur:25,del:5},
    {color:'rgba(242,166,138,.30)', w:380,h:400,top:'40%', left:'2%',  anim:'blob-a',dur:20,del:8},
    {color:'rgba(140,220,210,.24)', w:340,h:340,top:'55%', left:'38%', anim:'blob-b',dur:28,del:2},
    {color:'rgba(224,122,95,.26)',  w:460,h:420,top:'68%', left:'-3%', anim:'blob-c',dur:23,del:6},
    {color:'rgba(45,157,143,.28)',  w:520,h:480,top:'75%', left:'55%', anim:'blob-a',dur:26,del:4},
    {color:'rgba(242,166,138,.24)', w:300,h:310,top:'88%', left:'28%', anim:'blob-b',dur:21,del:9},
  ];

  blobs.forEach(b => {
    const el = document.createElement('div');
    el.className = 'bubble';
    el.style.cssText = `
      --bubble-color:${b.color};
      width:${b.w}px;height:${b.h}px;
      top:${b.top};left:${b.left};
      filter:blur(${Math.round(Math.max(b.w,b.h)*.13)}px);
      animation:${b.anim} ${b.dur}s ease-in-out ${b.del}s infinite;
    `;
    wrap.appendChild(el);
  });

  /* ── Rising bubbles: spawn at bottom, float upward, respawn ── */
  const POOL = 24, MIN = 18, MAX = 112;
  function spawn() {
    const isTeal = Math.random() > .42;
    const color  = isTeal ? pick(teals) : pick(peaches);
    const size   = MIN + Math.random() * (MAX - MIN);
    const left   = 1 + Math.random() * 98;
    const dur    = 9  + Math.random() * 12;
    const delay  = Math.random() * 5;
    const blur   = size < 40 ? 1 : Math.round(size * .07);
    const el     = document.createElement('div');
    el.className = 'bubble';
    el.style.cssText = `
      --bubble-color:${color};
      width:${size}px;height:${size}px;
      bottom:-${size+30}px;left:${left}%;
      filter:blur(${blur}px);
      animation:bubble-rise ${dur}s ease-in ${delay}s 1 forwards;
    `;
    wrap.appendChild(el);
    setTimeout(() => { el.remove(); spawn(); }, (dur + delay) * 1000 + 300);
  }
  for (let i = 0; i < POOL; i++) setTimeout(spawn, i * 260);
})();


/* ═══════════════════════════════════════════════════════
   2. HERO ANIMATION  —  KJ. → Krishna Jadeja (Runs immediately)
   ═══════════════════════════════════════════════════════ */
(function initHero() {
  const typeEl     = document.getElementById('hero-typing');
  const afterItems = document.querySelectorAll('.hero-after-anim');
  if (!typeEl) return;

  function revealHeroContent() {
    afterItems.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }

  async function runHeroTyping() {
    const ERASE_MS = 50, TYPE_MS = 72, PAUSE_1 = 650, PAUSE_2 = 600;
    const final = 'Krishna Jadeja';

    /* ── Show initial text "KJ." ── */
    typeEl.textContent = 'KJ.';
    await wait(PAUSE_1);

    /* ── Attach blinking cursor ── */
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    typeEl.parentNode.insertBefore(cursor, typeEl.nextSibling);

    /* ── Erase "KJ." ── */
    while (typeEl.textContent.length > 0) {
      typeEl.textContent = typeEl.textContent.slice(0, -1);
      await wait(ERASE_MS);
    }
    await wait(180);

    /* ── Type "Krishna Jadeja" ── */
    for (const ch of final) {
      typeEl.textContent += ch;
      await wait(TYPE_MS);
    }
    await wait(PAUSE_2);

    /* ── Remove cursor ── */
    cursor.classList.add('hidden');
    await wait(200);
    cursor.remove();

    /* ── Apply full-name gradient ── */
    const hero = document.getElementById('hero-heading');
    hero.innerHTML = '<span class="full-name-gradient">Krishna Jadeja</span>';

    /* ── Reveal hero content ── */
    revealHeroContent();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', runHeroTyping)
    : runHeroTyping();
})();


/* ═══════════════════════════════════════════════════════
   3. SCROLL REVEAL (Normal animations for other sections)
   ═══════════════════════════════════════════════════════ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-card');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  });

  elements.forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════════════════════
   4. NAVIGATION  —  scroll spy + hamburger
   ═══════════════════════════════════════════════════════ */
(function initNav() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('nav-hamburger');
  const navLinksEl = document.getElementById('nav-links');
  const allLinks   = document.querySelectorAll('.nav-link');
  const sections   = document.querySelectorAll('section[id]');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  allLinks.forEach(l => l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }));

  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        allLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, {
    rootMargin: `-${Math.round(window.innerHeight*.38)}px 0px -${Math.round(window.innerHeight*.48)}px 0px`,
    threshold: 0
  });

  sections.forEach(s => spy.observe(s));

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
})();


/* ═══════════════════════════════════════════════════════
   5. 3D MOUSE-TRACKING TILT  —  Cards
   ═══════════════════════════════════════════════════════ */
(function initTilt() {
  document.querySelectorAll('.cool-card').forEach(card => {
    const MAX = 10;
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      
      // Calculate rotation. Note: inverted dy for natural feel.
      card.style.transform  = `perspective(1000px) rotateX(${-dy*MAX}deg) rotateY(${dx*MAX}deg) translateY(-8px) scale(1.02)`;
      card.style.transition = 'transform .08s linear, box-shadow .08s linear';
      card.style.boxShadow  = `${-dx*MAX*1.2}px ${dy*MAX*1.2}px 40px rgba(30,95,90,.18), 0 0 50px rgba(45,157,143,.15)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .45s cubic-bezier(.34,1.56,.64,1), box-shadow .45s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   6. DISABLED LINK GUARD
   ═══════════════════════════════════════════════════════ */
document.querySelectorAll('.project-link.disabled').forEach(link => {
  link.addEventListener('click', e => e.preventDefault());
});
