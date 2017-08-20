import { expect } from "chai";
import { TreeNode, getTreeNodeParent, walkTree, findTreeNode } from "./tree";

interface TestTreeNode extends TreeNode<TestTreeNode> {
  // id: string
};

describe(__filename + "#", () => {
  describe("getParentNode", () => {
    it("can return the parent of a node", () => {
      const tree: TestTreeNode = {
        $id: "1",
        childNodes: [
          { 
            $id: "2",
            childNodes: [
              {
                $id: "3",
                childNodes: []
              },
              {
                $id: "4",
                childNodes: []
              }
            ]
          }
        ]
      }
      const node = findTreeNode(tree, node => node.$id === "4");
      expect(node.$id).to.eql("4");
      const parentNode = getTreeNodeParent(node, tree);
      expect(parentNode.$id).to.eql("2");
    });
  });
});