/* ===================================
   ISAQUE FOTÓGRAFO — JAVASCRIPT
=================================== */

// -------- CUSTOM CURSOR --------
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .portfolio-item, .filter-btn, .depo-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor--hover');
    cursorFollower.classList.add('cursor--hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor--hover');
    cursorFollower.classList.remove('cursor--hover');
  });
});

document.addEventListener('mouseleave', () => {
  cursor.classList.add('cursor--hidden');
  cursorFollower.classList.add('cursor--hidden');
});
document.addEventListener('mouseenter', () => {
  cursor.classList.remove('cursor--hidden');
  cursorFollower.classList.remove('cursor--hidden');
});

// -------- NAVBAR SCROLL --------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// -------- HAMBURGER MENU --------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// -------- SCROLL REVEAL --------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// -------- COUNTER ANIMATION --------
function animateCounter(el, target, duration = 2000) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        animateCounter(counter, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// -------- PORTFOLIO FILTER --------
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    portfolioItems.forEach(item => {
      const category = item.dataset.category;
      if (filter === 'all' || category === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'none';
        item.offsetHeight; // reflow
        item.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// -------- TESTIMONIALS SLIDER --------
const track = document.getElementById('depoTrack');
const prevBtn = document.getElementById('depoPrev');
const nextBtn = document.getElementById('depoNext');
const dotsContainer = document.getElementById('depoDots');

const cards = track ? track.querySelectorAll('.depo-card') : [];
let currentSlide = 0;
let autoSlideInterval;

// Create dots
cards.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.classList.add('depo-dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function updateDots() {
  dotsContainer.querySelectorAll('.depo-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = (index + cards.length) % cards.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  updateDots();
}

if (prevBtn) prevBtn.addEventListener('click', () => {
  goToSlide(currentSlide - 1);
  resetAutoSlide();
});
if (nextBtn) nextBtn.addEventListener('click', () => {
  goToSlide(currentSlide + 1);
  resetAutoSlide();
});

function startAutoSlide() {
  autoSlideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
}
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}
startAutoSlide();

// Touch swipe for testimonials
let touchStartX = 0;
if (track) {
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
      resetAutoSlide();
    }
  });
}

// -------- PARALLAX HERO --------
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
  if (heroImg) {
    const scrolled = window.scrollY;
    heroImg.style.transform = `scale(1.08) translateY(${scrolled * 0.25}px)`;
  }
});

// -------- CONTACT FORM --------
const form = document.getElementById('contatoForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.innerHTML = '<span>Enviando...</span>';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Simulate sending
    setTimeout(() => {
      formSuccess.classList.add('show');
      form.reset();
      btn.innerHTML = '<span>Enviar Mensagem</span><span class="btn-arrow">→</span>';
      btn.disabled = false;
      btn.style.opacity = '1';
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1500);
  });

  // Input focus effects
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('focus', () => {
      el.parentElement.style.transform = 'translateY(-2px)';
    });
    el.addEventListener('blur', () => {
      el.parentElement.style.transform = 'translateY(0)';
    });
  });
}

// -------- SMOOTH ACTIVE NAV --------
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + id
          ? 'var(--accent)'
          : '';
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => navObserver.observe(s));

// -------- HERO ENTRY ANIMATION --------
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal-up').forEach((el, i) => {
    if (el.closest('.hero')) {
      setTimeout(() => el.classList.add('revealed'), 300 + i * 150);
    }
  });
});
