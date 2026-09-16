(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Resolve the old IntersectionObserver .reveal system first so it cannot
  // keep GSAP-controlled parents at opacity: 0.
  const revealNodes = document.querySelectorAll('.reveal');
  revealNodes.forEach(el => el.classList.add('visible'));

  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';

  if (!hasGSAP || reduceMotion) {
    document.documentElement.classList.add('motion-fallback');
    return;
  }

  document.documentElement.classList.add('gsap-ready');
  if (hasScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const hero = document.querySelector('.hero');
  const heroCopy = document.querySelector('.hero-copy');
  const heroArt = document.querySelector('.hero-art');
  const sun = document.querySelector('.sun');
  const mountains = document.querySelector('.mountains');
  const incense = document.querySelector('.incense-holder');
  const smoke = document.querySelector('.smoke-stage');
  const note = document.querySelector('.vertical-note');
  const cue = document.querySelector('.hero-scroll-cue');

  // Force a known visible baseline before creating the timeline.
  gsap.set([heroCopy, heroArt].filter(Boolean), { autoAlpha: 1 });

  // One master hero timeline.
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (heroCopy) {
    const heroItems = heroCopy.querySelectorAll('.eyebrow, h1, .hero-intro, .hero-actions, .hero-proof');
    tl.fromTo(heroItems,
      { y: 34, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: .9, stagger: .12, clearProps: 'transform,opacity,visibility' }
    );
  }
  if (heroArt) tl.fromTo(heroArt, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.1 }, '-=.95');
  if (sun) tl.fromTo(sun, { scale: .72, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.35 }, '-=.95');
  if (mountains) tl.fromTo(mountains, { y: 44, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.15 }, '-=1.1');
  if (incense) tl.fromTo(incense, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .85 }, '-=.9');
  if (smoke) tl.fromTo(smoke, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.1 }, '-=.5');
  if (note) tl.fromTo(note, { x: 12, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .8 }, '-=.8');
  if (cue) tl.fromTo(cue, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .7 }, '-=.45');

  // Ambient hero motion.
  if (sun) gsap.to(sun, { y: -10, x: 7, duration: 6.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
  if (incense) gsap.to(incense, { y: -4, duration: 4.8, ease: 'sine.inOut', repeat: -1, yoyo: true });
  if (cue) {
    const cueLine = cue.querySelector('i');
    if (cueLine) gsap.fromTo(cueLine, { scaleY: .25, opacity: .35 }, { scaleY: 1, opacity: 1, duration: 1.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
  }

  if (hasScrollTrigger) {
    const header = document.querySelector('.site-header');
    if (header) {
      ScrollTrigger.create({
        start: 40,
        onUpdate: self => header.classList.toggle('motion-scrolled', self.scroll() > 40)
      });
    }

    if (hero) {
      if (sun) gsap.to(sun, { yPercent: -22, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.1 } });
      if (mountains) gsap.to(mountains, { yPercent: 8, scale: 1.025, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.2 } });
      if (incense) gsap.to(incense, { yPercent: -9, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } });
      if (smoke) gsap.to(smoke, { yPercent: -12, xPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.2 } });
      if (heroCopy) gsap.to(heroCopy, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.3 } });
    }

    const storyImage = document.querySelector('.story-image');
    const storyCopy = document.querySelector('.story-copy');
    if (storyImage) {
      gsap.fromTo(storyImage, { x: -34, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: storyImage, start: 'top 82%', once: true } });
    }
    if (storyCopy) {
      gsap.fromTo(storyCopy.children, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8, stagger: .1, scrollTrigger: { trigger: storyCopy, start: 'top 80%', once: true } });
    }

    document.querySelectorAll('.section-heading, .finder-intro, .ritual-copy, .newsletter').forEach(section => {
      gsap.fromTo(section, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 84%', once: true } });
    });

    const cards = gsap.utils.toArray('.product-card');
    if (cards.length) {
      gsap.fromTo(cards, { y: 42, autoAlpha: 0, scale: .985 }, { y: 0, autoAlpha: 1, scale: 1, duration: .85, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '#productGrid', start: 'top 82%', once: true } });
    }

    const finderRows = gsap.utils.toArray('.finder-grid a');
    if (finderRows.length) {
      gsap.fromTo(finderRows, { x: 24, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .7, stagger: .1, ease: 'power2.out', scrollTrigger: { trigger: '.finder-grid', start: 'top 82%', once: true } });
    }

    const ritualSteps = gsap.utils.toArray('.ritual-steps li');
    if (ritualSteps.length) {
      gsap.fromTo(ritualSteps, { x: 28, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .75, stagger: .12, ease: 'power2.out', scrollTrigger: { trigger: '.ritual-steps', start: 'top 82%', once: true } });
    }

    const footer = document.querySelector('footer');
    if (footer) {
      gsap.fromTo(footer.children, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .7, stagger: .08, scrollTrigger: { trigger: footer, start: 'top 90%', once: true } });
    }

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  // Small pointer parallax, desktop only.
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (finePointer && heroArt) {
    const moveSunX = sun ? gsap.quickTo(sun, 'x', { duration: .8, ease: 'power3.out' }) : null;
    const moveSunY = sun ? gsap.quickTo(sun, 'y', { duration: .8, ease: 'power3.out' }) : null;
    const moveMountainX = mountains ? gsap.quickTo(mountains, 'x', { duration: 1, ease: 'power3.out' }) : null;

    heroArt.addEventListener('pointermove', event => {
      const rect = heroArt.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - .5;
      const ny = (event.clientY - rect.top) / rect.height - .5;
      moveSunX?.(nx * 12);
      moveSunY?.(ny * 8);
      moveMountainX?.(nx * -8);
    });

    heroArt.addEventListener('pointerleave', () => {
      moveSunX?.(0); moveSunY?.(0); moveMountainX?.(0);
    });
  }
})();
