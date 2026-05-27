/* ─── ELYSIANN · main.js ─── */

/* ──────────────────────────────────────────────
   CUSTOM CURSOR  (desktop/mouse only)
────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');

if (window.matchMedia('(pointer: fine)').matches && cursor && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const hoverEls = document.querySelectorAll('a, button, .service-card, .work-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '6px'; cursor.style.height  = '6px';
      ring.style.width   = '52px'; ring.style.height   = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '10px'; cursor.style.height  = '10px';
      ring.style.width   = '36px'; ring.style.height   = '36px';
    });
  });
}

/* ──────────────────────────────────────────────
   MOBILE DRAWER
────────────────────────────────────────────── */
const mobileBtn    = document.getElementById('mobile-menu-btn');
const mobileDrawer = document.getElementById('mobile-drawer');
const mobileLinks  = document.querySelectorAll('.mobile-link, .mobile-cta');

function toggleDrawer(open) {
  const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
  mobileDrawer.classList.toggle('open', isOpen);
  mobileBtn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

if (mobileBtn) {
  mobileBtn.addEventListener('click', () => toggleDrawer());
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });
}

/* ──────────────────────────────────────────────
   NAV SCROLL BEHAVIOUR
────────────────────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ──────────────────────────────────────────────
   CAMERA ROTATION ON SCROLL
────────────────────────────────────────────── */
const cameraSvg = document.getElementById('camera-svg');
let lastScrollY = 0, cameraRot = 0;

window.addEventListener('scroll', () => {
  const delta = window.scrollY - lastScrollY;
  cameraRot += delta * 0.18;
  lastScrollY = window.scrollY;
  if (cameraSvg) cameraSvg.style.transform = `rotate(${cameraRot}deg)`;
}, { passive: true });

/* Camera idle float */
const cameraWrap = document.querySelector('.camera-wrap');
if (cameraWrap) {
  let ft = 0;
  (function floatCamera() {
    ft += 0.015;
    cameraWrap.style.transform = `translateY(${Math.sin(ft) * 8}px)`;
    requestAnimationFrame(floatCamera);
  })();
}

/* ──────────────────────────────────────────────
   SCROLL REVEAL
────────────────────────────────────────────── */
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ──────────────────────────────────────────────
   DIAL NAVIGATION
────────────────────────────────────────────── */
const dialWrap   = document.querySelector('.dial-wrap');
const dialLinks  = document.querySelectorAll('.dial-link');
const dialAngles = [0, 90, 180, 270];
let currentAngle = 0;

function rotateDial(index) {
  if (!dialWrap) return;
  const targetAngle = dialAngles[index];
  let delta = targetAngle - (currentAngle % 360);
  if (delta > 180)  delta -= 360;
  if (delta < -180) delta += 360;
  currentAngle += delta;
  dialWrap.style.transform = `rotate(${currentAngle}deg)`;
}

dialLinks.forEach(link => {
  link.addEventListener('click', function () {
    dialLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    rotateDial(parseInt(this.dataset.index));
  });
});

/* Auto-highlight nav on scroll */
const sections = ['services', 'about', 'work', 'contact'];
let ticking = false;

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    let current = '';
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section && window.scrollY >= section.offsetTop - 220) current = id;
    });

    dialLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + current;
      link.classList.toggle('active', isActive);
      if (isActive) rotateDial(parseInt(link.dataset.index));
    });
    ticking = false;
  });
}, { passive: true });

/* ──────────────────────────────────────────────
   CONTACT FORM
────────────────────────────────────────────── */
const form   = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        status.textContent = "Message sent! We'll be in touch soon.";
        status.style.color = '#c9a96e';
        form.reset();
        btn.textContent = 'Send Message →';
      } else {
        throw new Error('Network error');
      }
    } catch {
      status.textContent = 'Something went wrong. Please try again.';
      status.style.color = '#e07070';
      btn.textContent = 'Send Message →';
    }
    btn.disabled = false;
  });
}

/* ──────────────────────────────────────────────
   SERVICE OPTION SELECTOR (if used)
────────────────────────────────────────────── */
document.querySelectorAll('.service-option').forEach(option => {
  option.addEventListener('click', function () {
    document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
    this.classList.add('selected');
    const input = document.getElementById('service-input');
    if (input) input.value = this.dataset.value;
  });
});
