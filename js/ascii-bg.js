(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Reduced motion — draw one static frame and bail                   */
  /* ------------------------------------------------------------------ */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /*  Canvas bootstrap                                                  */
  /* ------------------------------------------------------------------ */
  var canvas = document.getElementById('ascii-bg');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var W, H, dpr, isMobile;
  var chars = [];
  var mouse = { x: 0, y: 0 };
  var smoothMouse = { x: 0, y: 0 };
  var mouseActive = false;
  var paused = false;
  var time = 0;
  var rafId = null;

  /* ------------------------------------------------------------------ */
  /*  Word / fragment pools                                             */
  /* ------------------------------------------------------------------ */
  var WORDS = [
    'LBBY','R STUDIO','GAME SERVER','HOSTING','MINECRAFT','TERRARIA',
    'JAVA','SERVER','WORLD','PLAY','HOST','TUNNEL','PLAYIT','MODS',
    'PLUGINS','MODPACKS','BACKUP','RESTORE','PAPER','FABRIC','FORGE',
    'PURPUR','FOLIA','NEOFORGE','BUKKIT','SPIGOT','SPONGE','VANILLA',
    'PLAYER','ADMIN','TPS','RAM','CPU','JVM','CHUNKS','LAN',
    'CLOUDFLARE','TOKEN','DASHBOARD','CONSOLE','MULTIGAME','ONLINE','NETWORK'
  ];

  var FRAGMENTS = [
    'server_01','world_alpha','game_node','minecraft.ready','terraria.soon',
    'tunnel_open','playit.gg','port:25565','jvm.flags','tps:20.0',
    'ram:4096','players:08','paper/build','fabric/loader','forge/modpack',
    'backup.zip','restore_point','chunk.queue','remote.token','lan.node',
    'cloudflare.quick.tunnel','install.start.share','no_port_forwarding',
    'multi_game_host','01/LBBY','02/GAME','VN/HOST','BUILD.PLAY'
  ];

  var DOTS = ['.', '·', '•', '●', '○', '–', '—', '-'];

  /* ------------------------------------------------------------------ */
  /*  Simple noise (hash-based value noise with smooth interpolation)   */
  /* ------------------------------------------------------------------ */
  function hash(ix, iy) {
    var n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
    return n - Math.floor(n);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function noise(x, y) {
    var ix = Math.floor(x);
    var iy = Math.floor(y);
    var fx = smoothstep(x - ix);
    var fy = smoothstep(y - iy);
    var a = hash(ix, iy);
    var b = hash(ix + 1, iy);
    var c = hash(ix, iy + 1);
    var d = hash(ix + 1, iy + 1);
    return lerp(lerp(a, b, fx), lerp(c, d, fx), fy);
  }

  function fbm(x, y, octaves) {
    var val = 0;
    var amp = 0.5;
    var freq = 1;
    for (var i = 0; i < octaves; i++) {
      val += noise(x * freq, y * freq) * amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    return val;
  }

  /* ------------------------------------------------------------------ */
  /*  Density map                                                       */
  /* ------------------------------------------------------------------ */
  function densityAt(px, py) {
    var scale = 0.018;
    var d = fbm(px * scale, py * scale, 4);
    d += fbm(px * scale * 0.4, py * scale * 0.4, 3) * 0.4;
    d = d / 1.4;
    d = smoothstep(d);
    return d;
  }

  /* ------------------------------------------------------------------ */
  /*  Character generation                                              */
  /* ------------------------------------------------------------------ */
  function pickChar(density) {
    if (density > 0.70) {
      return FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
    }
    if (density > 0.45) {
      return WORDS[Math.floor(Math.random() * WORDS.length)];
    }
    if (density > 0.25) {
      return WORDS[Math.floor(Math.random() * WORDS.length)];
    }
    return DOTS[Math.floor(Math.random() * DOTS.length)];
  }

  function fontSizeFor(density, layer) {
    var base = isMobile ? 7 : 9;
    if (layer === 0) return base - 2;
    if (layer === 2) return base + 1;
    if (density > 0.65) return base + 1;
    return base;
  }

  function buildCharacters() {
    chars = [];
    var cellSize = isMobile ? 28 : 22;
    var cols = Math.ceil(W / cellSize);
    var rows = Math.ceil(H / cellSize);
    var maxDensityCells = isMobile ? cols * rows * 0.42 : cols * rows * 0.50;

    var ox = Math.random() * 1000;
    var oy = Math.random() * 1000;

    var placed = 0;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var cx = c * cellSize + cellSize * 0.5;
        var cy = r * cellSize + cellSize * 0.5;
        var d = densityAt(cx + ox, cy + oy);

        var prob = d * 0.85;
        if (placed > maxDensityCells) prob *= 0.25;
        if (Math.random() > prob) continue;

        var layer;
        var rnd = Math.random();
        if (d > 0.62 && rnd < 0.18) {
          layer = 2;
        } else if (d > 0.35 && rnd < 0.55) {
          layer = 1;
        } else {
          layer = 0;
        }

        var baseAlpha;
        if (layer === 0) baseAlpha = 0.04 + d * 0.08;
        else if (layer === 1) baseAlpha = 0.10 + d * 0.22;
        else baseAlpha = 0.30 + d * 0.48;

        chars.push({
          x: cx + (Math.random() - 0.5) * cellSize * 0.6,
          y: cy + (Math.random() - 0.5) * cellSize * 0.6,
          char: pickChar(d),
          layer: layer,
          baseAlpha: baseAlpha,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.06,
          phase: Math.random() * Math.PI * 2,
          size: fontSizeFor(d, layer),
          density: d
        });

        placed++;
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Theme colours                                                     */
  /* ------------------------------------------------------------------ */
  function getColors() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      dim:    isDark ? 'rgba(255,255,255,0.08)'  : 'rgba(0,0,0,0.07)',
      mid:    isDark ? 'rgba(192,192,192,0.30)'   : 'rgba(120,120,120,0.24)',
      bright: isDark ? 'rgba(255,255,255,0.78)'   : 'rgba(20,20,20,0.60)',
      glow:   isDark ? 'rgba(229,34,39,0.18)'     : 'rgba(229,34,39,0.16)',
      bg:     isDark ? '#030303'                   : '#e9e3d3'
    };
  }

  /* ------------------------------------------------------------------ */
  /*  Dimensions & resize                                               */
  /* ------------------------------------------------------------------ */
  function measure() {
    var rect = canvas.getBoundingClientRect();
    isMobile = window.innerWidth < 768;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width;
    H = rect.height;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resize() {
    measure();
    buildCharacters();
    if (prefersReduced) drawFrame();
  }

  /* ------------------------------------------------------------------ */
  /*  Draw                                                              */
  /* ------------------------------------------------------------------ */
  function drawFrame() {
    var colors = getColors();
    ctx.clearRect(0, 0, W, H);

    /* centre mask — dim centre so headline stays readable */
    var cx = W * 0.5;
    var cy = H * 0.5;
    var maskR = Math.max(W, H) * 0.55;
    var maskGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maskR);
    maskGrad.addColorStop(0, 'rgba(0,0,0,0.28)');
    maskGrad.addColorStop(0.45, 'rgba(0,0,0,0.10)');
    maskGrad.addColorStop(1, 'rgba(0,0,0,0)');

    /* parallax offsets per layer */
    var dx = smoothMouse.x;
    var dy = smoothMouse.y;
    var offsets = [
      { x: dx * 0.01, y: dy * 0.01 },
      { x: dx * 0.02, y: dy * 0.02 },
      { x: dx * 0.03, y: dy * 0.03 }
    ];

    var t = time;

    for (var i = 0, len = chars.length; i < len; i++) {
      var ch = chars[i];
      var lo = offsets[ch.layer];

      /* slow drift */
      ch.x += ch.vx * 0.3;
      ch.y += ch.vy * 0.2;

      /* wrap around */
      if (ch.x < -40) ch.x += W + 80;
      if (ch.x > W + 40) ch.x -= W + 80;
      if (ch.y < -40) ch.y += H + 80;
      if (ch.y > H + 40) ch.y -= H + 80;

      /* wave distortion */
      var wy = Math.sin(ch.x * 0.002 + t * 0.0003) * 2;

      /* opacity flicker */
      var flicker = Math.sin(ch.phase + t * 0.0008) * 0.10;
      var shimmer = 0;
      if (ch.layer === 2) {
        shimmer = Math.sin(ch.phase * 1.7 + t * 0.0014) * 0.18;
      }
      var alpha = Math.max(0, Math.min(1, ch.baseAlpha + flicker + shimmer));

      /* pick colour bucket */
      var col;
      if (ch.layer === 0) col = colors.dim;
      else if (ch.layer === 2) col = colors.bright;
      else col = alpha > 0.22 ? colors.mid : colors.dim;

      var px = ch.x + lo.x;
      var py = ch.y + lo.y + wy;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = col;
      ctx.font = ch.size + 'px "JetBrains Mono","Fira Code","SF Mono",monospace';
      ctx.fillText(ch.char, px, py);
    }

    ctx.globalAlpha = 1;

    /* cursor glow (desktop only) */
    if (mouseActive && !isMobile) {
      var gx = smoothMouse.x + W * 0.5;
      var gy = smoothMouse.y + H * 0.5;
      var glowR = isMobile ? 90 : 140;
      var glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowR);
      glow.addColorStop(0, colors.glow);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(gx - glowR, gy - glowR, glowR * 2, glowR * 2);
    }

    /* re-apply centre mask */
    ctx.fillStyle = maskGrad;
    ctx.fillRect(0, 0, W, H);
  }

  /* ------------------------------------------------------------------ */
  /*  Animation loop                                                    */
  /* ------------------------------------------------------------------ */
  function tick(ts) {
    if (paused) { rafId = requestAnimationFrame(tick); return; }
    time = ts || 0;

    /* lerp mouse */
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.06;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.06;

    drawFrame();
    rafId = requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------ */
  /*  Mouse tracking                                                    */
  /* ------------------------------------------------------------------ */
  function onMouseMove(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left - W * 0.5;
    mouse.y = e.clientY - rect.top  - H * 0.5;
    mouseActive = true;
  }

  function onMouseLeave() {
    mouseActive = false;
    mouse.x = 0;
    mouse.y = 0;
  }

  /* ------------------------------------------------------------------ */
  /*  Visibility observer — pause when offscreen                        */
  /* ------------------------------------------------------------------ */
  var observer;
  function observeVisibility() {
    if (!('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(function (entries) {
      paused = !entries[0].isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);
  }

  /* ------------------------------------------------------------------ */
  /*  Theme change watcher                                              */
  /* ------------------------------------------------------------------ */
  var themeObserver;
  function watchTheme() {
    if (!('MutationObserver' in window)) return;
    themeObserver = new MutationObserver(function () {
      /* colours are read live each frame — nothing extra needed */
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Init                                                              */
  /* ------------------------------------------------------------------ */
  function init() {
    measure();
    buildCharacters();
    observeVisibility();
    watchTheme();

    /* mouse events — desktop only */
    if (!isMobile) {
      canvas.addEventListener('mousemove', onMouseMove, { passive: true });
      canvas.addEventListener('mouseleave', onMouseLeave, { passive: true });
    }

    window.addEventListener('resize', resize, { passive: true });

    if (prefersReduced) {
      /* single static frame */
      drawFrame();
    } else {
      rafId = requestAnimationFrame(tick);
    }
  }

  /* start when DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
