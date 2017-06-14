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
var lodash_1 = require("lodash");
var mesh_1 = require("mesh");
var __1 = require("..");
var aerial_sandbox_1 = require("aerial-sandbox");
var style_1 = require("./style");
var base_1 = require("./base");
var aerial_common_1 = require("aerial-common");
var SyntheticCSSStyleRuleMutationTypes;
(function (SyntheticCSSStyleRuleMutationTypes) {
    SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION = "setDeclaration";
})(SyntheticCSSStyleRuleMutationTypes = exports.SyntheticCSSStyleRuleMutationTypes || (exports.SyntheticCSSStyleRuleMutationTypes = {}));
function isCSSStyleRuleMutation(mutation) {
    return !!(_a = {},
        _a[SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION] = true,
        _a)[mutation.type];
    var _a;
}
exports.isCSSStyleRuleMutation = isCSSStyleRuleMutation;
// TODO - move this to synthetic-browser
var SyntheticCSSStyleRuleEdit = (function (_super) {
    __extends(SyntheticCSSStyleRuleEdit, _super);
    function SyntheticCSSStyleRuleEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticCSSStyleRuleEdit.prototype.setDeclaration = function (name, value, oldName, index) {
        return this.addChange(new aerial_common_1.PropertyMutation(SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION, this.target, name, value, undefined, oldName, index));
    };
    SyntheticCSSStyleRuleEdit.prototype.addDiff = function (newRule) {
        var _this = this;
        _super.prototype.addDiff.call(this, newRule);
        var oldKeys = Object.keys(this.target.style).filter(style_1.isValidCSSDeclarationProperty);
        var newKeys = Object.keys(newRule.style).filter(style_1.isValidCSSDeclarationProperty);
        aerial_common_1.diffArray(oldKeys, newKeys, function (a, b) {
            return a === b ? 0 : -1;
        }).accept({
            visitInsert: function (_a) {
                var value = _a.value, index = _a.index;
                _this.setDeclaration(value, newRule.style[value], undefined, index);
            },
            visitRemove: function (_a) {
                var index = _a.index;
                // don't apply a move edit if the value doesn't exist.
                if (_this.target.style[oldKeys[index]]) {
                    _this.setDeclaration(oldKeys[index], undefined);
                }
            },
            visitUpdate: function (_a) {
                var originalOldIndex = _a.originalOldIndex, newValue = _a.newValue, index = _a.index;
                if (_this.target.style[newValue] !== newRule.style[newValue]) {
                    _this.setDeclaration(newValue, newRule.style[newValue], undefined, index);
                }
            }
        });
        return this;
    };
    return SyntheticCSSStyleRuleEdit;
}(base_1.SyntheticCSSObjectEdit));
exports.SyntheticCSSStyleRuleEdit = SyntheticCSSStyleRuleEdit;
var CSSStyleRuleEditor = (function (_super) {
    __extends(CSSStyleRuleEditor, _super);
    function CSSStyleRuleEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CSSStyleRuleEditor.prototype.applySingleMutation = function (mutation) {
        if (mutation.type === SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION) {
            var _a = mutation, name_1 = _a.name, newValue = _a.newValue, oldName = _a.oldName;
            this.target.style.setProperty(lodash_1.kebabCase(name_1), newValue);
            if (newValue == null) {
                this.target.style.removeProperty(name_1);
            }
            if (oldName) {
                this.target.style.removeProperty(oldName);
            }
        }
    };
    return CSSStyleRuleEditor;
}(aerial_sandbox_1.BaseEditor));
exports.CSSStyleRuleEditor = CSSStyleRuleEditor;
var SyntheticCSSStyleRuleEditor = (function (_super) {
    __extends(SyntheticCSSStyleRuleEditor, _super);
    function SyntheticCSSStyleRuleEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticCSSStyleRuleEditor.prototype.applyMutations = function (mutations) {
        _super.prototype.applyMutations.call(this, mutations);
        new base_1.SyntheticCSSObjectEditor(this.target).applyMutations(mutations);
        new CSSStyleRuleEditor(this.target).applyMutations(mutations);
    };
    return SyntheticCSSStyleRuleEditor;
}(aerial_sandbox_1.BaseEditor));
exports.SyntheticCSSStyleRuleEditor = SyntheticCSSStyleRuleEditor;
var SyntheticCSSStyleRule = (function (_super) {
    __extends(SyntheticCSSStyleRule, _super);
    function SyntheticCSSStyleRule(style) {
        var _this = _super.call(this) || this;
        _this.style = style;
        if (!style)
            style = _this.style = new style_1.SyntheticCSSStyle();
        style.$parentRule = _this;
        return _this;
    }
    Object.defineProperty(SyntheticCSSStyleRule.prototype, "metadata", {
        get: function () {
            if (this._metadata)
                return this._metadata;
            this._metadata = new aerial_common_1.Metadata();
            this._metadata.observe(this._metadataObserver = new mesh_1.CallbackBus(this._onMetadataEvent.bind(this)));
            return this._metadata;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSStyleRule.prototype.createEdit = function () {
        return new SyntheticCSSStyleRuleEdit(this);
    };
    SyntheticCSSStyleRule.prototype.toString = function () {
        return this.cssText;
    };
    SyntheticCSSStyleRule.prototype.createEditor = function () {
        return new SyntheticCSSStyleRuleEditor(this);
    };
    SyntheticCSSStyleRule.prototype.visitWalker = function (walker) {
        walker.accept(this.style);
    };
    SyntheticCSSStyleRule.prototype._onMetadataEvent = function (event) {
        var ownerNode = this.$ownerNode || (this.$parentStyleSheet && this.$parentStyleSheet.$ownerNode);
        if (ownerNode)
            ownerNode.notify(event);
    };
    return SyntheticCSSStyleRule;
}(base_1.SyntheticCSSObject));
exports.SyntheticCSSStyleRule = SyntheticCSSStyleRule;
var SyntheticCSSElementStyleRuleMutationTypes;
(function (SyntheticCSSElementStyleRuleMutationTypes) {
    SyntheticCSSElementStyleRuleMutationTypes.SET_DECLARATION = SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION;
    SyntheticCSSElementStyleRuleMutationTypes.SET_RULE_SELECTOR = "setRuleSelector";
})(SyntheticCSSElementStyleRuleMutationTypes = exports.SyntheticCSSElementStyleRuleMutationTypes || (exports.SyntheticCSSElementStyleRuleMutationTypes = {}));
function isCSSSElementtyleRuleMutation(mutation) {
    return isCSSStyleRuleMutation(mutation) || !!(_a = {},
        _a[SyntheticCSSElementStyleRuleMutationTypes.SET_RULE_SELECTOR] = true,
        _a)[mutation.type];
    var _a;
}
exports.isCSSSElementtyleRuleMutation = isCSSSElementtyleRuleMutation;
var SyntheticCSSElementStyleRuleEdit = (function (_super) {
    __extends(SyntheticCSSElementStyleRuleEdit, _super);
    function SyntheticCSSElementStyleRuleEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticCSSElementStyleRuleEdit.prototype.setSelector = function (selector) {
        return this.addChange(new aerial_common_1.SetValueMutation(SyntheticCSSElementStyleRuleMutationTypes.SET_RULE_SELECTOR, this.target, selector));
    };
    SyntheticCSSElementStyleRuleEdit.prototype.addDiff = function (newRule) {
        _super.prototype.addDiff.call(this, newRule);
        if (this.target.selector !== newRule.selector) {
            this.setSelector(newRule.selector);
        }
        return this;
    };
    return SyntheticCSSElementStyleRuleEdit;
}(SyntheticCSSStyleRuleEdit));
exports.SyntheticCSSElementStyleRuleEdit = SyntheticCSSElementStyleRuleEdit;
var SyntheticCSSElementStyleRuleSerializer = (function () {
    function SyntheticCSSElementStyleRuleSerializer() {
    }
    SyntheticCSSElementStyleRuleSerializer.prototype.serialize = function (value) {
        return [value.selector, aerial_common_1.serialize(value.style)];
    };
    SyntheticCSSElementStyleRuleSerializer.prototype.deserialize = function (_a, kernel) {
        var selector = _a[0], style = _a[1];
        return new SyntheticCSSElementStyleRule(selector, aerial_common_1.deserialize(style, kernel));
    };
    return SyntheticCSSElementStyleRuleSerializer;
}());
var SyntheticCSSElementStyleRule = (function (_super) {
    __extends(SyntheticCSSElementStyleRule, _super);
    var SyntheticCSSElementStyleRule = SyntheticCSSElementStyleRule_1 = function SyntheticCSSElementStyleRule(selector, style) {
        var _this = _super.call(this, style) || this;
        _this.selector = selector;
        return _this;
    };
    Object.defineProperty(SyntheticCSSElementStyleRule.prototype, "cssText", {
        get: function () {
            return this.selector + " {\n" + this.style.cssText + "}\n";
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSElementStyleRule.prototype.createEdit = function () {
        return new SyntheticCSSElementStyleRuleEdit(this);
    };
    SyntheticCSSElementStyleRule.prototype.cloneShallow = function () {
        return new SyntheticCSSElementStyleRule_1(this.selector, undefined);
    };
    SyntheticCSSElementStyleRule.prototype.matchesElement = function (element) {
        return __1.getSelectorTester(this.selector, element).test(element);
    };
    SyntheticCSSElementStyleRule.prototype.countShallowDiffs = function (target) {
        return this.selector === target.selector ? 0 : -1;
    };
    SyntheticCSSElementStyleRule = SyntheticCSSElementStyleRule_1 = __decorate([
        aerial_common_1.serializable("SyntheticCSSElementStyleRule", new base_1.SyntheticCSSObjectSerializer(new SyntheticCSSElementStyleRuleSerializer()))
    ], SyntheticCSSElementStyleRule);
    return SyntheticCSSElementStyleRule;
    var SyntheticCSSElementStyleRule_1;
}(SyntheticCSSStyleRule));
exports.SyntheticCSSElementStyleRule = SyntheticCSSElementStyleRule;
//# sourceMappingURL=style-rule.js.map