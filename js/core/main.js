(function () {
  function callInit(moduleName, methodName) {
    const moduleRef = window[moduleName];
    if (!moduleRef || typeof moduleRef[methodName] !== 'function') return;
    try {
      moduleRef[methodName]();
    } catch (err) {
      console.error('[Frenzy init error]', moduleName + '.' + methodName, err);
    }
  }

  function initApp() {
    callInit('FrenzyHomeVideo', 'initHomeVideo');
    callInit('FrenzyUI', 'initThemeToggle');
    callInit('FrenzyUI', 'initNavbarScroll');
    callInit('FrenzyUI', 'initMobileMenu');

    callInit('FrenzyAnimations', 'initCounters');
    callInit('FrenzyAnimations', 'initScrollAnimations');
    callInit('FrenzyAnimations', 'initParticles');
    callInit('FrenzyAnimations', 'initSmoothAnchorScroll');

    callInit('FrenzyTestimonials', 'initTestimonials');
    callInit('FrenzyVideoShowcase', 'initVideoShowcase');
    callInit('FrenzyBookingForm', 'initBookingForm');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
