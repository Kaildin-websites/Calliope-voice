export function mountBinaryGrid(root) {
  const canvas = root.querySelector('canvas');
  const ctx    = canvas.getContext('2d');

  // ====== PARAMETRI ======
  const CFG = {
    fps:            24,     // frame al secondo
    flipRate:       0.006,  // quota di caselle che cambia 0/1 per frame
    hlDensity:      0.011,  // quota di caselle evidenziate contemporaneamente (rare)
    hlMinMs:        2200,   // durata minima evidenziazione
    hlMaxMs:        5200,   // durata massima evidenziazione
    tintScale:      0.075,  // grandezza dei blocchi di colore (più basso = più grandi)
    tintSpeed:      0.12,   // velocità con cui i blocchi si evolvono
    tintLevels:     4,      // livelli di grigio-azzurro (effetto a gradini)
    tintSmooth:     0.10,   // fluidità della transizione tra livelli
  };

  const cs = getComputedStyle(root);
  const css = n => cs.getPropertyValue(n).trim();
  const CELL = parseFloat(css('--cell')) || 16;
  const TINT = css('--tint');
  const TINT_MAX = parseFloat(css('--tint-max')) || .17;
  const FONT = css('--mono');

  let W, H, cols, rows, dpr, bits, tint, target, hlList, sprites;

  // ---------- value noise 3D (per i blocchi di colore) ----------
  const hash = (x, y, z) => {
    let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
  const sm = t => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  const noise = (x, y, z) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = sm(x - xi), yf = sm(y - yi), zf = sm(z - zi);
    const c = (i, j, k) => hash(xi + i, yi + j, zi + k);
    return lerp(
      lerp(lerp(c(0,0,0), c(1,0,0), xf), lerp(c(0,1,0), c(1,1,0), xf), yf),
      lerp(lerp(c(0,0,1), c(1,0,1), xf), lerp(c(0,1,1), c(1,1,1), xf), yf), zf);
  };

  // ---------- sprite dei caratteri (pre-renderizzati) ----------
  function makeSprite(ch, weight, color) {
    const s = document.createElement('canvas');
    s.width = s.height = Math.ceil(CELL * dpr);
    const g = s.getContext('2d');
    g.font = `${weight} ${Math.round(CELL * 0.68 * dpr)}px ${FONT}`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = color;
    g.fillText(ch, s.width / 2, s.height / 2 + dpr * 0.5);
    return s;
  }
  function buildSprites() {
    const d = css('--digit'), h = css('--digit-hl');
    sprites = {
      n: [makeSprite('0', 400, d), makeSprite('1', 400, d)],
      b: [makeSprite('0', 800, h), makeSprite('1', 800, h)],
    };
  }

  // ---------- setup / resize ----------
  function resize() {
    dpr  = Math.min(window.devicePixelRatio || 1, 2);
    W    = root.clientWidth; H = root.clientHeight;
    cols = Math.ceil(W / CELL); rows = Math.ceil(H / CELL);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = cols * rows;
    bits   = Uint8Array.from({ length: n }, () => Math.random() < .5 ? 1 : 0);
    tint   = new Float32Array(n);
    target = new Float32Array(n);
    hlList = [];
    buildSprites();
    computeTargets(performance.now());
    tint.set(target);
    draw(performance.now());
  }

  function computeTargets(now) {
    const z = now / 1000 * CFG.tintSpeed, L = CFG.tintLevels;
    for (let y = 0, i = 0; y < rows; y++)
      for (let x = 0; x < cols; x++, i++) {
        // due ottave: blocchi grandi + variazione fine
        const n = noise(x * CFG.tintScale, y * CFG.tintScale, z) * .75
                + noise(x * CFG.tintScale * 3, y * CFG.tintScale * 3, z * 1.6 + 40) * .25;
        let v = Math.min(Math.max((n - .5) / .22, 0), 1);
        target[i] = Math.round(v * L) / L;   // quantizzato: look a "caselle"
      }
  }

  function tickHighlights(now) {
    const max = Math.max(1, Math.round(cols * rows * CFG.hlDensity));
    hlList = hlList.filter(h => now - h.t0 < h.dur);
    let spawn = Math.min(max - hlList.length, 2);
    while (spawn-- > 0 && Math.random() < .5)
      hlList.push({ i: (Math.random() * cols * rows) | 0, t0: now,
                    dur: CFG.hlMinMs + Math.random() * (CFG.hlMaxMs - CFG.hlMinMs) });
  }

  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    // 1) blocchi di colore
    for (let y = 0, i = 0; y < rows; y++)
      for (let x = 0; x < cols; x++, i++) {
        const t = tint[i];
        if (t < .02) continue;
        ctx.fillStyle = `rgba(${TINT},${(t * TINT_MAX).toFixed(3)})`;
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    // 2) cifre normali
    for (let y = 0, i = 0; y < rows; y++)
      for (let x = 0; x < cols; x++, i++)
        ctx.drawImage(sprites.n[bits[i]], x * CELL, y * CELL, CELL, CELL);
    // 3) cifre evidenziate (bold + scure, fade in/out)
    for (const h of hlList) {
      const p = (now - h.t0) / h.dur;
      const a = Math.sin(Math.PI * Math.min(p * 1.15, 1)) ** 0.6; // sale in fretta, scende piano
      const x = (h.i % cols) * CELL, y = ((h.i / cols) | 0) * CELL;
      ctx.clearRect(x, y, CELL, CELL);
      ctx.fillStyle = `rgba(${TINT},${(tint[h.i] * TINT_MAX).toFixed(3)})`;
      ctx.fillRect(x, y, CELL, CELL);
      ctx.globalAlpha = 1 - a;  ctx.drawImage(sprites.n[bits[h.i]], x, y, CELL, CELL);
      ctx.globalAlpha = a;      ctx.drawImage(sprites.b[bits[h.i]], x, y, CELL, CELL);
      ctx.globalAlpha = 1;
    }
  }

  // ---------- loop ----------
  let last = 0, lastNoise = 0, raf = 0, running = false;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < 1000 / CFG.fps) return;
    last = now;
    if (now - lastNoise > 120) { computeTargets(now); lastNoise = now; }
    for (let i = 0; i < tint.length; i++) tint[i] += (target[i] - tint[i]) * CFG.tintSmooth;
    const flips = Math.ceil(bits.length * CFG.flipRate);
    for (let k = 0; k < flips; k++) bits[(Math.random() * bits.length) | 0] ^= 1;
    tickHighlights(now);
    draw(now);
  }
  const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
  const stop  = () => { running = false; cancelAnimationFrame(raf); };

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  const sync = () => visible && !document.hidden && !reduce.matches ? start() : stop();
  const sizeObserver = new ResizeObserver(resize);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  resize();
  sizeObserver.observe(root);
  visibilityObserver.observe(root);
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', sync);
  return () => {
    stop();
    sizeObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', sync);
    reduce.removeEventListener('change', sync);
  };
}
