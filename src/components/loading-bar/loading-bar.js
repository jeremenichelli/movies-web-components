// styles
import styles from './loading-bar.less';

const template = document.createElement('template');

template.innerHTML = `
  <style>${ styles.toString() }</style>
  <div class=${ styles.locals.indeterminate} ></div>
`;

class LoadingBar extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  set visible(value) {
    if (Boolean(value) === true) {
      this.setAttribute('visible', '');
    } else {
      this.removeAttribute('visible');
    }
  }

  get visible() {
    return this.hasAttribute('visible');
  }
}

window.customElements.define('loading-bar', LoadingBar);
