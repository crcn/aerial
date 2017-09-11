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
var ts = require("typescript");
var aerial_sandbox_1 = require("aerial-sandbox");
var aerial_synthetic_browser_1 = require("aerial-synthetic-browser");
var TSEditor = (function (_super) {
    __extends(TSEditor, _super);
    function TSEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._replacements = [];
        return _this;
    }
    TSEditor.prototype[aerial_synthetic_browser_1.SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT] = function (target, message) {
        var child = this.findTargetASTNode(target, message.child);
        this._replacements.push({
            start: child.getStart(),
            end: child.getEnd(),
            value: ""
        });
        var beforeChild = target.children[message.index];
        this._replacements.push({
            start: beforeChild.getStart(),
            end: beforeChild.getStart(),
            value: child.getText()
        });
    };
    TSEditor.prototype[aerial_synthetic_browser_1.SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT] = function (target, change) {
        var child = this.findTargetASTNode(target, change.child);
        this._replacements.push({
            start: child.getStart(),
            end: child.getEnd(),
            value: ""
        });
    };
    TSEditor.prototype[aerial_synthetic_browser_1.SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT] = function (target, change) {
        if (target.kind === ts.SyntaxKind.JsxSelfClosingElement) {
            var jsxElement = target;
            this._replacements.push({
                start: jsxElement.getEnd() - 2,
                end: jsxElement.getEnd(),
                value: ">" + change.child.toString() + "</" + jsxElement.tagName.getText() + ">"
            });
        }
        else {
            var jsxElement = target;
            var index = change.index;
            var pos = void 0;
            if (jsxElement.children.length) {
                pos = jsxElement.children[index >= jsxElement.children.length ? jsxElement.children.length - 1 : index].getEnd();
            }
            else {
                pos = jsxElement.openingElement.getEnd();
            }
            this._replacements.push({
                start: pos,
                end: pos,
                value: change.child.toString()
            });
        }
    };
    TSEditor.prototype[aerial_synthetic_browser_1.SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT] = function (target, change) {
        var _this = this;
        function alternativeName(name) {
            return {
                class: "className"
            }[name];
        }
        var modify = function (target) {
            var found;
            target.attributes;
            for (var _i = 0, _a = target.attributes.properties; _i < _a.length; _i++) {
                var attribute = _a[_i];
                // TODO - need to consider spreads
                var attr = attribute;
                if (attr.name.text === change.name || attr.name.text === alternativeName(change.name)) {
                    found = true;
                    // if the attribute value is undefined, then remove it
                    if (change.newValue == null) {
                        _this._replacements.push({
                            // remove whitespace with -1
                            start: attr.getStart(),
                            end: attr.getEnd(),
                            value: ""
                        });
                    }
                    else {
                        _this._replacements.push({
                            start: attr.initializer.getStart(),
                            end: attr.initializer.getEnd(),
                            value: "\"" + change.newValue + "\""
                        });
                    }
                }
            }
            if (!found) {
                _this._replacements.push({
                    start: target.tagName.getEnd(),
                    end: target.tagName.getEnd(),
                    value: " " + change.name + "=\"" + change.newValue + "\""
                });
            }
        };
        if (target.kind === ts.SyntaxKind.JsxSelfClosingElement) {
            modify(target);
        }
        else if (target.kind === ts.SyntaxKind.JsxElement) {
            modify(target.openingElement);
        }
    };
    TSEditor.prototype.parseContent = function (content) {
        return ts.createSourceFile(this.uri, content, ts.ScriptTarget.ES2016, true);
    };
    TSEditor.prototype.findTargetASTNode = function (root, target) {
        var found;
        var content = root.getSourceFile().getText();
        var find = function (node) {
            var pos = ts.getLineAndCharacterOfPosition(root.getSourceFile(), node.getFullStart());
            var tstart = target.$source.start;
            if (target.nodeType === aerial_synthetic_browser_1.DOMNodeType.ELEMENT) {
                // look for the tag name Identifier
                if (node.kind === ts.SyntaxKind.Identifier && pos.line + 1 === tstart.line && pos.character - 1 === tstart.column) {
                    found = node.parent;
                    if (found.kind === ts.SyntaxKind.JsxOpeningElement) {
                        found = found.parent;
                    }
                }
            }
            if (!found)
                ts.forEachChild(node, find);
        };
        ts.forEachChild(root, find);
        return found;
    };
    TSEditor.prototype.getFormattedContent = function (root) {
        var text = this.content;
        var replacements = this._replacements.sort(function (a, b) {
            return a.start > b.start ? -1 : 1;
        });
        for (var _i = 0, replacements_1 = replacements; _i < replacements_1.length; _i++) {
            var _a = replacements_1[_i], start = _a.start, end = _a.end, value = _a.value;
            text = text.substr(0, start) + value + text.substr(end);
        }
        return text;
    };
    return TSEditor;
}(aerial_sandbox_1.BaseContentEditor));
exports.TSEditor = TSEditor;
//# sourceMappingURL=ts-editor.js.map