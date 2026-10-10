(() => {
  if (customElements.get('ta-vie-product-feature')) return;

  class TaVieProductFeature extends HTMLElement {
    connectedCallback() {
      if (this.cleanup) return;
      this.cleanup = [];
      this.groups = [];
      this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.querySelectorAll('[data-feature-tabs]').forEach((group) => this.setupTabs(group));
      this.setupMediaFallbacks();
      this.onClick = (event) => this.returnToPurchase(event);
      this.addEventListener('click', this.onClick);
      this.onMotionChange = () => this.setupMotion();
      this.motion.addEventListener('change', this.onMotionChange);
      this.setupMotion();
    }

    disconnectedCallback() {
      this.removeEventListener('click', this.onClick);
      this.motion?.removeEventListener('change', this.onMotionChange);
      this.observer?.disconnect();
      this.observer = null;
      this.querySelectorAll('video').forEach((video) => video.pause());
      this.cleanup?.slice().reverse().forEach((restore) => restore());
      this.cleanup = null;
      this.groups = [];
    }

    saveAttributes(element, names) {
      const original = names.map((name) => [name, element.getAttribute(name)]);
      this.cleanup.push(() => original.forEach(([name, value]) => {
        if (value === null) element.removeAttribute(name);
        else element.setAttribute(name, value);
      }));
    }

    setupTabs(group) {
      const tabs = [...group.querySelectorAll('[data-feature-tab]')]
        .filter((tab) => tab.closest('[data-feature-tabs]') === group && !tab.disabled);
      const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
      if (!tabs.length || tabs.some((tab) => !tab.id) || panels.some((panel) => !panel || !group.contains(panel)) || new Set(panels).size !== panels.length) return;
      const tabList = group.querySelector('[data-feature-tab-list]');
      if (!tabList || tabs.some((tab) => !tabList.contains(tab))) return;

      this.saveAttributes(group, ['data-feature-enhanced']);
      this.saveAttributes(tabList, ['role', 'aria-orientation']);
      tabList.setAttribute('role', 'tablist');
      tabList.setAttribute('aria-orientation', 'horizontal');
      tabs.forEach((tab, index) => {
        this.saveAttributes(tab, ['role', 'aria-selected', 'tabindex']);
        this.saveAttributes(panels[index], ['role', 'aria-labelledby', 'tabindex', 'hidden']);
        tab.setAttribute('role', 'tab');
        panels[index].setAttribute('role', 'tabpanel');
        panels[index].setAttribute('aria-labelledby', tab.id);
        panels[index].setAttribute('tabindex', '0');
      });
      const select = (index, focus = false) => {
        tabs.forEach((tab, candidate) => {
          const active = candidate === index;
          tab.setAttribute('aria-selected', String(active));
          tab.tabIndex = active ? 0 : -1;
          panels[candidate].hidden = !active;
          if (!active) panels[candidate].querySelectorAll('video').forEach((video) => video.pause());
        });
        if (focus) tabs[index].focus({preventScroll: true});
      };
      const onClick = (event) => {
        const tab = event.target.closest('[data-feature-tab]');
        const index = tabs.indexOf(tab);
        if (index < 0) return;
        event.preventDefault();
        select(index);
      };
      const onKeyDown = (event) => {
        const index = tabs.indexOf(event.target.closest('[data-feature-tab]'));
        if (index < 0) return;
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        select(next, true);
      };
      group.addEventListener('click', onClick);
      group.addEventListener('keydown', onKeyDown);
      this.cleanup.push(() => {
        group.removeEventListener('click', onClick);
        group.removeEventListener('keydown', onKeyDown);
      });
      select(0);
      group.setAttribute('data-feature-enhanced', '');
      this.groups.push(group);
    }

    setupMotion() {
      this.observer?.disconnect();
      this.observer = null;
      this.querySelectorAll('[data-feature-in-view]').forEach((media) => media.removeAttribute('data-feature-in-view'));
      if (this.motion.matches || this.dataset.featureMotion !== 'true' || !('IntersectionObserver' in window)) return;
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-feature-in-view', '');
          this.observer?.unobserve(entry.target);
        });
      }, {threshold: 0.2});
      this.querySelectorAll('.ta-vie-feature__media:not(.ta-vie-feature__media--video)').forEach((media) => this.observer.observe(media));
    }

    setupMediaFallbacks() {
      this.querySelectorAll('.ta-vie-feature__media').forEach((media) => {
        const split = media.closest('.ta-vie-feature__split');
        const chapter = media.closest('.ta-vie-feature__chapter');
        this.saveAttributes(media, ['hidden']);
        if (split) this.saveAttributes(split, ['class']);
        if (chapter) this.saveAttributes(chapter, ['hidden']);
        const hide = () => {
          media.hidden = true;
          if (split?.querySelector('.ta-vie-feature__copy')) split.classList.add('ta-vie-feature__split--text-only');
          else if (chapter) {
            chapter.hidden = true;
            this.querySelectorAll('.ta-vie-feature__nav a').forEach((link) => {
              if (link.getAttribute('href') !== `#${chapter.id}`) return;
              this.saveAttributes(link, ['hidden']);
              link.hidden = true;
            });
          }
        };
        const watchImage = (image) => {
          image.addEventListener('error', hide, {once: true});
          this.cleanup.push(() => image.removeEventListener('error', hide));
          if (image.complete && image.currentSrc && !image.naturalWidth) hide();
        };
        media.querySelectorAll('img').forEach(watchImage);
        media.querySelectorAll('video').forEach((video) => {
          const fallback = () => {
            if (!video.poster) { hide(); return; }
            const image = document.createElement('img');
            image.alt = '';
            watchImage(image);
            image.src = video.poster;
            media.append(image);
            this.saveAttributes(video, ['hidden']);
            video.hidden = true;
            video.pause();
            this.cleanup.push(() => image.remove());
          };
          video.addEventListener('error', fallback, {once: true});
          this.cleanup.push(() => video.removeEventListener('error', fallback));
          if (video.error) {
            video.removeEventListener('error', fallback);
            fallback();
          }
        });
      });
    }

    returnToPurchase(event) {
      const link = event.target.closest('[data-feature-purchase]');
      if (!link || !this.contains(link) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;
      let target;
      try { target = document.getElementById(decodeURIComponent(href.slice(1))); } catch { return; }
      if (!target) return;
      const product = target.closest('product-info') || target.closest('.shopify-section')?.querySelector('product-info') || document.querySelector('product-info[id^="MainProduct--"]');
      if (!product) return;
      const candidates = [
        'variant-selects input:checked:not([type="hidden"]):not(:disabled)',
        'variant-selects select:not(:disabled)',
        'variant-selects button[data-popout-toggle]:not(:disabled)',
        'variant-selects input:not([type="hidden"]):not(:disabled)',
        '[data-product-form] [data-add-to-cart]:not(:disabled)',
      ].flatMap((selector) => [...product.querySelectorAll(selector)]);
      const control = candidates.find((candidate) => candidate.getClientRects().length && getComputedStyle(candidate).visibility !== 'hidden');
      event.preventDefault();
      target.scrollIntoView({behavior: this.motion.matches ? 'instant' : 'smooth', block: 'start'});
      if (control) control.focus({preventScroll: true});
      else {
        const fallback = product.querySelector('.product__title, h1') || product;
        if (!fallback.hasAttribute('tabindex')) {
          fallback.tabIndex = -1;
          const restore = () => {
            fallback.removeAttribute('tabindex');
            fallback.removeEventListener('blur', restore);
          };
          fallback.addEventListener('blur', restore, {once: true});
          this.cleanup.push(restore);
        }
        fallback.focus({preventScroll: true});
      }
    }
  }

  customElements.define('ta-vie-product-feature', TaVieProductFeature);
})();
