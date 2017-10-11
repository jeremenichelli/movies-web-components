import collectRefs from 'web-component-refs';
import svgs from '../../util/svgs.js'

// styles
import styles from './app-icon.less';

const template = document.createElement('template');

template.innerHTML = `
  <style>${ styles.toString() }</style>
  <svg
    class="${ styles.locals.icon }"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    ref="svg"
  >
  </svg>
`;

class AppIcon extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // get refs
    collectRefs.call(this);
  }

  connectedCallback() {
    if (this.hasAttribute('type') === true) {
      this.refs.svg.innerHTML = svgs[ this.getAttribute('type') ];
    }
  }
}

window.customElements.define('app-icon', AppIcon);
