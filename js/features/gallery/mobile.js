(function () {
  function renderPhotoMobile(photoItems, grid) {
    const shared = window.FrenzyGalleryShared;
    const slidesData = shared.splitIntoChunks(photoItems, 1);

    const carousel = document.createElement('div');
    carousel.className = 'gallery-photo-carousel';

    const track = document.createElement('div');
    track.className = 'gallery-photo-track';
    carousel.appendChild(track);

    slidesData.forEach((slideItems) => {
      const slide = document.createElement('section');
      slide.className = 'gallery-photo-slide';
      slideItems.forEach((item) => {
        const card = shared.createMediaCard(item);
        card.classList.add('gallery-photo-card');
        slide.appendChild(card);
      });
      track.appendChild(slide);
    });

    let current = 0;
    let autoTimer = null;
    let resumeTimer = null;
    let dotsWrap = null;
    const autoIntervalMs = 2000;
    const autoPauseAfterSwipeMs = 10000;

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
      resumeTimer = window.setTimeout(() => {
        startAuto();
      }, autoPauseAfterSwipeMs);
    }

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

    if (slidesData.length > 1) {
      dotsWrap = document.createElement('div');
      dotsWrap.className = 'slider-dots gallery-photo-dots';
      slidesData.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `slider-dot${idx === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Go to gallery photo ${idx + 1}`);
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
      if (resumeTimer) {
        window.clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    };
  }

  function renderVideoMobile(videoItems, grid) {
    const shared = window.FrenzyGalleryShared;
    const slidesData = shared.splitIntoChunks(videoItems, 1);

    const carousel = document.createElement('div');
    carousel.className = 'gallery-video-carousel';

    const track = document.createElement('div');
    track.className = 'gallery-video-track';
    carousel.appendChild(track);

    slidesData.forEach((slideItems) => {
      const slide = document.createElement('section');
      slide.className = 'gallery-video-slide gallery-video-slide-mobile';
      slideItems.forEach((item) => {
        const card = shared.createMediaCard(item);
        card.classList.add(shared.isPortraitItem(item) ? 'layout-portrait' : 'layout-landscape');
        slide.appendChild(card);
      });
      track.appendChild(slide);
    });

    let current = 0;
    let dotsWrap = null;

    function goTo(index) {
      const bounded = Math.max(0, Math.min(index, slidesData.length - 1));
      current = bounded;
      track.style.transform = `translateX(-${current * 100}%)`;
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.slider-dot').forEach((dot, idx) => {
          dot.classList.toggle('active', idx === current);
        });
      }
      shared.stopMediaInContainer(track);
    }

    if (slidesData.length > 1) {
      const controls = document.createElement('div');
      controls.className = 'slider-controls gallery-video-controls';

      const prev = document.createElement('button');
      prev.className = 'slider-btn prev';
      prev.type = 'button';
      prev.setAttribute('aria-label', 'Previous gallery videos');
      prev.textContent = '←';

      const next = document.createElement('button');
      next.className = 'slider-btn next';
      next.type = 'button';
      next.setAttribute('aria-label', 'Next gallery videos');
      next.textContent = '→';

      dotsWrap = document.createElement('div');
      dotsWrap.className = 'slider-dots';
      slidesData.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `slider-dot${idx === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Go to gallery slide ${idx + 1}`);
        dot.addEventListener('click', () => goTo(idx));
        dotsWrap.appendChild(dot);
      });

      prev.addEventListener('click', () => goTo(current > 0 ? current - 1 : slidesData.length - 1));
      next.addEventListener('click', () => goTo(current < slidesData.length - 1 ? current + 1 : 0));

      controls.appendChild(prev);
      controls.appendChild(dotsWrap);
      controls.appendChild(next);
      carousel.appendChild(controls);
    }

    if (slidesData.length > 1) {
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
      }, { passive: true });
    }

    grid.appendChild(carousel);
  }

  window.FrenzyGalleryMobile = {
    renderPhotoMobile,
    renderVideoMobile,
  };
})();
