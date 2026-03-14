/**
 * DotGrid - Vanilla JS implementation
 * Matches @react-bits/DotGrid parameters exactly:
 *   dotSize=6, gap=14, baseColor="#800000", activeColor="#ff0000"
 *   proximity=120, speedTrigger=100, shockRadius=250, shockStrength=5
 *   maxSpeed=5000, resistance=750, returnDuration=1.5
 */
(function () {
  // Config matching the react-bits props
  const CONFIG = {
    dotSize: 6,
    gap: 14,
    baseColor: '#800000',
    activeColor: '#ff0000',
    proximity: 120,
    speedTrigger: 100,
    shockRadius: 250,
    shockStrength: 5,
    maxSpeed: 5000,
    resistance: 750,
    returnDuration: 1.5,
  };

  // Create canvas and attach to hero
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Ensure hero is positioned relatively to contain absolute canvas
  const heroStyle = window.getComputedStyle(hero);
  if (heroStyle.position === 'static') {
    hero.style.position = 'relative';
  }

  const canvas = document.createElement('canvas');
  canvas.id = 'dotgrid-canvas';
  canvas.style.cssText = `
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 2;
    opacity: 0.6;
  `;
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Mouse state
  let mouseX = -9999, mouseY = -9999;
  let lastMouseX = -9999, lastMouseY = -9999;
  let mouseSpeed = 0;

  // Dot grid state
  let dots = [];

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    buildGrid();
  }

  function buildGrid() {
    dots = [];
    const cols = Math.ceil(canvas.width / (CONFIG.dotSize + CONFIG.gap));
    const rows = Math.ceil(canvas.height / (CONFIG.dotSize + CONFIG.gap));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * (CONFIG.dotSize + CONFIG.gap) + CONFIG.dotSize / 2;
        const y = r * (CONFIG.dotSize + CONFIG.gap) + CONFIG.dotSize / 2;
        dots.push({
          ox: x, oy: y,    // origin
          x, y,            // current
          vx: 0, vy: 0,    // velocity
          active: 0,       // 0–1 color interpolation
        });
      }
    }
  }

  // Parse a hex color to [r,g,b]
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  const BASE = hexToRgb(CONFIG.baseColor);
  const ACTIVE = hexToRgb(CONFIG.activeColor);

  function lerpColor(t) {
    const r = Math.round(BASE[0] + (ACTIVE[0] - BASE[0]) * t);
    const g = Math.round(BASE[1] + (ACTIVE[1] - BASE[1]) * t);
    const b = Math.round(BASE[2] + (ACTIVE[2] - BASE[2]) * t);
    return `rgb(${r},${g},${b})`;
  }

  // Shock event: send dots flying from origin
  function triggerShock(cx, cy) {
    dots.forEach(d => {
      const dx = d.ox - cx;
      const dy = d.oy - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.shockRadius && dist > 0) {
        const force = (1 - dist / CONFIG.shockRadius) * CONFIG.shockStrength;
        const speed = Math.min(force * 1000, CONFIG.maxSpeed);
        d.vx += (dx / dist) * speed;
        d.vy += (dy / dist) * speed;
      }
    });
  }

  let lastTime = 0;
  function animate(ts) {
    const dt = Math.min((ts - lastTime) / 1000, 0.05); // seconds, capped
    lastTime = ts;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(d => {
      // Apply resistance (damping)
      const damp = Math.pow(0.001, dt * CONFIG.resistance / 1000);
      d.vx *= damp;
      d.vy *= damp;

      // Spring return to origin
      const returnK = dt / CONFIG.returnDuration;
      d.x += (d.ox - d.x) * returnK + d.vx * dt;
      d.y += (d.oy - d.y) * returnK + d.vy * dt;

      // Proximity-based activation
      const mdx = d.x - mouseX;
      const mdy = d.y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      let t = 0;
      if (mdist < CONFIG.proximity) {
        t = 1 - mdist / CONFIG.proximity;
        // Speed boost activation
        if (mouseSpeed > CONFIG.speedTrigger) {
          t = Math.min(t + mouseSpeed / CONFIG.speedTrigger * 0.2, 1);
        }
      }
      // Smooth fade
      d.active += (t - d.active) * Math.min(dt * 8, 1);

      // Draw dot
      ctx.beginPath();
      ctx.arc(d.x, d.y, CONFIG.dotSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = lerpColor(Math.max(0, Math.min(1, d.active)));
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  // Track mouse position relative to hero
  let shockCooldown = 0;
  document.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    const ny = e.clientY - rect.top;

    const dx = nx - lastMouseX;
    const dy = ny - lastMouseY;
    mouseSpeed = Math.sqrt(dx * dx + dy * dy) * 60; // pixels/sec approx

    lastMouseX = mouseX;
    lastMouseY = mouseY;
    mouseX = nx;
    mouseY = ny;

    // Trigger shock on fast swipe
    if (mouseSpeed > CONFIG.speedTrigger * 3 && Date.now() > shockCooldown) {
      triggerShock(mouseX, mouseY);
      shockCooldown = Date.now() + 200;
    }
  });

  document.addEventListener('click', (e) => {
    const rect = hero.getBoundingClientRect();
    triggerShock(e.clientX - rect.left, e.clientY - rect.top);
  });

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(animate);
})();
