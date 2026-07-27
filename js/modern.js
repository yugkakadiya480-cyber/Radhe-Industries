/* ============================================================
   RADHE INDUSTRIES — MODERN JS
   Scroll Reveal • Counter Animation • WhatsApp • Progress Bar
   ============================================================ */

(function () {
  'use strict';

  /* ── Scroll Progress Bar ───────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── Scroll-Reveal via IntersectionObserver ─────────────── */
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right'
  );
  if (revealEls.length) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ── Animated Counter ───────────────────────────────────── */
  function animateCount(el, target, duration, suffix) {
    let start    = 0;
    const step   = target / (duration / 16);
    const ticker = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(ticker);
      }
      el.textContent = Math.floor(start) + suffix;
    }, 16);
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    let counted = false;
    const statsObs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counted) {
          counted = true;
          document.querySelectorAll('.stat-count').forEach(el => {
            const target   = parseInt(el.dataset.target, 10);
            const suffix   = el.dataset.suffix || '';
            animateCount(el, target, 1800, suffix);
          });
          statsObs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    statsObs.observe(statsSection);
  }

  /* ── Back-to-Top Link ───────────────────────────────────── */
  document.querySelectorAll('.back-to-top').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ── Duplicate Ticker for Seamless Loop ─────────────────── */
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    // Clone content once so animation loops seamlessly
    tickerTrack.innerHTML += tickerTrack.innerHTML;
  }

})();
