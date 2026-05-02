(function () {
  let isHomeVideoInit = false;

  const HOME_FALLBACK = {
    poster: 'logo.png',
    sources: [
      {
        src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        type: 'video/mp4',
      },
    ],
  };

  function applyYouTubeConfig(config) {
    const wrapper = document.querySelector('.home-video-wrap');
    if (!wrapper) return;

    const existingVideo = wrapper.querySelector('#homeVideo');
    const existingEmbed = wrapper.querySelector('.home-video-embed');
    if (existingEmbed) existingEmbed.remove();

    const iframe = window.FrenzyYouTubeUtils.createEmbedIframe(config.youtubeId, {
      className: 'home-video-embed',
      title: 'Frenzy Photobooth Hero Video',
      allow: 'autoplay; encrypted-media; picture-in-picture',
      tabIndex: -1,
      ariaHidden: true,
      params: {
        autoplay: '1',
        mute: '1',
        controls: '0',
        loop: '1',
        playlist: config.youtubeId,
        enablejsapi: '0',
        fs: '0',
        disablekb: '1',
        iv_load_policy: '3',
        cc_load_policy: '0',
      },
    });

    if (existingVideo) {
      existingVideo.style.display = 'none';
    }
    wrapper.appendChild(iframe);
  }

  function applyHomeVideoConfig(config) {
    if (config && config.youtubeId) {
      applyYouTubeConfig(config);
      return;
    }

    const homeVideo = document.getElementById('homeVideo');
    if (!homeVideo) return;

    homeVideo.style.display = '';
    homeVideo.innerHTML = '';
    homeVideo.poster = config.poster || 'logo.png';

    (config.sources || []).forEach((item) => {
      const source = document.createElement('source');
      source.src = item.src;
      source.type = item.type || 'video/mp4';
      homeVideo.appendChild(source);
    });

    homeVideo.load();
  }

  async function fetchHomeVideoConfig() {
    try {
      const response = await fetch('assets/data/home-video.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Home video config request failed');

      const data = await response.json();
      if (window.FrenzyConfigUtils.hasValidYouTubeId(data)) {
        return data;
      }
      if (window.FrenzyConfigUtils.hasValidSources(data)) {
        return data;
      }
      throw new Error('Home video config is invalid');
    } catch (err) {
      return HOME_FALLBACK;
    }
  }

  async function initHomeVideo() {
    if (isHomeVideoInit) return;

    const homeVideo = document.getElementById('homeVideo');
    if (!homeVideo) return;
    isHomeVideoInit = true;

    const config = await fetchHomeVideoConfig();
    applyHomeVideoConfig(config);
  }

  window.FrenzyHomeVideo = {
    initHomeVideo,
  };
})();
