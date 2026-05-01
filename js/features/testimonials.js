(function () {
  let isTestimonialsInit = false;

  function initTestimonials() {
    if (isTestimonialsInit) return;
    isTestimonialsInit = true;

    window.FrenzySlider.createSlider({
      trackId: 'testimonialTrack',
      dotsId: 'sliderDots',
      prevBtnId: 'prevBtn',
      nextBtnId: 'nextBtn',
      cardSelector: '.testimonial-card',
      autoAdvanceMs: 5000,
    });
  }

  window.FrenzyTestimonials = {
    initTestimonials,
  };
})();
