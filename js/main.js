const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .service-card, .work-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '6px'; cursor.style.height = '6px'; ring.style.width = '52px'; ring.style.height = '52px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; ring.style.width = '36px'; ring.style.height = '36px'; });
  });

  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); });

  // Camera rotation on scroll
  const cameraSvg = document.getElementById('camera-svg');
  let lastY = 0, cameraRot = 0;
  window.addEventListener('scroll', () => {
    const delta = window.scrollY - lastY;
    cameraRot += delta * 0.18;
    lastY = window.scrollY;
    cameraSvg.style.transform = `rotate(${cameraRot}deg)`;
  });

  // Camera idle float
  let ft = 0;
  (function floatCamera() {
    ft += 0.015;
    document.querySelector('.camera-wrap').style.transform = `translateY(${Math.sin(ft) * 8}px)`;
    requestAnimationFrame(floatCamera);
  })();

  // Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const response = await fetch(form.action, {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  });
  if (response.ok) {
    status.textContent = 'Message sent! We\'ll be in touch soon.';
    form.reset();
  } else {
    status.textContent = 'Something went wrong. Please try again.';
  }
});
// Dial rotation
const dialSvg = document.getElementById('dial-svg');
const dialLinks = document.querySelectorAll('.dial-link');

// Rotation angles for each nav item (0=Services, 1=About, 2=Work, 3=Contact)
const dialAngles = [0, 90, 180, 270];

let currentAngle = 0;

dialLinks.forEach(link => {
  link.addEventListener('click', function () {
    // Remove active from all
    dialLinks.forEach(l => l.classList.remove('active'));
    // Add active to clicked
    this.classList.add('active');

    const index = parseInt(this.dataset.index);
    const targetAngle = dialAngles[index];

    // Always rotate in the shortest direction
    let delta = targetAngle - (currentAngle % 360);
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    currentAngle += delta;

    document.querySelector('.dial-wrap').style.transform = `rotate(${currentAngle}deg)`;
  });
});

// Auto-highlight nav item based on scroll position
const sections = ['services', 'about', 'work', 'contact'];
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section && window.scrollY >= section.offsetTop - 200) {
      current = id;
    }
  });

  dialLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
      const index = parseInt(link.dataset.index);
      const targetAngle = dialAngles[index];
      let delta = targetAngle - (currentAngle % 360);
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      currentAngle += delta;
      document.querySelector('.dial-wrap').style.transform = `rotate(${currentAngle}deg)`;
    }
  });
});
// Service selector
document.querySelectorAll('.service-option').forEach(option => {
  option.addEventListener('click', function() {
    document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
    this.classList.add('selected');
    document.getElementById('service-input').value = this.dataset.value;
  });
});