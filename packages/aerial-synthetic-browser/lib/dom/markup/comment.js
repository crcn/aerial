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
var aerial_common_1 = require("aerial-common");
var node_1 = require("./node");
var value_node_1 = require("./value-node");
var SyntheticDOMComment = (function (_super) {
    __extends(SyntheticDOMComment, _super);
    var SyntheticDOMComment = SyntheticDOMComment_1 = function SyntheticDOMComment(nodeValue) {
        var _this = _super.call(this, "#comment", nodeValue) || this;
        _this.nodeType = node_types_1.DOMNodeType.COMMENT;
        return _this;
    };
    SyntheticDOMComment.prototype.toString = function () {
        return "<!--" + this.nodeValue + "-->";
    };
    Object.defineProperty(SyntheticDOMComment.prototype, "textContent", {
        get: function () {
            return "";
        },
        set: function (value) {
            this.nodeValue = value;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticDOMComment.prototype.accept = function (visitor) {
        return visitor.visitComment(this);
    };
    SyntheticDOMComment.prototype.cloneShallow = function () {
        return new SyntheticDOMComment_1(this.nodeValue);
    };
    SyntheticDOMComment.prototype.visitWalker = function (walker) { };
    SyntheticDOMComment = SyntheticDOMComment_1 = __decorate([
        aerial_common_1.serializable("SyntheticDOMComment", new node_1.SyntheticDOMNodeSerializer(new value_node_1.SyntheticDOMValueNodeSerializer()))
    ], SyntheticDOMComment);
    return SyntheticDOMComment;
    var SyntheticDOMComment_1;
}(value_node_1.SyntheticDOMValueNode));
exports.SyntheticDOMComment = SyntheticDOMComment;
//# sourceMappingURL=comment.js.map