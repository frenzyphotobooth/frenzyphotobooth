(function () {
  let isNavbarScrollInit = false;

  function initNavbarScroll() {
    if (isNavbarScrollInit) return;
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    isNavbarScrollInit = true;

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  window.FrenzyNavbarScroll = {
    initNavbarScroll,
  };
})();
