/* Additive Live state: only remove stale badges/expired promotion. Never infer a
 * live broadcast, ended status or an archive from the clock. Native UI untouched. */
(() => {
  if (customElements.get('ta-vie-live-card')) return;
  class TaVieLiveCard extends HTMLElement {
    connectedCallback() { this.updateClock(); }
    disconnectedCallback() { window.clearTimeout(this.clockTimer); }
    updateClock() {
      window.clearTimeout(this.clockTimer);
      const now = Date.now() / 1000;
      const expiry = Number(this.dataset.liveUntil || 0);
      const promotionEnd = Number(this.dataset.showUntil || 0);
      const start = Number(this.dataset.startsAt || 0);
      if (this.dataset.compact !== 'true' && promotionEnd && now >= promotionEnd) {
        const card = this.closest('.tvj-live-card');
        if (card) card.hidden = true;
        else this.hidden = true;
        return;
      }
      if (this.dataset.liveStatus === 'live' && (!expiry || now >= expiry)) {
        const label = this.querySelector('[data-live-label]');
        const note = this.querySelector('[data-live-status-note]');
        const link = this.querySelector('[data-live-link-label]');
        if (label) { label.textContent = '配信状況をご確認ください'; label.classList.remove('is-live'); }
        if (note) { note.textContent = '配信状況はInstagramでご確認ください。'; note.hidden = false; }
        if (link) link.textContent = 'Instagramで配信状況を確認';
        this.dataset.liveActive = 'false';
      } else if (this.dataset.liveStatus === 'planned' && start && now >= start) {
        const note = this.querySelector('[data-live-status-note]');
        const link = this.querySelector('[data-live-link-label]');
        if (note) { note.textContent = '予定時刻を過ぎています。最新の開催案内はInstagramでご確認ください。'; note.hidden = false; }
        if (link) link.textContent = 'Instagramで配信状況を確認';
      }
      const boundaries = [promotionEnd, this.dataset.liveStatus === 'live' ? expiry : 0, this.dataset.liveStatus === 'planned' ? start : 0].filter(value => value > now);
      if (boundaries.length) {
        const delay = Math.min(Math.max((Math.min(...boundaries) - now) * 1000 + 50, 50), 2147483647);
        this.clockTimer = window.setTimeout(() => this.updateClock(), delay);
      }
    }
  }
  customElements.define('ta-vie-live-card', TaVieLiveCard);
})();
