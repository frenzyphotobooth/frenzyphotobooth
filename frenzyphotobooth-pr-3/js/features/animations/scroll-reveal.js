(function () {
  let isScrollAnimationsInit = false;

  function initScrollAnimations() {
    if (isScrollAnimationsInit) return;

    const elements = document.querySelectorAll(
      '.about-content, .about-images, .service-card, .gallery-item, .testimonial-card, .booking-info, .booking-form-wrapper, .section-header'
    );
    if (!elements.length) return;
    isScrollAnimationsInit = true;

    elements.forEach((el) => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach((el) => observer.observe(el));
  }

  window.FrenzyScrollReveal = {
    initScrollAnimations,
  };
})();
