(function () {
  let isCountersInit = false;

  function initCounters() {
    if (isCountersInit) return;

    function animateCounters() {
      const counters = document.querySelectorAll('.stat-number');
      counters.forEach((counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
      });
    }

    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;
    isCountersInit = true;

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          heroObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    heroObserver.observe(heroStats);
  }

  window.FrenzyCounterAnimations = {
    initCounters,
  };
})();
