"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common_1 = require("aerial-common");
var DependencyWalker = (function (_super) {
    __extends(DependencyWalker, _super);
    function DependencyWalker(each) {
        var _this = _super.call(this, each) || this;
        _this._walked = {};
        return _this;
    }
    DependencyWalker.prototype.accept = function (dependency) {
        if (this._walked[dependency.hash])
            return;
        this._walked[dependency.hash] = true;
        _super.prototype.accept.call(this, dependency);
    };
    return DependencyWalker;
}(aerial_common_1.TreeWalker));
exports.DependencyWalker = DependencyWalker;
function flattenDependencies(root) {
    var deps = [];
    new DependencyWalker(function (dependency) {
        deps.push(dependency);
    }).accept(root);
    return deps;
}
exports.flattenDependencies = flattenDependencies;
//# sourceMappingURL=utils.js.map