(function () {
  function initCounters() {
    if (!window.FrenzyCounterAnimations || typeof window.FrenzyCounterAnimations.initCounters !== 'function') return;
    window.FrenzyCounterAnimations.initCounters();
  }

  function initScrollAnimations() {
    if (!window.FrenzyScrollReveal || typeof window.FrenzyScrollReveal.initScrollAnimations !== 'function') return;
    window.FrenzyScrollReveal.initScrollAnimations();
  }

  function initParticles() {
    if (!window.FrenzyParticles || typeof window.FrenzyParticles.initParticles !== 'function') return;
    window.FrenzyParticles.initParticles();
  }

  function initSmoothAnchorScroll() {
    if (!window.FrenzySmoothScroll || typeof window.FrenzySmoothScroll.initSmoothAnchorScroll !== 'function') return;
    window.FrenzySmoothScroll.initSmoothAnchorScroll();
  }

  window.FrenzyAnimations = {
    initCounters,
    initScrollAnimations,
    initParticles,
    initSmoothAnchorScroll,
  };
})();
