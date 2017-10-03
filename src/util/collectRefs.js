export default function collectRefs() {
  const refsArray = [ ...this.shadowRoot.querySelectorAll('[ref]') ];

  if (refsArray.length > 0) {
    this.refs = {};
    refsArray.map(el => {
      this.refs[ el.getAttribute('ref') ] = el;
      el.removeAttribute('ref');
    });
  }
}
