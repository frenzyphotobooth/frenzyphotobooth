(function () {
  let isVideoShowcaseInit = false;

  const FALLBACK_VIDEOS = [
    {
      title: 'Wedding Reactions',
      description: 'Guests laughing, props, and instant keepsake moments.',
      poster: 'logo.png',
      sources: [{ src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', type: 'video/mp4' }],
    },
    {
      title: '360 Booth Motion',
      description: 'Dynamic spins and cinematic movement built for sharing.',
      poster: 'logo.png',
      sources: [{ src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', type: 'video/mp4' }],
    },
    {
      title: 'Corporate Activation',
      description: 'Branded experiences that feel polished and social-ready.',
      poster: 'logo.png',
      sources: [{ src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', type: 'video/mp4' }],
    },
  ];

  function buildVideoCard(item) {
    const card = document.createElement('article');
    card.className = 'video-card';

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

    const title = document.createElement('h4');
    title.textContent = item.title || 'Event Clip';

    const description = document.createElement('p');
    description.textContent = item.description || '';

    card.appendChild(video);
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
      return data;
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
