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
var SandboxModuleEvaluatorFactoryProvider = (function (_super) {
    __extends(SandboxModuleEvaluatorFactoryProvider, _super);
    function SandboxModuleEvaluatorFactoryProvider(mimeType, clazz) {
        var _this = _super.call(this, SandboxModuleEvaluatorFactoryProvider.getNamespace(mimeType), clazz) || this;
        _this.mimeType = mimeType;
        return _this;
    }
    SandboxModuleEvaluatorFactoryProvider.prototype.clone = function () {
        return new SandboxModuleEvaluatorFactoryProvider(this.mimeType, this.value);
    };
    SandboxModuleEvaluatorFactoryProvider.getNamespace = function (mimeType) {
        return [this.ID, mimeType].join("/");
    };
    SandboxModuleEvaluatorFactoryProvider.prototype.create = function () {
        return _super.prototype.create.call(this);
    };
    SandboxModuleEvaluatorFactoryProvider.find = function (mimeType, kernel) {
        return kernel.query(this.getNamespace(mimeType));
    };
    return SandboxModuleEvaluatorFactoryProvider;
}(aerial_common_1.ClassFactoryProvider));
SandboxModuleEvaluatorFactoryProvider.ID = "sandboxModuleEvaluator";
exports.SandboxModuleEvaluatorFactoryProvider = SandboxModuleEvaluatorFactoryProvider;
//# sourceMappingURL=providers.js.map