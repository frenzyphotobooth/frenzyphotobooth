(function () {
  let isThemePreviewInit = false;
  const GRADIENT_STORAGE_KEY = 'frenzy-gradient-theme';

  const OPTIONS = [
    { id: 'frenzy-signature-gold', name: 'Frenzy Signature Gold', primary: '#7a4d00', accent: '#ffd166' },
    { id: 'black-gold-luxe', name: 'Black Gold Luxe', primary: '#1a1204', accent: '#f2c14e' },
    { id: 'royal-bullion', name: 'Royal Bullion', primary: '#5c3a00', accent: '#ffbf00' },
    { id: 'champagne-contrast', name: 'Champagne Contrast', primary: '#6e4f1f', accent: '#ffe7a3' },
    { id: 'amber-strike', name: 'Amber Strike', primary: '#4a2f00', accent: '#ffb000' },
    { id: 'gilded-onyx', name: 'Gilded Onyx', primary: '#111111', accent: '#d4af37' },
    { id: 'brass-flare', name: 'Brass Flare', primary: '#5b4500', accent: '#f7c948' },
    { id: 'honey-gold-pop', name: 'Honey Gold Pop', primary: '#8a5a00', accent: '#ffd54f' },
    { id: 'antique-gold', name: 'Antique Gold', primary: '#6b4e16', accent: '#e6be5a' },
    { id: 'white-gold-premium', name: 'White Gold Premium', primary: '#ffffff', accent: '#d4af37' },
    { id: 'ruby-flare', name: 'Ruby Flare', primary: '#7f1d1d', accent: '#ef4444' },
    { id: 'coral-pop', name: 'Coral Pop', primary: '#9a3412', accent: '#fb7185' },
    { id: 'sunset-punch', name: 'Sunset Punch', primary: '#c2410c', accent: '#f97316' },
    { id: 'emerald-glow', name: 'Emerald Glow', primary: '#065f46', accent: '#34d399' },
    { id: 'mint-teal-shift', name: 'Mint Teal Shift', primary: '#0f766e', accent: '#2dd4bf' },
    { id: 'sapphire-wave', name: 'Sapphire Wave', primary: '#1d4ed8', accent: '#38bdf8' },
    { id: 'indigo-fusion', name: 'Indigo Fusion', primary: '#3730a3', accent: '#8b5cf6' },
    { id: 'orchid-blaze', name: 'Orchid Blaze', primary: '#7e22ce', accent: '#ec4899' },
    { id: 'crimson-noir', name: 'Crimson Noir', primary: '#111111', accent: '#e11d48' },
    { id: 'arctic-contrast', name: 'Arctic Contrast', primary: '#0f172a', accent: '#f8fafc' },
  ];

  function hexToRgb(hex) {
    const normalized = hex.replace('#', '');
    const full = normalized.length === 3
      ? normalized.split('').map((c) => c + c).join('')
      : normalized;
    const int = Number.parseInt(full, 16);
    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255,
    };
  }

  function applyThemeGradient(option) {
    if (!option) return;
    localStorage.setItem(
      GRADIENT_STORAGE_KEY,
      JSON.stringify({ primary: option.primary, accent: option.accent })
    );

    if (window.FrenzyTheme && typeof window.FrenzyTheme.applyGradientTheme === 'function') {
      window.FrenzyTheme.applyGradientTheme(option);
      return;
    }

    const rootStyle = document.documentElement.style;
    const startRgb = hexToRgb(option.primary);
    const endRgb = hexToRgb(option.accent);
    rootStyle.setProperty('--primary', option.primary);
    rootStyle.setProperty('--primary-dark', option.primary);
    rootStyle.setProperty('--primary-light', option.primary);
    rootStyle.setProperty('--accent', option.accent);
    rootStyle.setProperty('--accent-light', option.accent);
    rootStyle.setProperty('--gradient', `linear-gradient(135deg, ${option.primary}, ${option.accent})`);
    rootStyle.setProperty(
      '--gradient-subtle',
      `linear-gradient(135deg, rgba(${startRgb.r},${startRgb.g},${startRgb.b},0.10), rgba(${endRgb.r},${endRgb.g},${endRgb.b},0.10))`
    );
  }

  function createCard(option) {
    const card = document.createElement('article');
    card.className = 'theme-option-card';

    const swatch = document.createElement('div');
    swatch.className = 'theme-option-swatch';
    swatch.style.background = `linear-gradient(135deg, ${option.primary}, ${option.accent})`;

    const title = document.createElement('h4');
    title.textContent = option.name;

    const chips = document.createElement('div');
    chips.className = 'theme-option-chips';
    const startChip = document.createElement('span');
    startChip.textContent = option.primary;
    const endChip = document.createElement('span');
    endChip.textContent = option.accent;
    chips.appendChild(startChip);
    chips.appendChild(endChip);

    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.className = 'btn btn-primary theme-option-apply';
    applyBtn.textContent = 'Apply Theme';
    applyBtn.addEventListener('click', () => applyThemeGradient(option));

    card.appendChild(swatch);
    card.appendChild(title);
    card.appendChild(chips);
    card.appendChild(applyBtn);
    return card;
  }

  function initThemePreview() {
    if (isThemePreviewInit) return;
    const grid = document.getElementById('themeOptionsGrid');
    if (!grid) return;
    isThemePreviewInit = true;

    OPTIONS.forEach((option) => {
      grid.appendChild(createCard(option));
    });
  }

  window.FrenzyThemePreview = {
    initThemePreview,
  };
})();
