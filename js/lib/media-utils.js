(function () {
  function isNonEmptyString(value) {
    if (window.FrenzyConfigUtils && typeof window.FrenzyConfigUtils.isNonEmptyString === 'function') {
      return window.FrenzyConfigUtils.isNonEmptyString(value);
    }
    return typeof value === 'string' && value.trim().length > 0;
  }

  function createYouTubeEmbed(videoId, options) {
    if (!window.FrenzyYouTubeUtils || !isNonEmptyString(videoId)) return null;
    const opts = options || {};
    return window.FrenzyYouTubeUtils.createEmbedIframe(videoId, {
      className: opts.className || '',
      title: opts.title || 'YouTube Video',
      allow: opts.allow,
      params: opts.params,
      allowFullscreen: opts.allowFullscreen,
      tabIndex: opts.tabIndex,
      ariaHidden: opts.ariaHidden,
    });
  }

  function createDriveEmbed(src, options) {
    if (!isNonEmptyString(src)) return null;
    const opts = options || {};
    const iframe = document.createElement('iframe');
    iframe.className = opts.className || '';
    iframe.src = src;
    iframe.allow = opts.allow || 'autoplay; encrypted-media; picture-in-picture';
    iframe.loading = opts.loading || 'lazy';
    iframe.title = opts.title || 'Embedded Video';
    iframe.referrerPolicy = opts.referrerPolicy || 'strict-origin-when-cross-origin';
    if (opts.allowFullscreen !== false) iframe.setAttribute('allowfullscreen', '');
    return iframe;
  }

  function createLocalVideo(options) {
    const opts = options || {};
    const video = document.createElement('video');
    video.className = opts.className || '';
    video.controls = opts.controls !== false;
    video.preload = opts.preload || 'metadata';
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.muted = Boolean(opts.muted);
    video.autoplay = Boolean(opts.autoplay);
    video.loop = Boolean(opts.loop);
    if (isNonEmptyString(opts.poster)) video.poster = opts.poster;

    if (Array.isArray(opts.sources) && opts.sources.length) {
      opts.sources.forEach((item) => {
        if (!item || !isNonEmptyString(item.src)) return;
        const source = document.createElement('source');
        source.src = item.src;
        source.type = item.type || 'video/mp4';
        video.appendChild(source);
      });
    } else if (isNonEmptyString(opts.src)) {
      const source = document.createElement('source');
      source.src = opts.src;
      source.type = opts.type || 'video/mp4';
      video.appendChild(source);
    }

    return video;
  }

  window.FrenzyMediaUtils = {
    isNonEmptyString,
    createYouTubeEmbed,
    createDriveEmbed,
    createLocalVideo,
  };
})();

