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
var sandbox_1 = require("@tandem/sandbox");
var parse5 = require("parse5");
var providers_1 = require("../providers");
var dom_1 = require("../dom");
// TODO - mutate ast, diff that, then apply sorted
// text transformations
var MarkupEditor = (function (_super) {
    __extends(MarkupEditor, _super);
    function MarkupEditor(uri, content) {
        var _this = _super.call(this, uri, content) || this;
        _this._replacements = [];
        return _this;
    }
    MarkupEditor.prototype[common_1.RemoveMutation.REMOVE_CHANGE] = function (node, _a) {
        var target = _a.target;
        var index = node.parentNode.childNodes.indexOf(node);
        this._replacements.push({
            start: node.__location.startOffset,
            end: node.__location.endOffset,
            value: ""
        });
        // if (index !== -1) {
        //   // node.parentNode.childNodes.splice(index, 1);
        //   this._replacements.push({
        //     start: node.__location.startOffset,
        //     end: node.__location.endOffset,
        //     value: ""
        //   });
        // }
    };
    // compatible with command & value node
    MarkupEditor.prototype[dom_1.SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT] = function (node, _a) {
        var target = _a.target, newValue = _a.newValue;
        // node.value = node.data = newValue;
        this._replacements.push({
            start: node.__location.startOffset,
            end: node.__location.endOffset,
            value: newValue
        });
    };
    MarkupEditor.prototype[dom_1.SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT] = function (node, _a) {
        var target = _a.target, name = _a.name, newValue = _a.newValue, oldName = _a.oldName, index = _a.index;
        var syntheticElement = target;
        var start = node.__location.startTag.startOffset;
        var end = node.__location.startTag.endOffset;
        var found;
        for (var i = node.attrs.length; i--;) {
            var attr = node.attrs[i];
            if (attr.name === name) {
                found = true;
                if (newValue == null) {
                    node.attrs.splice(i, 1);
                }
                else {
                    attr.value = newValue;
                    if (i !== index) {
                        node.attrs.splice(i, 1);
                        node.attrs.splice(index, 0, attr);
                    }
                }
                break;
            }
        }
        if (!found) {
            node.attrs.splice(index, 0, { name: name, value: newValue });
        }
        if (oldName) {
            for (var i = node.attrs.length; i--;) {
                var attr = node.attrs[i];
                if (attr.name === name) {
                    node.attrs.splice(i, 1);
                }
            }
        }
        var diff = dom_1.formatMarkupExpression(node);
        var change = parse5.parseFragment(diff, { locationInfo: true }).childNodes[0];
        // does not work for /> end tags
        // console.log(diff, diff.substr(change.__location.startTag.startOffset, change.__location.startTag.endOffset));
        // console.log(this.content.substr(start, end - start))
        // console.log(diff.substr(change.__location.startTag.startOffset, change.__location.startTag.endOffset - change.__location.startTag.startOffset));
        this._replacements.push({
            start: start,
            end: end,
            value: diff.substr(change.__location.startTag.startOffset, change.__location.startTag.endOffset - change.__location.startTag.startOffset)
        });
    };
    MarkupEditor.prototype[dom_1.SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT] = function (node, _a) {
        var target = _a.target, child = _a.child, index = _a.index;
        var childExpression = parse5.parseFragment(child.toString(), { locationInfo: true });
        var afterChild = (node.childNodes[index] || node.childNodes[node.childNodes.length - 1]);
        if (!afterChild) {
            var start = node.__location.startTag.startOffset;
            var end = node.__location.startTag.endOffset;
            node.childNodes.splice(index, 0, childExpression);
            this._replacements.push({
                start: node.__location.startTag.startOffset,
                end: node.__location.startTag.endOffset,
                value: dom_1.formatMarkupExpression(node)
            });
        }
        else {
            this._replacements.push({
                start: afterChild.__location.endOffset,
                end: afterChild.__location.endOffset,
                value: child.toString()
            });
        }
    };
    MarkupEditor.prototype[dom_1.SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT] = function (node, _a) {
        var target = _a.target, child = _a.child, index = _a.index;
        var childNode = this.findTargetASTNode(node, child);
        this._replacements.push({
            start: childNode.__location.startOffset,
            end: childNode.__location.endOffset,
            value: ""
        });
        // node.childNodes.splice(node.childNodes.indexOf(childNode), 1);
    };
    MarkupEditor.prototype[dom_1.SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT] = function (node, _a) {
        var target = _a.target, child = _a.child, index = _a.index;
        var childNode = this.findTargetASTNode(node, child);
        this._replacements.push({
            start: childNode.__location.startOffset,
            end: childNode.__location.endOffset,
            value: ""
        });
        // node.childNodes.splice(node.childNodes.indexOf(childNode), 1);
        var afterChild = (node.childNodes[index] || node.childNodes[node.childNodes.length - 1]);
        // console.log(!!afterChild);
        this._replacements.push({
            start: afterChild.__location.endOffset,
            end: childNode.__location.endOffset,
            value: this.content.substr(childNode.__location.startOffset, childNode.__location.endOffset - childNode.__location.startOffset)
        });
        // node.childNodes.splice(index, 0, childNode);
    };
    MarkupEditor.prototype.findTargetASTNode = function (root, synthetic) {
        return dom_1.findDOMNodeExpression(root, function (expression) {
            var location = dom_1.getHTMLASTNodeLocation(expression);
            return common_1.sourcePositionEquals(location, synthetic.source.start);
        });
    };
    MarkupEditor.prototype.handleUnknownMutation = function (mutation) {
        var mstart = mutation.target.source.start;
        // for now just support text nodes. However, attributes may need to be implemented here in thre future
        var matchingTextNode = dom_1.filterDOMNodeExpressions(this._rootASTNode, function (expression) {
            var eloc = dom_1.getHTMLASTNodeLocation(expression);
            // may be new -- ignore if there is no location 
            if (!eloc)
                return false;
            //  && 
            // (mstart.line < eloc.end.line || (mstart.line === eloc.end.line && mstart.column <= eloc.end.column)
            return (mstart.line > eloc.line || (mstart.line === eloc.line && mstart.column >= eloc.column));
        }).pop();
        if (!matchingTextNode || matchingTextNode.nodeName !== "#text") {
            return _super.prototype.handleUnknownMutation.call(this, mutation);
        }
        if (!matchingTextNode.parentNode)
            return _super.prototype.handleUnknownMutation.call(this, mutation);
        var element = matchingTextNode.parentNode;
        var contentMimeType = providers_1.ElementTextContentMimeTypeProvider.lookup(element, this.kernel);
        if (!contentMimeType)
            return _super.prototype.handleUnknownMutation.call(this, mutation);
        var editorProvider = sandbox_1.ContentEditorFactoryProvider.find(contentMimeType, this.kernel);
        if (!editorProvider) {
            return this.logger.error("Cannot edit " + element.nodeName + ":" + contentMimeType + " element text content.");
        }
        var nodeLocation = dom_1.getHTMLASTNodeLocation(matchingTextNode);
        // need to add whitespace before the text node since the editor needs the proper line number in order to apply the
        // mutation. The column number should match.
        var lines = Array.from({ length: nodeLocation.line - 1 }).map(function () { return "\n"; }).join("");
        var newTextContent = editorProvider.create(this.uri, lines + matchingTextNode.value).applyMutations([mutation]);
        this._replacements.push({
            start: matchingTextNode.__location.startOffset,
            end: matchingTextNode.__location.endOffset,
            value: newTextContent
        });
    };
    MarkupEditor.prototype.parseContent = function (content) {
        return parse5.parse(content, { locationInfo: true });
    };
    MarkupEditor.prototype.getFormattedContent = function (root) {
        var result = this.content;
        var used = [];
        // ends first
        this._replacements.sort(function (a, b) {
            return a.start > b.start ? -1 : 1;
        }).forEach(function (_a) {
            var start = _a.start, value = _a.value, end = _a.end;
            for (var _i = 0, used_1 = used; _i < used_1.length; _i++) {
                var _b = used_1[_i], s = _b[0], e = _b[1];
                // overlapping. Okay for now unless the user
                // applies many mutations all at once
                if ((start >= s && start < e)) {
                    return;
                }
            }
            used.push([start, end]);
            result = result.substr(0, start) + value + result.substr(end);
        });
        return result;
    };
    return MarkupEditor;
}(sandbox_1.BaseContentEditor));
exports.MarkupEditor = MarkupEditor;
//# sourceMappingURL=markup-editor.js.map