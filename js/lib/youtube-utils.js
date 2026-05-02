(function () {
  const DEFAULT_EMBED_PARAMS = {
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  };

  function buildEmbedUrl(videoId, params) {
    const query = new URLSearchParams({
      ...DEFAULT_EMBED_PARAMS,
      ...(params || {}),
    });
    return `https://www.youtube.com/embed/${videoId}?${query.toString()}`;
  }

  function createEmbedIframe(videoId, options) {
    const opts = options || {};
    const iframe = document.createElement('iframe');
    iframe.className = opts.className || '';
    iframe.src = buildEmbedUrl(videoId, opts.params);
    iframe.title = opts.title || 'YouTube Video';
    iframe.setAttribute(
      'allow',
      opts.allow || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    );
    if (opts.allowFullscreen !== false) {
      iframe.setAttribute('allowfullscreen', '');
    }
    if (opts.tabIndex !== undefined) {
      iframe.setAttribute('tabindex', String(opts.tabIndex));
    }
    if (opts.ariaHidden === true) {
      iframe.setAttribute('aria-hidden', 'true');
    }
    return iframe;
  }

  window.FrenzyYouTubeUtils = {
    buildEmbedUrl,
    createEmbedIframe,
  };
})();
