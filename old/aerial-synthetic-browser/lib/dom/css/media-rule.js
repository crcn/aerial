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
var base_1 = require("./base");
var aerial_common_1 = require("aerial-common");
var atrule_1 = require("./atrule");
var SyntheticCSSMediaRuleSerializer = (function () {
    function SyntheticCSSMediaRuleSerializer() {
    }
    SyntheticCSSMediaRuleSerializer.prototype.serialize = function (_a) {
        var media = _a.media, cssRules = _a.cssRules;
        return {
            media: media,
            cssRules: cssRules.map(aerial_common_1.serialize)
        };
    };
    SyntheticCSSMediaRuleSerializer.prototype.deserialize = function (_a, kernel) {
        var media = _a.media, cssRules = _a.cssRules;
        return new SyntheticCSSMediaRule(media, cssRules.map(function (cs) { return aerial_common_1.deserialize(cs, kernel); }));
    };
    return SyntheticCSSMediaRuleSerializer;
}());
var SyntheticCSSMediaRule = (function (_super) {
    __extends(SyntheticCSSMediaRule, _super);
    function SyntheticCSSMediaRule(media, rules) {
        var _this = _super.call(this, rules) || this;
        _this.media = media;
        _this.atRuleName = "media";
        return _this;
    }
    SyntheticCSSMediaRule_1 = SyntheticCSSMediaRule;
    Object.defineProperty(SyntheticCSSMediaRule.prototype, "cssText", {
        get: function () {
            return "@media " + this.media.join(" ") + " {\n" + this.innerText + "}\n";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSMediaRule.prototype, "params", {
        get: function () {
            return this.media.join(" ");
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSMediaRule.prototype.cloneShallow = function () {
        return new SyntheticCSSMediaRule_1(this.media.concat(), []);
    };
    SyntheticCSSMediaRule.prototype.createEdit = function () {
        return new atrule_1.SyntheticCSSGroupAtRuleEdit(this);
    };
    SyntheticCSSMediaRule.prototype.visitWalker = function (walker) {
        this.cssRules.forEach(function (rule) { return walker.accept(rule); });
    };
    SyntheticCSSMediaRule = SyntheticCSSMediaRule_1 = __decorate([
        aerial_common_1.serializable("SyntheticCSSMediaRule", new base_1.SyntheticCSSObjectSerializer(new SyntheticCSSMediaRuleSerializer()))
    ], SyntheticCSSMediaRule);
    return SyntheticCSSMediaRule;
    var SyntheticCSSMediaRule_1;
}(atrule_1.SyntheticCSSGroupAtRule));
exports.SyntheticCSSMediaRule = SyntheticCSSMediaRule;
//# sourceMappingURL=media-rule.js.map