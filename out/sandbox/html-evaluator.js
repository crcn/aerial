"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../dom");
var providers_1 = require("../providers");
var parse5 = require("parse5");
var HTMLDependencyEvaluator = (function () {
    function HTMLDependencyEvaluator() {
    }
    HTMLDependencyEvaluator.prototype.evaluate = function (module) {
        var window = module.sandbox.global;
        window.document.removeAllChildren();
        // documentElement must be this -- handled by browser instance. Also note
        // that we're not manually setting document element here to ensure that HTMLDependencyEvaluator works for imported docs
        // which is (slowly) being implemented in real browsers.
        dom_1.evaluateMarkup(parse5.parse(module.source.content, { locationInfo: true }), window.document, providers_1.MarkupMimeTypeXMLNSProvider.lookup(module.source.uri, window.browser.kernel), module, window.document);
    };
    return HTMLDependencyEvaluator;
}());
exports.HTMLDependencyEvaluator = HTMLDependencyEvaluator;
//# sourceMappingURL=html-evaluator.js.map