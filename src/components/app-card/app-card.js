import collectRefs from '../../util/collectRefs.js';

// styles
import styles from './app-card.less';

const template = document.createElement('template');

template.innerHTML = `
  <style>${ styles.toString() }</style>
  <slot></slot>
`;

class AppCard extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  get hollow() {
    return this.hasAttribute('hollow');
  }

  set hollow(value) {
    const isHollow = Boolean(value);

    if (isHollow === true) {
      this.setAttribute('hollow', '');
    } else {
      this.removeAttribute('hollow');
    }
  }
}

window.customElements.define('app-card', AppCard);
