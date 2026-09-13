/*
 * Droplet field - mouse-reactive particles behind the homepage hero.
 * Vanilla JS, no dependencies. Renders one static frame when the user
 * prefers reduced motion; pauses when the tab is hidden.
 *
 * Mechanism:
 * 1. Particles hold position + velocity + size + hue + alpha.
 * 2. Each frame applies a cheap sine flow field (ambient drift) and
 *    mouse repulsion within REPEL_R, plus a sweep along cursor velocity.
 * 3. Particles draw as round-capped lines along their velocity, so fast
 *    ones stretch into droplet streaks. Coordinates are canvas-local.
 */
(() => {
  "use strict";

  const canvas = document.querySelector(".hero-field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0;
  let H = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(W * dpr));
    canvas.height = Math.max(1, Math.round(H * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    syncCount();
  }

  const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
  let lastMove = 0;

  addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const now = performance.now();
    const dt = Math.max(now - lastMove, 1);
    if (lastMove) {
      mouse.vx = mouse.vx * 0.7 + ((x - mouse.x) / dt) * 16 * 0.3;
      mouse.vy = mouse.vy * 0.7 + ((y - mouse.y) / dt) * 16 * 0.3;
    }
    mouse.x = x;
    mouse.y = y;
    lastMove = now;
  });
  addEventListener("pointerleave", park);
  addEventListener("scroll", () => {
    // park the pointer when the hero scrolls out of view
    const r = canvas.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) park();
  }, { passive: true });

  function park() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  const parts = [];
  function targetCount() {
    return Math.max(90, Math.min(360, Math.round((W * H) / 5200)));
  }
  function spawn(p) {
    p = p || {};
    p.x = Math.random() * W;
    p.y = Math.random() * H;
    p.vx = (Math.random() - 0.5) * 0.4;
    p.vy = (Math.random() - 0.5) * 0.4;
    p.size = 0.9 + Math.random() * 1.4;
    p.hue = 222 + Math.random() * 16;
    p.light = 55 + Math.random() * 18;
    p.alpha = 0.3 + Math.random() * 0.6;
    return p;
  }
  function syncCount() {
    const n = targetCount();
    while (parts.length < n) parts.push(spawn());
    parts.length = n;
  }

  function flow(x, y, t) {
    const a = Math.sin(x * 0.0016 + t * 0.00021) + Math.cos(y * 0.0013 - t * 0.00017);
    const b = Math.sin((x + y) * 0.0009 + t * 0.00013);
    return { x: Math.cos(a * 1.7 + b), y: Math.sin(a * 1.3 - b) };
  }

  const REPEL_R = 190;
  const REPEL_R2 = REPEL_R * REPEL_R;
  const MAX_SPEED = 3.4;

  function step(t, dt) {
    for (const p of parts) {
      const f = flow(p.x, p.y, t);
      p.vx += f.x * 0.014 * dt;
      p.vy += f.y * 0.014 * dt;

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < REPEL_R2 && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const fall = 1 - d / REPEL_R;
        p.vx += (dx / d) * fall * 0.55 * dt + mouse.vx * fall * 0.05 * dt;
        p.vy += (dy / d) * fall * 0.55 * dt + mouse.vy * fall * 0.05 * dt;
      }

      p.vx *= 0.955;
      p.vy *= 0.955;
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > MAX_SPEED) {
        p.vx = (p.vx / sp) * MAX_SPEED;
        p.vy = (p.vy / sp) * MAX_SPEED;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.x < -24) p.x = W + 24;
      else if (p.x > W + 24) p.x = -24;
      if (p.y < -24) p.y = H + 24;
      else if (p.y > H + 24) p.y = -24;
    }
    mouse.vx *= 0.9;
    mouse.vy *= 0.9;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round";
    for (const p of parts) {
      const sp = Math.hypot(p.vx, p.vy);
      const len = 1.5 + sp * 7;
      const nx = sp > 0.001 ? p.vx / sp : 0;
      const ny = sp > 0.001 ? p.vy / sp : 1;
      ctx.strokeStyle = `hsla(${p.hue}, 88%, ${p.light}%, ${p.alpha})`;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - nx * len, p.y - ny * len);
      ctx.stroke();
    }
  }

  addEventListener("resize", resize);
  resize();

  if (reduced) {
    for (const p of parts) {
      p.vx = (Math.random() - 0.5) * 0.8;
      p.vy = (Math.random() - 0.5) * 0.8;
    }
    draw();
    return;
  }

  let last = performance.now();
  let running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) {
      last = performance.now();
      requestAnimationFrame(loop);
    }
  });

  function loop(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 16.667, 3);
    last = now;
    step(now, dt);
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
