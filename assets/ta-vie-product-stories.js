(() => {
  'use strict';
  if (customElements.get('ta-vie-product-stories')) return;
  customElements.define('ta-vie-product-stories', class extends HTMLElement {
    connectedCallback() {
      if (this.controller) return;
      this.controller = new AbortController();
      this.signal = this.controller.signal;
      this.panels = [...this.querySelectorAll('[data-story-panel]')];
      this.chapters = [...this.querySelectorAll('[data-chapter]')];
      if (!this.panels.length) return;
      this.current = 0;
      this.photos = new Map();
      this.timers = new Map();
      this.pending = new Map();
      this.dialog = this.querySelector('[data-story-dialog]');
      this.classList.add('is-enhanced');
      this.querySelectorAll('[data-enhanced-control]').forEach(el => el.hidden = false);
      this.querySelector('.tvs__chapters').setAttribute('role', 'tablist');
      this.chapters.forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', this.panels[index].id);
        this.panels[index].setAttribute('role', 'tabpanel');
        this.panels[index].setAttribute('aria-labelledby', tab.id);
      });
      this.panels.forEach(panel => {
        this.photos.set(panel, 0);
        const tabs = [...panel.querySelectorAll('[data-photo-tab]')];
        panel.querySelector('.tvs__photo-tabs').setAttribute('role', 'tablist');
        tabs.forEach((tab, index) => {
          tab.id = panel.id + '-photo-tab-' + index;
          tab.setAttribute('role', 'tab');
          tab.setAttribute('aria-controls', panel.querySelectorAll('[data-photo]')[index].id);
          panel.querySelectorAll('[data-photo]')[index].setAttribute('role', 'tabpanel');
          panel.querySelectorAll('[data-photo]')[index].setAttribute('aria-labelledby', tab.id);
        });
        const gallery = panel.querySelector('[data-gallery]');
        gallery.addEventListener('pointerdown', () => this.clearPending(panel), {passive: true, signal: this.signal});
        gallery.addEventListener('scroll', () => {
          clearTimeout(this.timers.get(panel));
          this.timers.set(panel, setTimeout(() => {
            if (!gallery.clientWidth) return;
            const pending = this.pending.get(panel);
            if (pending && Math.abs(gallery.scrollLeft - pending.index * gallery.clientWidth) > 2) return;
            this.clearPending(panel);
            const index = Math.round(gallery.scrollLeft / gallery.clientWidth);
            this.setPhoto(panel, index, false, false);
          }, 100));
        }, {passive: true, signal: this.signal});
        this.setPhoto(panel, 0, false, false);
      });
      this.addEventListener('click', event => this.onClick(event), {capture: true, signal: this.signal});
      this.addEventListener('keydown', event => this.onKey(event), {signal: this.signal});
      this.dialog.addEventListener('close', () => {
        document.documentElement.style.overflow = this.previousOverflow ?? '';
        const panel = this.panels[this.current];
        const visibleTrigger = panel.querySelectorAll('[data-photo]')[this.photos.get(panel)]?.querySelector('[data-zoom]');
        const trigger = this.zoomTrigger?.isConnected && !this.zoomTrigger.closest('[inert],[hidden]') ? this.zoomTrigger : visibleTrigger;
        trigger?.focus({preventScroll: true});
      }, {signal: this.signal});
      this.dialog.addEventListener('click', event => {
        if (event.target !== this.dialog) return;
        const box = this.dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) this.dialog.close();
      }, {signal: this.signal});
      document.addEventListener('shopify:block:select', event => {
        const index = this.panels.findIndex(panel => panel.dataset.blockId === event.detail?.blockId);
        if (index >= 0) this.selectChapter(index, false);
      }, {signal: this.signal});
      this.resize = new ResizeObserver(() => {
        const panel = this.panels[this.current];
        this.setPhoto(panel, this.photos.get(panel), true, false, true);
      });
      this.resize.observe(this);
      this.selectChapter(0, false);
    }
    disconnectedCallback() {
      if (this.dialog?.open) {
        document.documentElement.style.overflow = this.previousOverflow ?? '';
        this.dialog.close();
      }
      this.controller?.abort();
      this.resize?.disconnect();
      this.timers?.forEach(clearTimeout);
      this.pending?.forEach(pending => clearTimeout(pending.timer));
      this.controller = null;
    }
    selectChapter(index, announce = true) {
      index = Math.max(0, Math.min(this.panels.length - 1, index));
      this.current = index;
      this.panels.forEach((panel, i) => { panel.hidden = i !== index; panel.inert = i !== index; });
      this.chapters.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      this.querySelector('[data-chapter-prev]').disabled = index === 0;
      this.querySelector('[data-chapter-next]').disabled = index === this.panels.length - 1;
      this.querySelector('[data-chapter-count]').textContent = this.count(index, this.panels.length);
      const panel = this.panels[index];
      this.setPhoto(panel, this.photos.get(panel), true, false, true);
      if (announce) this.status(panel.querySelector('h3').textContent);
    }
    setPhoto(panel, index, scroll = true, announce = true, instant = false) {
      if (!panel) return;
      const frames = [...panel.querySelectorAll('[data-photo]')];
      index = Math.max(0, Math.min(frames.length - 1, Number(index) || 0));
      this.photos.set(panel, index);
      panel.querySelectorAll('[data-photo-tab]').forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      frames.forEach((frame, i) => { frame.inert = i !== index; });
      panel.querySelector('[data-photo-prev]').disabled = index === 0;
      panel.querySelector('[data-photo-next]').disabled = index === frames.length - 1;
      panel.querySelector('[data-photo-count]').textContent = this.count(index, frames.length);
      if (scroll) {
        const gallery = panel.querySelector('[data-gallery]');
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.clearPending(panel);
        if (!instant && !reduced) {
          const timer = setTimeout(() => {
            this.pending.delete(panel);
            if (gallery.clientWidth) gallery.scrollTo({left: index * gallery.clientWidth, behavior: 'instant'});
          }, 650);
          this.pending.set(panel, {index, timer});
        }
        gallery.scrollTo({left: index * gallery.clientWidth, behavior: instant || reduced ? 'instant' : 'smooth'});
      }
      if (this.dialog?.open && panel === this.panels[this.current]) this.updateDialog(panel);
      if (announce) this.status(frames[index].querySelector('[data-caption]').textContent);
    }
    onClick(event) {
      const control = event.target.closest('[data-chapter],[data-photo-tab],[data-photo-prev],[data-photo-next],[data-chapter-prev],[data-chapter-next],[data-zoom],[data-dialog-close],[data-dialog-prev],[data-dialog-next]');
      if (!control || !this.contains(control)) return;
      if (control.matches('[data-chapter],[data-photo-tab],[data-zoom]')) event.stopPropagation();
      const panel = control.closest('[data-story-panel]') || this.panels[this.current];
      if (control.matches('[data-chapter]')) { event.preventDefault(); this.selectChapter(Number(control.dataset.chapter)); }
      if (control.matches('[data-photo-tab]')) { event.preventDefault(); this.setPhoto(panel, Number(control.dataset.photoTab)); }
      if (control.matches('[data-chapter-prev]')) this.selectChapter(this.current - 1);
      if (control.matches('[data-chapter-next]')) this.selectChapter(this.current + 1);
      if (control.matches('[data-photo-prev],[data-dialog-prev]')) this.setPhoto(panel, this.photos.get(panel) - 1);
      if (control.matches('[data-photo-next],[data-dialog-next]')) this.setPhoto(panel, this.photos.get(panel) + 1);
      if (control.matches('[data-dialog-close]')) this.dialog.close();
      if (control.matches('[data-zoom]') && typeof this.dialog.showModal === 'function') {
        event.preventDefault();
        this.zoomTrigger = control;
        this.previousOverflow = document.documentElement.style.overflow;
        this.updateDialog(panel);
        this.dialog.showModal();
        document.documentElement.style.overflow = 'hidden';
      }
    }
    onKey(event) {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const chapter = event.target.closest('[data-chapter]');
      const photo = event.target.closest('[data-photo-tab]');
      const gallery = event.target.matches('[data-gallery]');
      if (!chapter && !photo && !gallery && !this.dialog.open) return;
      event.preventDefault();
      if (chapter) {
        const index = this.nextIndex(event.key, this.current, this.panels.length);
        this.selectChapter(index); this.chapters[index].focus({preventScroll: true});
      } else {
        const panel = this.panels[this.current];
        const index = this.nextIndex(event.key, this.photos.get(panel), panel.querySelectorAll('[data-photo]').length);
        this.setPhoto(panel, index);
        if (photo) panel.querySelectorAll('[data-photo-tab]')[index].focus({preventScroll: true});
      }
    }
    nextIndex(key, index, total) {
      return key === 'Home' ? 0 : key === 'End' ? total - 1 : Math.max(0, Math.min(total - 1, index + (key === 'ArrowRight' ? 1 : -1)));
    }
    updateDialog(panel) {
      const frames = [...panel.querySelectorAll('[data-photo]')];
      const index = this.photos.get(panel);
      const frame = frames[index], source = frame.querySelector('img');
      const image = this.dialog.querySelector('[data-dialog-image]');
      image.src = source.currentSrc || source.src;
      image.alt = source.alt;
      image.classList.toggle('is-cropped', frame.classList.contains('tvs__photo--crop'));
      this.dialog.querySelector('[data-dialog-caption]').textContent = frame.querySelector('[data-caption]').textContent;
      this.dialog.querySelector('[data-dialog-count]').textContent = this.count(index, frames.length);
      this.dialog.querySelector('[data-dialog-prev]').disabled = index === 0;
      this.dialog.querySelector('[data-dialog-next]').disabled = index === frames.length - 1;
    }
    count(index, total) { return String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0'); }
    clearPending(panel) {
      const pending = this.pending.get(panel);
      if (pending) clearTimeout(pending.timer);
      this.pending.delete(panel);
    }
    status(text) { this.querySelector('[data-story-status]').textContent = text; }
  });
})();
