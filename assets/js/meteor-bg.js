/* =========================================================
   CISCO LEARNING HUB — meteor-bg.js
   Starfield + hujan meteor sebagai background, jalan terus
   tanpa pernah berhenti selama halaman terbuka. Vanilla JS +
   Canvas 2D, tanpa dependency. Diletakkan paling belakang
   (di belakang .grid-veil dan konten) lewat z-index.
   ========================================================= */
(function () {
  const cfg = Object.assign({
    starCount: null,              // null = otomatis sesuai luas layar
    starColor: '234,243,251',     // selaras dengan --text di style.css
    meteorColors: [               // selaras dengan --cyan / --orange / --green (blueprint palette)
      ['125,211,252', '143,166,255'],  // cyan -> violet
      ['255,138,76', '255,140,170'],   // orange -> rose
      ['74,222,128', '125,211,252'],   // green -> cyan
      ['195,236,255', '125,211,252']   // cyan-2 -> cyan
    ],
    meteorIntervalMs: 900,        // interval cek spawn — makin kecil makin rapat
    meteorChance: 0.85,           // peluang spawn tiap interval
    maxConcurrentMeteors: 5,      // dijaga sedikit biar tetap rapi, tidak ramai
    zIndex: 0                     // di atas <body> tapi di belakang .shell (yang z-index:1)
  }, window.METEOR_CONFIG || {});

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let canvas = document.getElementById('meteor-bg-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'meteor-bg-canvas';
  }
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = String(cfg.zIndex);
  canvas.style.pointerEvents = 'none';
  canvas.style.background = 'transparent';

  function mount() {
    if (document.body && !document.getElementById('meteor-bg-canvas')) {
      document.body.prepend(canvas);
    } else if (!document.body) {
      document.addEventListener('DOMContentLoaded', mount);
    }
  }
  mount();

  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---------------- Bintang statis berkedip ---------------- */
  let STAR_COUNT = cfg.starCount || Math.min(170, Math.floor((window.innerWidth * window.innerHeight) / 9500));
  let stars = Array.from({ length: STAR_COUNT }, makeStar);
  function makeStar() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      a: Math.random(),
      da: (Math.random() * 0.012 + 0.004) * (Math.random() < 0.5 ? -1 : 1)
    };
  }
  // Re-seed star field proporsional saat resize besar (mis. rotate device)
  window.addEventListener('resize', () => {
    const target = cfg.starCount || Math.min(170, Math.floor((window.innerWidth * window.innerHeight) / 9500));
    if (Math.abs(target - stars.length) > 20) stars = Array.from({ length: target }, makeStar);
  });

  /* ---------------- Meteor / shooting star ---------------- */
  let meteors = [];

  function spawnMeteor() {
    const palette = cfg.meteorColors[Math.floor(Math.random() * cfg.meteorColors.length)];
    meteors.push({
      x: Math.random() * w * 1.3 - w * 0.15,
      y: -30,
      len: Math.random() * 150 + 100,
      speed: Math.random() * 6.5 + 8,
      angle: (Math.PI / 4) + (Math.random() * 0.22 - 0.11),
      life: 0,
      maxLife: Math.random() * 75 + 60,
      c1: palette[0],
      c2: palette[1],
      width: Math.random() * 1.3 + 1
    });
  }

  // Loop spawn abadi — tidak pernah di-clear, jadi meteor selalu ada terus-menerus
  // selama tab/halaman aktif dan reduce-motion tidak diminta pengguna.
  function scheduleSpawns() {
    setInterval(() => {
      if (document.hidden) return; // hemat baterai saat tab tidak aktif
      if (meteors.length < cfg.maxConcurrentMeteors && Math.random() < cfg.meteorChance) {
        spawnMeteor();
      }
    }, cfg.meteorIntervalMs);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const s of stars) {
      s.a += s.da;
      if (s.a <= 0.05 || s.a >= 1) s.da *= -1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${cfg.starColor},${Math.max(0, Math.min(1, s.a * 0.7))})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const m of meteors) {
      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;
      m.life++;
      const fadeIn = Math.min(1, m.life / 8);
      const fadeOut = 1 - Math.max(0, (m.life - (m.maxLife - 18)) / 18);
      const opacity = Math.max(0, Math.min(fadeIn, fadeOut)) * 0.85;

      const tailX = m.x - Math.cos(m.angle) * m.len;
      const tailY = m.y - Math.sin(m.angle) * m.len;
      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(${m.c1},${opacity})`);
      grad.addColorStop(0.45, `rgba(${m.c2},${opacity * 0.5})`);
      grad.addColorStop(1, `rgba(${m.c2},0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = m.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${opacity})`;
      ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    meteors = meteors.filter(m => m.life < m.maxLife && m.y < h + 150 && m.x > -250 && m.x < w + 250);

    requestAnimationFrame(draw);
  }

  if (!reduceMotion) {
    scheduleSpawns();
    setTimeout(spawnMeteor, 300);
    setTimeout(spawnMeteor, 1100);
    setTimeout(spawnMeteor, 2200);
  }
  requestAnimationFrame(draw);
})();
