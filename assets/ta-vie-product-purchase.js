/* The native ProductInfo replaces the bar for every real variant. Its
 * unavailable-combination path emits only the form's hidden-id change; handle
 * that path without replacing Broadcast's selection or purchase logic. */
if (!customElements.get('ta-vie-purchase-state')) {
  // Broadcast serializes fetched product HTML during a whole-page swap. Keep
  // the notification contact form outside the purchase form before that
  // serialization, so the browser does not discard a nested form on reparse.
  const preparedProducts = new WeakSet();
  const prepareProductSwap = (productInfo) => {
    if (productInfo?.dataset.taVieExperience !== 'true' || preparedProducts.has(productInfo)) return;
    if (typeof productInfo.addPreProcessCallback !== 'function') return;
    preparedProducts.add(productInfo);
    productInfo.addPreProcessCallback((html) => {
      // A different product also needs its own canonical and sharing metadata.
      // Section-only variant responses have no full page head and stay native.
      const fetchedHead = html.ownerDocument.head;
      if (html.matches('main') && fetchedHead?.querySelector('link[rel="canonical"]')) {
        const metadata = 'link[rel="canonical"], meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]';
        document.head.querySelectorAll(metadata).forEach((node) => node.remove());
        fetchedHead.querySelectorAll(metadata).forEach((node) => document.head.append(node.cloneNode(true)));
      }
      html.querySelectorAll('popup-component.product-soldout-notification').forEach((popup) => {
        const purchaseForm = popup.closest('form[data-product-form]');
        if (purchaseForm) purchaseForm.after(popup);
      });
    });
  };
  document.addEventListener('theme:product-info:loaded', (event) => prepareProductSwap(event.target));
  customElements.whenDefined('product-info').then(() => {
    document.querySelectorAll('product-info').forEach(prepareProductSwap);
  });

  customElements.define('ta-vie-purchase-state', class extends HTMLElement {
    connectedCallback() {
      this.productInfo = this.closest('product-info');
      this.onVariantInput = (event) => {
        if (!event.target.matches('input[name="id"]') || event.target.form?.getAttribute('id') !== `product-form-${this.productInfo?.dataset.section}`) return;
        queueMicrotask(() => {
          if (this.isConnected) this.updateUnavailable();
        });
      };
      this.productInfo?.addEventListener('change', this.onVariantInput);
      this.updateUnavailable();
    }

    disconnectedCallback() {
      this.productInfo?.removeEventListener('change', this.onVariantInput);
    }

    updateUnavailable() {
      const input = this.productInfo?.querySelector(`#product-form-${CSS.escape(this.productInfo.dataset.section)} input[name="id"]`);
      if (!input) return;
      const mainPrice = this.productInfo.querySelector(`#Price-${CSS.escape(this.productInfo.dataset.section)}`);
      if (mainPrice) mainPrice.hidden = !input.value;
      const buttonPrice = this.productInfo.querySelector('[data-add-to-cart] [data-product-price]');
      if (buttonPrice) buttonPrice.hidden = !input.value;
      if (input.value) return;
      const bar = this.closest('cart-bar');
      const selected = this.querySelector('[data-ta-vie-selected-variant]');
      if (selected) {
        const selector = this.productInfo.querySelector('variant-selects');
        selected.textContent = Array.from(selector?.querySelectorAll('[data-selected-value]') || [])
          .map((value) => value.textContent.trim()).filter(Boolean).join(' / ');
      }
      const status = this.querySelector('[data-ta-vie-availability]');
      if (status) status.textContent = window.theme?.strings?.unavailable || '選択できません';
      const price = bar?.querySelector('.cart-bar__product__price');
      if (price) price.hidden = true;
    }
  });
}
