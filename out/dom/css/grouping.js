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
var common_1 = require("@tandem/common");
var parsers_1 = require("./parsers");
var utils_1 = require("./utils");
var sandbox_1 = require("@tandem/sandbox");
var evaluate_1 = require("./evaluate");
var base_1 = require("./base");
var CSSGroupingRuleMutationTypes;
(function (CSSGroupingRuleMutationTypes) {
    CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT = "insertRuleEdit";
    CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT = "removeRuleEdit";
    CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT = "moveRuleEdit";
})(CSSGroupingRuleMutationTypes = exports.CSSGroupingRuleMutationTypes || (exports.CSSGroupingRuleMutationTypes = {}));
var SyntheticCSSGroupingRuleEdit = (function (_super) {
    __extends(SyntheticCSSGroupingRuleEdit, _super);
    function SyntheticCSSGroupingRuleEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticCSSGroupingRuleEdit.prototype.insertRule = function (rule, index) {
        return this.addChange(new common_1.InsertChildMutation(CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, this.target, rule.clone(true), index));
    };
    SyntheticCSSGroupingRuleEdit.prototype.moveRule = function (rule, index, patchedOldIndex) {
        return this.addChange(new common_1.MoveChildMutation(CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT, this.target, rule.clone(true), patchedOldIndex || this.target.rules.indexOf(rule), index));
    };
    SyntheticCSSGroupingRuleEdit.prototype.removeRule = function (rule) {
        return this.addChange(new common_1.RemoveChildMutation(CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, this.target, rule, this.target.rules.indexOf(rule)));
    };
    SyntheticCSSGroupingRuleEdit.prototype.addDiff = function (groupingRule) {
        var _this = this;
        _super.prototype.addDiff.call(this, groupingRule);
        utils_1.diffStyleSheetRules(this.target.rules, groupingRule.rules).accept({
            visitInsert: function (_a) {
                var index = _a.index, value = _a.value;
                _this.insertRule(value, index);
            },
            visitRemove: function (_a) {
                var index = _a.index;
                _this.removeRule(_this.target.rules[index]);
            },
            visitUpdate: function (_a) {
                var originalOldIndex = _a.originalOldIndex, patchedOldIndex = _a.patchedOldIndex, newValue = _a.newValue, index = _a.index;
                if (patchedOldIndex !== index) {
                    _this.moveRule(_this.target.rules[originalOldIndex], index, patchedOldIndex);
                }
                var oldRule = _this.target.rules[originalOldIndex];
                _this.addChildEdit(oldRule.createEdit().fromDiff(newValue));
            }
        });
        return this;
    };
    return SyntheticCSSGroupingRuleEdit;
}(base_1.SyntheticCSSObjectEdit));
exports.SyntheticCSSGroupingRuleEdit = SyntheticCSSGroupingRuleEdit;
function isCSSGroupingStyleMutation(mutation) {
    return !!(_a = {},
        _a[CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT] = true,
        _a[CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT] = true,
        _a[CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT] = true,
        _a)[mutation.type];
    var _a;
}
exports.isCSSGroupingStyleMutation = isCSSGroupingStyleMutation;
var CSSGroupingRuleEditor = (function (_super) {
    __extends(CSSGroupingRuleEditor, _super);
    function CSSGroupingRuleEditor(target, createInsertableCSSRule, onInsertedChild, onDeletedChild) {
        if (createInsertableCSSRule === void 0) { createInsertableCSSRule = function (parent, child) { return child.cssText; }; }
        var _this = _super.call(this, target) || this;
        _this.target = target;
        _this.createInsertableCSSRule = createInsertableCSSRule;
        _this.onInsertedChild = onInsertedChild;
        _this.onDeletedChild = onDeletedChild;
        return _this;
    }
    CSSGroupingRuleEditor.prototype.applySingleMutation = function (mutation) {
        if (mutation.type === CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT) {
            var _a = mutation, child = _a.child, index = _a.index;
            this.target.insertRule(this.createInsertableCSSRule(this.target, child), index);
            if (this.onInsertedChild)
                this.onInsertedChild(child, index);
        }
        else if (mutation.type === CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT) {
            var _b = mutation, child = _b.child, index = _b.index;
            this.target.deleteRule(index);
            if (this.onDeletedChild)
                this.onDeletedChild(child, index);
        }
        else if (mutation.type === CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT) {
            var _c = mutation, oldIndex = _c.oldIndex, child = _c.child, index = _c.index;
            var existingChild = this.target.cssRules[oldIndex];
            this.target.deleteRule(oldIndex);
            // TODO - move the existing instance -- don't just create a new one
            this.target.insertRule(this.createInsertableCSSRule(this.target, existingChild), index);
            if (this.onInsertedChild)
                this.onInsertedChild(existingChild, index);
        }
    };
    return CSSGroupingRuleEditor;
}(sandbox_1.BaseEditor));
exports.CSSGroupingRuleEditor = CSSGroupingRuleEditor;
var SyntheticCSSGroupingRuleEditor = (function (_super) {
    __extends(SyntheticCSSGroupingRuleEditor, _super);
    function SyntheticCSSGroupingRuleEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticCSSGroupingRuleEditor.prototype.applyMutations = function (mutations) {
        new CSSGroupingRuleEditor(this.target, function (parent, child) {
            return child.$parentRule === parent ? child : child.clone(true);
        }).applyMutations(mutations);
        new base_1.SyntheticCSSObjectEditor(this.target).applyMutations(mutations);
    };
    return SyntheticCSSGroupingRuleEditor;
}(sandbox_1.BaseEditor));
exports.SyntheticCSSGroupingRuleEditor = SyntheticCSSGroupingRuleEditor;
var SyntheticCSSGroupingRule = (function (_super) {
    __extends(SyntheticCSSGroupingRule, _super);
    function SyntheticCSSGroupingRule(rules) {
        if (rules === void 0) { rules = []; }
        var _this = _super.call(this) || this;
        _this.rules = rules;
        rules.forEach(function (rule) { return _this.linkRule(rule); });
        return _this;
    }
    Object.defineProperty(SyntheticCSSGroupingRule.prototype, "cssRules", {
        get: function () {
            return this.rules;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSGroupingRule.prototype.deleteRule = function (index) {
        var rule = this.cssRules[index];
        this.cssRules.splice(index, 1);
        var owner = this.ownerNode;
        if (owner)
            owner.notify(new common_1.RemoveChildMutation(CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, this, rule, index).toEvent());
    };
    SyntheticCSSGroupingRule.prototype.createEditor = function () {
        return new SyntheticCSSGroupingRuleEditor(this);
    };
    SyntheticCSSGroupingRule.prototype.regenerateUID = function () {
        _super.prototype.regenerateUID.call(this);
        for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
            var rule = _a[_i];
            rule.regenerateUID();
        }
        return this;
    };
    SyntheticCSSGroupingRule.prototype.createEdit = function () {
        return new SyntheticCSSGroupingRuleEdit(this);
    };
    SyntheticCSSGroupingRule.prototype.insertRule = function (rule, index) {
        var ruleInstance = typeof rule === "string" ? evaluate_1.evaluateCSS(parsers_1.parseCSS(rule)).rules[0] : rule;
        if (index == undefined) {
            index = this.rules.length;
        }
        this.rules.splice(index, 0, ruleInstance);
        this.linkRule(ruleInstance);
        var owner = this.ownerNode;
        if (owner)
            owner.notify(new common_1.InsertChildMutation(CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, this, ruleInstance, index).toEvent());
        return index;
    };
    SyntheticCSSGroupingRule.prototype.linkRule = function (rule) {
        rule.$parentRule = this;
    };
    return SyntheticCSSGroupingRule;
}(base_1.SyntheticCSSObject));
exports.SyntheticCSSGroupingRule = SyntheticCSSGroupingRule;
//# sourceMappingURL=grouping.js.map