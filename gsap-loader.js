(() => {
  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });

  async function loadFirst(urls, test) {
    if (test()) return;
    for (const url of urls) {
      try {
        await loadScript(url);
        if (test()) return;
      } catch (error) {
        console.warn(error.message);
      }
    }
    throw new Error('All animation CDN sources failed.');
  }

  async function start() {
    try {
      await loadFirst([
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js',
        'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js'
      ], () => typeof window.gsap !== 'undefined');

      await loadFirst([
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js',
        'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js'
      ], () => typeof window.ScrollTrigger !== 'undefined');

      await loadScript('motion.js?v=20260916-2');
    } catch (error) {
      console.warn('GSAP unavailable; using CSS fallback.', error);
      document.documentElement.classList.add('motion-fallback');
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }
  }

  start();
})();
