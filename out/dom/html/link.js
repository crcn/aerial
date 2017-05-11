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
var element_1 = require("./element");
var css_1 = require("../css");
var _cache = {};
// TODO - implement imports
var SyntheticHTMLLinkElement = (function (_super) {
    __extends(SyntheticHTMLLinkElement, _super);
    function SyntheticHTMLLinkElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SyntheticHTMLLinkElement.prototype, "href", {
        get: function () {
            return this.getAttribute("href");
        },
        set: function (value) {
            this.setAttribute("href", value);
            this.reload();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLLinkElement.prototype, "rel", {
        get: function () {
            return this.getAttribute("rel");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLLinkElement.prototype, "type", {
        get: function () {
            return this.getAttribute("type");
        },
        enumerable: true,
        configurable: true
    });
    SyntheticHTMLLinkElement.prototype.createdCallback = function () {
        var rel = this.getAttribute("rel") || "stylesheet";
        var href = this.getAttribute("href");
        if (href)
            this.reload();
    };
    SyntheticHTMLLinkElement.prototype.attachedCallback = function () {
        this.attachStylesheet();
    };
    SyntheticHTMLLinkElement.prototype.detachedCallback = function () {
        this.detachStylesheet();
    };
    SyntheticHTMLLinkElement.prototype.reload = function () {
        var rel = (this.getAttribute("rel") || "stylesheet").toLowerCase();
        if (rel !== "stylesheet")
            return;
        var href = this.href;
        var dep = this.module && this.module.source.eagerGetDependency(href);
        var content, type;
        var ret;
        if (dep) {
            this.stylesheet = this.module.sandbox.evaluate(dep);
        }
        else {
            var result = parseDataURI(href);
            content = result && decodeURIComponent(result.content);
            this.stylesheet = new css_1.SyntheticCSSStyleSheet([]);
            this.stylesheet.cssText = content || "";
        }
        this.stylesheet.$ownerNode = this;
        this.attachStylesheet();
    };
    SyntheticHTMLLinkElement.prototype.attachStylesheet = function () {
        if (this._addedToDocument || !this.ownerDocument || !this._attached || !this.stylesheet)
            return;
        this._addedToDocument = true;
        this.ownerDocument.styleSheets.push(this.stylesheet);
    };
    SyntheticHTMLLinkElement.prototype.detachStylesheet = function () {
        if (!this.ownerDocument || !this._attached || !this.stylesheet)
            return;
        this._addedToDocument = false;
        var index = this.ownerDocument.styleSheets.indexOf(this.stylesheet);
        if (index !== -1) {
            this.ownerDocument.styleSheets.splice(index, 1);
        }
    };
    return SyntheticHTMLLinkElement;
}(element_1.SyntheticHTMLElement));
exports.SyntheticHTMLLinkElement = SyntheticHTMLLinkElement;
function parseDataURI(uri) {
    var parts = uri.match(/data:(.*?),(.*)/);
    return parts && { type: parts[1], content: parts[2] };
}
//# sourceMappingURL=link.js.map