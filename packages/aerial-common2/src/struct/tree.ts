import { weakMemo } from "../memo";

export type TreeNode<TProps> = TProps & {
  childNodes: TreeNode<TProps>[]
};


export const findTreeNode = <T>(node: TreeNode<T>, filter: (node: TreeNode<T>) => any) => {
  let found: TreeNode<T>;
  walkTree(node, (node) => {
    if (filter(node)) {
      found = node;
      return false;
    }
  });
  return found;
};

export const getTreeNodeDepth = weakMemo(<T>(child: TreeNode<T>, root: TreeNode<T>) => {
  let depth = 0;
  walkTree(root, (parent) => {
    depth++;
    if (parent.childNodes.indexOf(child) !== -1) {
      return false;
    }
  });
  return depth;
}) as <T>(child: TreeNode<T>, root: TreeNode<T>) => number;

export const getTreeNodeParent = weakMemo(<T>(child: TreeNode<T>, root: TreeNode<T>) => findTreeNode(root, (node) => node.childNodes.indexOf(child) !== -1)) as <T>(child: TreeNode<T>, root: TreeNode<T>) => TreeNode<T>;

export const walkTree = <T>(node: TreeNode<T>, eachNode: (node: TreeNode<T>) => void | boolean) => {
  if (eachNode(node) !== false) {
    node.childNodes.forEach(node => walkTree(node, eachNode));
  }
};
