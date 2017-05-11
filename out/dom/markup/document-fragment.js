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
var container_1 = require("./container");
var common_1 = require("@tandem/common");
var SyntheticDocumentFragmentSerializer = (function () {
    function SyntheticDocumentFragmentSerializer() {
    }
    SyntheticDocumentFragmentSerializer.prototype.serialize = function (_a) {
        var childNodes = _a.childNodes;
        return childNodes.map(common_1.serialize);
    };
    SyntheticDocumentFragmentSerializer.prototype.deserialize = function (childNodes, kernel) {
        var fragment = new SyntheticDocumentFragment();
        for (var i = 0, n = childNodes.length; i < n; i++) {
            fragment.appendChild(common_1.deserialize(childNodes[i], kernel));
        }
        return fragment;
    };
    return SyntheticDocumentFragmentSerializer;
}());
var SyntheticDocumentFragment = SyntheticDocumentFragment_1 = (function (_super) {
    __extends(SyntheticDocumentFragment, _super);
    function SyntheticDocumentFragment() {
        var _this = _super.call(this, "#document-fragment") || this;
        _this.nodeType = node_types_1.DOMNodeType.DOCUMENT_FRAGMENT;
        return _this;
    }
    SyntheticDocumentFragment.prototype.accept = function (visitor) {
        return visitor.visitDocumentFragment(this);
    };
    SyntheticDocumentFragment.prototype.cloneShallow = function () {
        return new SyntheticDocumentFragment_1();
    };
    return SyntheticDocumentFragment;
}(container_1.SyntheticDOMContainer));
SyntheticDocumentFragment = SyntheticDocumentFragment_1 = __decorate([
    common_1.serializable("SyntheticDocumentFragment", new SyntheticDocumentFragmentSerializer())
], SyntheticDocumentFragment);
exports.SyntheticDocumentFragment = SyntheticDocumentFragment;
var SyntheticDocumentFragment_1;
//# sourceMappingURL=document-fragment.js.map