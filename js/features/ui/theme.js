(function () {
  let isThemeInit = false;

  function initThemeToggle() {
    if (isThemeInit) return;
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const root = document.documentElement;
    if (!root) return;
    isThemeInit = true;

    const savedTheme = localStorage.getItem('frenzy-theme') || 'light';
    root.setAttribute('data-theme', savedTheme);

    function toggleTheme() {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('frenzy-theme', next);
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);
  }

  window.FrenzyTheme = {
    initThemeToggle,
  };
})();
