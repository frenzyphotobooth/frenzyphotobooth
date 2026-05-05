(function () {
  let isGalleryInit = false;
  const MOBILE_BREAKPOINT = 900;

  function getViewportMode() {
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches ? 'mobile' : 'desktop';
  }

  function getGalleryBehavior(type, viewportMode) {
    if (type === 'video') {
      return viewportMode === 'mobile'
        ? { render: window.FrenzyGalleryMobile.renderVideoMobile }
        : { render: window.FrenzyGalleryDesktop.renderVideoDesktop };
    }
    return { render: window.FrenzyGalleryShared.renderPhotoGrid };
  }

  function renderGallery(items, currentType, grid) {
    grid.innerHTML = '';
    const filtered = items.filter((item) => item.type === currentType);
    if (!filtered.length) {
      window.FrenzyGalleryShared.renderEmpty(grid);
      return;
    }
    const viewportMode = getViewportMode();
    const behavior = getGalleryBehavior(currentType, viewportMode);
    behavior.render(filtered, grid);
  }

  function bindTabs(items, tabs, grid) {
    let currentType = 'photo';
    renderGallery(items, currentType, grid);

    let viewportMode = getViewportMode();
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const onViewportChange = () => {
      const nextMode = getViewportMode();
      if (nextMode === viewportMode) return;
      if (document.fullscreenElement) return;
      viewportMode = nextMode;
      renderGallery(items, currentType, grid);
    };
    if (typeof mediaQuery.addEventListener === 'function') mediaQuery.addEventListener('change', onViewportChange);
    else if (typeof mediaQuery.addListener === 'function') mediaQuery.addListener(onViewportChange);

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const nextType = tab.getAttribute('data-gallery-tab');
        if (!nextType || nextType === currentType) return;
        currentType = nextType;
        tabs.forEach((btn) => {
          const isActive = btn === tab;
          btn.classList.toggle('is-active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        renderGallery(items, currentType, grid);
      });
    });
  }

  async function fetchGalleryConfig() {
    const response = await fetch('assets/data/gallery.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Gallery config request failed');
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Gallery config must be an array');
    return data.filter((item) => {
      if (!item || (item.type !== 'photo' && item.type !== 'video')) return false;
      if (item.type === 'video' && item.sourceType === 'drive' && !window.FrenzyGalleryShared.isNonEmptyString(item.src)) return false;
      return true;
    });
  }

  async function initGallery() {
    if (isGalleryInit) return;
    const grid = document.getElementById('galleryGrid');
    const tabs = Array.from(document.querySelectorAll('#galleryTabs .gallery-tab'));
    if (!grid || !tabs.length) return;
    isGalleryInit = true;

    try {
      const items = await fetchGalleryConfig();
      bindTabs(items, tabs, grid);
    } catch (err) {
      grid.innerHTML = '';
      window.FrenzyGalleryShared.renderEmpty(grid);
    }
  }

  window.FrenzyGallery = { initGallery };
})();

