"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@tandem/common");
exports.bindDOMEventMethods = function (eventTypes, target) {
    function handleDOMEventMethod(type, newListener, oldListener) {
        if (oldListener) {
            target.removeEventListener(type, newListener);
        }
        if (newListener) {
            target.addEventListener(type, newListener);
        }
    }
    eventTypes.forEach(function (eventType) {
        new common_1.PropertyWatcher(target, "on" + eventType.toLowerCase()).connect(handleDOMEventMethod.bind(target, eventType));
    });
};
exports.bindDOMNodeEventMethods = function (target) {
    var additional = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        additional[_i - 1] = arguments[_i];
    }
    exports.bindDOMEventMethods(["load"].concat(additional), target);
};
exports.getNodePath = function (element) {
    var path = [];
    var current = element;
    while (current.parentNode) {
        path.unshift(current.parentNode.childNodes.indexOf(current));
        current = current.parentNode;
    }
    return path;
};
exports.getNodeByPath = function (root, path) {
    var current = root;
    for (var i = 0, n = path.length; i < n; i++) {
        current = current.childNodes[path[i]];
        if (!current)
            break;
    }
    return current;
};
//# sourceMappingURL=index.js.map