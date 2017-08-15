"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
/**
 * Constants
 */
exports.DOM_TEXT_NODE = "DOM_TEXT_NODE";
exports.DOM_ELEMENT = "DOM_ELEMENT";
exports.DOM_DOCUMENT = "DOM_DOCUMENT";
exports.DOM_COMMENT = "DOM_COMMENT";
exports.SYTNTHETIC_BROWSER_WINDOW = "SYNTHETIC_BROWSER_WINDOW";
exports.SYNTHETIC_BROWSER = "SYNTHETIC_BROWSER";
var DEFAULT_SYNTHETIC_WINDOW_BOX = {
    left: 0,
    top: 0,
    // small screen size
    right: 800,
    bottom: 600
};
exports.isSyntheticDOMNode = function (value) { return value && value.nodeType != null; };
/**
 * Utilities
 */
exports.createSyntheticBrowser2 = aerial_common2_1.createStructFactory(exports.SYNTHETIC_BROWSER, {
    windows: []
});
exports.createSyntheticBrowserWindow2 = aerial_common2_1.createStructFactory(exports.SYTNTHETIC_BROWSER_WINDOW, {
    computedStyles: {},
    computedBoxes: {},
    box: DEFAULT_SYNTHETIC_WINDOW_BOX
});
exports.getSyntheticBrowserWindow = function (root, id) {
    return aerial_common2_1.getValueById(root, id);
};
exports.getSyntheticBrowser = function (root, id) {
    return aerial_common2_1.getValueById(root, id);
};
exports.findSyntheticDOMNodes = aerial_common2_1.weakMemo(function (root, filter) {
    var found = [];
    aerial_common2_1.traverseObject(root, function (item) {
        if (exports.isSyntheticDOMNode(item) && filter(item)) {
            found.push(item);
        }
    });
    return found;
});
exports.getAllSyntheticDOMNodes = aerial_common2_1.weakMemo(function (root) { return exports.findSyntheticDOMNodes(root, function () { return true; }); });
exports.getAllSyntheticDOMNodesAsIdMap = aerial_common2_1.weakMemo(function (root) {
    var allNodes = exports.getAllSyntheticDOMNodes(root);
    var map = {};
    for (var _i = 0, allNodes_1 = allNodes; _i < allNodes_1.length; _i++) {
        var node = allNodes_1[_i];
        map[node.$$id] = node;
    }
    return map;
});
//# sourceMappingURL=index.js.map