const phrases = [
  'Візуальні новели українською мовою.',
  'Точна передача сюжету, стилю та інтонацій.',
  'Locus Team спеціалізується на VN-локалізаціях.',
  'The Song of Saya - поточний фокус команди.'
];

const rotatingText = document.querySelector('.hero-rotating');
let phraseIndex = 0;

function rotatePhrase() {
  if (!rotatingText) {
    return;
  }

  rotatingText.style.opacity = '0';
  rotatingText.style.transform = 'translateY(-10px)';

  setTimeout(() => {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    rotatingText.textContent = phrases[phraseIndex];
    rotatingText.style.transform = 'translateY(10px)';

    requestAnimationFrame(() => {
      rotatingText.style.opacity = '1';
      rotatingText.style.transform = 'translateY(0)';
    });
  }, 260);
}

if (rotatingText) {
  rotatingText.textContent = phrases[0];
  rotatingText.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  setInterval(rotatePhrase, 3600);
}

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobileNav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
    });
  });
}

const revealItems = document.querySelectorAll('.section-reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.18,
  rootMargin: '0px 0px -10% 0px'
});

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 0.08, 0.36)}s`;
  revealObserver.observe(item);
});

const heroCanvas = document.getElementById('heroCanvas');

if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = heroCanvas.width = heroCanvas.offsetWidth;
    H = heroCanvas.height = heroCanvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }

  function drawGlow() {
    const cx = W / 2;
    const cy = H * 0.46;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.55);
    grad.addColorStop(0, 'rgba(194,13,22,0.13)');
    grad.addColorStop(0.5, 'rgba(194,13,22,0.05)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function drawLines() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(194,13,22,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawGlow();

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,89,98,${p.opacity})`;
      ctx.fill();
    }

    drawLines();
    requestAnimationFrame(animate);
  }

  const ro = new ResizeObserver(() => {
    resize();
    createParticles();
  });
  ro.observe(heroCanvas);

  resize();
  createParticles();
  animate();
}

/* ── Lightbox ──────────────────────────────────────────────── */
(function () {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg     = document.getElementById('lbImg');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose   = lightbox.querySelector('.lb-close');
  const lbPrev    = lightbox.querySelector('.lb-prev');
  const lbNext    = lightbox.querySelector('.lb-next');

  const shots = Array.from(document.querySelectorAll('[data-lightbox]'));
  let current = 0;

  function open(index) {
    current = index;
    update();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    shots[current].focus();
  }

  function update() {
    const src = shots[current].dataset.lightbox;
    const alt = shots[current].querySelector('img').alt;
    lbImg.src = src;
    lbImg.alt = alt;
    lbCounter.textContent = (current + 1) + ' / ' + shots.length;
    lbPrev.disabled = current === 0;
    lbNext.disabled = current === shots.length - 1;
  }

  shots.forEach(function (btn, i) {
    btn.addEventListener('click', function () { open(i); });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', function () { if (current > 0) { current--; update(); } });
  lbNext.addEventListener('click', function () { if (current < shots.length - 1) { current++; update(); } });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  { if (current > 0) { current--; update(); } }
    if (e.key === 'ArrowRight') { if (current < shots.length - 1) { current++; update(); } }
  });
}());

/* ── Download counter ─────────────────────────────────────── */
(function () {
  var OWNER = 'DivanDoge';
  var REPO  = 'REPO_NAME'; // замініть на реальну назву репозиторію

  var countEl = document.getElementById('sayaDlNum');
  var wrapEl  = document.getElementById('sayaDlCount');
  if (!countEl || !wrapEl) return;

  fetch('https://api.github.com/repos/' + OWNER + '/' + REPO + '/releases')
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (releases) {
      var total = releases
        .flatMap(function (r) { return r.assets; })
        .reduce(function (sum, a) { return sum + a.download_count; }, 0);
      countEl.textContent = total.toLocaleString('uk-UA');
      wrapEl.hidden = false;
    })
    .catch(function () { /* мовчки ігноруємо помилки мережі */ });
}());
