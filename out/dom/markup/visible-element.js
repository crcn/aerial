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
var element_1 = require("./element");
var common_1 = require("@tandem/common");
// TODO - possibly move this over to @tandem/common/display or similar
var VisibleDOMNodeCapabilities = (function () {
    function VisibleDOMNodeCapabilities(movable, resizable) {
        this.movable = movable;
        this.resizable = resizable;
    }
    VisibleDOMNodeCapabilities.prototype.merge = function () {
        var capabilities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            capabilities[_i] = arguments[_i];
        }
        return VisibleDOMNodeCapabilities.merge.apply(VisibleDOMNodeCapabilities, [this].concat(capabilities));
    };
    VisibleDOMNodeCapabilities.notCapableOfAnything = function () {
        return new VisibleDOMNodeCapabilities(false, false);
    };
    VisibleDOMNodeCapabilities.prototype.equalTo = function (capabilities) {
        return capabilities.movable === this.movable && capabilities.resizable === this.resizable;
    };
    VisibleDOMNodeCapabilities.merge = function () {
        var capabilities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            capabilities[_i] = arguments[_i];
        }
        return capabilities.reduce(function (a, b) { return (new VisibleDOMNodeCapabilities(a ? a.movable && b.movable : b.movable, b ? a.resizable && b.resizable : b.resizable)); });
    };
    return VisibleDOMNodeCapabilities;
}());
exports.VisibleDOMNodeCapabilities = VisibleDOMNodeCapabilities;
var VisibleSyntheticDOMElement = (function (_super) {
    __extends(VisibleSyntheticDOMElement, _super);
    function VisibleSyntheticDOMElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(VisibleSyntheticDOMElement.prototype, "renderer", {
        get: function () {
            return this.browser.renderer;
        },
        enumerable: true,
        configurable: true
    });
    VisibleSyntheticDOMElement.prototype.getComputedStyle = function () {
        return this.renderer.getComputedStyle(this.uid);
    };
    VisibleSyntheticDOMElement.prototype.getBoundingClientRect = function () {
        return this.renderer.getBoundingRect(this.uid);
    };
    VisibleSyntheticDOMElement.prototype.getAbsoluteBounds = function () {
        if (!this.computeVisibility())
            return common_1.BoundingRect.zeros();
        return this._absoluteBounds;
    };
    VisibleSyntheticDOMElement.prototype.getCapabilities = function () {
        if (!this.computeVisibility())
            return VisibleDOMNodeCapabilities.notCapableOfAnything();
        return this._capabilities;
    };
    VisibleSyntheticDOMElement.prototype.computeVisibility = function () {
        var newStyle = this.getComputedStyle();
        var newBounds = this.getBoundingClientRect();
        if (!newStyle || !newBounds.visible) {
            this._computedStyle = undefined;
            this._currentBounds = undefined;
            return this._computedVisibility = false;
        }
        var newCapabilities = this.computeCapabilities(newStyle);
        if (this._computedVisibility) {
            if (this._computedStyle.uid === newStyle.uid && this._currentBounds.equalTo(newBounds) && this._capabilities.equalTo(newCapabilities)) {
                return true;
            }
        }
        this._computedStyle = newStyle;
        this._currentBounds = newBounds;
        this._capabilities = newCapabilities;
        this._absoluteBounds = this.computeAbsoluteBounds(this._computedStyle, this._currentBounds);
        this.onUpdateComputedVisibility();
        return this._computedVisibility = true;
    };
    VisibleSyntheticDOMElement.prototype.onUpdateComputedVisibility = function () {
    };
    return VisibleSyntheticDOMElement;
}(element_1.SyntheticDOMElement));
__decorate([
    common_1.bindable()
], VisibleSyntheticDOMElement.prototype, "_absoluteBounds", void 0);
__decorate([
    common_1.bindable()
], VisibleSyntheticDOMElement.prototype, "_capabilities", void 0);
exports.VisibleSyntheticDOMElement = VisibleSyntheticDOMElement;
//# sourceMappingURL=visible-element.js.map