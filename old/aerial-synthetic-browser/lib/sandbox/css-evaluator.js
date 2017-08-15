"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var css_1 = require("../dom/css");
var CSSDependencyEvaluator = (function () {
    function CSSDependencyEvaluator() {
    }
    CSSDependencyEvaluator.prototype.evaluate = function (module) {
        module.exports = css_1.evaluateCSSSource(module.source.content, module.source.map, module);
    };
    return CSSDependencyEvaluator;
}());
exports.CSSDependencyEvaluator = CSSDependencyEvaluator;
//# sourceMappingURL=css-evaluator.js.map