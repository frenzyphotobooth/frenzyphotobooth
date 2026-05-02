(function () {
  let isVideoShowcaseInit = false;

  const FALLBACK_VIDEOS = [
    {
      title: 'Wedding Reactions',
      description: 'Guests laughing, props, and instant keepsake moments.',
      poster: 'logo.png',
      youtubeId: 'EsRnfCA5occ',
    },
    {
      title: '360 Booth Motion',
      description: 'Dynamic spins and cinematic movement built for sharing.',
      poster: 'logo.png',
      youtubeId: 'EsRnfCA5occ',
    },
    {
      title: 'Corporate Activation',
      description: 'Branded experiences that feel polished and social-ready.',
      poster: 'logo.png',
      youtubeId: 'EsRnfCA5occ',
    },
  ];

  function isValidVideoItem(item) {
    if (!item || typeof item !== 'object') return false;
    if (window.FrenzyConfigUtils.hasValidYouTubeId(item)) return true;
    if (window.FrenzyConfigUtils.hasValidSources(item)) return true;
    return false;
  }

  function buildVideoCard(item) {
    const card = document.createElement('article');
    card.className = 'video-card';

    if (item.youtubeId) {
      const iframe = window.FrenzyYouTubeUtils.createEmbedIframe(item.youtubeId, {
        className: 'video-card-embed',
        title: item.title || 'Event Clip',
        params: {
          autoplay: '0',
          mute: '0',
          controls: '1',
          enablejsapi: '1',
        },
      });
      card.appendChild(iframe);
    } else {
      const video = document.createElement('video');
      video.controls = true;
      video.preload = 'metadata';
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.poster = item.poster || 'logo.png';

      (item.sources || []).forEach((sourceItem) => {
        const source = document.createElement('source');
        source.src = sourceItem.src;
        source.type = sourceItem.type || 'video/mp4';
        video.appendChild(source);
      });
      card.appendChild(video);
    }

    const title = document.createElement('h4');
    title.textContent = item.title || 'Event Clip';

    const description = document.createElement('p');
    description.textContent = item.description || '';

    card.appendChild(title);
    card.appendChild(description);

    return card;
  }

  function renderVideoCards(items) {
    const track = document.getElementById('videoTrack');
    if (!track) return false;
    track.innerHTML = '';
    items.forEach((item) => track.appendChild(buildVideoCard(item)));
    return items.length > 0;
  }

  async function fetchVideoConfig() {
    try {
      const response = await fetch('assets/data/videos.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Config request failed');
      const data = await response.json();
      if (!Array.isArray(data) || !data.length) throw new Error('Config is empty');
      const validItems = data.filter(isValidVideoItem);
      if (!validItems.length) throw new Error('Config has no valid video items');
      return validItems;
    } catch (err) {
      return FALLBACK_VIDEOS;
    }
  }

  async function initVideoShowcase() {
    if (isVideoShowcaseInit) return;

    const items = await fetchVideoConfig();
    const hasItems = renderVideoCards(items);
    if (!hasItems) return;
    isVideoShowcaseInit = true;

    window.FrenzySlider.createSlider({
      trackId: 'videoTrack',
      dotsId: 'videoSliderDots',
      prevBtnId: 'videoPrevBtn',
      nextBtnId: 'videoNextBtn',
      cardSelector: '.video-card',
      autoAdvanceMs: 7000,
      pauseOnMediaPlay: true,
    });
  }

  window.FrenzyVideoShowcase = {
    initVideoShowcase,
  };
})();
