import collectRefs from '../../util/collectRefs.js';
import router from '../../util/router.js';

// styles
import styles from './search-result.less';

const template = document.createElement('template');

template.innerHTML = `
  <style>${ styles.toString() }</style>
  <app-card hollow>
    <h3 class="${ styles.locals.search__result_title }">
      <span ref="title"></span>
      <app-icon type="action"></app-icon>
    </h3>
    <p ref="year" class="${ styles.locals.search__result_year }"></p>
  </app-card>
`;

class SearchResult extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.goToMovie = this.goToMovie.bind(this);
  }

  connectedCallback() {
    // get refs
    collectRefs.call(this);

    this.refs.title.textContent = this.getAttribute('title');
    this.refs.year.textContent = this.getAttribute('year');

    this.addEventListener('click', this.goToMovie);
  }

  goToMovie() {
    router.navigate(`movie/${ this.getAttribute('mid') }`);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.goToMovie);
  }
}

window.customElements.define('search-result', SearchResult);
