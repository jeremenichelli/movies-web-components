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
}

window.customElements.define('loading-bar', LoadingBar);
