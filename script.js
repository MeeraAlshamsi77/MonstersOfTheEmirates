/* ═══════════════════════════════════════════════════════
وحوش الإمارات / Monsters of the Emirates
JAVASCRIPT — script.js
Handles: custom cursor, scroll reveal, nav state,
CCTV clock, episode interactions
═══════════════════════════════════════════════════════ */

// ─── WAIT FOR DOM ─────────────────────────────────────
document.addEventListener(‘DOMContentLoaded’, () => {

/* ───────────────────────────────────────────────────
1. CUSTOM CURSOR
Follows mouse with a slight lag. Expands on hover.
─────────────────────────────────────────────────── */
const cursor    = document.getElementById(‘cursor’);
const cursorDot = document.getElementById(‘cursorDot’);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

// Track raw mouse position
document.addEventListener(‘mousemove’, (e) => {
mouseX = e.clientX;
mouseY = e.clientY;
// Dot snaps instantly
cursorDot.style.left = mouseX + ‘px’;
cursorDot.style.top  = mouseY + ‘px’;
});

// Outer ring follows with slight easing
function animateCursor() {
cursorX += (mouseX - cursorX) * 0.12;
cursorY += (mouseY - cursorY) * 0.12;
cursor.style.left = cursorX + ‘px’;
cursor.style.top  = cursorY + ‘px’;
requestAnimationFrame(animateCursor);
}
animateCursor();

// Expand cursor ring on interactive elements
const hoverTargets = document.querySelectorAll(‘a, button, .char-card, .visual-card, .season-card, .episode-item’);
hoverTargets.forEach(el => {
el.addEventListener(‘mouseenter’, () => document.body.classList.add(‘cursor-hover’));
el.addEventListener(‘mouseleave’, () => document.body.classList.remove(‘cursor-hover’));
});

// Hide cursor when leaving window
document.addEventListener(‘mouseleave’, () => {
cursor.style.opacity = ‘0’;
cursorDot.style.opacity = ‘0’;
});
document.addEventListener(‘mouseenter’, () => {
cursor.style.opacity = ‘1’;
cursorDot.style.opacity = ‘1’;
});

/* ───────────────────────────────────────────────────
2. NAVIGATION — add scrolled class after 80px
─────────────────────────────────────────────────── */
const nav = document.getElementById(‘nav’);

function updateNav() {
if (window.scrollY > 80) {
nav.classList.add(‘scrolled’);
} else {
nav.classList.remove(‘scrolled’);
}
}
window.addEventListener(‘scroll’, updateNav, { passive: true });
updateNav(); // run on load

/* ───────────────────────────────────────────────────
3. SCROLL REVEAL
Observes all .reveal elements and adds .visible
when they enter the viewport.
─────────────────────────────────────────────────── */
const revealElements = document.querySelectorAll(’.reveal’);

const revealObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add(‘visible’);
// Once revealed, stop observing to save performance
revealObserver.unobserve(entry.target);
}
});
}, {
threshold: 0.12,      // Trigger when 12% of element is visible
rootMargin: ‘0px 0px -40px 0px’  // Slightly before it reaches bottom
});

revealElements.forEach(el => revealObserver.observe(el));

/* ───────────────────────────────────────────────────
4. CCTV TIMESTAMP CLOCK
Updates the CCTV time display in real time.
Format: HH:MM:SS — feels like real surveillance footage.
─────────────────────────────────────────────────── */
const cctvTime = document.getElementById(‘cctv-time’);

function updateCCTVClock() {
if (!cctvTime) return;
const now = new Date();
const h = String(now.getHours()).padStart(2, ‘0’);
const m = String(now.getMinutes()).padStart(2, ‘0’);
const s = String(now.getSeconds()).padStart(2, ‘0’);
cctvTime.textContent = `${h}:${m}:${s}`;
}

updateCCTVClock();
setInterval(updateCCTVClock, 1000);

/* ───────────────────────────────────────────────────
5. EPISODE ITEM — EXPAND ON CLICK (mobile UX)
On smaller screens, episode descriptions can be
toggled for a cleaner initial view.
─────────────────────────────────────────────────── */
const episodeItems = document.querySelectorAll(’.episode-item’);

episodeItems.forEach(item => {
const content = item.querySelector(’.ep-content’);
const dot = item.querySelector(’.ep-dot’);

```
// Subtle dot pulse on hover
item.addEventListener('mouseenter', () => {
  dot.style.boxShadow = '0 0 8px rgba(184, 150, 62, 0.5)';
});
item.addEventListener('mouseleave', () => {
  dot.style.boxShadow = 'none';
});
```

});

/* ───────────────────────────────────────────────────
6. SMOOTH SCROLL for nav links
Handles the offset caused by the fixed nav bar.
─────────────────────────────────────────────────── */
const NAV_HEIGHT = 70; // px offset for fixed nav

document.querySelectorAll(‘a[href^=”#”]’).forEach(link => {
link.addEventListener(‘click’, (e) => {
const targetId = link.getAttribute(‘href’);
if (targetId === ‘#’) return;
const target = document.querySelector(targetId);
if (!target) return;

```
  e.preventDefault();
  const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
  window.scrollTo({ top, behavior: 'smooth' });
});
```

});

/* ───────────────────────────────────────────────────
7. SUBTLE PARALLAX on hero silhouette
The dark abaya shape drifts slightly on scroll
for depth without distraction.
─────────────────────────────────────────────────── */
const silhouette = document.querySelector(’.silhouette’);

function updateParallax() {
if (!silhouette) return;
const scrollY = window.scrollY;
// Drift upward at 20% of scroll speed
silhouette.style.transform = `translateX(-50%) translateY(${scrollY * -0.2}px)`;
}

window.addEventListener(‘scroll’, updateParallax, { passive: true });

/* ───────────────────────────────────────────────────
8. CHARACTER CARD — subtle scanline hover effect
Each card gets a momentary top-to-bottom light
sweep when hovered.
─────────────────────────────────────────────────── */
const charCards = document.querySelectorAll(’.char-card’);

charCards.forEach(card => {
// Create a scanline element per card
const scanEl = document.createElement(‘div’);
scanEl.style.cssText = `position: absolute; top: -100%; left: 0; right: 0; height: 40%; background: linear-gradient(to bottom, transparent, rgba(184,150,62,0.03), transparent); pointer-events: none; transition: top 0.6s ease; z-index: 1;`;
card.style.position = ‘relative’;
card.appendChild(scanEl);

```
card.addEventListener('mouseenter', () => {
  scanEl.style.top = '110%';
});
card.addEventListener('mouseleave', () => {
  // Reset instantly for next hover
  scanEl.style.transition = 'none';
  scanEl.style.top = '-100%';
  // Re-enable transition after reset
  setTimeout(() => { scanEl.style.transition = 'top 0.6s ease'; }, 10);
});
```

});

/* ───────────────────────────────────────────────────
9. STAGGER REVEAL for grids
Elements in grids get staggered delay based
on their index within the parent grid.
─────────────────────────────────────────────────── */
const grids = document.querySelectorAll(’.characters-grid, .visual-grid, .seasons-grid’);

grids.forEach(grid => {
const children = Array.from(grid.querySelectorAll(’.reveal’));
children.forEach((child, i) => {
child.style.transitionDelay = `${i * 0.08}s`;
});
});

/* ───────────────────────────────────────────────────
10. HERO CTA FLICKER
Very subtle pulse animation on the CTA button
to suggest a slow heartbeat / signal.
─────────────────────────────────────────────────── */
const heroCTA = document.querySelector(’.hero-cta’);

if (heroCTA) {
let flickerInterval = null;

```
// Start gentle flicker after 3 seconds on page
setTimeout(() => {
  flickerInterval = setInterval(() => {
    // Brief opacity dip
    heroCTA.style.opacity = '0.7';
    setTimeout(() => { heroCTA.style.opacity = '1'; }, 120);
  }, 4000);
}, 3000);

// Stop flickering while user hovers (feels less gimmicky)
heroCTA.addEventListener('mouseenter', () => clearInterval(flickerInterval));
heroCTA.addEventListener('mouseleave', () => {
  flickerInterval = setInterval(() => {
    heroCTA.style.opacity = '0.7';
    setTimeout(() => { heroCTA.style.opacity = '1'; }, 120);
  }, 4000);
});
```

}

/* ───────────────────────────────────────────────────
11. THEME TAGS — subtle interactive color shift
─────────────────────────────────────────────────── */
const tags = document.querySelectorAll(’.tag’);
tags.forEach(tag => {
tag.addEventListener(‘click’, () => {
// Brief flash to acknowledge click
tag.style.borderColor = ‘var(–gold)’;
tag.style.color = ‘var(–gold)’;
setTimeout(() => {
tag.style.borderColor = ‘’;
tag.style.color = ‘’;
}, 600);
});
});

}); // end DOMContentLoaded
