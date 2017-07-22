import { weakMemo } from "../memo";
import { IDd } from "./utils";

export interface TreeNode<TChild extends TreeNode<any>> extends IDd {
  childNodes: TChild[]
}

export const findTreeNode = <TTree extends TreeNode<any>>(node: TTree, filter: (node: TTree) => any) => {
  let found: TTree;
  walkTree(node, (node) => {
    if (filter(node)) {
      found = node;
      return false;
    }
  });
  return found;
};

export const getTreeNodeDepth = weakMemo(<TTree extends TreeNode<any>>(child: TTree, root: TTree) => {
  let depth = 0;
  walkTree(root, (parent) => {
    depth++;
    if (parent.childNodes.indexOf(child) !== -1) {
      return false;
    }
  });
  return depth;
}) as <TTree extends TreeNode<any>>(child: TTree, root: TTree) => number;

export const getTreeNodeParent = weakMemo(<TTree extends TreeNode<any>>(child: TTree, root: TTree) => findTreeNode(root, (node) => node.childNodes.indexOf(child) !== -1)) as <TTree extends TreeNode<any>>(child: TTree, root: TTree) => TTree;

export const walkTree = <TTree extends TreeNode<any>>(node: TTree, eachNode: (node: TTree) => void | boolean) => {
  if (eachNode(node) !== false) {
    node.childNodes.forEach(node => walkTree(node, eachNode));
  }
};
