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
var style_rule_1 = require("./style-rule");
var style_1 = require("./style");
var base_1 = require("./base");
var aerial_common_1 = require("aerial-common");
var SyntheticCSSFontFaceSerializer = (function () {
    function SyntheticCSSFontFaceSerializer() {
    }
    SyntheticCSSFontFaceSerializer.prototype.serialize = function (_a) {
        var style = _a.style;
        return aerial_common_1.serialize(style);
    };
    SyntheticCSSFontFaceSerializer.prototype.deserialize = function (style, kernel) {
        return new SyntheticCSSFontFace(aerial_common_1.deserialize(style, kernel));
    };
    return SyntheticCSSFontFaceSerializer;
}());
var SyntheticCSSFontFace = (function (_super) {
    __extends(SyntheticCSSFontFace, _super);
    var SyntheticCSSFontFace = SyntheticCSSFontFace_1 = function SyntheticCSSFontFace(style) {
        var _this = _super.call(this, style) || this;
        _this.atRuleName = "font-face";
        return _this;
    };
    Object.defineProperty(SyntheticCSSFontFace.prototype, "params", {
        get: function () {
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSFontFace.prototype, "cssText", {
        get: function () {
            return "@font-face {\n      " + this.style.cssText + "\n    }";
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSFontFace.prototype.cloneShallow = function () {
        return new SyntheticCSSFontFace_1(new style_1.SyntheticCSSStyle());
    };
    SyntheticCSSFontFace.prototype.countShallowDiffs = function (target) {
        return this.cssText === target.cssText ? 0 : -1;
    };
    SyntheticCSSFontFace = SyntheticCSSFontFace_1 = __decorate([
        aerial_common_1.serializable("SyntheticCSSFontFace", new base_1.SyntheticCSSObjectSerializer(new SyntheticCSSFontFaceSerializer()))
    ], SyntheticCSSFontFace);
    return SyntheticCSSFontFace;
    var SyntheticCSSFontFace_1;
}(style_rule_1.SyntheticCSSStyleRule));
exports.SyntheticCSSFontFace = SyntheticCSSFontFace;
//# sourceMappingURL=font-face.js.map