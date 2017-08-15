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
var SyntheticCSSKeyframesRuleSerializer = (function () {
    function SyntheticCSSKeyframesRuleSerializer() {
    }
    SyntheticCSSKeyframesRuleSerializer.prototype.serialize = function (_a) {
        var name = _a.name, cssRules = _a.cssRules;
        return {
            name: name,
            cssRules: cssRules.map(aerial_common_1.serialize)
        };
    };
    SyntheticCSSKeyframesRuleSerializer.prototype.deserialize = function (_a, kernel) {
        var name = _a.name, cssRules = _a.cssRules;
        return new SyntheticCSSKeyframesRule(name, cssRules.map(function (cs) { return aerial_common_1.deserialize(cs, kernel); }));
    };
    return SyntheticCSSKeyframesRuleSerializer;
}());
var SyntheticCSSKeyframesRuleEdit = (function (_super) {
    __extends(SyntheticCSSKeyframesRuleEdit, _super);
    function SyntheticCSSKeyframesRuleEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticCSSKeyframesRuleEdit.prototype.setName = function (value) {
        this.addChange(new aerial_common_1.PropertyMutation(atrule_1.SyntheticCSSGroupAtRuleMutationTypes.SET_NAME_EDIT, this.target, "name", value));
    };
    SyntheticCSSKeyframesRuleEdit.prototype.addDiff = function (newAtRule) {
        if (this.target.name !== newAtRule.name) {
            this.setName(newAtRule.name);
        }
        return _super.prototype.addDiff.call(this, newAtRule);
    };
    return SyntheticCSSKeyframesRuleEdit;
}(atrule_1.SyntheticCSSGroupAtRuleEdit));
exports.SyntheticCSSKeyframesRuleEdit = SyntheticCSSKeyframesRuleEdit;
var SyntheticCSSKeyframesRule = (function (_super) {
    __extends(SyntheticCSSKeyframesRule, _super);
    function SyntheticCSSKeyframesRule(name, rules) {
        var _this = _super.call(this, rules) || this;
        _this.name = name;
        _this.atRuleName = "keyframes";
        return _this;
    }
    SyntheticCSSKeyframesRule_1 = SyntheticCSSKeyframesRule;
    Object.defineProperty(SyntheticCSSKeyframesRule.prototype, "params", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSKeyframesRule.prototype, "cssText", {
        get: function () {
            return "@keyframes " + this.name + " {\n      " + this.innerText + "\n    }";
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSKeyframesRule.prototype.cloneShallow = function () {
        return new SyntheticCSSKeyframesRule_1(this.name, []);
    };
    SyntheticCSSKeyframesRule.prototype.createEdit = function () {
        return new SyntheticCSSKeyframesRuleEdit(this);
    };
    SyntheticCSSKeyframesRule.prototype.visitWalker = function (walker) {
        this.cssRules.forEach(function (rule) { return walker.accept(rule); });
    };
    SyntheticCSSKeyframesRule = SyntheticCSSKeyframesRule_1 = __decorate([
        aerial_common_1.serializable("SyntheticCSSKeyframesRule", new base_1.SyntheticCSSObjectSerializer(new SyntheticCSSKeyframesRuleSerializer()))
    ], SyntheticCSSKeyframesRule);
    return SyntheticCSSKeyframesRule;
    var SyntheticCSSKeyframesRule_1;
}(atrule_1.SyntheticCSSGroupAtRule));
exports.SyntheticCSSKeyframesRule = SyntheticCSSKeyframesRule;
//# sourceMappingURL=keyframes-rule.js.map