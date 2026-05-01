(function () {
  let isBookingFormInit = false;

  function hasFormDependencies() {
    return Boolean(
      window.FrenzyFormUI &&
      window.FrenzyFormValidation &&
      window.FrenzyFormSubmission &&
      typeof window.FrenzyFormUI.wireErrorClearOnInput === 'function' &&
      typeof window.FrenzyFormUI.hideStatus === 'function' &&
      typeof window.FrenzyFormUI.showErrorStatus === 'function' &&
      typeof window.FrenzyFormUI.showSuccessStatus === 'function' &&
      typeof window.FrenzyFormUI.setSubmitState === 'function' &&
      typeof window.FrenzyFormValidation.clearFieldErrors === 'function' &&
      typeof window.FrenzyFormValidation.validateBookingForm === 'function' &&
      typeof window.FrenzyFormSubmission.getPayload === 'function' &&
      typeof window.FrenzyFormSubmission.submitBookingForm === 'function'
    );
  }

  function initBookingForm() {
    if (isBookingFormInit) return;
    if (!hasFormDependencies()) {
      console.error('[Frenzy booking form] Missing form module dependencies');
      return;
    }

    const bookingForm = document.getElementById('bookingForm');
    const formStatus = document.getElementById('formStatus');
    if (!bookingForm || !formStatus) return;
    isBookingFormInit = true;

    window.FrenzyFormUI.wireErrorClearOnInput(bookingForm);

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      window.FrenzyFormValidation.clearFieldErrors(bookingForm);
      window.FrenzyFormUI.hideStatus(formStatus);

      const isValid = window.FrenzyFormValidation.validateBookingForm(bookingForm);
      if (!isValid) {
        window.FrenzyFormUI.showErrorStatus(formStatus, 'Please fill in all required fields correctly.');
        return;
      }

      const restoreSubmitState = window.FrenzyFormUI.setSubmitState(bookingForm, true);
      const payload = window.FrenzyFormSubmission.getPayload(bookingForm);

      try {
        await window.FrenzyFormSubmission.submitBookingForm(payload);
        window.FrenzyFormUI.showSuccessStatus(
          formStatus,
          "Success! Your message has been sent. We'll get back to you within 24 hours."
        );
        bookingForm.reset();
      } catch (err) {
        window.FrenzyFormUI.showErrorStatus(
          formStatus,
          'Something went wrong. Please try again or email us directly.'
        );
      }

      restoreSubmitState();
    });
  }

  window.FrenzyBookingForm = {
    initBookingForm,
  };
})();
