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

  function applyHomeVideoConfig(config) {
    const homeVideo = document.getElementById('homeVideo');
    if (!homeVideo) return;

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
      if (!data || !Array.isArray(data.sources) || !data.sources.length) {
        throw new Error('Home video config missing sources');
      }

      return data;
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
