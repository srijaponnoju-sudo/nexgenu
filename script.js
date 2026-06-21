// ── MOBILE NAV ──
function toggleMobileNav() {
  const nav = document.getElementById('mainNav');
  nav.classList.toggle('open');
}
document.querySelectorAll('.main-nav a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mainNav').classList.remove('open'));
});

// ── HEADER SCROLL ──
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);

  // Active nav highlight
  const ids = ['home','engineering','govtjobs','startup','platform','about','contact'];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.top <= 80 && r.bottom >= 80) {
      document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.main-nav a[href="#${id}"]`);
      if (match) match.classList.add('active');
      break;
    }
  }
});

// ── SCROLL REVEAL ──
const css = document.createElement('style');
css.textContent = `
  .reveal { opacity:0; transform:translateY(24px); transition:opacity 0.55s ease,transform 0.55s ease; }
  .reveal.visible { opacity:1; transform:none; }
  .reveal-d1 { transition-delay:0.08s; }
  .reveal-d2 { transition-delay:0.16s; }
  .reveal-d3 { transition-delay:0.24s; }
  .reveal-d4 { transition-delay:0.32s; }
  .main-nav a.active { color:var(--indigo) !important; background:rgba(79,70,229,0.07) !important; }
`;
document.head.appendChild(css);

const revealEls = document.querySelectorAll(
  '.branch-card,.govt-card,.gf-item,.stl-step,.ss-card,.plat-card,.sc,.abm,.fcp,.vc,.clist-item,.off-item,.clist-item,.pp-step'
);
revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  const d = i % 4;
  if (d) el.classList.add(`reveal-d${d}`);
});

const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => ro.observe(el));

// ── COUNTER ANIMATION ──
function countUp(el, target, suffix) {
  const dur = 1400;
  const start = performance.now();
  const update = now => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const metricObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.metric strong, .abm strong').forEach(el => {
      const raw = el.textContent.trim();
      const match = raw.match(/^([\d,]+)(\+|%|k)?$/i);
      if (match) {
        const num = parseInt(match[1].replace(/,/g, ''));
        const suf = match[2] || '';
        countUp(el, num, suf);
      }
    });
    metricObs.unobserve(e.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-metrics, .ab-metrics').forEach(el => metricObs.observe(el));