(() => {
  if (!customElements.get('ta-vie-product-world')) {
    customElements.define('ta-vie-product-world', class extends HTMLElement {
      connectedCallback() {
        if (this.abort) return;
        this.abort = new AbortController();
        this.restorations = [];
        this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.links = Array.from(this.querySelectorAll('[data-tv-world-chapter-link]'));
        this.chapters = this.links.map((link) => document.getElementById(link.hash.slice(1)));
        this.nav = this.querySelector('[data-tv-world-nav]');
        const queue = () => {
          if (!this.frame) this.frame = requestAnimationFrame(() => this.updateNavigation());
        };
        window.addEventListener('scroll', queue, {passive: true, signal: this.abort.signal});
        window.addEventListener('resize', queue, {passive: true, signal: this.abort.signal});
        document.addEventListener('theme:resize', queue, {signal: this.abort.signal});
        document.addEventListener('shopify:section:load', queue, {signal: this.abort.signal});
        this.addEventListener('click', (event) => this.returnToPurchase(event), {signal: this.abort.signal});
        this.querySelectorAll('img').forEach((image) => {
          image.addEventListener('error', () => {
            const media = image.closest('.tv-world__media, .tv-world__return-image, .tv-world__product-card-image');
            if (!media) return;
            const previous = media.hidden;
            const split = media.closest('.tv-world__split');
            const wasTextOnly = split?.classList.contains('tv-world__split--text');
            media.hidden = true;
            split?.classList.add('tv-world__split--text');
            this.restorations.push(() => { media.hidden = previous; if (!wasTextOnly) split?.classList.remove('tv-world__split--text'); });
          }, {signal: this.abort.signal});
        });
        this.querySelectorAll('.tv-world__media video').forEach((video) => {
          const media = video.closest('.tv-world__media');
          const fallback = media?.querySelector('[data-tv-world-video-fallback]');
          let hasFailed = false;
          const fail = () => {
            if (hasFailed) return;
            hasFailed = true;
            const previousVideo = video.hidden;
            const previousMedia = media.hidden;
            const previousFallback = fallback?.hidden;
            video.pause();
            video.hidden = true;
            if (fallback) fallback.hidden = false;
            else media.hidden = true;
            this.restorations.push(() => {
              video.hidden = previousVideo;
              media.hidden = previousMedia;
              if (fallback) fallback.hidden = previousFallback;
            });
          };
          video.addEventListener('error', fail, {once: true, signal: this.abort.signal});
          const sources = Array.from(video.querySelectorAll('source'));
          const failedSources = new Set();
          sources.forEach((source) => source.addEventListener('error', () => {
            failedSources.add(source);
            if (failedSources.size === sources.length) fail();
          }, {once: true, signal: this.abort.signal}));
        });
        const header = Array.from(document.querySelectorAll('[data-header-height]')).find((item) => !item.closest('.js__header__clone'));
        const wrapper = header?.closest('[data-header-wrapper]');
        this.headerObserver = new MutationObserver(queue);
        [header, wrapper].filter(Boolean).forEach((item) => this.headerObserver.observe(item, {attributes: true, attributeFilter: ['class', 'style']}));
        this.updateNavigation();
      }

      get productInfo() {
        return Array.from((this.closest('main') || document).querySelectorAll('product-info[id^="MainProduct--"]'))
          .find((item) => item.dataset.productId === this.dataset.productId);
      }

      updateNavigation() {
        this.frame = null;
        if (!this.isConnected) return;
        const header = Array.from(document.querySelectorAll('[data-header-height]')).find((item) => !item.closest('.js__header__clone'));
        const wrapper = header?.closest('[data-header-wrapper]');
        let offset = 0;
        if (header) {
          const headerStyle = getComputedStyle(header);
          const wrapperStyle = wrapper ? getComputedStyle(wrapper) : null;
          const fixed = ['fixed', 'sticky'].includes(headerStyle.position)
            || ['fixed', 'sticky'].includes(wrapperStyle?.position)
            || wrapper?.classList.contains('js__header__stuck');
          if (fixed && headerStyle.visibility !== 'hidden' && wrapperStyle?.visibility !== 'hidden') {
            const rect = header.getBoundingClientRect();
            offset = Math.max(0, Math.min(rect.bottom, rect.height));
          }
        }
        this.purchaseOffset = offset;
        this.style.setProperty('--tv-world-offset', `${offset}px`);
        if (!this.nav || this.chapters.some((chapter) => !chapter || !this.contains(chapter))) return;
        const boundary = Math.max(0, this.nav.getBoundingClientRect().bottom) + 36;
        let active = 0;
        this.chapters.forEach((chapter, index) => { if (chapter.getBoundingClientRect().top <= boundary) active = index; });
        this.links.forEach((link, index) => {
          if (index === active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
        if (this.active === active) return;
        this.active = active;
        const link = this.links[active];
        const left = link.getBoundingClientRect().left - this.nav.getBoundingClientRect().left + this.nav.scrollLeft;
        if (left < this.nav.scrollLeft || left + link.offsetWidth > this.nav.scrollLeft + this.nav.clientWidth) {
          this.nav.scrollTo({left: Math.max(0, left - 20), behavior: this.motion.matches ? 'instant' : 'smooth'});
        }
      }

      returnToPurchase(event) {
        const link = event.target.closest('[data-tv-world-purchase]');
        if (!link) return;
        const purchase = this.productInfo?.querySelector('[data-form-wrapper]') || this.productInfo;
        if (!purchase) return;
        event.preventDefault();
        this.updateNavigation();
        const top = Math.max(0, window.scrollY + purchase.getBoundingClientRect().top - this.purchaseOffset - 24);
        window.scrollTo({top, behavior: this.motion.matches ? 'instant' : 'smooth'});
        // Use an existing native control. Do not add attributes or styles to
        // Broadcast's product form, description, variant state, or cart.
        const control = Array.from(purchase.querySelectorAll('variant-selects input:not([type="hidden"]):not([disabled]), variant-selects select:not([disabled]), variant-selects button:not([disabled]), [data-add-to-cart]:not([disabled])'))
          .find((item) => item.getClientRects().length);
        control?.focus({preventScroll: true});
      }

      disconnectedCallback() {
        this.abort?.abort();
        this.abort = null;
        this.headerObserver?.disconnect();
        if (this.frame) cancelAnimationFrame(this.frame);
        this.frame = null;
        this.restorations?.reverse().forEach((restore) => restore());
        this.restorations = [];
        this.querySelectorAll('video').forEach((video) => video.pause());
        this.links?.forEach((link) => link.removeAttribute('aria-current'));
        this.style.removeProperty('--tv-world-offset');
        this.active = null;
      }
    });
  }

})();
