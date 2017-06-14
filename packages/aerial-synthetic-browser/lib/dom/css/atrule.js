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
var grouping_1 = require("./grouping");
var base_1 = require("./base");
var aerial_common_1 = require("aerial-common");
var SyntheticCSSGroupAtRuleMutationTypes;
(function (SyntheticCSSGroupAtRuleMutationTypes) {
    SyntheticCSSGroupAtRuleMutationTypes.SET_NAME_EDIT = "setNameEdit";
})(SyntheticCSSGroupAtRuleMutationTypes = exports.SyntheticCSSGroupAtRuleMutationTypes || (exports.SyntheticCSSGroupAtRuleMutationTypes = {}));
function isCSSAtRuleMutaton(mutation) {
    return !!(_a = {},
        _a[SyntheticCSSGroupAtRuleMutationTypes.SET_NAME_EDIT] = true,
        _a)[mutation.type];
    var _a;
}
exports.isCSSAtRuleMutaton = isCSSAtRuleMutaton;
var SyntheticCSSGroupAtRuleEdit = (function (_super) {
    __extends(SyntheticCSSGroupAtRuleEdit, _super);
    function SyntheticCSSGroupAtRuleEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SyntheticCSSGroupAtRuleEdit;
}(grouping_1.SyntheticCSSGroupingRuleEdit));
exports.SyntheticCSSGroupAtRuleEdit = SyntheticCSSGroupAtRuleEdit;
var SyntheticCSSGroupAtRuleEditor = (function (_super) {
    __extends(SyntheticCSSGroupAtRuleEditor, _super);
    function SyntheticCSSGroupAtRuleEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SyntheticCSSGroupAtRuleEditor;
}(grouping_1.SyntheticCSSGroupingRuleEditor));
exports.SyntheticCSSGroupAtRuleEditor = SyntheticCSSGroupAtRuleEditor;
var SyntheticCSSGroupAtRule = (function (_super) {
    __extends(SyntheticCSSGroupAtRule, _super);
    function SyntheticCSSGroupAtRule(cssRules) {
        if (cssRules === void 0) { cssRules = []; }
        return _super.call(this, cssRules) || this;
    }
    SyntheticCSSGroupAtRule.prototype.toString = function () {
        return this.cssText;
    };
    Object.defineProperty(SyntheticCSSGroupAtRule.prototype, "innerText", {
        get: function () {
            return this.cssRules.map(function (rule) { return rule.cssText; }).join("\n");
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSGroupAtRule.prototype.countShallowDiffs = function (target) {
        return this.params === target.params ? 0 : -1;
    };
    SyntheticCSSGroupAtRule.prototype.visitWalker = function (walker) {
        this.cssRules.forEach(function (rule) { return walker.accept(rule); });
    };
    return SyntheticCSSGroupAtRule;
}(grouping_1.SyntheticCSSGroupingRule));
exports.SyntheticCSSGroupAtRule = SyntheticCSSGroupAtRule;
var SyntheticCSSUnknownAtRuleSerializer = (function () {
    function SyntheticCSSUnknownAtRuleSerializer() {
    }
    SyntheticCSSUnknownAtRuleSerializer.prototype.serialize = function (_a) {
        var atRuleName = _a.atRuleName, params = _a.params, cssRules = _a.cssRules;
        return [atRuleName, params, cssRules.map(aerial_common_1.serialize)];
    };
    SyntheticCSSUnknownAtRuleSerializer.prototype.deserialize = function (_a, kernel) {
        var atRuleName = _a[0], params = _a[1], cssRules = _a[2];
        return new SyntheticCSSUnknownGroupAtRule(atRuleName, params, cssRules.map(function (cs) { return aerial_common_1.deserialize(cs, kernel); }));
    };
    return SyntheticCSSUnknownAtRuleSerializer;
}());
var SyntheticCSSUnknownGroupAtRule = (function (_super) {
    __extends(SyntheticCSSUnknownGroupAtRule, _super);
    var SyntheticCSSUnknownGroupAtRule = SyntheticCSSUnknownGroupAtRule_1 = function SyntheticCSSUnknownGroupAtRule(atRuleName, params, cssRules) {
        if (cssRules === void 0) { cssRules = []; }
        var _this = _super.call(this, cssRules) || this;
        _this.atRuleName = atRuleName;
        _this.params = params;
        return _this;
    };
    Object.defineProperty(SyntheticCSSUnknownGroupAtRule.prototype, "cssText", {
        get: function () {
            return "@" + this.atRuleName + " " + this.params + " {\n" + this.innerText + " }";
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSUnknownGroupAtRule.prototype.cloneShallow = function () {
        return new SyntheticCSSUnknownGroupAtRule_1(this.atRuleName, this.params);
    };
    SyntheticCSSUnknownGroupAtRule = SyntheticCSSUnknownGroupAtRule_1 = __decorate([
        aerial_common_1.serializable("SyntheticCSSUnknownGroupAtRule", new base_1.SyntheticCSSObjectSerializer(new SyntheticCSSUnknownAtRuleSerializer()))
    ], SyntheticCSSUnknownGroupAtRule);
    return SyntheticCSSUnknownGroupAtRule;
    var SyntheticCSSUnknownGroupAtRule_1;
}(SyntheticCSSGroupAtRule));
exports.SyntheticCSSUnknownGroupAtRule = SyntheticCSSUnknownGroupAtRule;
//# sourceMappingURL=atrule.js.map