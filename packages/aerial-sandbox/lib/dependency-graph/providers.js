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
var strategies_1 = require("./strategies");
var DependencyLoaderFactoryProvider = (function (_super) {
    __extends(DependencyLoaderFactoryProvider, _super);
    function DependencyLoaderFactoryProvider(mimeType, value) {
        var _this = _super.call(this, DependencyLoaderFactoryProvider.getNamespace(mimeType), value) || this;
        _this.mimeType = mimeType;
        return _this;
    }
    DependencyLoaderFactoryProvider.getNamespace = function (mimeType) {
        return [DependencyLoaderFactoryProvider.NS, mimeType].join("/");
    };
    DependencyLoaderFactoryProvider.prototype.create = function (strategy) {
        return _super.prototype.create.call(this, strategy);
    };
    DependencyLoaderFactoryProvider.find = function (mimeType, kernel) {
        return kernel.query(this.getNamespace(mimeType));
    };
    DependencyLoaderFactoryProvider.prototype.clone = function () {
        return new DependencyLoaderFactoryProvider(this.mimeType, this.value);
    };
    return DependencyLoaderFactoryProvider;
}(aerial_common_1.ClassFactoryProvider));
DependencyLoaderFactoryProvider.NS = "bundleLoader";
exports.DependencyLoaderFactoryProvider = DependencyLoaderFactoryProvider;
var DependencyGraphStrategyProvider = (function (_super) {
    __extends(DependencyGraphStrategyProvider, _super);
    function DependencyGraphStrategyProvider(name, clazz) {
        var _this = _super.call(this, DependencyGraphStrategyProvider.getNamespace(name), clazz) || this;
        _this.name = name;
        return _this;
    }
    DependencyGraphStrategyProvider.getNamespace = function (name) {
        return [DependencyGraphStrategyProvider.ID, name].join("/");
    };
    DependencyGraphStrategyProvider.create = function (strategyName, options, kernel) {
        var dependency = kernel.query(this.getNamespace(strategyName));
        return dependency ? dependency.create(options) : kernel.inject(new strategies_1.DefaultDependencyGraphStrategy(options));
    };
    return DependencyGraphStrategyProvider;
}(aerial_common_1.ClassFactoryProvider));
DependencyGraphStrategyProvider.ID = "dependencyGraphStrategies";
exports.DependencyGraphStrategyProvider = DependencyGraphStrategyProvider;
var DependencyGraphProvider = (function (_super) {
    __extends(DependencyGraphProvider, _super);
    function DependencyGraphProvider(clazz) {
        var _this = _super.call(this, DependencyGraphProvider.ID, clazz) || this;
        _this.clazz = clazz;
        _this._instances = {};
        return _this;
    }
    DependencyGraphProvider.prototype.clone = function () {
        return new DependencyGraphProvider(this.clazz);
    };
    DependencyGraphProvider.prototype.getInstance = function (options) {
        var hash = JSON.stringify(options);
        var strategyName = (options && options.name) || "default";
        if (this._instances[hash])
            return this._instances[hash];
        return this._instances[hash] = this.owner.inject(new this.clazz(DependencyGraphStrategyProvider.create(strategyName, options, this.owner)));
    };
    DependencyGraphProvider.getInstance = function (options, kernel) {
        return kernel.query(this.ID).getInstance(options);
    };
    return DependencyGraphProvider;
}(aerial_common_1.Provider));
DependencyGraphProvider.ID = "dependencyGraphs";
exports.DependencyGraphProvider = DependencyGraphProvider;
var DependencyGraphStrategyOptionsProvider = (function (_super) {
    __extends(DependencyGraphStrategyOptionsProvider, _super);
    function DependencyGraphStrategyOptionsProvider(name, test, options) {
        var _this = _super.call(this, DependencyGraphStrategyOptionsProvider.getId(name), options) || this;
        _this.name = name;
        _this.test = test;
        _this.options = options;
        return _this;
    }
    DependencyGraphStrategyOptionsProvider.getId = function (name) {
        return [this.NS, name].join("/");
    };
    DependencyGraphStrategyOptionsProvider.prototype.clone = function () {
        return new DependencyGraphStrategyOptionsProvider(this.name, this.test, this.options);
    };
    DependencyGraphStrategyOptionsProvider.find = function (uri, kernel) {
        var provider = kernel.queryAll(this.getId("**")).find(function (provider) { return provider.test(uri); });
        return provider && provider.value;
    };
    return DependencyGraphStrategyOptionsProvider;
}(aerial_common_1.Provider));
DependencyGraphStrategyOptionsProvider.NS = "dependencyGraphStrategyOptions";
exports.DependencyGraphStrategyOptionsProvider = DependencyGraphStrategyOptionsProvider;
//# sourceMappingURL=providers.js.map