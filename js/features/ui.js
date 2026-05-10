(function () {
  function initThemeToggle() {
    if (!window.FrenzyTheme || typeof window.FrenzyTheme.initThemeToggle !== 'function') return;
    window.FrenzyTheme.initThemeToggle();
  }

  function initNavbarScroll() {
    if (!window.FrenzyNavbarScroll || typeof window.FrenzyNavbarScroll.initNavbarScroll !== 'function') return;
    window.FrenzyNavbarScroll.initNavbarScroll();
  }

  function initMobileMenu() {
    if (!window.FrenzyMobileMenu || typeof window.FrenzyMobileMenu.initMobileMenu !== 'function') return;
    window.FrenzyMobileMenu.initMobileMenu();
  }

  window.FrenzyUI = {
    initThemeToggle,
    initNavbarScroll,
    initMobileMenu,
  };
})();
