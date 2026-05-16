(function () {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function clearFieldErrors(form) {
    form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
  }

  function validateBookingForm(form) {
    let isValid = true;

    form.querySelectorAll('[required]').forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      }
    });

    const emailField = form.querySelector('#form-email');
    if (emailField && emailField.value && !EMAIL_REGEX.test(emailField.value)) {
      emailField.classList.add('error');
      isValid = false;
    }

    return isValid;
  }

  window.FrenzyFormValidation = {
    clearFieldErrors,
    validateBookingForm,
  };
})();
