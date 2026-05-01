(function () {
  let isSmoothScrollInit = false;

  function initSmoothAnchorScroll() {
    if (isSmoothScrollInit) return;

    const anchors = document.querySelectorAll('a[href^="#"]');
    if (!anchors.length) return;
    isSmoothScrollInit = true;

    anchors.forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  window.FrenzySmoothScroll = {
    initSmoothAnchorScroll,
  };
})();
