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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("../decorators");
var providers_1 = require("./providers");
var ioc_1 = require("../ioc");
/**
 * Application services create the combined functionality of the
 * entiry application.
 */
var BaseApplicationService = (function () {
    function BaseApplicationService() {
    }
    BaseApplicationService.prototype.dispatch = function (message) {
        var method = this[message.type];
        if (method) {
            if (this.logger) {
                this.logger.debug(message.type + "()");
            }
            return method.call(this, message);
        }
    };
    BaseApplicationService.prototype.$didInject = function () {
        this.bus.register(this);
        var acceptedMessageTypes = [];
        for (var _i = 0, _a = Object.getOwnPropertyNames(this.constructor.prototype); _i < _a.length; _i++) {
            var property = _a[_i];
            var value = this[property];
            if (typeof value === "function" && !/^([$_]|constructor)/.test(property.charAt(0))) {
                acceptedMessageTypes.push(property);
            }
        }
        this._acceptedMessageTypes = acceptedMessageTypes;
    };
    BaseApplicationService.prototype.testMessage = function (message) {
        return this._acceptedMessageTypes.length === 0 || this._acceptedMessageTypes.indexOf(message.type) !== -1;
    };
    return BaseApplicationService;
}());
__decorate([
    decorators_1.inject(ioc_1.PrivateBusProvider.ID)
], BaseApplicationService.prototype, "bus", void 0);
__decorate([
    decorators_1.inject(ioc_1.KernelProvider.ID)
], BaseApplicationService.prototype, "kernel", void 0);
exports.BaseApplicationService = BaseApplicationService;
/**
 * Core service required for the app to run
 */
var CoreApplicationService = (function (_super) {
    __extends(CoreApplicationService, _super);
    function CoreApplicationService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreApplicationService;
}(BaseApplicationService));
__decorate([
    decorators_1.inject(providers_1.ApplicationConfigurationProvider.ID)
], CoreApplicationService.prototype, "config", void 0);
exports.CoreApplicationService = CoreApplicationService;
//# sourceMappingURL=services.js.map