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
var aerial_common_1 = require("aerial-common");
var element_1 = require("./element");
var location_1 = require("../../location");
var SyntheticHTMLAnchorElement = (function (_super) {
    __extends(SyntheticHTMLAnchorElement, _super);
    function SyntheticHTMLAnchorElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SyntheticHTMLAnchorElement.prototype, "hostname", {
        get: function () { return this._location.hostname; },
        set: function (value) { this._location.hostname = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLAnchorElement.prototype, "pathname", {
        get: function () { return this._location.pathname; },
        set: function (value) { this._location.pathname = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLAnchorElement.prototype, "port", {
        get: function () { return this._location.port; },
        set: function (value) { this._location.port = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLAnchorElement.prototype, "protocol", {
        get: function () { return this._location.protocol; },
        set: function (value) { this._location.protocol = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLAnchorElement.prototype, "hash", {
        get: function () { return this._location.hash; },
        set: function (value) { this._location.hash = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLAnchorElement.prototype, "search", {
        get: function () { return this._location.search; },
        set: function (value) { this._location.search = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLAnchorElement.prototype, "host", {
        get: function () { return this._location.host; },
        set: function (value) { this._location.host = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLAnchorElement.prototype, "href", {
        get: function () {
            return this.getAttribute("href");
        },
        set: function (value) {
            this.setAttribute("href", value);
        },
        enumerable: true,
        configurable: true
    });
    SyntheticHTMLAnchorElement.prototype.createdCallback = function () {
        var _this = this;
        _super.prototype.createdCallback.call(this);
        this._location = new location_1.SyntheticLocation(this.href || "");
        new aerial_common_1.PropertyWatcher(this._location, "href").connect(function (value) {
            _this.setAttribute("href", value);
        });
    };
    SyntheticHTMLAnchorElement.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
        _super.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        if (name === "href" && this._location) {
            this._location.href = newValue;
        }
    };
    return SyntheticHTMLAnchorElement;
}(element_1.SyntheticHTMLElement));
exports.SyntheticHTMLAnchorElement = SyntheticHTMLAnchorElement;
//# sourceMappingURL=anchor.js.map