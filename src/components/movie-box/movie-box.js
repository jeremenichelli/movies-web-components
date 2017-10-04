import collectRefs from '../../util/collectRefs.js';
import emitter from '../../util/emitter.js';
import getMovie from '../../services/movie.js';

// styles
import styles from './movie-box.less';

const template = document.createElement('template');

template.innerHTML = `
  <style>${ styles.toString() }</style>
  <app-card ref="card">
    <h3 class="${ styles.locals.movie__title }" ref="title"></h3>
    <h4 class="${ styles.locals.movie__tagline }" ref="tagline"></h4>
    <dl class="${ styles.locals.movie__data }">
      <dt>Released</dt>
      <dd ref="released"></dd>
      <dt>Runtime</dt>
      <dd ref="runtime"></dd>
      <dt>User Rating</dt>
      <dd ref="rating"></dd>
    </dl>
    <img class="${ styles.locals.movie__thumb }" alt="" ref="image"/>
    <p class="${ styles.locals.movie__plot }">
      <span class="${ styles.locals.movie__plot__label }">Plot</span>
      <span ref="overview"></span>
    </p>
  </app-card>
`;

const BASE_POSTER_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

class MovieBox extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // get refs
    collectRefs.call(this);

    const movieId = this.getAttribute('mid');
    const dataFromStorage = JSON.parse(sessionStorage.getItem(movieId));

    // restore from local storage if available
    if (dataFromStorage !== null) {
      return this.renderCard(dataFromStorage);
    }

    // get movie data from database
    getMovie(movieId)
      .then(data => {
        this.renderCard(data);
        sessionStorage.setItem(movieId, JSON.stringify(data));
      })
      .catch(error => console.log(error));
  }

  renderCard(data) {
    // populate data
    this.refs.title.textContent = data.title;
    this.refs.tagline.textContent = data.tagline;
    this.refs.released.textContent = data.release_date ? data.release_date.slice(0, 4) : '-';
    this.refs.runtime.innerHTML = `${ data.runtime }&nbsp;min.`;
    this.refs.rating.textContent = data.vote_average;
    this.refs.overview.textContent = data.overview;
    this.refs.image.src = BASE_POSTER_URL + data.poster_path;

    // make box visible
    this.refs.card.setAttribute('loaded', '');

    // hide loading bar
    setTimeout(() => {
      emitter.emit('onloadingended', null);
    }, 100);
  }
}

window.customElements.define('movie-box', MovieBox);
