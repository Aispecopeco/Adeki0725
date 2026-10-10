/* Product-led chapter navigation and real-photo views. No purchase state is duplicated. */
(() => {
  if (window.TaVieEditorial) return;
  const instances = new Map();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function mount(root) {
    if (instances.has(root)) return;
    const controller = new AbortController();
    const { signal } = controller;
    const observers = [];
    const chapters = [...root.querySelectorAll('[data-editorial-chapter]')];
    const nav = root.querySelector('[data-editorial-nav]');
    const navLinks = nav ? [...nav.querySelectorAll('[data-editorial-jump]')] : [];
    const progress = root.querySelector('[data-editorial-progress]');
    let frame = 0;

    function stickyOffset() {
      const header = document.querySelector('[data-header-height]') || document.querySelector('.header__wrapper') || document.querySelector('[data-section-type="header"]');
      if (!header) return 0;
      const rect = header.getBoundingClientRect();
      const style = getComputedStyle(header);
      const wrapper = header.closest('[data-header-wrapper]');
      if (style.position === 'fixed' || style.position === 'sticky' || wrapper?.classList.contains('js__header__stuck') || header.closest('.shopify-section-header-sticky')) return Math.max(0, Math.min(rect.bottom, rect.height));
      return 0;
    }

    function update() {
      frame = 0;
      const offset = stickyOffset();
      root.style.setProperty('--editorial-sticky-offset', `${offset}px`);
      const threshold = offset + (nav ? nav.offsetHeight : 0) + window.innerHeight * 0.25;
      let active = chapters[0];
      chapters.forEach((chapter) => { if (chapter.getBoundingClientRect().top <= threshold) active = chapter; });
      navLinks.forEach((link) => {
        if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      if (progress && chapters.length) {
        const first = chapters[0].getBoundingClientRect();
        const last = chapters[chapters.length - 1].getBoundingClientRect();
        const length = last.bottom - first.top - window.innerHeight;
        const value = length > 0 ? Math.max(0, Math.min(1, -first.top / length)) : 1;
        progress.style.transform = `scaleX(${value})`;
      }
    }
    function scheduleUpdate() { if (!frame) frame = requestAnimationFrame(update); }

    root.addEventListener('click', (event) => {
      const jump = event.target.closest('[data-editorial-jump]');
      if (!jump || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const destination = chapters.find((chapter) => `#${chapter.id}` === jump.hash);
      if (!destination) return;
      event.preventDefault();
      destination.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
      destination.focus({ preventScroll: true });
      if (history.replaceState) history.replaceState(null, '', jump.hash);
    }, { signal });

    root.querySelectorAll('[data-editorial-gallery]').forEach((gallery) => {
      const controls = gallery.querySelector('[data-editorial-controls]');
      const panels = [...gallery.querySelectorAll('[data-editorial-panel]')];
      function select(view) {
        panels.forEach((panel) => {
          panel.hidden = panel.dataset.editorialPanel !== view || panel.dataset.editorialFailed === 'true';
          if (panel.hidden) panel.querySelectorAll('video').forEach((video) => video.pause());
        });
        controls?.querySelectorAll('[data-editorial-view]').forEach((control) => {
          control.setAttribute('aria-pressed', String(control.dataset.editorialView === view));
        });
      }
      function failed(panel) {
        panel.dataset.editorialFailed = 'true';
        const available = panels.filter((item) => item.dataset.editorialFailed !== 'true');
        if (!available.length) {
          gallery.hidden = true;
          gallery.closest('[data-editorial-chapter]').classList.add('ta-vie-editorial__chapter--type');
          return;
        }
        if (!panel.hidden) select(available[0].dataset.editorialPanel);
        panel.hidden = true;
        if (controls) {
          controls.hidden = available.length < 2;
          controls.querySelectorAll('[data-editorial-view]').forEach((button) => {
            button.hidden = !available.some((item) => item.dataset.editorialPanel === button.dataset.editorialView);
          });
        }
      }
      panels.forEach((panel) => {
        panel.querySelectorAll('img').forEach((image) => {
          image.addEventListener('error', () => failed(panel), { signal });
          if (image.complete && image.naturalWidth === 0) failed(panel);
        });
        panel.querySelectorAll('video').forEach((video) => {
          video.addEventListener('error', () => videoFallback(video, () => failed(panel)), { signal });
          if (video.error) videoFallback(video, () => failed(panel));
        });
      });
      if (controls) {
        controls.hidden = panels.filter((panel) => panel.dataset.editorialFailed !== 'true').length < 2;
        controls.addEventListener('click', (event) => {
          const button = event.target.closest('[data-editorial-view]');
          if (button) select(button.dataset.editorialView);
        }, { signal });
      }
    });

    function videoFallback(video, failure) {
      if (!video.poster) return failure();
      const image = new Image();
      image.className = 'ta-vie-editorial__image';
      image.alt = video.closest('[data-editorial-chapter]')?.querySelector('h2')?.textContent || video.closest('figure')?.querySelector('figcaption')?.textContent.trim() || root.querySelector('.ta-vie-editorial__heading')?.textContent || '';
      image.addEventListener('error', failure, { once: true, signal });
      image.src = video.poster;
      const picture = document.createElement('picture');
      picture.appendChild(image);
      video.replaceWith(picture);
    }
    const heroMedia = root.querySelector('.ta-vie-editorial__hero-media');
    if (heroMedia) {
      const failedHero = () => {
        heroMedia.hidden = true;
        root.querySelector('.ta-vie-editorial__hero').classList.add('ta-vie-editorial__hero--type');
      };
      heroMedia.querySelectorAll('img').forEach((image) => {
        image.addEventListener('error', failedHero, { signal });
        if (image.complete && image.naturalWidth === 0) failedHero();
      });
      heroMedia.querySelectorAll('video').forEach((video) => {
        video.addEventListener('error', () => videoFallback(video, failedHero), { signal });
        if (video.error) videoFallback(video, failedHero);
      });
    }

    if ('IntersectionObserver' in window && !reducedMotion.matches && !window.Shopify?.designMode) {
      root.setAttribute('data-editorial-enhanced', '');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -24px 0px', threshold: 0.05 });
      root.querySelectorAll('[data-editorial-reveal]').forEach((element) => observer.observe(element));
      observers.push(observer);
      reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) root.removeAttribute('data-editorial-enhanced');
      }, { signal });
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true, signal });
    window.addEventListener('resize', scheduleUpdate, { passive: true, signal });
    update();
    instances.set(root, () => {
      controller.abort();
      observers.forEach((observer) => observer.disconnect());
      if (frame) cancelAnimationFrame(frame);
      root.removeAttribute('data-editorial-enhanced');
      instances.delete(root);
    });
  }

  function mountWithin(container = document) {
    if (container.matches?.('[data-editorial-root]')) mount(container);
    container.querySelectorAll?.('[data-editorial-root]').forEach(mount);
  }
  function unmountWithin(container) {
    [...instances].forEach(([root, destroy]) => { if (container === root || container.contains(root)) destroy(); });
  }
  document.addEventListener('shopify:section:load', (event) => mountWithin(event.target));
  document.addEventListener('shopify:section:unload', (event) => unmountWithin(event.target));
  document.addEventListener('shopify:block:select', (event) => {
    const chapter = event.target.closest('[data-editorial-chapter]');
    if (chapter) chapter.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  window.TaVieEditorial = { mountWithin, unmountWithin };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => mountWithin(), { once: true });
  else mountWithin();
})();
