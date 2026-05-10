(function () {
  function initFloatingQuote() {
    var button = document.querySelector('.floating-quote-btn');
    if (!button) return;

    var threshold = 200;
    var scrollingTimer = null;

    function updateVisibility() {
      var isVisible = window.scrollY > threshold;
      button.classList.toggle('is-visible', isVisible);
    }

    function markScrolling() {
      button.classList.add('is-scrolling');
      if (scrollingTimer) window.clearTimeout(scrollingTimer);
      scrollingTimer = window.setTimeout(function () {
        button.classList.remove('is-scrolling');
      }, 180);
    }

    updateVisibility();
    window.addEventListener('scroll', function () {
      updateVisibility();
      markScrolling();
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingQuote);
  } else {
    initFloatingQuote();
  }
})();
