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
var node_types_1 = require("./node-types");
var node_1 = require("./node");
var aerial_common_1 = require("aerial-common");
var value_node_1 = require("./value-node");
var SyntheticDOMText = (function (_super) {
    __extends(SyntheticDOMText, _super);
    function SyntheticDOMText(nodeValue) {
        var _this = _super.call(this, "#text", nodeValue) || this;
        _this.nodeType = node_types_1.DOMNodeType.TEXT;
        return _this;
    }
    SyntheticDOMText_1 = SyntheticDOMText;
    Object.defineProperty(SyntheticDOMText.prototype, "textContent", {
        get: function () {
            return this.nodeValue;
        },
        set: function (value) {
            this.nodeValue = value;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticDOMText.prototype.toString = function () {
        return this.nodeValue;
    };
    SyntheticDOMText.prototype.accept = function (visitor) {
        return visitor.visitText(this);
    };
    SyntheticDOMText.prototype.cloneShallow = function () {
        return new SyntheticDOMText_1(this.nodeValue);
    };
    SyntheticDOMText.prototype.visitWalker = function (walker) { };
    SyntheticDOMText = SyntheticDOMText_1 = __decorate([
        aerial_common_1.serializable("SyntheticDOMText", new node_1.SyntheticDOMNodeSerializer(new value_node_1.SyntheticDOMValueNodeSerializer()))
    ], SyntheticDOMText);
    return SyntheticDOMText;
    var SyntheticDOMText_1;
}(value_node_1.SyntheticDOMValueNode));
exports.SyntheticDOMText = SyntheticDOMText;
//# sourceMappingURL=text-node.js.map