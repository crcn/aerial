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
var postcss = require("postcss");
var lodash_1 = require("lodash");
var aerial_common_1 = require("aerial-common");
var dom_1 = require("../dom");
var aerial_sandbox_1 = require("aerial-sandbox");
// TODO - move this to synthetic-browser
// TODO - may need to split this out into separate CSS editors. Some of this is specific
// to SASS
var CSSEditor = (function (_super) {
    __extends(CSSEditor, _super);
    function CSSEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CSSEditor.prototype[dom_1.SyntheticCSSElementStyleRuleMutationTypes.SET_RULE_SELECTOR] = function (node, _a) {
        var target = _a.target, newValue = _a.newValue;
        var source = target.source;
        node.selector = newValue;
    };
    CSSEditor.prototype[dom_1.CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT] = function (node, _a) {
        var target = _a.target, child = _a.child;
        var childNode = this.findTargetASTNode(node, child);
        childNode.parent.removeChild(childNode);
    };
    CSSEditor.prototype[dom_1.CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT] = function (node, _a) {
        var target = _a.target, child = _a.child, index = _a.index;
        var childNode = this.findTargetASTNode(node, child);
        var parent = childNode.parent;
        parent.removeChild(childNode);
        parent.insertBefore(node.nodes[index], childNode);
    };
    CSSEditor.prototype[dom_1.CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT] = function (node, _a) {
        var target = _a.target, child = _a.child, index = _a.index;
        var newChild = child;
        var newChildNode = {
            rule: function (rule) {
                var ruleNode = postcss.rule({
                    selector: rule.selector,
                });
                for (var key in rule.style.toObject()) {
                    ruleNode.append(postcss.decl({
                        prop: key,
                        value: rule.style[key]
                    }));
                }
                return ruleNode;
            },
            atrule: function (atrule) {
                var ruleNode = postcss.atRule({
                    name: atrule.atRuleName,
                    params: atrule.params
                });
                for (var _i = 0, _a = atrule.cssRules; _i < _a.length; _i++) {
                    var rule = _a[_i];
                    ruleNode.append(this[rule.source.kind](rule));
                }
                return ruleNode;
            }
        }[newChild.source.kind](newChild);
        if (index >= node.nodes.length) {
            node.append(newChildNode);
        }
        else {
            node.each(function (child, i) {
                if (child.parent === node && i === index) {
                    node.insertBefore(child, newChildNode);
                    return false;
                }
            });
        }
    };
    CSSEditor.prototype[dom_1.SyntheticCSSElementStyleRuleMutationTypes.SET_DECLARATION] = function (node, _a) {
        var target = _a.target, name = _a.name, newValue = _a.newValue, oldName = _a.oldName, index = _a.index;
        var source = target.source;
        name = lodash_1.kebabCase(name);
        var found;
        var foundIndex = -1;
        var shouldAdd = node.walkDecls(function (decl, index) {
            if (decl.parent !== node)
                return;
            if (decl.prop === name || decl.prop === oldName) {
                if (name && newValue) {
                    decl.prop = name;
                    decl.value = newValue;
                    foundIndex = index;
                }
                else {
                    node.removeChild(decl);
                }
                found = true;
            }
        });
        if (index != null && foundIndex > -1 && foundIndex !== index) {
            var decl = node.nodes[foundIndex];
            node.removeChild(decl);
            if (index === node.nodes.length) {
                node.append(decl);
            }
            else {
                node.insertBefore(node.nodes[index], decl);
            }
        }
        if (!found && newValue) {
            node.append(postcss.decl({ prop: name, value: newValue }));
        }
    };
    CSSEditor.prototype.findTargetASTNode = function (root, target) {
        var _this = this;
        var found;
        var walk = function (node, index) {
            if (found)
                return false;
            if (_this.nodeMatchesSyntheticSource(node, target.source)) {
                found = node;
                return false;
            }
        };
        if (walk(root, -1) !== false) {
            root.walk(walk);
        }
        return found;
    };
    CSSEditor.prototype.nodeMatchesSyntheticSource = function (node, source) {
        return node.type === source.kind && node.source && aerial_common_1.sourcePositionEquals(node.source.start, source.start);
    };
    CSSEditor.prototype.parseContent = function (content) {
        return dom_1.parseCSS(content, undefined, null, false);
    };
    CSSEditor.prototype.getFormattedContent = function (root) {
        // try parsing again. This should throw an error if any edits are invalid.
        dom_1.parseCSS(root.toString());
        return root.toString();
    };
    __decorate([
        aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
    ], CSSEditor.prototype, "_kernel", void 0);
    return CSSEditor;
}(aerial_sandbox_1.BaseContentEditor));
exports.CSSEditor = CSSEditor;
function isRuleNode(node) {
    return node.type === "rule";
}
//# sourceMappingURL=css-editor.js.map