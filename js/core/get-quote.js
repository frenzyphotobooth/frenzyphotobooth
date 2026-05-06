(function () {
  function initQuotePage() {
    if (window.FrenzyUI) {
      window.FrenzyUI.initThemeToggle();
      window.FrenzyUI.initNavbarScroll();
      window.FrenzyUI.initMobileMenu();
    }

    if (window.FrenzyBookingForm) {
      window.FrenzyBookingForm.initBookingForm();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuotePage);
  } else {
    initQuotePage();
  }
})();
