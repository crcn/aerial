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
var common_1 = require("@tandem/common");
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
var SyntheticHTMLCollection = (function (_super) {
    __extends(SyntheticHTMLCollection, _super);
    function SyntheticHTMLCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticHTMLCollection.prototype.item = function (index) {
        return this[index];
    };
    return SyntheticHTMLCollection;
}(common_1.ArrayCollection));
exports.SyntheticHTMLCollection = SyntheticHTMLCollection;
//# sourceMappingURL=index.js.map