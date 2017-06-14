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
var css_1 = require("../css");
var utils_1 = require("../utils");
var utils_2 = require("./utils");
var aerial_common_1 = require("aerial-common");
var markup_1 = require("../markup");
var parse5 = require("parse5");
var ElementClassList = (function (_super) {
    __extends(ElementClassList, _super);
    function ElementClassList(target) {
        var _this = _super.apply(this, String(target.getAttribute("class") || "").split(" ")) || this;
        _this.target = target;
        return _this;
    }
    ElementClassList.prototype.add = function (value) {
        this.push(value);
        this._reset();
    };
    ElementClassList.prototype.remove = function (value) {
        var index = this.indexOf(value);
        if (index !== -1)
            this.splice(index, 1);
        this._reset();
    };
    ElementClassList.prototype._reset = function () {
        this.target.setAttribute("className", this.join(" "));
    };
    return ElementClassList;
}(aerial_common_1.ArrayCollection));
// http://www.w3schools.com/jsref/dom_obj_event.asp
// TODO - proxy dataset
var SyntheticHTMLElement = (function (_super) {
    __extends(SyntheticHTMLElement, _super);
    function SyntheticHTMLElement(ns, tagName) {
        var _this = _super.call(this, ns, tagName) || this;
        _this._style = new css_1.SyntheticCSSStyle();
        utils_1.bindDOMEventMethods([
            "click",
            "dblClick",
            "mouseDown",
            "mouseEnter",
            "mouseLeave",
            "mouseMove",
            "mouseOver",
            "mouseOut",
            "mouseUp",
            "keyUp",
            "keyPress",
            "keyDown",
        ], _this);
        return _this;
    }
    SyntheticHTMLElement.prototype.getClientRects = function () {
        return [aerial_common_1.BoundingRect.zeros()];
    };
    SyntheticHTMLElement.prototype.getBoundingClientRect = function () {
        return (this.browser && this.browser.renderer.getBoundingRect(this.uid)) || aerial_common_1.BoundingRect.zeros();
    };
    Object.defineProperty(SyntheticHTMLElement.prototype, "classList", {
        get: function () {
            return this._classList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLElement.prototype, "style", {
        get: function () {
            return this._styleProxy || this._resetStyleProxy();
        },
        set: function (value) {
            this._style.clearAll();
            Object.assign(this._style, value);
            this.onStyleChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLElement.prototype, "text", {
        get: function () {
            return this.getAttribute("text");
        },
        set: function (value) {
            this.setAttribute("text", value);
        },
        enumerable: true,
        configurable: true
    });
    SyntheticHTMLElement.prototype.focus = function () {
        // TODO - possibly set activeElement on synthetic document
    };
    SyntheticHTMLElement.prototype.blur = function () {
        // TODO
    };
    Object.defineProperty(SyntheticHTMLElement.prototype, "className", {
        get: function () {
            return this.class;
        },
        set: function (value) {
            this.class = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLElement.prototype, "class", {
        get: function () {
            return this.getAttribute("class") || "";
        },
        set: function (value) {
            this.setAttribute("class", value);
        },
        enumerable: true,
        configurable: true
    });
    SyntheticHTMLElement.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
        if (name === "style") {
            this._resetStyleFromAttribute();
        }
        else if (name === "class") {
            this._classList = ElementClassList.create(this);
        }
        _super.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
    };
    Object.defineProperty(SyntheticHTMLElement.prototype, "innerHTML", {
        get: function () {
            return this.childNodes.map(function (child) { return child.toString(); }).join("");
        },
        set: function (value) {
            this.removeAllChildren();
            this.appendChild(markup_1.evaluateMarkup(parse5.parseFragment(value, { locationInfo: true }), this.ownerDocument, this.namespaceURI));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLElement.prototype, "outerHTML", {
        get: function () {
            return this.toString();
        },
        enumerable: true,
        configurable: true
    });
    SyntheticHTMLElement.prototype._resetStyleFromAttribute = function () {
        this._style.clearAll();
        Object.assign(this._style, css_1.SyntheticCSSStyle.fromString(this.getAttribute("style") || ""));
    };
    SyntheticHTMLElement.prototype._resetStyleProxy = function () {
        var _this = this;
        // Proxy the style here so that any changes get synchronized back
        // to the attribute
        // element.
        return this._styleProxy = new Proxy(this._style, {
            get: function (target, propertyName, receiver) {
                return target[propertyName];
            },
            set: function (target, propertyName, value, receiver) {
                // normalize the value if it's a pixel unit. Numbers are invalid for CSS declarations.
                if (typeof value === "number") {
                    value = Math.round(value) + "px";
                }
                target.setProperty(propertyName.toString(), value);
                _this.onStyleChange();
                return true;
            }
        });
    };
    SyntheticHTMLElement.prototype.onStyleChange = function () {
        this.setAttribute("style", this.style.cssText.replace(/[\n\t\s]+/g, " "));
    };
    SyntheticHTMLElement.prototype.computeCapabilities = function (style) {
        return new markup_1.VisibleDOMNodeCapabilities(/fixed|absolute|relative/.test(style.position), /fixed|absolute|relative/.test(style.position));
    };
    SyntheticHTMLElement.prototype.computeAbsoluteBounds = function (style) {
        return this.getBoundingClientRect();
    };
    SyntheticHTMLElement.prototype.setAbsolutePosition = function (_a) {
        var left = _a.left, top = _a.top;
        var localizedPoint = utils_2.localizeFixedPosition({ left: left, top: top }, this);
        Object.assign(this.style, localizedPoint);
    };
    SyntheticHTMLElement.prototype.setAbsoluteBounds = function (newBounds) {
        // const oldBounds = this.getAbsoluteBounds();
        Object.assign(this.style, {
            left: newBounds.left,
            top: newBounds.top,
            width: newBounds.width,
            height: newBounds.height
        });
    };
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticHTMLElement.prototype, "onclick", void 0);
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticHTMLElement.prototype, "ondblclick", void 0);
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticHTMLElement.prototype, "onmousedown", void 0);
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticHTMLElement.prototype, "onmouseenter", void 0);
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticHTMLElement.prototype, "onmouseleave", void 0);
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticHTMLElement.prototype, "onmousemove", void 0);
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticHTMLElement.prototype, "onmouseover", void 0);
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticHTMLElement.prototype, "onmouseup", void 0);
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticHTMLElement.prototype, "onkeydown", void 0);
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticHTMLElement.prototype, "onkeypress", void 0);
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticHTMLElement.prototype, "onkeyup", void 0);
    SyntheticHTMLElement = __decorate([
        aerial_common_1.serializable("SyntheticHTMLElement")
    ], SyntheticHTMLElement);
    return SyntheticHTMLElement;
}(markup_1.VisibleSyntheticDOMElement));
exports.SyntheticHTMLElement = SyntheticHTMLElement;
//# sourceMappingURL=element.js.map