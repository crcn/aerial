"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
var state_1 = require("../state");
var dom_1 = require("../../dom");
var actions_1 = require("../actions");
exports.syntheticBrowserReducer = function (root, event) {
    switch (event.type) {
        case actions_1.OPEN_SYNTHETIC_WINDOW_REQUESTED: {
            var _a = event, location_1 = _a.location, syntheticBrowserId = _a.syntheticBrowserId;
            var browser = state_1.getSyntheticBrowser(root, syntheticBrowserId);
            return aerial_common2_1.updateStructProperty(root, browser, "windows", browser.windows.concat(state_1.createSyntheticBrowserWindow2({
                location: location_1
            })));
        }
        case aerial_common2_1.REMOVED: {
            var _b = event, itemId = _b.itemId, itemType = _b.itemType;
            if (itemType === state_1.SYTNTHETIC_BROWSER_WINDOW) {
                return aerial_common2_1.deleteValueById(root, itemId);
            }
        }
    }
    root = syntheticBrowserWindowReducer(root, event);
    return root;
};
var syntheticBrowserWindowReducer = function (root, event) {
    switch (event.type) {
        case actions_1.LEGACY_SYNTHETIC_DOM_CHANGED: {
            return updateDOMFromLegacyMutation(root, event);
        }
        case aerial_common2_1.RESIZED: {
            var _a = event, itemId = _a.itemId, itemType = _a.itemType, box = _a.box;
            if (itemType === state_1.SYTNTHETIC_BROWSER_WINDOW) {
                var window_1 = state_1.getSyntheticBrowserWindow(root, itemId);
                if (window_1) {
                    return aerial_common2_1.updateStructProperty(root, window_1, "box", box);
                }
                break;
            }
        }
        case aerial_common2_1.MOVED: {
            var _b = event, itemId = _b.itemId, itemType = _b.itemType, point = _b.point;
            if (itemType === state_1.SYTNTHETIC_BROWSER_WINDOW) {
                var window_2 = state_1.getSyntheticBrowserWindow(root, itemId);
                if (window_2) {
                    return aerial_common2_1.updateStructProperty(root, window_2, "box", aerial_common2_1.moveBounds(window_2.box, point));
                }
                break;
            }
        }
        case actions_1.SYNTHETIC_WINDOW_TITLE_CHANGED: {
            var _c = event, title = _c.title, syntheticWindowId = _c.syntheticWindowId;
            var window_3 = state_1.getSyntheticBrowserWindow(root, syntheticWindowId);
            return aerial_common2_1.updateStructProperty(root, window_3, "title", title);
        }
        case actions_1.SYNTHETIC_WINDOW_MOUNT_CHANGED: {
            var _d = event, syntheticWindowId = _d.syntheticWindowId, mount = _d.mount;
            var window_4 = state_1.getSyntheticBrowserWindow(root, syntheticWindowId);
            return aerial_common2_1.updateStructProperty(root, window_4, "mount", mount);
        }
    }
    return root;
};
var updateDOMFromLegacyMutation = function (root, _a) {
    var mutation = _a.mutation, syntheticWindowId = _a.syntheticWindowId, legacyDocument = _a.legacyDocument;
    if (!mutation) {
        var window_5 = state_1.getSyntheticBrowserWindow(root, syntheticWindowId);
        if (!window_5)
            return root;
        return aerial_common2_1.updateStructProperty(root, state_1.getSyntheticBrowserWindow(root, syntheticWindowId), "document", mapLegacyDOMNodeToPOJO(legacyDocument));
    }
    return root;
};
var mapLegacyDOMNodeToPOJO = function (node) {
    var base = {
        $$id: node.$uid,
        $source: node.$source,
        nodeName: node.nodeName,
        nodeType: node.nodeType,
        childNodes: node.childNodes.map(mapLegacyDOMNodeToPOJO)
    };
    if (node.nodeType === dom_1.DOMNodeType.DOCUMENT) {
        return __assign({}, base, { $$type: state_1.DOM_DOCUMENT });
    }
    else if (node.nodeType === dom_1.DOMNodeType.ELEMENT) {
        var element = node;
        var attrs_1 = {};
        element.attributes.forEach(function (attr) { return attrs_1[attr.name] = attr.value; });
        return __assign({}, base, { attributes: attrs_1, $$type: state_1.DOM_ELEMENT });
    }
    else if (node.nodeType === dom_1.DOMNodeType.TEXT || node.nodeType === dom_1.DOMNodeType.COMMENT) {
        return __assign({}, base, { nodeValue: node.nodeValue, $$type: node.nodeType === dom_1.DOMNodeType.TEXT ? state_1.DOM_TEXT_NODE : state_1.DOM_COMMENT });
    }
    return base;
};
//# sourceMappingURL=index.js.map