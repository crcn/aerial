"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var markup_1 = require("../markup");
var _testers = {};
function getSelectorTester(selectorSource, start) {
    if (_testers[selectorSource])
        return _testers[selectorSource];
    var syntheticWindow = start.nodeType === markup_1.DOMNodeType.DOCUMENT ? start.defaultView : start.ownerDocument.defaultView;
    var selector = selectorSource = selectorSource.replace(/:?:(before|after)/g, "");
    var nw = syntheticWindow.selector;
    return _testers[selectorSource] = {
        source: selectorSource,
        test: function (element) { return element.nodeType == markup_1.DOMNodeType.ELEMENT && nw.match(element, selector); }
    };
}
exports.getSelectorTester = getSelectorTester;
//# sourceMappingURL=tester.js.map