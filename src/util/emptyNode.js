export default function emptyNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

  if (node.innerText) {
    node.innerText = '';
  }
}
