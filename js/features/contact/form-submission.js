(function () {
  const DEFAULT_CONFIG = {
    endpoint: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse',
    mode: 'no-cors',
    fields: {
      name: 'entry.XXXXX1',
      email: 'entry.XXXXX2',
      phone: 'entry.XXXXX3',
      eventDate: 'entry.XXXXX4',
      eventType: 'entry.XXXXX5',
      message: 'entry.XXXXX6',
    },
  };
  const REQUIRED_FIELD_KEYS = ['name', 'email', 'phone', 'eventDate', 'eventType', 'message'];
  let cachedConfig = null;

  function normalizeMode(mode) {
    return mode === 'cors' ? 'cors' : 'no-cors';
  }

  function getPayload(form) {
    return {
      name: form.querySelector('#form-name')?.value || '',
      email: form.querySelector('#form-email')?.value || '',
      phone: form.querySelector('#form-phone')?.value || '',
      eventDate: form.querySelector('#form-date')?.value || '',
      eventType: form.querySelector('#form-event-type')?.value || '',
      message: form.querySelector('#form-message')?.value || '',
    };
  }

  function toGoogleFormData(payload, fieldMap) {
    const formData = new FormData();
    Object.keys(fieldMap).forEach((key) => {
      const entryId = fieldMap[key];
      if (!entryId) return;
      formData.append(entryId, payload[key] || '');
    });
    return formData;
  }

  async function fetchContactFormConfig() {
    if (cachedConfig) return cachedConfig;
    try {
      const response = await fetch('/assets/data/contact-form.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Contact form config request failed');
      const data = await response.json();
      if (
        !data ||
        !window.FrenzyConfigUtils.isNonEmptyString(data.endpoint) ||
        !window.FrenzyConfigUtils.isValidFieldMap(data.fields, REQUIRED_FIELD_KEYS)
      ) {
        throw new Error('Invalid contact form config');
      }
      cachedConfig = {
        endpoint: data.endpoint.trim(),
        mode: normalizeMode(data.mode),
        fields: data.fields,
      };
      return cachedConfig;
    } catch (err) {
      cachedConfig = DEFAULT_CONFIG;
      return cachedConfig;
    }
  }

  async function submitBookingForm(payload) {
    const config = await fetchContactFormConfig();
    const formData = toGoogleFormData(payload, config.fields);
    await fetch(config.endpoint, {
      method: 'POST',
      body: formData,
      mode: config.mode || 'no-cors',
    });
  }

  window.FrenzyFormSubmission = {
    getPayload,
    submitBookingForm,
    fetchContactFormConfig,
  };
})();
