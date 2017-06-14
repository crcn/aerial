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
var bindable_1 = require("./bindable");
var chai_1 = require("chai");
var observable_1 = require("../observable");
describe(__filename + "#", function () {
    it("can make a property bindable for changes", function () {
        var Item = (function (_super) {
            __extends(Item, _super);
            function Item() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Item;
        }(observable_1.Observable));
        __decorate([
            bindable_1.bindable()
        ], Item.prototype, "name", void 0);
        var item = new Item();
        var lastMessage;
        item.observe({
            dispatch: function (message) { return lastMessage = message; }
        });
        item.name = "john";
        chai_1.expect(lastMessage.type).to.equal("mutation");
    });
});
//# sourceMappingURL=bindable-test.js.map