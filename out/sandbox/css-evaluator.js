"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var CSSDependencyEvaluator = (function () {
    function CSSDependencyEvaluator() {
    }
    CSSDependencyEvaluator.prototype.evaluate = function (module) {
        module.exports = __1.evaluateCSSSource(module.source.content, module.source.map, module);
    };
    return CSSDependencyEvaluator;
}());
exports.CSSDependencyEvaluator = CSSDependencyEvaluator;
//# sourceMappingURL=css-evaluator.js.map