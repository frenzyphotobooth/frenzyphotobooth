(function () {
  function clearIntervalSafe(id) {
    if (id) clearInterval(id);
  }

  function createSlider(config) {
    const track = document.getElementById(config.trackId);
    const dotsContainer = document.getElementById(config.dotsId);
    const prevBtn = document.getElementById(config.prevBtnId);
    const nextBtn = document.getElementById(config.nextBtnId);

    if (!track || !dotsContainer || !prevBtn || !nextBtn) return null;
    if (track.__frenzySlider && typeof track.__frenzySlider.destroy === 'function') {
      track.__frenzySlider.destroy();
    }

    const cards = track.querySelectorAll(config.cardSelector);
    if (!cards.length) return null;

    dotsContainer.innerHTML = '';
    let current = 0;
    let mediaIsPlaying = false;
    let autoSlide = null;
    const cleanups = [];

    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      const onDotClick = () => goTo(i);
      dot.addEventListener('click', onDotClick);
      cleanups.push(() => dot.removeEventListener('click', onDotClick));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    const onPrevClick = () => goTo(current > 0 ? current - 1 : cards.length - 1);
    const onNextClick = () => goTo(current < cards.length - 1 ? current + 1 : 0);
    prevBtn.addEventListener('click', onPrevClick);
    nextBtn.addEventListener('click', onNextClick);
    cleanups.push(() => prevBtn.removeEventListener('click', onPrevClick));
    cleanups.push(() => nextBtn.removeEventListener('click', onNextClick));

    if (config.autoAdvanceMs) {
      if (config.pauseOnMediaPlay) {
        track.querySelectorAll('video').forEach((video) => {
          const onPlay = () => {
            mediaIsPlaying = true;
          };
          const onPause = () => {
            mediaIsPlaying = false;
          };
          const onEnded = () => {
            mediaIsPlaying = false;
          };
          video.addEventListener('play', onPlay);
          video.addEventListener('pause', onPause);
          video.addEventListener('ended', onEnded);
          cleanups.push(() => video.removeEventListener('play', onPlay));
          cleanups.push(() => video.removeEventListener('pause', onPause));
          cleanups.push(() => video.removeEventListener('ended', onEnded));
        });
      }

      autoSlide = setInterval(() => {
        if (mediaIsPlaying) return;
        goTo(current < cards.length - 1 ? current + 1 : 0);
      }, config.autoAdvanceMs);

      const onMouseEnter = () => clearIntervalSafe(autoSlide);
      const onMouseLeave = () => {
        autoSlide = setInterval(() => {
          if (mediaIsPlaying) return;
          goTo(current < cards.length - 1 ? current + 1 : 0);
        }, config.autoAdvanceMs);
      };
      track.addEventListener('mouseenter', onMouseEnter);
      track.addEventListener('mouseleave', onMouseLeave);
      cleanups.push(() => track.removeEventListener('mouseenter', onMouseEnter));
      cleanups.push(() => track.removeEventListener('mouseleave', onMouseLeave));
    }

    const instance = {
      goTo,
      destroy() {
        clearIntervalSafe(autoSlide);
        cleanups.forEach((fn) => fn());
        dotsContainer.innerHTML = '';
        if (track.__frenzySlider === instance) {
          track.__frenzySlider = null;
        }
      },
    };
    track.__frenzySlider = instance;
    return instance;
  }

  window.FrenzySlider = {
    createSlider,
  };
})();
