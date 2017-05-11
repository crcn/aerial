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
var element_1 = require("../markup/element");
var css_1 = require("../css");
var SyntheticHTMLStyleElement = (function (_super) {
    __extends(SyntheticHTMLStyleElement, _super);
    function SyntheticHTMLStyleElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticHTMLStyleElement.prototype.attachedCallback = function () {
        _super.prototype.attachedCallback.call(this);
        this.ownerDocument.styleSheets.push(this.getStyleSheet());
    };
    SyntheticHTMLStyleElement.prototype.getStyleSheet = function () {
        if (this._styleSheet)
            return this._styleSheet;
        this._styleSheet = new css_1.SyntheticCSSStyleSheet([]);
        var firstChild = this.firstChild;
        this._styleSheet.$ownerNode = this;
        this._styleSheet.cssText = this.textContent;
        return this._styleSheet;
    };
    SyntheticHTMLStyleElement.prototype.detachedCallback = function () {
        this.ownerDocument.styleSheets.splice(this.ownerDocument.styleSheets.indexOf(this._styleSheet), 1);
    };
    SyntheticHTMLStyleElement.prototype.onChildAdded = function (child, index) {
        _super.prototype.onChildAdded.call(this, child, index);
        if (this._styleSheet) {
            this._styleSheet.cssText = this.textContent;
        }
    };
    Object.defineProperty(SyntheticHTMLStyleElement.prototype, "styleSheet", {
        get: function () {
            return this._styleSheet;
        },
        enumerable: true,
        configurable: true
    });
    return SyntheticHTMLStyleElement;
}(element_1.SyntheticDOMElement));
exports.SyntheticHTMLStyleElement = SyntheticHTMLStyleElement;
//# sourceMappingURL=style.js.map