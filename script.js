// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const root = document.documentElement;

const savedTheme = localStorage.getItem('frenzy-theme') || 'dark';
root.setAttribute('data-theme', savedTheme);

function toggleTheme() {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('frenzy-theme', next);
}

themeToggle.addEventListener('click', toggleTheme);
themeToggleMobile.addEventListener('click', toggleTheme);

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// ===== ANIMATED COUNTER =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// Trigger counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
  const elements = document.querySelectorAll(
    '.about-content, .about-images, .service-card, .gallery-item, .testimonial-card, .booking-info, .booking-form-wrapper, .section-header'
  );
  elements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

setupScrollAnimations();

// ===== TESTIMONIAL SLIDER =====
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (track) {
  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current > 0 ? current - 1 : cards.length - 1));
  nextBtn.addEventListener('click', () => goTo(current < cards.length - 1 ? current + 1 : 0));

  // Auto-advance every 5 seconds
  let autoSlide = setInterval(() => {
    goTo(current < cards.length - 1 ? current + 1 : 0);
  }, 5000);

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
      goTo(current < cards.length - 1 ? current + 1 : 0);
    }, 5000);
  });
}

// ===== FLOATING PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['rgba(124,58,237,0.3)', 'rgba(244,63,94,0.3)', 'rgba(167,139,250,0.2)', 'rgba(251,113,133,0.2)'];

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 6 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
    particle.style.animationDelay = (Math.random() * 5) + 's';
    container.appendChild(particle);
  }
}

createParticles();

// ===== SMOOTH SCROLL FOR SAFARI =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ===== BOOKING FORM =====
const bookingForm = document.getElementById('bookingForm');
const formStatus = document.getElementById('formStatus');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    bookingForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    formStatus.hidden = true;

    // Validate
    const fields = bookingForm.querySelectorAll('[required]');
    let valid = true;
    fields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    const emailField = bookingForm.querySelector('#form-email');
    if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error');
      valid = false;
    }

    if (!valid) {
      formStatus.hidden = false;
      formStatus.className = 'form-status error-msg';
      formStatus.textContent = 'Please fill in all required fields correctly.';
      return;
    }

    const submitBtn = bookingForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    /*
     * GOOGLE FORM INTEGRATION
     * To connect this form to your Google Form:
     * 1. Open your Google Form, click the 3-dot menu > "Get pre-filled link"
     * 2. Fill in dummy data and click "Get link"
     * 3. The URL will contain entry IDs like entry.123456789
     * 4. Replace the GOOGLE_FORM_ACTION_URL and entry.XXXXX values below
     *
     * Example:
     * const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
     * formData.append('entry.111111111', name);   // Name field
     * formData.append('entry.222222222', email);   // Email field
     * etc.
     */

    const name = bookingForm.querySelector('#form-name').value;
    const email = bookingForm.querySelector('#form-email').value;
    const phone = bookingForm.querySelector('#form-phone').value;
    const eventDate = bookingForm.querySelector('#form-date').value;
    const message = bookingForm.querySelector('#form-message').value;

    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';

    const formData = new FormData();
    formData.append('entry.XXXXX1', name);
    formData.append('entry.XXXXX2', email);
    formData.append('entry.XXXXX3', phone);
    formData.append('entry.XXXXX4', eventDate);
    formData.append('entry.XXXXX5', message);

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Google Forms doesn't support CORS
      });

      // With no-cors we can't read the response, but the submission goes through
      formStatus.hidden = false;
      formStatus.className = 'form-status success';
      formStatus.innerHTML = '✅ Success! Your message has been sent. We\'ll get back to you within 24 hours.';
      bookingForm.reset();
    } catch (err) {
      formStatus.hidden = false;
      formStatus.className = 'form-status error-msg';
      formStatus.textContent = 'Something went wrong. Please try again or email us directly.';
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });

  // Remove error styling on input
  bookingForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}
