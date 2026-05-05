(function () {
  function renderVideoDesktop(videoItems, grid) {
    const shared = window.FrenzyGalleryShared;
    const slidesData = shared.splitIntoChunks(videoItems, 4);

    const carousel = document.createElement('div');
    carousel.className = 'gallery-video-carousel';

    const track = document.createElement('div');
    track.className = 'gallery-video-track';
    carousel.appendChild(track);

    slidesData.forEach((slideItems) => {
      const slide = document.createElement('section');
      slide.className = 'gallery-video-slide gallery-video-slide-desktop';

      const portraits = slideItems.filter(shared.isPortraitItem);
      const landscapes = slideItems.filter((item) => !shared.isPortraitItem(item));

      const leftCol = document.createElement('div');
      leftCol.className = 'gallery-video-column gallery-video-column-left';
      const middleCol = document.createElement('div');
      middleCol.className = 'gallery-video-column gallery-video-column-middle';
      const rightCol = document.createElement('div');
      rightCol.className = 'gallery-video-column gallery-video-column-right';

      const leftPortrait = portraits.shift() || null;
      const rightPortrait = portraits.shift() || null;
      const middleTop = landscapes.shift() || null;
      const middleBottom = landscapes.shift() || null;

      if (leftPortrait) {
        const card = shared.createMediaCard(leftPortrait);
        card.classList.add('layout-portrait');
        leftCol.appendChild(card);
      }
      [middleTop, middleBottom].forEach((item) => {
        if (!item) return;
        const card = shared.createMediaCard(item);
        card.classList.add('layout-landscape');
        middleCol.appendChild(card);
      });
      if (rightPortrait) {
        const card = shared.createMediaCard(rightPortrait);
        card.classList.add('layout-portrait');
        rightCol.appendChild(card);
      }

      const leftovers = [...portraits, ...landscapes];
      leftovers.forEach((item) => {
        const fallbackCard = shared.createMediaCard(item);
        fallbackCard.classList.add(shared.isPortraitItem(item) ? 'layout-portrait' : 'layout-landscape');
        if (middleCol.children.length < 2 && !shared.isPortraitItem(item)) {
          middleCol.appendChild(fallbackCard);
        } else if (!leftCol.children.length) {
          leftCol.appendChild(fallbackCard);
        } else {
          rightCol.appendChild(fallbackCard);
        }
      });

      slide.appendChild(leftCol);
      slide.appendChild(middleCol);
      slide.appendChild(rightCol);
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

    grid.appendChild(carousel);
  }

  window.FrenzyGalleryDesktop = {
    renderVideoDesktop,
  };
})();

