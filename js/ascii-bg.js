/**
 * Lbby ASCII Background — Canvas 2D
 * Phase 2 hero background with fBm noise density, layered characters,
 * drift animation, sine-wave flicker, mouse parallax, and theme support.
 *
 * Usage: <canvas id="ascii-bg"></canvas>
 * Events: listen for 'lbby:themechange' on document to swap color palette.
 */
(function () {
  'use strict';

  /* ── Word pools ────────────────────────────────────────────────── */

  const WORDS = [
    'LBBY','R STUDIO','GAME SERVER','HOSTING','MINECRAFT','TERRARIA',
    'JAVA','SERVER','WORLD','PLAY','HOST','TUNNEL','PLAYIT','MODS',
    'PLUGINS','MODPACKS','BACKUP','RESTORE','PAPER','FABRIC','FORGE',
    'PURPUR','FOLIA','NEOFORGE','BUKKIT','SPIGOT','SPONGE','VANILLA',
    'PLAYER','ADMIN','TPS','RAM','CPU','JVM','CHUNKS','LAN',
    'CLOUDFLARE','TOKEN','DASHBOARD','CONSOLE','MULTIGAME','ONLINE','NETWORK'
  ];

  const FRAGMENTS = [
    'server_01','world_alpha','game_node','minecraft.ready','terraria.soon',
    'tunnel_open','playit.gg','port:25565','jvm.flags','tps:20.0',
    'ram:4096','players:08','paper/build','fabric/loader','forge/modpack',
    'backup.zip','restore_point','chunk.queue','remote.token','lan.node',
    'cloudflare.quick.tunnel','install.start.share','no_port_forwarding',
    'multi_game_host','01/LBBY','02/GAME','VN/HOST','BUILD.PLAY'
  ];

  const DOTS = ['.','·','•','●','○','–','—','-'];

  /* ── fBm noise primitives ──────────────────────────────────────── */

  // Simple integer hash → [0,1)
  function hash(x, y) {
    let h = (x * 374761393 + y * 668265263 + 1013904223) | 0;
    h = (h ^ (h >> 13)) * 1274126177;
    h = h ^ (h >> 16);
    return (h >>> 0) / 4294967296;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  // Value noise 2D
  function noise(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = smoothstep(x - ix);
    const fy = smoothstep(y - iy);
    const a = hash(ix, iy);
    const b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1);
    const d = hash(ix + 1, iy + 1);
    return lerp(lerp(a, b, fx), lerp(c, d, fx), fy);
  }

  // Fractal Brownian Motion — 4 octaves
  function fbm(x, y) {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    for (let i = 0; i < 4; i++) {
      value += amplitude * noise(x * frequency, y * frequency);
      amplitude *= 0.5;
      frequency *= 2;
    }
    return value;
  }

  /* ── Color palettes ───────────────────────────────────────────── */

  function getColors() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    if (theme === 'light') {
      return {
        dim:    'rgba(40, 40, 60, ALPHA)',
        mid:    'rgba(60, 50, 120, ALPHA)',
        bright: 'rgba(90, 70, 180, ALPHA)',
      };
    }
    return {
      dim:    'rgba(140, 140, 180, ALPHA)',
      mid:    'rgba(180, 170, 255, ALPHA)',
      bright: 'rgba(210, 200, 255, ALPHA)',
    };
  }

  /* ── Canvas setup ──────────────────────────────────────────────── */

  const canvas = document.getElementById('ascii-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0;
  let H = 0;
  let chars = [];
  let colors = getColors();
  let mouseX = 0.5;
  let mouseY = 0.5;
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;
  let animId = null;
  let paused = false;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  /* ── Character object ──────────────────────────────────────────── */

  function makeChar(x, y, layer, text) {
    // Layer determines alpha range and drift speed
    const alphaRanges = {
      dim:    { min: 0.04, max: 0.12 },
      mid:    { min: 0.10, max: 0.32 },
      bright: { min: 0.30, max: 0.78 },
    };
    const ar = alphaRanges[layer];

    return {
      x: x,
      y: y,
      text: text,
      layer: layer,
      alpha: ar.min + Math.random() * (ar.max - ar.min),
      baseAlpha: ar.min + Math.random() * (ar.max - ar.min),
      vx: (Math.random() - 0.5) * (layer === 'bright' ? 0.18 : layer === 'mid' ? 0.1 : 0.04),
      vy: (Math.random() - 0.5) * (layer === 'bright' ? 0.18 : layer === 'mid' ? 0.1 : 0.04),
      phase: Math.random() * Math.PI * 2,
      flickerSpeed: 0.3 + Math.random() * 0.8,
      fontSize: layer === 'bright' ? (isMobile ? 10 : 13) : layer === 'mid' ? (isMobile ? 9 : 11) : (isMobile ? 8 : 10),
    };
  }

  /* ── pickChar by density ───────────────────────────────────────── */

  function pickChar(density) {
    if (density > 0.7) {
      return FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
    }
    if (density > 0.35) {
      return WORDS[Math.floor(Math.random() * WORDS.length)];
    }
    return DOTS[Math.floor(Math.random() * DOTS.length)];
  }

  /* ── Build character grid ──────────────────────────────────────── */

  function buildCharacters() {
    chars = [];
    const cellW = isMobile ? 60 : 80;
    const cellH = isMobile ? 44 : 56;
    const cols = Math.ceil(W / cellW);
    const rows = Math.ceil(H / cellH);
    const noiseScale = isMobile ? 0.012 : 0.008;
    const maxDensity = isMobile ? 0.75 : 1.0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const nx = col * noiseScale;
        const ny = row * noiseScale;
        const density = Math.min(fbm(nx + 1.7, ny + 3.2) * 1.2, maxDensity);

        // Probability of placing a character scales with density
        if (Math.random() > density * 0.6) continue;

        const cx = col * cellW + Math.random() * cellW;
        const cy = row * cellH + Math.random() * cellH;
        const text = pickChar(density);

        // Assign layer based on density
        let layer;
        if (density > 0.7) {
          layer = Math.random() < 0.3 ? 'bright' : 'mid';
        } else if (density > 0.35) {
          layer = Math.random() < 0.6 ? 'mid' : 'dim';
        } else {
          layer = 'dim';
        }

        chars.push(makeChar(cx, cy, layer, text));
      }
    }
  }

  /* ── Resize handler ────────────────────────────────────────────── */

  function resize() {
    W = canvas.parentElement.clientWidth;
    H = canvas.parentElement.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildCharacters();
  }

  /* ── Draw one frame ────────────────────────────────────────────── */

  function draw(timestamp) {
    ctx.clearRect(0, 0, W, H);
    colors = getColors();

    // Lerp mouse position
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    const parallaxX = (mouseX - 0.5) * (isMobile ? 0 : 20);
    const parallaxY = (mouseY - 0.5) * (isMobile ? 0 : 20);

    const time = timestamp * 0.001;

    // Batch by font string to minimize ctx.font switches
    const batches = new Map();

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];

      // Update position with drift
      c.x += c.vx;
      c.y += c.vy;

      // Wrap around edges
      if (c.x < -120) c.x = W + 80;
      if (c.x > W + 120) c.x = -80;
      if (c.y < -80) c.y = H + 60;
      if (c.y > H + 80) c.y = -60;

      // Sine-wave alpha flicker
      const flicker = Math.sin(time * c.flickerSpeed + c.phase) * 0.3;
      const alpha = Math.max(0, Math.min(1, c.baseAlpha + flicker * c.baseAlpha));

      // Parallax offset based on layer depth
      const depth = c.layer === 'bright' ? 1.0 : c.layer === 'mid' ? 0.6 : 0.3;
      const drawX = c.x + parallaxX * depth;
      const drawY = c.y + parallaxY * depth;

      const fontStr = c.fontSize + 'px "SF Mono","Fira Code","Cascadia Code",monospace';
      const color = colors[c.layer].replace('ALPHA', alpha.toFixed(3));

      if (!batches.has(fontStr)) {
        batches.set(fontStr, []);
      }
      batches.get(fontStr).push({ text: c.text, x: drawX, y: drawY, color: color });
    }

    // Render batches
    for (const [fontStr, items] of batches) {
      ctx.font = fontStr;
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        ctx.fillStyle = item.color;
        ctx.fillText(item.text, item.x, item.y);
      }
    }
  }

  /* ── Animation loop ────────────────────────────────────────────── */

  function loop(timestamp) {
    if (paused) return;
    draw(timestamp);
    animId = requestAnimationFrame(loop);
  }

  function startAnimation() {
    if (prefersReducedMotion) {
      // Draw one static frame and stop
      draw(0);
      return;
    }
    if (animId) cancelAnimationFrame(animId);
    paused = false;
    animId = requestAnimationFrame(loop);
  }

  function pauseAnimation() {
    paused = true;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  /* ── Event listeners ───────────────────────────────────────────── */

  window.addEventListener('resize', function () {
    // Debounce resize
    clearTimeout(window._asciiResizeTimer);
    window._asciiResizeTimer = setTimeout(resize, 150);
  });

  // Mouse parallax (desktop only)
  if (!isMobile) {
    document.addEventListener('mousemove', function (e) {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = e.clientY / window.innerHeight;
    });
  }

  // Visibility change: pause when tab hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      pauseAnimation();
    } else {
      startAnimation();
    }
  });

  // Theme change event
  document.addEventListener('lbby:themechange', function () {
    colors = getColors();
  });

  // Also watch data-theme attribute directly (fallback)
  const observer = new MutationObserver(function () {
    colors = getColors();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  /* ── Init ──────────────────────────────────────────────────────── */

  resize();
  startAnimation();
})();
