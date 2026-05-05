(function () {
  const posterCache = new Map();

  function isNonEmptyString(value) {
    return window.FrenzyMediaUtils.isNonEmptyString(value);
  }

  function generatePosterFromVideo(src) {
    if (!isNonEmptyString(src)) return Promise.resolve('');
    if (posterCache.has(src)) return posterCache.get(src);

    const task = new Promise((resolve) => {
      const probe = document.createElement('video');
      probe.preload = 'metadata';
      probe.muted = true;
      probe.playsInline = true;
      probe.crossOrigin = 'anonymous';
      probe.src = src;

      const fail = () => resolve('');

      probe.addEventListener('error', fail, { once: true });
      function captureFrame() {
        try {
          const w = probe.videoWidth || 0;
          const h = probe.videoHeight || 0;
          if (!w || !h) return fail();
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return fail();
          ctx.drawImage(probe, 0, 0, w, h);

          const sampleW = Math.min(80, w);
          const sampleH = Math.min(80, h);
          const data = ctx.getImageData(0, 0, sampleW, sampleH).data;
          let sum = 0;
          for (let i = 0; i < data.length; i += 4) {
            sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
          }
          const avgBrightness = sum / (data.length / 4);
          if (avgBrightness < 12) return '';

          return canvas.toDataURL('image/jpeg', 0.82);
        } catch (_) {
          return '';
        }
      }

      probe.addEventListener(
        'loadedmetadata',
        () => {
          const duration = Number.isFinite(probe.duration) ? probe.duration : 0;
          const candidates = duration > 0
            ? [Math.min(0.8, duration * 0.08), duration * 0.22, duration * 0.45, duration * 0.7]
            : [0];
          let idx = 0;

          function tryNextCapture() {
            if (idx >= candidates.length) {
              resolve('');
              return;
            }
            const target = candidates[idx++];
            const onSeeked = () => {
              const poster = captureFrame();
              if (poster) resolve(poster);
              else tryNextCapture();
            };
            probe.addEventListener('seeked', onSeeked, { once: true });
            try {
              probe.currentTime = Math.max(0, Math.min(target, Math.max(duration - 0.05, 0)));
            } catch (_) {
              const poster = captureFrame();
              if (poster) resolve(poster);
              else tryNextCapture();
            }
          }

          if (duration > 0) {
            tryNextCapture();
          } else {
            probe.addEventListener('loadeddata', () => {
              const poster = captureFrame();
              resolve(poster || '');
            }, { once: true });
          }
        },
        { once: true }
      );
    });

    posterCache.set(src, task);
    return task;
  }

  function createMediaCard(item) {
    const card = document.createElement('article');
    card.className = 'gallery-item';
    card.classList.add(`gallery-item-${item.type}`);
    if (isNonEmptyString(item.sourceType)) {
      card.classList.add(`gallery-source-${item.sourceType}`);
    }

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'gallery-media';
    if (isNonEmptyString(item.aspectRatio)) {
      mediaWrap.style.setProperty('--gallery-media-ratio', item.aspectRatio);
    }
    if (item.orientation === 'portrait') {
      card.classList.add('is-portrait');
    }

    if (item.type === 'photo') {
      const img = document.createElement('img');
      img.src = item.thumb || item.src;
      img.alt = item.alt || item.title || 'Gallery photo';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('load', () => {
        if (!item.orientation && img.naturalHeight > img.naturalWidth) {
          card.classList.add('is-portrait');
        }
      });
      mediaWrap.appendChild(img);
    } else if (item.sourceType === 'youtube' && isNonEmptyString(item.videoId)) {
      const iframe = window.FrenzyMediaUtils.createYouTubeEmbed(item.videoId, {
        className: 'gallery-video-embed',
        title: item.title || 'Gallery video',
        allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
        params: {
          rel: '0',
          modestbranding: '1',
          playsinline: '1',
          autoplay: '0',
          mute: '0',
          controls: '1',
          enablejsapi: '1',
        },
      });
      if (iframe) mediaWrap.appendChild(iframe);
    } else if (item.sourceType === 'drive' && isNonEmptyString(item.src)) {
      const iframe = window.FrenzyMediaUtils.createDriveEmbed(item.src, {
        className: 'gallery-video-embed',
        title: item.title || 'Gallery video',
      });
      if (iframe) mediaWrap.appendChild(iframe);
    } else if (item.sourceType === 'local' && isNonEmptyString(item.src)) {
      const video = window.FrenzyMediaUtils.createLocalVideo({
        src: item.src,
        type: item.mimeType || 'video/mp4',
        controls: true,
        preload: 'metadata',
        muted: false,
        autoplay: false,
        loop: false,
        poster: isNonEmptyString(item.thumb) ? item.thumb : '',
      });
      if (!isNonEmptyString(item.thumb)) {
        generatePosterFromVideo(item.src).then((poster) => {
          if (poster) video.poster = poster;
        });
      }

      video.addEventListener('loadedmetadata', () => {
        if (!item.orientation && video.videoHeight > video.videoWidth) {
          card.classList.add('is-portrait');
        }
      });

      video.addEventListener('error', () => {
        mediaWrap.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.className = 'gallery-placeholder';
        placeholder.textContent = 'This local video format is not supported in this browser. Use H.264 MP4 for best compatibility.';
        mediaWrap.appendChild(placeholder);
      });

      mediaWrap.appendChild(video);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'gallery-placeholder';
      placeholder.textContent = item.description || 'Video source not configured yet.';
      mediaWrap.appendChild(placeholder);
    }

    card.appendChild(mediaWrap);

    if (isNonEmptyString(item.title)) {
      const meta = document.createElement('div');
      meta.className = 'gallery-meta';
      const title = document.createElement('h4');
      title.textContent = item.title;
      meta.appendChild(title);

      if (isNonEmptyString(item.sourceType)) {
        const badge = document.createElement('span');
        badge.className = 'gallery-badge';
        badge.textContent = item.sourceType.toUpperCase();
        meta.appendChild(badge);
      }
      card.appendChild(meta);
    }

    return card;
  }

  function splitIntoChunks(items, size) {
    const chunks = [];
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size));
    }
    return chunks;
  }

  function isPortraitItem(item) {
    if (item.orientation === 'portrait') return true;
    if (!isNonEmptyString(item.aspectRatio)) return false;
    const match = item.aspectRatio.match(/(\d+)\s*\/\s*(\d+)/);
    if (!match) return false;
    const w = Number(match[1]);
    const h = Number(match[2]);
    return Number.isFinite(w) && Number.isFinite(h) && h > w;
  }

  function stopMediaInContainer(container) {
    container.querySelectorAll('video').forEach((video) => {
      if (!video.paused) video.pause();
    });
    container.querySelectorAll('iframe').forEach((iframe) => {
      if (!iframe.contentWindow) return;
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'stopVideo', args: [] }), '*');
    });
  }

  function renderPhotoGrid(items, grid) {
    items.forEach((item) => grid.appendChild(createMediaCard(item)));
  }

  function renderEmpty(grid) {
    const empty = document.createElement('p');
    empty.className = 'gallery-empty';
    empty.textContent = 'No media in this section yet.';
    grid.appendChild(empty);
  }

  window.FrenzyGalleryShared = {
    isNonEmptyString,
    createMediaCard,
    splitIntoChunks,
    isPortraitItem,
    stopMediaInContainer,
    renderPhotoGrid,
    renderEmpty,
  };
})();

