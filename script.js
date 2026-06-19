/* ═══════════════════════════════════════════════════════════
   REN COMPUTERS — script.js
   ═══════════════════════════════════════════════════════════ */

/* ── Preloader ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hide');
  }, 1800);
});

/* ── Offer Banner Hide on Scroll ───────────────────────────── */
const offerBanner = document.querySelector('.offer-banner');
let lastScrollY = 0;
function handleBannerScroll() {
  const current = window.scrollY;
  if (current > 120) {
    offerBanner && offerBanner.classList.add('hide');
    document.body.classList.add('offer-hidden');
  } else {
    offerBanner && offerBanner.classList.remove('hide');
    document.body.classList.remove('offer-hidden');
  }
  lastScrollY = current;
}

/* ── Navbar ────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

function closeMobileNav() {
  if (!navToggle || !navLinks) return;
  navToggle.classList.remove('open');
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
  document.body.style.overflow = '';
}

function openMobileNav() {
  if (!navToggle || !navLinks) return;
  navToggle.classList.add('open');
  navLinks.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');
}

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  handleBannerScroll();
  handleBackToTop();
  highlightNavOnScroll();
}

navToggle && navToggle.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileNav();
  });
});

document.addEventListener('click', (event) => {
  if (!navLinks || !navToggle || !navLinks.classList.contains('open')) return;
  const clickedInsideMenu = navLinks.contains(event.target);
  const clickedToggle = navToggle.contains(event.target);
  if (!clickedInsideMenu && !clickedToggle) closeMobileNav();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) closeMobileNav();
});

/* Active link on scroll */
const sections = document.querySelectorAll('section[id], div[id="home"]');

function highlightNavOnScroll() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  allNavLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

/* ── Back To Top ───────────────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');

function handleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn && backToTopBtn.classList.add('show');
  } else {
    backToTopBtn && backToTopBtn.classList.remove('show');
  }
}

backToTopBtn && backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Scroll event ──────────────────────────────────────────── */
window.addEventListener('scroll', handleNavScroll, { passive: true });

/* ── Hero Particles ────────────────────────────────────────── */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = window.innerWidth < 600 ? 10 : 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 14 + 4;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * -15}s;
      opacity: ${Math.random() * .5 + .1};
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ── Counter Animation ─────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ── Intersection Observer (AOS + counters) ─────────────────── */
const aosElements = document.querySelectorAll('[data-aos]');
const counterElements = document.querySelectorAll('.stat-num[data-count]');
const counterDone = new WeakSet();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.aosDelay || '0', 10);
      setTimeout(() => el.classList.add('aos-animate'), delay);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

aosElements.forEach(el => observer.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counterDone.has(entry.target)) {
      counterDone.add(entry.target);
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterElements.forEach(el => counterObserver.observe(el));

/* ── Gallery Filter ────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.gallery-filter');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'none';
        requestAnimationFrame(() => {
          item.style.animation = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(.9)';
          setTimeout(() => {
            item.style.transition = 'opacity .4s, transform .4s';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 30);
        });
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ── Lightbox ──────────────────────────────────────────────── */
const lightbox = document.getElementById('lightbox');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let lightboxIndex = 0;
const visibleItems = () => Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));

function openLightbox(idx) {
  const items = visibleItems();
  if (!items[idx]) return;
  lightboxIndex = idx;
  const img = items[idx].querySelector('img');
  const caption = items[idx].querySelector('.gallery-info span');
  lightboxImg.src = img.src.replace('w=400', 'w=1200');
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = caption ? caption.textContent : '';
  lightbox.classList.add('active');
  lightboxBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightboxBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

function navLightbox(dir) {
  const items = visibleItems();
  lightboxIndex = (lightboxIndex + dir + items.length) % items.length;
  const img = items[lightboxIndex].querySelector('img');
  const caption = items[lightboxIndex].querySelector('.gallery-info span');
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = img.src.replace('w=400', 'w=1200');
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightboxImg.style.opacity = '1';
  }, 200);
}

galleryItems.forEach((item, _idx) => {
  item.addEventListener('click', () => {
    const items = visibleItems();
    const idx = items.indexOf(item);
    if (idx > -1) openLightbox(idx);
  });
});

lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop && lightboxBackdrop.addEventListener('click', closeLightbox);
lightboxPrev && lightboxPrev.addEventListener('click', () => navLightbox(-1));
lightboxNext && lightboxNext.addEventListener('click', () => navLightbox(1));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileNav();
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navLightbox(-1);
  if (e.key === 'ArrowRight') navLightbox(1);
});

/* ── Contact Form ──────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm && contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const name = contactForm.querySelector('#name').value || '';
  const phone = contactForm.querySelector('#phone').value || '';
  const service = contactForm.querySelector('#service').value || '';
  const message = contactForm.querySelector('#message').value || '';
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  // Simulate send
  setTimeout(() => {
    formSuccess.classList.add('show');
    contactForm.reset();
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    setTimeout(() => formSuccess.classList.remove('show'), 5000);

    // WhatsApp redirect (optional — build the message)
    const msg = encodeURIComponent(
      `Hi REN COMPUTERS,\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`
    );
    const emailSubject = encodeURIComponent(`REN COMPUTERS Enquiry - ${service || 'Service Request'}`);
    const emailBody = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`
    );
    window.location.href = `mailto:elumalai2788@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    // Uncomment to auto-open WhatsApp:
    // window.open(`https://wa.me/919789892007?text=${msg}`, '_blank');
  }, 1400);
});

/* ── Smooth scroll for anchor links ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Initial call ──────────────────────────────────────────── */
handleNavScroll();
