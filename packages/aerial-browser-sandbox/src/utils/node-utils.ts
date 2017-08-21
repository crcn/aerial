
export const getNodePath = (node: Node, root: Node) => {
  const path = [];
  let current = node;
  while(current !== root) {
    path.unshift(Array.prototype.indexOf.call(current.parentNode.childNodes, current));
    current = current.parentNode;
  }
  return path;
}

export const getNodeByPath = (path: string[], root: Node) => {
  let current = root;
  for (const part of path) {
    current = current.childNodes[part];
  }
  return current;
}