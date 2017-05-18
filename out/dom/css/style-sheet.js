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
var css_1 = require("../../dom/css");
var grouping_1 = require("./grouping");
var base_1 = require("./base");
var common_1 = require("@tandem/common");
var utils_1 = require("./utils");
var SyntheticCSSStyleSheetSerializer = (function () {
    function SyntheticCSSStyleSheetSerializer() {
    }
    SyntheticCSSStyleSheetSerializer.prototype.serialize = function (value) {
        return {
            rules: value.rules.map(common_1.serialize)
        };
    };
    SyntheticCSSStyleSheetSerializer.prototype.deserialize = function (value, kernel) {
        return new SyntheticCSSStyleSheet(value.rules.map(function (raw) { return common_1.deserialize(raw, kernel); }));
    };
    return SyntheticCSSStyleSheetSerializer;
}());
var CSSStyleSheetEditor = (function (_super) {
    __extends(CSSStyleSheetEditor, _super);
    function CSSStyleSheetEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CSSStyleSheetEditor;
}(grouping_1.SyntheticCSSGroupingRuleEditor));
exports.CSSStyleSheetEditor = CSSStyleSheetEditor;
// let _smcache = {};
// function parseSourceMaps(value) {
//   if (String(value).indexOf("sourceMappingURL=data") == -1) return undefined;
//   if (_smcache[value]) return _smcache[value];
//   const sourceMappingURL = String(value).match(/sourceMappingURL=(data\:[^\s]+)/)[1];
//   // assuming that it's inlined here... shouldn't.
//   return _smcache[value] = JSON.parse(atob(sourceMappingURL.split(",").pop()));
// }
// setInterval(() => _smcache = {}, 1000 * 60);
var SyntheticCSSStyleSheet = SyntheticCSSStyleSheet_1 = (function (_super) {
    __extends(SyntheticCSSStyleSheet, _super);
    function SyntheticCSSStyleSheet(rules) {
        var _this = _super.call(this, rules) || this;
        _this.rules = rules;
        return _this;
    }
    SyntheticCSSStyleSheet.prototype.linkRule = function (rule) {
        _super.prototype.linkRule.call(this, rule);
        rule.$parentStyleSheet = this;
    };
    Object.defineProperty(SyntheticCSSStyleSheet.prototype, "cssText", {
        get: function () {
            return this.rules.map(function (rule) { return rule.cssText; }).join("\n");
        },
        set: function (value) {
            // let map: RawSourceMap = parseSourceMaps(value);
            this
                .createEdit()
                .fromDiff(css_1.evaluateCSSSource(value))
                .applyMutationsTo(this);
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSStyleSheet.prototype.regenerateUID = function () {
        _super.prototype.regenerateUID.call(this);
        for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
            var rule = _a[_i];
            rule.regenerateUID();
        }
        return this;
    };
    SyntheticCSSStyleSheet.prototype.addImport = function (bstrURL, lIndex) {
        // TODO -
        return -1;
    };
    SyntheticCSSStyleSheet.prototype.toString = function () {
        return this.cssText;
    };
    SyntheticCSSStyleSheet.prototype.countShallowDiffs = function (target) {
        // This condition won't work as well for cases where the stylesheet is defined
        // by some other code such as <style /> blocks. It *will* probably break if the source
        // that instantiated this SyntheticCSSStyleSheet instance maintains a reference to it. Though, that's
        // a totally different problem that needs to be resolved.
        if (target.source.uri === this.source.uri)
            return 0;
        return utils_1.diffStyleSheetRules(this.rules, target.rules).count;
    };
    SyntheticCSSStyleSheet.prototype.cloneShallow = function () {
        return new SyntheticCSSStyleSheet_1([]);
    };
    SyntheticCSSStyleSheet.prototype.visitWalker = function (walker) {
        this.rules.forEach(function (rule) { return walker.accept(rule); });
    };
    return SyntheticCSSStyleSheet;
}(grouping_1.SyntheticCSSGroupingRule));
SyntheticCSSStyleSheet = SyntheticCSSStyleSheet_1 = __decorate([
    common_1.serializable("SyntheticCSSStyleSheet", new base_1.SyntheticCSSObjectSerializer(new SyntheticCSSStyleSheetSerializer()))
], SyntheticCSSStyleSheet);
exports.SyntheticCSSStyleSheet = SyntheticCSSStyleSheet;
var SyntheticCSSStyleSheet_1;
//# sourceMappingURL=style-sheet.js.map