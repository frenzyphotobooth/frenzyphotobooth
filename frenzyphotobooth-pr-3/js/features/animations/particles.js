(function () {
  let isParticlesInit = false;

  function initParticles() {
    if (isParticlesInit) return;

    const container = document.getElementById('particles');
    if (!container) return;
    isParticlesInit = true;

    const colors = [
      'rgba(124,58,237,0.3)',
      'rgba(244,63,94,0.3)',
      'rgba(167,139,250,0.2)',
      'rgba(251,113,133,0.2)',
    ];

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 6 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 5) + 's';

      container.appendChild(particle);
    }
  }

  window.FrenzyParticles = {
    initParticles,
  };
})();
