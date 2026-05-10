(function () {
  let isThemeInit = false;
  const GRADIENT_STORAGE_KEY = 'frenzy-gradient-theme';

  function hexToRgb(hex) {
    if (typeof hex !== 'string') return null;
    const normalized = hex.replace('#', '');
    const full = normalized.length === 3
      ? normalized.split('').map((c) => c + c).join('')
      : normalized;
    const int = Number.parseInt(full, 16);
    if (!Number.isFinite(int)) return null;
    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255,
    };
  }

  function applyGradientTheme(theme) {
    if (!theme || typeof theme.primary !== 'string' || typeof theme.accent !== 'string') return;
    const startRgb = hexToRgb(theme.primary);
    const endRgb = hexToRgb(theme.accent);
    if (!startRgb || !endRgb) return;

    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--primary', theme.primary);
    rootStyle.setProperty('--primary-dark', theme.primary);
    rootStyle.setProperty('--primary-light', theme.primary);
    rootStyle.setProperty('--accent', theme.accent);
    rootStyle.setProperty('--accent-light', theme.accent);
    rootStyle.setProperty('--gradient', `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`);
    rootStyle.setProperty(
      '--gradient-subtle',
      `linear-gradient(135deg, rgba(${startRgb.r},${startRgb.g},${startRgb.b},0.10), rgba(${endRgb.r},${endRgb.g},${endRgb.b},0.10))`
    );
  }

  function applySavedGradientTheme() {
    let savedGradient = null;
    try {
      savedGradient = JSON.parse(localStorage.getItem(GRADIENT_STORAGE_KEY) || 'null');
    } catch (_) {
      savedGradient = null;
    }
    applyGradientTheme(savedGradient);
  }

  function initThemeToggle() {
    if (isThemeInit) return;
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const root = document.documentElement;
    if (!root) return;
    isThemeInit = true;

    const savedTheme = localStorage.getItem('frenzy-theme') || 'light';
    root.setAttribute('data-theme', savedTheme);
    applySavedGradientTheme();

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
    applyGradientTheme,
  };
})();
