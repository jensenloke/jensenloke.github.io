/*
 * Site-wide droplet field - mouse-reactive particles behind every page.
 * Vanilla JS, no dependencies. Targets <canvas id="site-field">, which is
 * CSS-fixed to the viewport at z-index -1; content columns carry a subtle
 * translucent scrim so prose stays legible while the gutters stay alive.
 *
 * Mechanism:
 * 1. Particles hold position + velocity + size + hue + alpha.
 * 2. Each frame applies a cheap sine flow field (ambient drift), a slight
 *    upward "antigravity" bias, and mouse repulsion within REPEL_R plus a
 *    sweep along cursor velocity.
 * 3. Particles draw as round-capped lines along their velocity, so fast
 *    ones stretch into droplet streaks.
 * Respects prefers-reduced-motion (one static frame, no loop); pauses when
 * the tab is hidden.
 */
(() => {
  "use strict";

  const canvas = document.getElementById("site-field");
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
    const now = performance.now();
    const dt = Math.max(now - lastMove, 1);
    if (lastMove) {
      mouse.vx = mouse.vx * 0.7 + ((e.clientX - mouse.x) / dt) * 16 * 0.3;
      mouse.vy = mouse.vy * 0.7 + ((e.clientY - mouse.y) / dt) * 16 * 0.3;
    }
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    lastMove = now;
  });
  addEventListener("pointerleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  const parts = [];
  function targetCount() {
    return Math.max(420, Math.min(1500, Math.round((W * H) / 1200)));
  }
  function spawn(p) {
    p = p || {};
    p.vx = (Math.random() - 0.5) * 0.4;
    p.vy = (Math.random() - 0.5) * 0.4;
    p.size = 0.9 + Math.random() * 1.4;
    p.hue = 222 + Math.random() * 16;
    p.light = 55 + Math.random() * 18;
    p.alpha = 0.35 + Math.random() * 0.55;
    p.orbit = 45 + Math.pow(Math.random(), 0.7) * 135; // own shell radius
    p.sw = Math.random() < 0.35 ? -1 : 1; // mostly one way, some counter-spin
    return p;
  }
  function syncCount() {
    const n = targetCount();
    while (parts.length < n) parts.push(spawn());
    parts.length = n;
    layoutHomes();
  }
  // Each droplet gets a "home" on a jittered grid covering the viewport.
  // A weak spring to home is what lets the field coalesce: the void your
  // cursor carves refills the moment the force leaves.
  function layoutHomes() {
    const n = parts.length;
    if (!n) return;
    const cols = Math.max(1, Math.round(Math.sqrt((n * W) / H)));
    const rows = Math.max(1, Math.ceil(n / cols));
    for (let i = 0; i < n; i++) {
      const p = parts[i];
      const c = i % cols;
      const r = (i / cols) | 0;
      p.hx = ((c + 0.5) / cols) * W + (Math.random() - 0.5) * 40;
      p.hy = ((r + 0.5) / rows) * H + (Math.random() - 0.5) * 40;
      if (p.x == null) {
        p.x = p.hx + (Math.random() - 0.5) * 60;
        p.y = p.hy + (Math.random() - 0.5) * 60;
      }
    }
  }

  function flow(x, y, t) {
    const a = Math.sin(x * 0.0016 + t * 0.00021) + Math.cos(y * 0.0013 - t * 0.00017);
    const b = Math.sin((x + y) * 0.0009 + t * 0.00013);
    return { x: Math.cos(a * 1.7 + b), y: Math.sin(a * 1.3 - b) };
  }

  // Capture well (Google-style): the cursor collects droplets into a
  // swirling cloud. Each droplet owns an orbit radius and spin direction,
  // so the cluster is a fuzzy swarm filling the disk - not a hard ring.
  // Home spring is suppressed while captured; the field reforms on exit.
  const CAPTURE_R = 260;
  const CAPTURE_R2 = CAPTURE_R * CAPTURE_R;
  const RING_K = 0.012; // spring toward the droplet's own orbit radius
  const SWIRL = 0.11; // tangential acceleration -> orbiting cloud
  const MAX_SPEED = 3.8;
  const LIFT = 0.006; // "antigravity": a slow, constant upward bias
  const HOME_K = 0.0012; // spring strength pulling droplets back to home

  function step(t, dt) {
    for (const p of parts) {
      const f = flow(p.x, p.y, t);
      p.vx += f.x * 0.018 * dt;
      p.vy += f.y * 0.018 * dt - LIFT * dt;

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      let cap = 0;
      if (d2 < CAPTURE_R2) {
        if (d2 > 0.01) {
          const d = Math.sqrt(d2);
          const ux = dx / d;
          const uy = dy / d;
          cap = 1 - d / CAPTURE_R;
          // pull toward this droplet's own orbit -> filled, fuzzy disk
          const ring = (d - p.orbit) * RING_K;
          p.vx -= ux * ring * dt;
          p.vy -= uy * ring * dt;
          // mixed swirl directions + gentle carry with cursor movement
          p.vx += (-uy * SWIRL * p.sw + mouse.vx * 0.03) * cap * dt;
          p.vy += (ux * SWIRL * p.sw + mouse.vy * 0.03) * cap * dt;
        }
        p.cap = cap;
      } else {
        p.cap = 0;
      }

      // home spring, relaxed while the cursor holds the particle
      const hk = HOME_K * (1 - cap * 0.92);
      p.vx += (p.hx - p.x) * hk * dt;
      p.vy += (p.hy - p.y) * hk * dt;

      // extra damping inside the well so droplets linger on the ring
      const damp = 0.955 - p.cap * 0.05;
      p.vx *= damp;
      p.vy *= damp;
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > MAX_SPEED) {
        p.vx = (p.vx / sp) * MAX_SPEED;
        p.vy = (p.vy / sp) * MAX_SPEED;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;

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
      const c = p.cap || 0;
      ctx.strokeStyle = `hsla(${p.hue}, 88%, ${p.light + c * 12}%, ${Math.min(1, p.alpha + c * 0.3)})`;
      ctx.lineWidth = p.size * (1 + c * 0.6);
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
