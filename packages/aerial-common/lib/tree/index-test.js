"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("..");
describe(__filename + "#", function () {
    it("can create a new node", function () {
        new __1.TreeNode();
    });
    it("can add a new child", function () {
        var node = new __1.TreeNode();
        node.appendChild(new __1.TreeNode());
        chai_1.expect(node.children.length).to.equal(1);
    });
    it("can remove a child", function () {
        var node = new __1.TreeNode();
        node.appendChild(new __1.TreeNode());
        chai_1.expect(node.children.length).to.equal(1);
        node.removeChild(node.children[0]);
        chai_1.expect(node.children.length).to.equal(0);
    });
    it("returns the parent node", function () {
        var parent = new __1.TreeNode();
        var child = new __1.TreeNode();
        parent.appendChild(child);
        chai_1.expect(child.parent).to.equal(parent);
    });
    it("removes a child from an existing parent when moving to another", function () {
        var parent = new __1.TreeNode();
        var parent2 = new __1.TreeNode();
        var child = new __1.TreeNode();
        parent.appendChild(child);
        chai_1.expect(parent.children.length).to.equal(1);
        parent2.appendChild(child);
        chai_1.expect(child.parent).to.equal(parent2);
        chai_1.expect(parent.children.length).to.equal(0);
    });
    it("can return the ancestors of a child", function () {
        var p1 = new __1.TreeNode();
        var p2 = new __1.TreeNode();
        var p3 = new __1.TreeNode();
        p1.appendChild(p2);
        p2.appendChild(p3);
        var ancenstors = p3.ancestors;
        chai_1.expect(ancenstors.length).to.equal(2);
        chai_1.expect(ancenstors[0]).to.equal(p2);
        chai_1.expect(ancenstors[1]).to.equal(p1);
    });
    it("can return the root", function () {
        var p1 = new __1.TreeNode();
        var p2 = new __1.TreeNode();
        var p3 = new __1.TreeNode();
        p1.appendChild(p2);
        p2.appendChild(p3);
        chai_1.expect(p3.root).to.equal(p1);
    });
    it("can return the depth", function () {
        var p1 = new __1.TreeNode();
        var p2 = new __1.TreeNode();
        var p3 = new __1.TreeNode();
        p1.appendChild(p2);
        p2.appendChild(p3);
        chai_1.expect(p3.depth).to.equal(2);
    });
    it("can return the next sibling", function () {
        var p1 = new __1.TreeNode();
        var c1 = new __1.TreeNode();
        var c2 = new __1.TreeNode();
        p1.appendChild(c1);
        p1.appendChild(c2);
        chai_1.expect(c1.nextSibling).to.equal(c2);
    });
    it("can return the previous sibling", function () {
        var p1 = new __1.TreeNode();
        var c1 = new __1.TreeNode();
        var c2 = new __1.TreeNode();
        p1.appendChild(c1);
        p1.appendChild(c2);
        chai_1.expect(c2.previousSibling).to.equal(c1);
    });
    it("can return the first child", function () {
        var p1 = new __1.TreeNode();
        var c1 = new __1.TreeNode();
        var c2 = new __1.TreeNode();
        p1.appendChild(c1);
        p1.appendChild(c2);
        chai_1.expect(p1.firstChild).to.equal(c1);
    });
    it("can return the last child", function () {
        var p1 = new __1.TreeNode();
        var c1 = new __1.TreeNode();
        var c2 = new __1.TreeNode();
        p1.appendChild(c1);
        p1.appendChild(c2);
        chai_1.expect(p1.lastChild).to.equal(c2);
    });
    it("can remove a child in the removing message without removing other parent children", function () {
        var p1 = new __1.TreeNode();
        var c1 = new __1.TreeNode();
        var c2 = new __1.TreeNode();
        p1.appendChild(c1);
        p1.appendChild(c2);
        var _ignoreAction = false;
        p1.observe({
            dispatch: function (event) {
                if (_ignoreAction)
                    return;
                _ignoreAction = true;
                if (event.type === __1.MutationEvent.MUTATION && (event.mutation.type === __1.TreeNodeMutationTypes.NODE_REMOVED)) {
                    event.target.parent.removeChild(event.target);
                }
                _ignoreAction = false;
            }
        });
        p1.removeChild(c1);
        chai_1.expect(p1.children.indexOf(c2)).to.equal(0);
    });
});
//# sourceMappingURL=index-test.js.map