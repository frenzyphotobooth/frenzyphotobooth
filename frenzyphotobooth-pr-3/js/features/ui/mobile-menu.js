(function () {
  let isMobileMenuInit = false;

  function initMobileMenu() {
    if (isMobileMenuInit) return;
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (!navToggle || !navLinks) return;
    isMobileMenuInit = true;

    function closeMobileMenu() {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
    }

    function openMobileMenu() {
      navLinks.classList.add('active');
      navToggle.classList.add('active');
      document.body.classList.add('menu-open');
    }

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.classList.contains('active')) return;
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  window.FrenzyMobileMenu = {
    initMobileMenu,
  };
})();
