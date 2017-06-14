"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("../decorators");
var ioc_1 = require("../ioc");
var BaseCommand = (function () {
    function BaseCommand() {
    }
    return BaseCommand;
}());
__decorate([
    decorators_1.inject(ioc_1.PrivateBusProvider.ID)
], BaseCommand.prototype, "bus", void 0);
__decorate([
    decorators_1.inject(ioc_1.KernelProvider.ID)
], BaseCommand.prototype, "kernel", void 0);
BaseCommand = __decorate([
    decorators_1.loggable()
], BaseCommand);
exports.BaseCommand = BaseCommand;
//# sourceMappingURL=base.js.map