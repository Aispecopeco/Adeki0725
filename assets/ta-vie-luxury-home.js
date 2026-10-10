(() => {
  if (customElements.get('ta-vie-luxury-home')) return;

  class TaVieLuxuryHome extends HTMLElement {
    connectedCallback() {
      if (this.abortController) return;
      this.abortController = new AbortController();
      const {signal} = this.abortController;
      this.pieces = [...this.querySelectorAll('[data-luxury-piece]')];
      this.links = [...this.querySelectorAll('[data-luxury-piece-link]')];
      this.navigation = this.querySelector('[data-luxury-home-nav]');
      this.currentName = this.querySelector('[data-luxury-current-name]');
      this.currentPrice = this.querySelector('[data-luxury-current-price]');
      this.currentLink = this.querySelector('[data-luxury-current-link]');
      this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.frame = 0;
      this.activeId = '';
      this.anchorTarget = null;
      this.anchorSettleTimer = 0;
      this.classList.add('is-enhanced');

      this.links.forEach((link) => {
        link.addEventListener('click', (event) => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          const target = this.pieces.find((piece) => `#${piece.id}` === link.getAttribute('href'));
          if (!target) return;
          event.preventDefault();
          this.updateMeasurements();
          this.anchorTarget = target;
          this.setCurrent(target.id, true);
          const targetTop = window.scrollY + target.getBoundingClientRect().top;
          const offset = this.headerOffset + this.navigationHeight + 20;
          window.scrollTo({top: Math.max(0, targetTop - offset), behavior: this.motionPreference.matches ? 'auto' : 'smooth'});
          this.scheduleAnchorSettle();
          if (window.location.hash !== `#${target.id}`) history.replaceState(null, '', `#${target.id}`);
        }, {signal});
      });

      this.schedule = () => {
        if (this.anchorTarget) this.scheduleAnchorSettle();
        if (this.frame) return;
        this.frame = requestAnimationFrame(() => {
          this.frame = 0;
          if (!this.isConnected) return;
          this.updateMeasurements();
          this.updateCurrent();
        });
      };
      window.addEventListener('scroll', this.schedule, {passive: true, signal});
      window.addEventListener('resize', this.schedule, {passive: true, signal});
      const cancelAnchor = () => {
        if (!this.anchorTarget) return;
        clearTimeout(this.anchorSettleTimer);
        this.anchorTarget = null;
      };
      window.addEventListener('wheel', cancelAnchor, {passive: true, signal});
      window.addEventListener('touchstart', cancelAnchor, {passive: true, signal});
      window.addEventListener('pointerdown', cancelAnchor, {passive: true, signal});
      document.addEventListener('theme:resize', this.schedule, {signal});
      document.addEventListener('shopify:section:load', this.schedule, {signal});
      this.addEventListener('shopify:block:select', (event) => {
        const piece = event.target.closest('[data-luxury-piece]');
        if (piece && this.contains(piece)) {
          this.updateMeasurements();
          this.setCurrent(piece.id, true);
          piece.scrollIntoView({block: 'start', behavior: 'auto'});
        }
      }, {signal});

      const headerWrapper = document.querySelector('[data-header-wrapper]');
      if (headerWrapper && 'MutationObserver' in window) {
        this.headerObserver = new MutationObserver(this.schedule);
        this.headerObserver.observe(headerWrapper, {attributes: true, attributeFilter: ['class', 'style']});
      }
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(this.schedule);
        if (this.navigation) this.resizeObserver.observe(this.navigation);
        if (headerWrapper) this.resizeObserver.observe(headerWrapper);
      }
      this.updateMeasurements();
      this.updateCurrent();
    }

    updateMeasurements() {
      let visibleHeaderBottom = 0;
      document.querySelectorAll('[data-header-height]').forEach((header) => {
        if (header.closest('.js__header__clone') || header.hidden || !header.getClientRects().length) return;
        const wrapper = header.closest('[data-header-wrapper]') || header;
        const headerStyle = getComputedStyle(header);
        const wrapperStyle = getComputedStyle(wrapper);
        if (headerStyle.visibility === 'hidden' || wrapperStyle.visibility === 'hidden' || Number(wrapperStyle.opacity) === 0) return;
        const fixed = wrapper.classList.contains('js__header__stuck') || ['fixed', 'sticky'].includes(wrapperStyle.position) || ['fixed', 'sticky'].includes(headerStyle.position);
        const rect = header.getBoundingClientRect();
        if (fixed && rect.top < window.innerHeight && rect.bottom > 0) visibleHeaderBottom = Math.max(visibleHeaderBottom, Math.min(rect.bottom, window.innerHeight));
      });
      this.headerOffset = Math.max(0, Math.round(visibleHeaderBottom));
      this.navigationHeight = this.navigation ? Math.ceil(this.navigation.getBoundingClientRect().height) : 0;
      this.style.setProperty('--ta-vie-home-header-offset', `${this.headerOffset}px`);
      this.style.setProperty('--ta-vie-home-nav-height', `${this.navigationHeight}px`);
    }

    updateCurrent() {
      if (!this.pieces.length) return;
      if (this.anchorTarget?.isConnected) {
        this.setCurrent(this.anchorTarget.id, false);
        return;
      }
      const readingLine = this.headerOffset + this.navigationHeight + Math.min(150, window.innerHeight * .2);
      let activePiece = this.pieces[0];
      this.pieces.forEach((piece) => {
        if (piece.getBoundingClientRect().top <= readingLine) activePiece = piece;
      });
      this.setCurrent(activePiece.id, false);
    }

    setCurrent(id, reveal) {
      const changed = this.activeId !== id;
      this.activeId = id;
      this.links.forEach((link) => {
        const active = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-current', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
        if (active && changed) {
          if (this.currentName) this.currentName.textContent = link.dataset.luxuryProductName || '';
          if (this.currentPrice) this.currentPrice.textContent = link.dataset.luxuryProductPrice || '';
          if (this.currentLink && link.dataset.luxuryProductPurchaseUrl) this.currentLink.href = link.dataset.luxuryProductPurchaseUrl;
        }
        if (active && (changed || reveal)) this.revealLink(link);
      });
    }

    scheduleAnchorSettle() {
      clearTimeout(this.anchorSettleTimer);
      this.anchorSettleTimer = setTimeout(() => {
        if (!this.isConnected || !this.anchorTarget?.isConnected) return;
        this.updateMeasurements();
        const offset = this.headerOffset + this.navigationHeight + 20;
        const difference = this.anchorTarget.getBoundingClientRect().top - offset;
        this.anchorTarget = null;
        if (Math.abs(difference) > 2) window.scrollBy({top: difference, behavior: 'instant'});
        this.updateCurrent();
      }, 140);
    }

    revealLink(link) {
      const scroller = link.parentElement;
      if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return;
      const linkRect = link.getBoundingClientRect();
      const parentRect = scroller.getBoundingClientRect();
      const leftDifference = linkRect.left - parentRect.left;
      const rightDifference = linkRect.right - parentRect.right;
      const change = leftDifference < 0 ? leftDifference - 8 : rightDifference > 0 ? rightDifference + 8 : 0;
      if (change) scroller.scrollTo({left: scroller.scrollLeft + change, behavior: this.motionPreference.matches ? 'auto' : 'smooth'});
    }

    disconnectedCallback() {
      this.abortController?.abort();
      this.abortController = null;
      this.headerObserver?.disconnect();
      this.resizeObserver?.disconnect();
      if (this.frame) cancelAnimationFrame(this.frame);
      clearTimeout(this.anchorSettleTimer);
      this.anchorTarget = null;
      this.classList.remove('is-enhanced');
      this.frame = 0;
      this.style.removeProperty('--ta-vie-home-header-offset');
      this.style.removeProperty('--ta-vie-home-nav-height');
    }
  }

  customElements.define('ta-vie-luxury-home', TaVieLuxuryHome);
})();
