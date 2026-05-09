(function () {
  const webAppUrl = window.FRENZY_GALLERY_WEBAPP_URL || '';
  const grid = document.getElementById('driveCategoryGrid');
  const backLink = document.getElementById('galleryBackLink');
  if (!grid) return;

  if (backLink) {
    backLink.addEventListener('click', (event) => {
      event.preventDefault();
      const fallbackHref = backLink.getAttribute('href') || '/#gallery';
      let referrerUrl = null;
      try {
        referrerUrl = document.referrer ? new URL(document.referrer) : null;
      } catch (_) {
        referrerUrl = null;
      }

      const sameOriginReferrer = referrerUrl && referrerUrl.origin === window.location.origin;
      const referrerIsHome =
        sameOriginReferrer &&
        (referrerUrl.pathname === '/' || referrerUrl.pathname === '/index.html');

      if (referrerIsHome) {
        window.location.href = '/#gallery';
        return;
      }
      if (window.history.length > 1 && referrerUrl) {
        window.history.back();
        return;
      }
      window.location.href = fallbackHref;
    });
  }

  const folderId = grid.getAttribute('data-drive-folder-id');
  const categorySlug = (grid.getAttribute('data-category-slug') || '').trim().toLowerCase();
  const categoryTitle = grid.getAttribute('data-category-title') || 'Gallery';
  const fallbackUrl = grid.getAttribute('data-drive-fallback-url') || '';
  const cacheKey = 'frenzy_drive_gallery_cache_v2';
  const cacheTtlMs = 30 * 60 * 1000;

  function createPhotoCard(fileId, alt) {
    const trigger = document.createElement('button');
    trigger.className = 'gallery-item gallery-photo-trigger';
    trigger.type = 'button';
    trigger.setAttribute('data-full-src', `https://drive.google.com/thumbnail?id=${fileId}&sz=w1800`);
    trigger.setAttribute('data-alt', alt);

    const media = document.createElement('div');
    media.className = 'gallery-media';
    const img = document.createElement('img');
    const thumbBase = `https://drive.google.com/thumbnail?id=${fileId}&sz=w480`;
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.dataset.retryBase = thumbBase;
    img.dataset.retryCount = '0';
    img.dataset.loaded = 'false';
    img.addEventListener('error', () => {
      const current = Number(img.dataset.retryCount || '0');
      if (current >= 3) return;
      const next = current + 1;
      img.dataset.retryCount = String(next);
      const baseDelayMs = next === 1 ? 1200 : next === 2 ? 2600 : 5000;
      const jitterMs = Math.floor(Math.random() * 700);
      window.setTimeout(() => {
        img.src = `${img.dataset.retryBase}&retry=${Date.now()}-${next}`;
      }, baseDelayMs + jitterMs);
    });
    media.appendChild(img);
    trigger.appendChild(media);
    return trigger;
  }

  function renderError(message) {
    grid.innerHTML = '';
    const empty = document.createElement('p');
    empty.className = 'gallery-empty';
    empty.textContent = message;
    grid.appendChild(empty);
    if (fallbackUrl) {
      const linkRow = document.createElement('p');
      linkRow.className = 'gallery-drive-link-row';
      const link = document.createElement('a');
      link.href = fallbackUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Open folder';
      linkRow.appendChild(link);
      grid.appendChild(linkRow);
    }
  }

  function readCached() {
    try {
      const raw = window.localStorage.getItem(cacheKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.timestamp || !parsed.byFolder) return null;
      if ((Date.now() - parsed.timestamp) > cacheTtlMs) return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function writeCached(payload) {
    try {
      window.localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        byFolder: payload.byFolder || {},
      }));
    } catch (_) {
      // Ignore storage write failures.
    }
  }

  async function fetchCategoryFilesFromWebApp(slug) {
    if (!webAppUrl || !slug) return null;
    const url = new URL(webAppUrl);
    url.searchParams.set('category', slug);

    const response = await fetch(url.toString(), { cache: 'no-store' });
    if (!response.ok) throw new Error('Gallery Web App request failed');
    const payload = await response.json();
    const photos = Array.isArray(payload.photos) ? payload.photos : [];
    return photos.map((p) => ({
      id: p.id || '',
      name: p.name || '',
    })).filter((p) => p.id);
  }

  async function getFolderFiles() {
    const cached = readCached();
    const cacheEntryKey = categorySlug || folderId;
    if (cached && cached.byFolder && Array.isArray(cached.byFolder[cacheEntryKey])) {
      return cached.byFolder[cacheEntryKey];
    }

    const files = await fetchCategoryFilesFromWebApp(categorySlug);
    const nextCache = cached && cached.byFolder ? cached : { byFolder: {} };
    nextCache.byFolder[cacheEntryKey] = files;
    writeCached(nextCache);
    return files;
  }

  function initLightbox() {
    const dialog = document.getElementById('galleryLightbox');
    if (!dialog) return;
    const image = dialog.querySelector('.gallery-lightbox-image');
    const closeBtn = dialog.querySelector('.gallery-lightbox-close');
    let savedScrollY = 0;

    function openLightbox(src, alt) {
      image.src = src;
      image.alt = alt || 'Gallery photo';
      savedScrollY = window.scrollY || window.pageYOffset || 0;
      dialog.showModal();
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      dialog.close();
      image.src = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, savedScrollY);
    }

    closeBtn.addEventListener('click', closeLightbox);
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeLightbox();
    });
    dialog.addEventListener('cancel', closeLightbox);

    const triggers = Array.from(document.querySelectorAll('.gallery-photo-trigger'));
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        openLightbox(trigger.getAttribute('data-full-src'), trigger.getAttribute('data-alt'));
      });
    });
  }

  async function loadDrivePhotos() {
    if (!folderId) {
      renderError('This gallery is not configured yet.');
      return;
    }
    if (!webAppUrl) {
      renderError('Gallery source not configured. Set Apps Script Web App URL.');
      return;
    }

    const files = await getFolderFiles();
    grid.innerHTML = '';
    if (!files.length) {
      renderError('No photos found in this category yet.');
      return;
    }

    const initialCount = 6;
    files.forEach((file, index) => {
      const alt = file.name || `${categoryTitle} photo ${index + 1}`;
      const card = createPhotoCard(file.id, alt);
      const img = card.querySelector('img');
      if (img) {
        if (index < initialCount) {
          img.src = `${img.dataset.retryBase}&eager=${index}`;
          img.dataset.loaded = 'true';
        } else {
          img.dataset.defer = 'true';
        }
      }
      grid.appendChild(card);
    });

    const deferredImages = Array.from(grid.querySelectorAll('img[data-defer="true"]'));
    if (deferredImages.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          if (!(img instanceof HTMLImageElement)) return;
          if (img.dataset.loaded === 'true') {
            observer.unobserve(img);
            return;
          }
          img.src = `${img.dataset.retryBase}&lazy=${Date.now()}`;
          img.dataset.loaded = 'true';
          observer.unobserve(img);
        });
      }, { rootMargin: '300px 0px' });
      deferredImages.forEach((img) => observer.observe(img));
    }

    initLightbox();
  }

  loadDrivePhotos().catch(() => {
    renderError('Could not load photos right now.');
  });
})();
