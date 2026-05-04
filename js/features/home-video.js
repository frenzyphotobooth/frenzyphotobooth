(function () {
  let isHomeVideoInit = false;
  let teardownPlaylist = null;

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

    if (teardownPlaylist) {
      teardownPlaylist();
      teardownPlaylist = null;
    }

    homeVideo.style.display = '';
    homeVideo.innerHTML = '';
    homeVideo.classList.remove('is-portrait');
    homeVideo.poster = config.poster || 'logo.png';

    const updateVideoFraming = () => {
      if (!homeVideo.videoWidth || !homeVideo.videoHeight) return;
      const isPortrait = homeVideo.videoHeight > homeVideo.videoWidth;
      homeVideo.classList.toggle('is-portrait', isPortrait);
    };

    const sources = Array.isArray(config.sources) ? config.sources.filter((item) => item && item.src) : [];
    if (!sources.length) return;

    if (sources.length === 1) {
      const source = document.createElement('source');
      source.src = sources[0].src;
      source.type = sources[0].type || 'video/mp4';
      homeVideo.appendChild(source);
      homeVideo.loop = true;
      homeVideo.addEventListener('loadedmetadata', updateVideoFraming);
      homeVideo.load();
      teardownPlaylist = () => {
        homeVideo.removeEventListener('loadedmetadata', updateVideoFraming);
      };
      return;
    }

    let currentIndex = 0;
    const setCurrentSource = (index) => {
      const current = sources[index];
      homeVideo.src = current.src;
      homeVideo.type = current.type || 'video/mp4';
      homeVideo.load();
      const playPromise = homeVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    };

    const onEnded = () => {
      currentIndex = (currentIndex + 1) % sources.length;
      setCurrentSource(currentIndex);
    };

    homeVideo.loop = false;
    homeVideo.addEventListener('loadedmetadata', updateVideoFraming);
    homeVideo.addEventListener('ended', onEnded);
    setCurrentSource(0);

    teardownPlaylist = () => {
      homeVideo.removeEventListener('loadedmetadata', updateVideoFraming);
      homeVideo.removeEventListener('ended', onEnded);
    };
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
