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
var window_1 = require("../window");
var element_1 = require("./element");
var SyntheticHTMLIframeElement = (function (_super) {
    __extends(SyntheticHTMLIframeElement, _super);
    function SyntheticHTMLIframeElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticHTMLIframeElement.prototype.createdCallback = function () {
        _super.prototype.createdCallback.call(this);
        this._contentWindow = new window_1.SyntheticWindow();
    };
    Object.defineProperty(SyntheticHTMLIframeElement.prototype, "contentWindow", {
        get: function () {
            return this._contentWindow;
        },
        enumerable: true,
        configurable: true
    });
    return SyntheticHTMLIframeElement;
}(element_1.SyntheticHTMLElement));
exports.SyntheticHTMLIframeElement = SyntheticHTMLIframeElement;
//# sourceMappingURL=iframe.js.map