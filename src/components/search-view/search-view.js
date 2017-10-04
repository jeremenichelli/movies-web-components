import collectRefs from '../../util/collectRefs.js';
import emptyNode from '../../util/emptyNode.js';
import emitter from '../../util/emitter.js';
import search from '../../services/search.js';

// components
import '../search-result/search-result.js';
import '../search-box/search-box.js';

// styles
import styles from './search-view.less';

const template = document.createElement('template');

template.innerHTML = `
  <style>${ styles.toString() }</style>
  <search-box></search-box>
  <p class="${ styles.locals.message }" ref="message"></p>
  <app-card hollow>
    <ul class="${ styles.locals.search__results }" ref="results"></ul>
  </app-card>
  <app-card hollow>
    <a hidden href="#" class="${ styles.locals.more }" ref="more">Load more results</a>
  </app-card>
`;

const noResults = [];

class SearchView extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.fetchMoreResults = this.fetchMoreResults.bind(this);
  }

  connectedCallback() {
    // get refs
    collectRefs.call(this);

    this.refs.more.addEventListener('click', this.fetchMoreResults);

    // recover data if available
    const persistData = JSON.parse(sessionStorage.getItem('searchData'));

    if (persistData !== null) {
      this.searchTitle = persistData.searchTitle;
      this.totalResults = persistData.total_results;
      this.noResults = persistData.noResults;
      this.results = persistData.results;

      this.refs.message.innerHTML = `<em>Search results for &laquo;${ this.searchTitle }&raquo;</em>`;
      this.appendResults(this.results);
    }

    // lsiten to events
    emitter.on('onsearchstarted', (data) => {
      this.resetData(data);
    });

    emitter.on('onsearchended', (data) => {
      if (data.results.length !== 0) {
        this.totalResults = data.total_results;
        this.results = data.results;

        this.appendResults(data.results);
      } else {
        sessionStorage.removeItem('searchData');
        this.refs.message.innerHTML = `<em>No results for &laquo;${ this.searchTitle }&raquo;</em>`;
      }
    });
  }

  disconnectedCallback() {
    const persistData = {
      searchTitle: this.searchTitle,
      totalResults: this.totalResults,
      results: this.results,
      pageResults: this.pageResults
    }

    // save data for back action
    sessionStorage.setItem('searchData', JSON.stringify(persistData));
  }

  appendResults(results) {
    // populate message
    if (this.pageResults === 1) {
      this.refs.message.innerHTML = `<em>Search results for &laquo;${ this.searchTitle }&raquo;</em>`;
    }

    results.map(m => {
      // create search result element
      const searchResult = document.createElement('search-result');
      searchResult.setAttribute('mid', m.id);
      searchResult.setAttribute('title', m.title);
      searchResult.setAttribute('year', m.release_date.substring(0,4));

      // append to results container
      this.refs.results.appendChild(searchResult);
    });

    // show/hide more action
    this.refs.more.hidden = !(this.results.length < this.totalResults && this.results.length);
  }

  resetData(data) {
    // clear result list
    emptyNode(this.refs.results);
    emptyNode(this.refs.message);

    // clear data props
    this.results = noResults;
    this.pageResults = 1;
    this.searchTitle = data && data.searchTitle;
    this.totalResults = 0;

    // hide more action
    this.refs.more.hidden = true;
  }

  fetchMoreResults(e) {
    e.preventDefault();

    emitter.emit('onloadingstarted', {});

    search(this.searchTitle, ++this.pageResults)
      .then(data => {
        emitter.emit('onloadingended', null);

        // update results property
        this.results = this.results.concat(data.results);

        // append only new results
        this.appendResults(data.results);

        emitter.emit('onloadingended', {});
      });
  }
}

window.customElements.define('search-view', SearchView);
