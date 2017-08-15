"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aerial_common_1 = require("aerial-common");
var test_1 = require("../test");
var chalk = require("chalk");
var __1 = require("..");
var aerial_sandbox_1 = require("aerial-sandbox");
describe(__filename + "#", function () {
    [
        // All single edits
        ["a", "b", [__1.SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT]],
        ["<!--a-->", "<!--b-->", [__1.SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT]],
        ["<div />", "<span></span>", [__1.SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT, __1.SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT]],
        ["<div></div><span></span>", "<span></span>", [__1.SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT, aerial_sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
        ["<div />", "<div></div><span></span>", [__1.SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT]],
        ["<span></span><div></div>", "<div></div><span></span>", [__1.SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT, aerial_sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, aerial_sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
        ["<div id=\"b\"></div>", "<div id=\"c\"></div>", [__1.SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT]],
        ["<div id=\"b\"></div>", "<div></div>", [__1.SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT]],
    ].forEach(function (_a) {
        var oldSource = _a[0], newSource = _a[1], messageNames = _a[2];
        it("diffs & patches " + oldSource + " to " + newSource + " with " + messageNames.join(" ") + " ops", function () {
            var document = new __1.SyntheticWindow(null).document;
            var anode = document.createElement("div");
            anode.innerHTML = oldSource;
            var bnode = document.createElement("div");
            bnode.innerHTML = newSource;
            var edit = anode.createEdit().fromDiff(bnode);
            chai_1.expect(edit.mutations.map(function (message) { return message.type; })).to.eql(messageNames);
            edit.applyMutationsTo(anode);
            chai_1.expect(anode.innerHTML).to.equal(newSource);
        });
    });
    it("can apply an insert diff to multiple child nodes", function () {
        var document = new __1.SyntheticWindow(null).document;
        var a = document.createElement("div");
        a.innerHTML = "<div>hello</div>";
        var b = document.createElement("div");
        var c = b.clone(true);
        var edit = b.createEdit().fromDiff(a);
        edit.applyMutationsTo(b);
        edit.applyMutationsTo(c);
        chai_1.expect(b.innerHTML).to.equal("<div>hello</div>");
        chai_1.expect(c.innerHTML).to.equal("<div>hello</div>");
    });
    // fuzzy testing
    it("diff & patch a set or random HTML elements", function () {
        for (var i = 50; i--;) {
            var document_1 = new __1.SyntheticWindow(null).document;
            var a = document_1.createElement("div");
            var b = document_1.createElement("div");
            a.appendChild(test_1.generateRandomSyntheticHTMLElement(document_1, 8, 4, 5));
            b.appendChild(test_1.generateRandomSyntheticHTMLElement(document_1, 8, 4, 5));
            a.createEdit().fromDiff(b).applyMutationsTo(a);
            var mutations = a.createEdit().fromDiff(b).mutations;
            chai_1.expect(mutations.length).to.equal(0, "\n\n        " + chalk.magenta(a.innerHTML) + " -> " + chalk.green(b.innerHTML) + "\n\n        Trying to apply edit.mutations from node that should be identical: " + mutations.map(function (message) { return message.type; }) + "\n      ");
        }
    });
    it("patches the source of each synthetic object", function () {
        for (var i = 10; i--;) {
            var document_2 = new __1.SyntheticWindow(null).document;
            var a = document_2.createElement("div");
            var b = document_2.createElement("div");
            a.appendChild(test_1.generateRandomSyntheticHTMLElement(document_2, 8, 4, 5));
            b.appendChild(test_1.generateRandomSyntheticHTMLElement(document_2, 8, 4, 5));
            a.createEdit().fromDiff(b).applyMutationsTo(a);
            var asources = aerial_common_1.flattenTree(a).map(function (node) { return node.source; });
            var bsources = aerial_common_1.flattenTree(b).map(function (node) { return node.source; });
            chai_1.expect(JSON.stringify(asources)).to.eql(JSON.stringify(bsources));
        }
    });
});
//# sourceMappingURL=dom-diff-test.js.map