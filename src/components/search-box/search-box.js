import collectRefs from 'web-component-refs';
import emitter from '../../util/emitter.js';
import search from '../../services/search.js';

// styles
import styles from './search-box.less';

const template = document.createElement('template');

template.innerHTML = `
  <style>${ styles.toString() }</style>
  <app-card hollow>
    <form action="?" class="${ styles.locals.search__form }" ref="form">
      <input type="text" placeholder="Search" class="${ styles.locals.search__input }" ref="input"/>
      <button type="submit" class="${ styles.locals.search__button }" ref="button" disabled>
        <app-icon type="search"></app-icon>
      </button>
    </form>
  </app-card>
`;

class SearchBox extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.onSearch = this.onSearch.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  connectedCallback() {
    // get refs
    collectRefs.call(this);

    this.refs.form.addEventListener('submit', this.onSearch);
    this.refs.input.addEventListener('keyup', this.onInputChange);
  }

  onSearch(e) {
    e.preventDefault();

    // get value from input
    const query = this.refs.input.value;

    // emit button
    emitter.emit('onloadingstarted', null);
    emitter.emit('onsearchstarted', { searchTitle: query });

    // disabled button and input while searching
    this.refs.button.disabled = true;
    this.refs.input.disabled = true;

    search(query, 1)
      .then(data => {
        // emit search results
        emitter.emit('onsearchended', data);
        emitter.emit('onloadingended', null);

        this.refs.button.disabled = false;
        this.refs.input.disabled = false;
      });
  }

  onInputChange(e) {
    if (e.target.value === '') {
      this.refs.button.disabled = true;
    } else {
      this.refs.button.disabled = false;
    }
  }
}

window.customElements.define('search-box', SearchBox);
