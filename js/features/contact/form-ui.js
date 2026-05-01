(function () {
  function hideStatus(statusEl) {
    statusEl.hidden = true;
  }

  function showErrorStatus(statusEl, message) {
    statusEl.hidden = false;
    statusEl.className = 'form-status error-msg';
    statusEl.textContent = message;
  }

  function showSuccessStatus(statusEl, message) {
    statusEl.hidden = false;
    statusEl.className = 'form-status success';
    statusEl.textContent = message;
  }

  function setSubmitState(form, isSubmitting) {
    const submitBtn = form.querySelector('.btn-submit');
    if (!submitBtn) return () => {};

    const originalText = submitBtn.textContent;
    if (isSubmitting) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }

    return function restoreSubmitState() {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    };
  }

  function wireErrorClearOnInput(form) {
    form.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }

  window.FrenzyFormUI = {
    hideStatus,
    showErrorStatus,
    showSuccessStatus,
    setSubmitState,
    wireErrorClearOnInput,
  };
})();
