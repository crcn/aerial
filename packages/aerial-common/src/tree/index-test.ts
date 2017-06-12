import { expect } from "chai";
import { MutationEvent, CoreEvent, TreeNode, TreeNodeMutationTypes } from "@tandem/common";

describe(__filename + "#", () => {
  it("can create a new node", () => {
    new TreeNode();
  });

  it("can add a new child", () => {
    const node = new TreeNode();
    node.appendChild(new TreeNode());
    expect(node.children.length).to.equal(1);
  });

  it("can remove a child", () => {
    const node = new TreeNode();
    node.appendChild(new TreeNode());
    expect(node.children.length).to.equal(1);
    node.removeChild(node.children[0]);
    expect(node.children.length).to.equal(0);
  });

  it("returns the parent node", () => {
    const parent = new TreeNode();
    const child  = new TreeNode();
    parent.appendChild(child);
    expect(child.parent).to.equal(parent);
  });

  it("removes a child from an existing parent when moving to another", () => {

    const parent = new TreeNode();
    const parent2  = new TreeNode();
    const child  = new TreeNode();
    parent.appendChild(child);
    expect(parent.children.length).to.equal(1);
    parent2.appendChild(child);
    expect(child.parent).to.equal(parent2);
    expect(parent.children.length).to.equal(0);
  });

  it("can return the ancestors of a child", () => {

    const p1 = new TreeNode();
    const p2 = new TreeNode();
    const p3 = new TreeNode();

    p1.appendChild(p2);
    p2.appendChild(p3);
    const ancenstors = p3.ancestors;
    expect(ancenstors.length).to.equal(2);
    expect(ancenstors[0]).to.equal(p2);
    expect(ancenstors[1]).to.equal(p1);
  });

  it("can return the root", () => {

    const p1 = new TreeNode();
    const p2 = new TreeNode();
    const p3 = new TreeNode();

    p1.appendChild(p2);
    p2.appendChild(p3);
    expect(p3.root).to.equal(p1);
  });

  it("can return the depth", () => {

    const p1 = new TreeNode();
    const p2 = new TreeNode();
    const p3 = new TreeNode();

    p1.appendChild(p2);
    p2.appendChild(p3);
    expect(p3.depth).to.equal(2);
  });


  it("can return the next sibling", () => {

    const p1 = new TreeNode();
    const c1 = new TreeNode();
    const c2 = new TreeNode();

    p1.appendChild(c1);
    p1.appendChild(c2);
    expect(c1.nextSibling).to.equal(c2);
  });

  it("can return the previous sibling", () => {

    const p1 = new TreeNode();
    const c1 = new TreeNode();
    const c2 = new TreeNode();

    p1.appendChild(c1);
    p1.appendChild(c2);
    expect(c2.previousSibling).to.equal(c1);
  });

  it("can return the first child", () => {

    const p1 = new TreeNode();
    const c1 = new TreeNode();
    const c2 = new TreeNode();

    p1.appendChild(c1);
    p1.appendChild(c2);
    expect(p1.firstChild).to.equal(c1);
  });

  it("can return the last child", () => {

    const p1 = new TreeNode();
    const c1 = new TreeNode();
    const c2 = new TreeNode();

    p1.appendChild(c1);
    p1.appendChild(c2);
    expect(p1.lastChild).to.equal(c2);
  });

  it("can remove a child in the removing message without removing other parent children", () => {
    const p1 = new TreeNode();
    const c1 = new TreeNode();
    const c2 = new TreeNode();
    p1.appendChild(c1);
    p1.appendChild(c2);

    let _ignoreAction = false;

    p1.observe({
      dispatch(event: CoreEvent) {
        if (_ignoreAction) return;
        _ignoreAction = true;
        if (event.type === MutationEvent.MUTATION && ((<MutationEvent<any>>event).mutation.type === TreeNodeMutationTypes.NODE_REMOVED)) {
          event.target.parent.removeChild(event.target);
        }
        _ignoreAction = false;
      }
    });


    p1.removeChild(c1);

    expect(p1.children.indexOf(c2)).to.equal(0);
  });
});