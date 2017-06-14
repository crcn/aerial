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
var ioc_1 = require("../ioc");
var ApplicationServiceProvider = (function (_super) {
    __extends(ApplicationServiceProvider, _super);
    function ApplicationServiceProvider(name, value) {
        return _super.call(this, ApplicationServiceProvider.getId(name), value) || this;
    }
    ApplicationServiceProvider.getId = function (name) {
        return [this.NS, name].join("/");
    };
    ApplicationServiceProvider.prototype.create = function () {
        return _super.prototype.create.call(this);
    };
    ApplicationServiceProvider.findAll = function (kernel) {
        return kernel.queryAll(this.getId("**"));
    };
    return ApplicationServiceProvider;
}(ioc_1.ClassFactoryProvider));
ApplicationServiceProvider.NS = "services";
exports.ApplicationServiceProvider = ApplicationServiceProvider;
/**
 * The application configuration dependency
 */
var ApplicationConfigurationProvider = (function (_super) {
    __extends(ApplicationConfigurationProvider, _super);
    function ApplicationConfigurationProvider(value) {
        return _super.call(this, ApplicationConfigurationProvider.ID, value) || this;
    }
    return ApplicationConfigurationProvider;
}(ioc_1.Provider));
ApplicationConfigurationProvider.ID = "config";
exports.ApplicationConfigurationProvider = ApplicationConfigurationProvider;
//# sourceMappingURL=providers.js.map