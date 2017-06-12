import { ITreeNode } from "./core";
import { IWalkable, TreeWalker } from "./walker";

export function traverseTree<T extends IWalkable>(node: T, each: (node: T) => any) {
  return new TreeWalker(each).accept(node);
};

export function filterTree<T extends IWalkable>(node: T, filter: (node: T) => boolean): T[] {
  const nodes = [];
  traverseTree(node, (child) => {
    if (filter(child)) nodes.push(child);
  });
  return nodes;
};

export function flattenTree<T extends IWalkable>(node: T): T[] {
  return filterTree(node, child => true);
};

export function findTreeNode<T extends IWalkable>(node: T, filter: (node: any) => boolean): T {
  let found;

  const walker = new TreeWalker((node) => {
    if (filter(node)) {
      found = node;
      return false;
    }
  });

  walker.accept(node);

  return found;
};

export function getTreeAncestors<T extends ITreeNode<any>>(node: T): T[] {
  const ancestors = [];
  let current = node.parent;
  while (current) {
    ancestors.push(current);
    current = current.parent;
  }
  return ancestors;
};

export function getNextTreeSiblings<T extends ITreeNode<any>>(node: T): T[] {
  const nextSiblings = [];
  let current = node.nextSibling;
  while (current) {
    nextSiblings.push(current);
    current = current.nextSibling;
  }
  return nextSiblings;
};

export function getPreviousTreeSiblings<T extends ITreeNode<any>>(node: T): T[] {
  const nextSiblings = [];
  let current = node.previousSibling;
  while (current) {
    nextSiblings.push(current);
    current = current.previousSibling;
  }
  return nextSiblings;
};