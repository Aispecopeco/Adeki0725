/* Real product photos and independently owned editorial views. No dependencies. */
(() => {
  'use strict';
  if (customElements.get('ta-vie-luxury-explorer')) return;

  const selector = {
    tabs: '[data-tv-explorer-tab]', panels: '[data-tv-explorer-panel]',
    stage: '[data-tv-explorer-stage]', dialog: '[data-tv-explorer-dialog]',
    detail: '[data-tv-explorer-detail]', hotspot: '[data-tv-explorer-hotspot]'
  };

  class TaVieLuxuryExplorer extends HTMLElement {
    connectedCallback() { this.initialize(); }
    disconnectedCallback() { this.destroy(); }

    initialize() {
      if (this._controller) return;
      this.tabs = Array.from(this.querySelectorAll(selector.tabs));
      this.panels = Array.from(this.querySelectorAll(selector.panels));
      this.dialog = this.querySelector(selector.dialog);
      if (!this.tabs.length || this.tabs.length !== this.panels.length || !this.dialog) return;
      this._controller = new AbortController();
      this._timers = new Set();
      this._active = 0;
      this._pointer = null;
      this._motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this._mobile = window.matchMedia('(max-width: 749px)');
      this._opener = null;
      this._scroll = null;
      this._scrollStyles = null;
      const on = (node, event, handler, options = {}) => node.addEventListener(event, handler, { ...options, signal: this._controller.signal });
      this.classList.add('is-enhanced');

      on(this, 'click', (event) => this.onClick(event));
      on(this, 'keydown', (event) => this.onTabKeydown(event));
      on(this, 'pointerdown', (event) => this.onPointerDown(event));
      on(this, 'pointermove', (event) => this.onPointerMove(event), { passive: false });
      on(this, 'pointerup', (event) => this.onPointerUp(event));
      on(this, 'pointercancel', () => { this._pointer = null; });
      on(this, 'dragstart', (event) => { if (event.target.closest(selector.stage)) event.preventDefault(); });
      on(this.dialog, 'cancel', (event) => { event.preventDefault(); this.closeDialog(); });
      on(this.dialog, 'close', () => this.finishDialogClose());
      on(document, 'keydown', (event) => this.onDialogKeydown(event));
      on(window, 'resize', () => this.positionHotspots(), { passive: true });
      on(this._mobile, 'change', () => this.positionHotspots());

      this.querySelectorAll(`${selector.stage} img`).forEach((image) => {
        image.draggable = false;
        on(image, 'load', () => this.positionHotspots());
        on(image, 'error', () => this.onImageError(image));
        if (image.complete && !image.naturalWidth) this.onImageError(image);
      });
      this.querySelectorAll('[data-tv-explorer-video] video').forEach((video) => {
        const button = video.parentElement.querySelector('[data-tv-explorer-play]');
        if (button) button.hidden = false;
        on(video, 'play', () => { if (button) button.hidden = true; });
        on(video, 'pause', () => { if (button && !video.error) button.hidden = false; });
        on(video, 'ended', () => { if (button && !video.error) button.hidden = false; });
        on(video, 'error', () => this.onVideoError(video));
        if (video.error) this.onVideoError(video);
      });
      if ('ResizeObserver' in window) {
        this._resizeObserver = new ResizeObserver(() => this.positionHotspots());
        this.querySelectorAll(selector.stage).forEach((stage) => this._resizeObserver.observe(stage));
      }
      this.setActive(0, { announce: false, animate: false });
      this.positionHotspots();
    }

    onClick(event) {
      const target = event.target instanceof Element ? event.target : event.target.parentElement;
      if (!target) return;
      const tab = target.closest(selector.tabs);
      if (tab && this.contains(tab)) {
        this.setActive(this.tabs.indexOf(tab));
        return;
      }
      if (target.closest('[data-tv-explorer-prev]')) { this.setActive(this._active - 1); return; }
      if (target.closest('[data-tv-explorer-next]')) { this.setActive(this._active + 1); return; }
      const detail = target.closest(`${selector.detail}, ${selector.hotspot}`);
      if (detail && this.contains(detail)) {
        event.preventDefault();
        this.openDialog(detail);
        return;
      }
      if (target.closest('[data-tv-explorer-close]') || target === this.dialog) {
        this.closeDialog();
        return;
      }
      const play = target.closest('[data-tv-explorer-play]');
      if (play) {
        const video = play.parentElement.querySelector('video');
        if (video) {
          const promise = video.play();
          if (promise && promise.catch) promise.catch(() => {
            if (this._controller) {
              play.hidden = false;
              this.announce('動画を再生できませんでした。再生ボタンからもう一度お試しください。');
            }
          });
        }
        return;
      }
      if (target.closest('[data-tv-explorer-zoom-toggle]') || (target.matches('.ta-vie-explorer__detail-image') && this.dialog.contains(target))) this.toggleZoom();
    }

    onTabKeydown(event) {
      const tab = event.target.closest(selector.tabs);
      if (!tab || !this.contains(tab)) return;
      const index = this.tabs.indexOf(tab);
      let next;
      switch (event.key) {
        case 'ArrowRight': case 'ArrowDown': next = index + 1; break;
        case 'ArrowLeft': case 'ArrowUp': next = index - 1; break;
        case 'Home': next = 0; break;
        case 'End': next = this.tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      this.setActive(next, { focus: true });
    }

    setActive(index, { focus = false, announce = true, animate = true } = {}) {
      if (!this._controller || !this.panels.length) return;
      const next = (index + this.panels.length) % this.panels.length;
      const previous = this._active;
      this._active = next;
      this.tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === next));
        tab.tabIndex = i === next ? 0 : -1;
      });
      this.panels.forEach((panel, i) => {
        const active = i === next;
        panel.classList.remove('is-leaving');
        panel.classList.toggle('is-active', active);
        panel.setAttribute('aria-hidden', String(!active));
        panel.inert = !active;
        panel.tabIndex = active ? 0 : -1;
        if (!active) panel.querySelectorAll('video').forEach((video) => { if (!video.paused) video.pause(); });
      });
      if (animate && previous !== next && !this._motion.matches) {
        const oldPanel = this.panels[previous];
        oldPanel.classList.add('is-leaving');
        this.later(() => oldPanel.classList.remove('is-leaving'), 340);
      }
      const count = this.querySelector('[data-tv-explorer-count]');
      if (count) count.textContent = String(next + 1).padStart(2, '0');
      const tab = this.tabs[next];
      const tablist = tab.parentElement;
      if (focus) tab.focus({ preventScroll: true });
      if (tab.offsetLeft < tablist.scrollLeft) tablist.scrollLeft = tab.offsetLeft;
      else if (tab.offsetLeft + tab.offsetWidth > tablist.scrollLeft + tablist.clientWidth) tablist.scrollLeft = tab.offsetLeft + tab.offsetWidth - tablist.clientWidth;
      if (announce) this.announce(`${this.panels[next].dataset.viewLabel}、${next + 1} / ${this.panels.length}`);
      this.positionHotspots();
      if (previous !== next) this.dispatchEvent(new CustomEvent('ta-vie:explorer-change', { bubbles: true, detail: { productId: this.dataset.productId, explorerId: this.id, index: next } }));
    }

    announce(message) {
      const status = this.querySelector('[data-tv-explorer-status]');
      if (status) status.textContent = message;
    }

    onPointerDown(event) {
      if (this.panels.length < 2 || !event.isPrimary || event.button !== 0) return;
      const stage = event.target.closest(selector.stage);
      if (!stage || event.target.closest('button, a, video') || !this.panels[this._active].contains(stage)) return;
      this._pointer = { id: event.pointerId, stage, x: event.clientX, y: event.clientY, horizontal: false };
    }

    onPointerMove(event) {
      const pointer = this._pointer;
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (!pointer.horizontal && Math.abs(dy) > 16 && Math.abs(dy) > Math.abs(dx)) {
        this._pointer = null;
        return;
      }
      if (!pointer.horizontal && Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.35) {
        pointer.horizontal = true;
        try { pointer.stage.setPointerCapture(event.pointerId); } catch (_) { /* Pointer may already belong to a native gesture. */ }
      }
      if (pointer.horizontal && event.cancelable) event.preventDefault();
    }

    onPointerUp(event) {
      const pointer = this._pointer;
      this._pointer = null;
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.5) this.setActive(this._active + (dx < 0 ? 1 : -1));
      try { if (pointer.stage.hasPointerCapture(event.pointerId)) pointer.stage.releasePointerCapture(event.pointerId); } catch (_) { /* Native pointer release needs no recovery. */ }
    }

    positionHotspots() {
      if (!this._controller) return;
      this.querySelectorAll(selector.hotspot).forEach((point) => {
        const stage = point.closest(selector.stage);
        const panel = point.closest(selector.panels);
        const image = stage.querySelector('.ta-vie-explorer__picture img');
        const hidden = panel !== this.panels[this._active] || !image || !image.naturalWidth || image.hidden || (point.dataset.mobileDifferent === 'true' && this._mobile.matches);
        point.hidden = hidden;
        if (hidden) return;
        const width = stage.clientWidth;
        const height = stage.clientHeight;
        if (!width || !height) { point.hidden = true; return; }
        const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
        const renderedWidth = image.naturalWidth * scale;
        const renderedHeight = image.naturalHeight * scale;
        const objectPosition = getComputedStyle(image).objectPosition.split(/\s+/);
        const positionOffset = (value, remaining) => {
          if (value && value.endsWith('%')) return remaining * parseFloat(value) / 100;
          if (value && value.endsWith('px')) return parseFloat(value);
          return remaining / 2;
        };
        const offsetX = positionOffset(objectPosition[0], width - renderedWidth);
        const offsetY = positionOffset(objectPosition[1], height - renderedHeight);
        const x = Math.min(100, Math.max(0, Number(point.dataset.hotspotX) || 0));
        const y = Math.min(100, Math.max(0, Number(point.dataset.hotspotY) || 0));
        point.style.left = `${offsetX + renderedWidth * x / 100}px`;
        point.style.top = `${offsetY + renderedHeight * y / 100}px`;
      });
    }

    onImageError(image) {
      const stage = image.closest(selector.stage);
      if (!stage) return;
      image.hidden = true;
      let message = stage.querySelector('[data-tv-explorer-image-error]');
      if (!message) {
        message = document.createElement('p');
        message.className = 'ta-vie-explorer__media-error';
        message.dataset.tvExplorerImageError = '';
        message.textContent = '写真を読み込めませんでした。';
        stage.append(message);
      }
      message.hidden = false;
      stage.querySelectorAll(selector.hotspot).forEach((point) => { point.hidden = true; });
    }

    onVideoError(video) {
      video.pause();
      const panel = video.closest(selector.panels);
      const wrapper = video.closest('[data-tv-explorer-video]');
      const fallback = panel && panel.querySelector('[data-tv-explorer-video-fallback]');
      if (wrapper) wrapper.hidden = true;
      if (fallback) fallback.hidden = false;
    }

    openDialog(opener) {
      const panel = opener.closest(selector.panels);
      const link = panel && panel.querySelector(selector.detail);
      if (!link) return;
      if (TaVieLuxuryExplorer.activeDialog && TaVieLuxuryExplorer.activeDialog !== this) TaVieLuxuryExplorer.activeDialog.closeDialog();
      this._opener = opener;
      this._scroll = { x: window.scrollX, y: window.scrollY };
      const content = this.dialog.querySelector('[data-tv-explorer-dialog-content]');
      content.replaceChildren();
      const source = panel.querySelector('[data-tv-explorer-detail-source]');
      if (source) {
        content.append(source.cloneNode(true));
      } else {
        const image = document.createElement('img');
        image.className = 'ta-vie-explorer__detail-image';
        const mobileZoom = this._mobile.matches && link.dataset.mobileZoomUrl;
        image.src = mobileZoom || link.href;
        image.alt = (mobileZoom ? link.dataset.mobileZoomAlt : link.dataset.detailAlt) || this.dataset.productTitle || '';
        const width = mobileZoom ? link.dataset.mobileZoomWidth : link.dataset.detailWidth;
        const height = mobileZoom ? link.dataset.mobileZoomHeight : link.dataset.detailHeight;
        if (Number(width) > 0) image.width = Number(width);
        if (Number(height) > 0) image.height = Number(height);
        image.decoding = 'async';
        content.append(image);
      }
      const zoomButton = document.createElement('button');
      zoomButton.type = 'button';
      zoomButton.className = 'ta-vie-explorer__zoom-toggle';
      zoomButton.dataset.tvExplorerZoomToggle = '';
      zoomButton.setAttribute('aria-pressed', 'false');
      zoomButton.textContent = '写真をさらに拡大';
      content.append(zoomButton);
      content.querySelectorAll('img').forEach((image) => {
        image.loading = 'eager';
        image.addEventListener('error', () => {
          image.hidden = true;
          zoomButton.hidden = true;
          const message = document.createElement('p');
          message.className = 'ta-vie-explorer__zoom-hint';
          message.textContent = '写真を読み込めませんでした。';
          image.after(message);
        }, { once: true, signal: this._controller.signal });
      });
      this.dialog.setAttribute('aria-modal', 'true');
      this.dialog.querySelector('.ta-vie-explorer__dialog-frame').scrollTop = 0;
      try {
        if (typeof this.dialog.showModal === 'function') this.dialog.showModal();
        else this.dialog.setAttribute('open', '');
      } catch (_) { this.dialog.setAttribute('open', ''); }
      this.lockScroll();
      TaVieLuxuryExplorer.activeDialog = this;
      this.dialog.querySelector('[data-tv-explorer-close]').focus({ preventScroll: true });
    }

    toggleZoom() {
      if (!this.dialog.open) return;
      const image = this.dialog.querySelector('.ta-vie-explorer__detail-image');
      const button = this.dialog.querySelector('[data-tv-explorer-zoom-toggle]');
      if (!image || image.hidden || !button) return;
      const enlarged = image.classList.toggle('is-zoomed');
      button.setAttribute('aria-pressed', String(enlarged));
      button.textContent = enlarged ? '全体表示に戻す' : '写真をさらに拡大';
      if (!enlarged) this.dialog.querySelector('[data-tv-explorer-dialog-content]').scrollLeft = 0;
    }

    onDialogKeydown(event) {
      if (!this.dialog.open || TaVieLuxuryExplorer.activeDialog !== this) return;
      if (event.key === 'Escape') { event.preventDefault(); this.closeDialog(); return; }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(this.dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')).filter((node) => !node.disabled && !node.hidden && node.getClientRects().length);
      if (!focusable.length) { event.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !this.dialog.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !this.dialog.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    }

    lockScroll() {
      if (this._scrollStyles) return;
      const root = document.documentElement;
      const body = document.body;
      this._scrollStyles = {
        rootOverflow: root.style.getPropertyValue('overflow'), rootPriority: root.style.getPropertyPriority('overflow'),
        bodyOverflow: body.style.getPropertyValue('overflow'), bodyPriority: body.style.getPropertyPriority('overflow'),
        bodyPadding: body.style.getPropertyValue('padding-right'), paddingPriority: body.style.getPropertyPriority('padding-right')
      };
      const scrollbar = window.innerWidth - root.clientWidth;
      if (scrollbar > 0) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbar}px`;
      root.style.setProperty('overflow', 'hidden');
      body.style.setProperty('overflow', 'hidden');
    }

    closeDialog() {
      if (this.dialog && this.dialog.open) {
        if (typeof this.dialog.close === 'function') this.dialog.close();
        else this.dialog.removeAttribute('open');
      }
      this.finishDialogClose();
    }

    finishDialogClose() {
      if (!this._opener && !this._scrollStyles) return;
      const styles = this._scrollStyles;
      if (styles) {
        const restore = (node, property, value, priority) => value ? node.style.setProperty(property, value, priority) : node.style.removeProperty(property);
        restore(document.documentElement, 'overflow', styles.rootOverflow, styles.rootPriority);
        restore(document.body, 'overflow', styles.bodyOverflow, styles.bodyPriority);
        restore(document.body, 'padding-right', styles.bodyPadding, styles.paddingPriority);
        this._scrollStyles = null;
      }
      if (this._opener && this._opener.isConnected) this._opener.focus({ preventScroll: true });
      if (this._scroll) window.scrollTo({ left: this._scroll.x, top: this._scroll.y, behavior: 'instant' });
      this._opener = null;
      this._scroll = null;
      if (TaVieLuxuryExplorer.activeDialog === this) TaVieLuxuryExplorer.activeDialog = null;
      if (this.dialog) {
        this.dialog.removeAttribute('aria-modal');
        this.dialog.querySelector('[data-tv-explorer-dialog-content]').replaceChildren();
      }
    }

    later(callback, delay) {
      const timer = window.setTimeout(() => { this._timers.delete(timer); callback(); }, delay);
      this._timers.add(timer);
    }

    destroy() {
      if (!this._controller) return;
      this.closeDialog();
      this._controller.abort();
      this._controller = null;
      if (this._resizeObserver) this._resizeObserver.disconnect();
      this._resizeObserver = null;
      this._timers.forEach((timer) => window.clearTimeout(timer));
      this._timers.clear();
      this._pointer = null;
      this.classList.remove('is-enhanced');
      this.panels.forEach((panel, i) => {
        panel.inert = false;
        panel.removeAttribute('aria-hidden');
        panel.tabIndex = 0;
        panel.classList.remove('is-leaving');
        panel.classList.toggle('is-active', i === 0);
      });
      this.tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === 0)); tab.tabIndex = i === 0 ? 0 : -1; });
      this.querySelectorAll('[data-tv-explorer-play], [data-tv-explorer-hotspot]').forEach((control) => { control.hidden = true; });
    }
  }

  customElements.define('ta-vie-luxury-explorer', TaVieLuxuryExplorer);
  const inSection = (target) => {
    if (!(target instanceof Element)) return [];
    return target.matches('ta-vie-luxury-explorer') ? [target] : Array.from(target.querySelectorAll('ta-vie-luxury-explorer'));
  };
  document.addEventListener('shopify:section:load', (event) => inSection(event.target).forEach((explorer) => explorer.initialize()));
  document.addEventListener('shopify:section:unload', (event) => inSection(event.target).forEach((explorer) => explorer.destroy()));
})();
