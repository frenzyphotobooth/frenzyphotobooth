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
    if (type === 'photo' && viewportMode === 'mobile') {
      return { render: window.FrenzyGalleryMobile.renderPhotoMobile };
    }
    return { render: window.FrenzyGalleryShared.renderPhotoGrid };
  }

  function renderPhotoCategories(categories, grid) {
    grid.innerHTML = '';
    if (!Array.isArray(categories) || !categories.length) {
      window.FrenzyGalleryShared.renderEmpty(grid);
      return;
    }

    categories.forEach((category) => {
      const link = document.createElement('a');
      link.className = 'gallery-item gallery-category-card';
      link.href = `/gallery/${encodeURIComponent(category.slug)}/`;
      link.setAttribute('aria-label', `View ${category.title} photos`);

      const mediaWrap = document.createElement('div');
      mediaWrap.className = 'gallery-media';
      const img = document.createElement('img');
      img.src = category.coverImage || 'assets/posters/event-01.jpg';
      img.alt = `${category.title} photo gallery`;
      img.loading = 'lazy';
      img.decoding = 'async';
      mediaWrap.appendChild(img);

      const meta = document.createElement('div');
      meta.className = 'gallery-meta';
      const title = document.createElement('h4');
      title.textContent = category.title;
      const desc = document.createElement('p');
      desc.className = 'gallery-category-desc';
      desc.textContent = category.description || 'View this photo category';
      meta.appendChild(title);
      meta.appendChild(desc);

      link.appendChild(mediaWrap);
      link.appendChild(meta);
      grid.appendChild(link);
    });
  }

  function renderPhotoCategoriesMobile(categories, grid) {
    grid.innerHTML = '';
    if (!Array.isArray(categories) || !categories.length) {
      window.FrenzyGalleryShared.renderEmpty(grid);
      return null;
    }

    const slidesData = window.FrenzyGalleryShared.splitIntoChunks(categories, 1);
    const carousel = document.createElement('div');
    carousel.className = 'gallery-photo-carousel';

    const track = document.createElement('div');
    track.className = 'gallery-photo-track';
    carousel.appendChild(track);

    slidesData.forEach((slideItems) => {
      const slide = document.createElement('section');
      slide.className = 'gallery-photo-slide';
      slideItems.forEach((category) => {
        const link = document.createElement('a');
        link.className = 'gallery-item gallery-category-card gallery-photo-card';
        link.href = `/gallery/${encodeURIComponent(category.slug)}/`;
        link.setAttribute('aria-label', `View ${category.title} photos`);

        const mediaWrap = document.createElement('div');
        mediaWrap.className = 'gallery-media';
        const img = document.createElement('img');
        img.src = category.coverImage || 'assets/posters/event-01.jpg';
        img.alt = `${category.title} photo gallery`;
        img.loading = 'lazy';
        img.decoding = 'async';
        mediaWrap.appendChild(img);

        const meta = document.createElement('div');
        meta.className = 'gallery-meta';
        const title = document.createElement('h4');
        title.textContent = category.title;
        const desc = document.createElement('p');
        desc.className = 'gallery-category-desc';
        desc.textContent = category.description || 'View this photo category';
        meta.appendChild(title);
        meta.appendChild(desc);

        link.appendChild(mediaWrap);
        link.appendChild(meta);
        slide.appendChild(link);
      });
      track.appendChild(slide);
    });

    let current = 0;
    let autoTimer = null;
    let resumeTimer = null;
    let dotsWrap = null;
    const autoIntervalMs = 2000;
    const autoPauseAfterSwipeMs = 10000;

    function goTo(index) {
      const bounded = Math.max(0, Math.min(index, slidesData.length - 1));
      current = bounded;
      track.style.transform = `translateX(-${current * 100}%)`;
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.slider-dot').forEach((dot, idx) => {
          dot.classList.toggle('active', idx === current);
        });
      }
    }

    function stopAuto() {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAuto() {
      if (slidesData.length <= 1) return;
      stopAuto();
      autoTimer = window.setInterval(() => {
        goTo(current < slidesData.length - 1 ? current + 1 : 0);
      }, autoIntervalMs);
    }

    function pauseAutoAfterSwipe() {
      stopAuto();
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => startAuto(), autoPauseAfterSwipeMs);
    }

    if (slidesData.length > 1) {
      dotsWrap = document.createElement('div');
      dotsWrap.className = 'slider-dots gallery-photo-dots';
      slidesData.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `slider-dot${idx === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Go to category ${idx + 1}`);
        dot.addEventListener('click', () => goTo(idx));
        dotsWrap.appendChild(dot);
      });
      carousel.appendChild(dotsWrap);

      let touchStartX = 0;
      let touchStartY = 0;
      let touchActive = false;
      const swipeThreshold = 40;

      track.addEventListener('touchstart', (event) => {
        if (!event.touches || event.touches.length !== 1) return;
        touchActive = true;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      }, { passive: true });

      track.addEventListener('touchend', (event) => {
        if (!touchActive || !event.changedTouches || event.changedTouches.length !== 1) return;
        touchActive = false;
        const dx = event.changedTouches[0].clientX - touchStartX;
        const dy = event.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dy) > Math.abs(dx)) return;
        if (Math.abs(dx) < swipeThreshold) return;
        if (dx < 0) goTo(current < slidesData.length - 1 ? current + 1 : 0);
        else goTo(current > 0 ? current - 1 : slidesData.length - 1);
        pauseAutoAfterSwipe();
      }, { passive: true });

      startAuto();
    }

    grid.appendChild(carousel);
    return () => {
      stopAuto();
      if (resumeTimer) window.clearTimeout(resumeTimer);
    };
  }

  function renderGallery(items, photoCategories, currentType, grid) {
    grid.innerHTML = '';
    if (currentType === 'photo') {
      if (getViewportMode() === 'mobile') {
        return renderPhotoCategoriesMobile(photoCategories, grid);
      }
      renderPhotoCategories(photoCategories, grid);
      return null;
    }

    const filtered = items.filter((item) => item.type === currentType);
    if (!filtered.length) {
      window.FrenzyGalleryShared.renderEmpty(grid);
      return null;
    }

    const viewportMode = getViewportMode();
    const behavior = getGalleryBehavior(currentType, viewportMode);
    return behavior.render(filtered, grid) || null;
  }

  function bindTabs(items, photoCategories, tabs, grid) {
    let currentType = 'photo';
    let cleanupRender = renderGallery(items, photoCategories, currentType, grid);

    let viewportMode = getViewportMode();
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const onViewportChange = () => {
      const nextMode = getViewportMode();
      if (nextMode === viewportMode) return;
      if (document.fullscreenElement) return;
      if (typeof cleanupRender === 'function') cleanupRender();
      viewportMode = nextMode;
      cleanupRender = renderGallery(items, photoCategories, currentType, grid);
    };
    if (typeof mediaQuery.addEventListener === 'function') mediaQuery.addEventListener('change', onViewportChange);
    else if (typeof mediaQuery.addListener === 'function') mediaQuery.addListener(onViewportChange);

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const nextType = tab.getAttribute('data-gallery-tab');
        if (!nextType || nextType === currentType) return;
        if (typeof cleanupRender === 'function') cleanupRender();
        currentType = nextType;
        tabs.forEach((btn) => {
          const isActive = btn === tab;
          btn.classList.toggle('is-active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        cleanupRender = renderGallery(items, photoCategories, currentType, grid);
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

  async function fetchPhotoCategories() {
    const response = await fetch('assets/data/photo-categories.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Photo categories request failed');
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Photo categories config must be an array');
    return data.filter((category) => category && category.slug && category.title);
  }

  async function initGallery() {
    if (isGalleryInit) return;
    const grid = document.getElementById('galleryGrid');
    const tabs = Array.from(document.querySelectorAll('#galleryTabs .gallery-tab'));
    if (!grid || !tabs.length) return;
    isGalleryInit = true;

    try {
      const [items, photoCategories] = await Promise.all([fetchGalleryConfig(), fetchPhotoCategories()]);
      bindTabs(items, photoCategories, tabs, grid);
    } catch (err) {
      grid.innerHTML = '';
      window.FrenzyGalleryShared.renderEmpty(grid);
    }
  }

  window.FrenzyGallery = { initGallery };
})();
