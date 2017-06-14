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
var providers_1 = require("../providers");
var aerial_common_1 = require("aerial-common");
var ApplyFileEditCommand = (function (_super) {
    __extends(ApplyFileEditCommand, _super);
    function ApplyFileEditCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ApplyFileEditCommand.prototype.execute = function (request) {
        return this._fileEditor.applyMutations(request.mutations);
    };
    return ApplyFileEditCommand;
}(aerial_common_1.BaseCommand));
__decorate([
    aerial_common_1.inject(providers_1.FileEditorProvider.ID)
], ApplyFileEditCommand.prototype, "_fileEditor", void 0);
exports.ApplyFileEditCommand = ApplyFileEditCommand;
//# sourceMappingURL=apply-file-edit.js.map