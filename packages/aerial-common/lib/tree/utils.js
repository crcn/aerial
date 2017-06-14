"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var walker_1 = require("./walker");
function traverseTree(node, each) {
    return new walker_1.TreeWalker(each).accept(node);
}
exports.traverseTree = traverseTree;
;
function filterTree(node, filter) {
    var nodes = [];
    traverseTree(node, function (child) {
        if (filter(child))
            nodes.push(child);
    });
    return nodes;
}
exports.filterTree = filterTree;
;
function flattenTree(node) {
    return filterTree(node, function (child) { return true; });
}
exports.flattenTree = flattenTree;
;
function findTreeNode(node, filter) {
    var found;
    var walker = new walker_1.TreeWalker(function (node) {
        if (filter(node)) {
            found = node;
            return false;
        }
    });
    walker.accept(node);
    return found;
}
exports.findTreeNode = findTreeNode;
;
function getTreeAncestors(node) {
    var ancestors = [];
    var current = node.parent;
    while (current) {
        ancestors.push(current);
        current = current.parent;
    }
    return ancestors;
}
exports.getTreeAncestors = getTreeAncestors;
;
function getNextTreeSiblings(node) {
    var nextSiblings = [];
    var current = node.nextSibling;
    while (current) {
        nextSiblings.push(current);
        current = current.nextSibling;
    }
    return nextSiblings;
}
exports.getNextTreeSiblings = getNextTreeSiblings;
;
function getPreviousTreeSiblings(node) {
    var nextSiblings = [];
    var current = node.previousSibling;
    while (current) {
        nextSiblings.push(current);
        current = current.previousSibling;
    }
    return nextSiblings;
}
exports.getPreviousTreeSiblings = getPreviousTreeSiblings;
;
//# sourceMappingURL=utils.js.map