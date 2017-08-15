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
var aerial_common_1 = require("aerial-common");
var aerial_sandbox_1 = require("aerial-sandbox");
var parse5 = require("parse5");
var providers_1 = require("../providers");
var dom_1 = require("../dom");
var MarkupStringMutation = (function (_super) {
    __extends(MarkupStringMutation, _super);
    function MarkupStringMutation(start, end, value, node, source) {
        var _this = _super.call(this, start, end, value) || this;
        _this.node = node;
        _this.source = source;
        return _this;
    }
    return MarkupStringMutation;
}(aerial_common_1.StringMutation));
// TODO - mutate ast, diff that, then apply sorted
// text transformations
var MarkupEditor = (function (_super) {
    __extends(MarkupEditor, _super);
    function MarkupEditor(uri, content) {
        var _this = _super.call(this, uri, content) || this;
        _this._sourceMutations = [];
        return _this;
    }
    MarkupEditor.prototype[aerial_common_1.RemoveMutation.REMOVE_CHANGE] = function (node, mutation) {
        var target = mutation.target;
        var index = node.parentNode.childNodes.indexOf(node);
        this._sourceMutations.push(new MarkupStringMutation(node.__location.startOffset, node.__location.endOffset, "", node, mutation));
    };
    // compatible with command & value node
    MarkupEditor.prototype[dom_1.SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT] = function (node, mutation) {
        var target = mutation.target, newValue = mutation.newValue;
        this._sourceMutations.push(new MarkupStringMutation(node.__location.startOffset, node.__location.endOffset, newValue, node, mutation));
    };
    MarkupEditor.prototype[dom_1.SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT] = function (node, mutation) {
        var target = mutation.target, name = mutation.name, newValue = mutation.newValue, oldName = mutation.oldName, index = mutation.index;
        var syntheticElement = target;
        var start = node.__location.startTag.startOffset + node.tagName.length + 1; // eat < + tagName
        var end = start;
        var found = false;
        for (var i = node.attrs.length; i--;) {
            var attr = node.attrs[i];
            if (attr.name === name) {
                found = true;
                var attrLocation = node.__location.attrs[attr.name];
                var beforeAttr = node.attrs[index];
                start = attrLocation.startOffset;
                end = attrLocation.endOffset;
                if (i !== index && beforeAttr) {
                    var beforeAttrLocation = node.__location.attrs[beforeAttr.name];
                    this._sourceMutations.push(new MarkupStringMutation(start, end, "", node, mutation));
                    start = end = beforeAttrLocation.startOffset;
                    node.attrs.splice(i, 1);
                    node.attrs.splice(index, 0, attr);
                }
                this._sourceMutations.push(new MarkupStringMutation(start, end, newValue ? " " + name + "=\"" + newValue + "\"" : "", node, mutation));
            }
        }
        if (!found) {
            var newMutation = new MarkupStringMutation(start, end, newValue ? " " + name + "=\"" + newValue + "\"" : "", node, mutation);
            var i = 0;
            for (i = 0; i < this._sourceMutations.length; i++) {
                var stringMutation = this._sourceMutations[i];
                if (stringMutation.node === node && stringMutation.source.type === dom_1.SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT) {
                    var prevAttrMutation = stringMutation.source;
                    if (prevAttrMutation.index < index && stringMutation.startIndex === start) {
                        break;
                    }
                }
            }
            this._sourceMutations.splice(i, 0, newMutation);
            node.attrs.splice(index, 0, { name: name, value: newValue });
        }
    };
    MarkupEditor.prototype[dom_1.SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT] = function (node, mutation) {
        var target = mutation.target, child = mutation.child, index = mutation.index;
        var childExpression = parse5.parseFragment(child.toString(), { locationInfo: true });
        var beforeChild = (node.childNodes[index] || node.childNodes[node.childNodes.length - 1]);
        // no children, so replace the _entire_ element with a new one
        if (!beforeChild) {
            var start = node.__location.startTag.startOffset;
            var end = node.__location.startTag.endOffset;
            node.childNodes.splice(index, 0, childExpression);
            this._sourceMutations.push(new MarkupStringMutation(node.__location.startTag.startOffset, node.__location.startTag.endOffset, dom_1.formatMarkupExpression(node), node, mutation));
        }
        else {
            this._sourceMutations.push(new MarkupStringMutation(beforeChild.__location.startOffset, beforeChild.__location.startOffset, child.toString(), node, mutation));
        }
    };
    MarkupEditor.prototype[dom_1.SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT] = function (node, mutation) {
        var target = mutation.target, child = mutation.child, index = mutation.index;
        var childNode = this.findTargetASTNode(node, child);
        this._sourceMutations.push(new MarkupStringMutation(childNode.__location.startOffset, childNode.__location.endOffset, "", node, mutation));
    };
    MarkupEditor.prototype[dom_1.SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT] = function (node, mutation) {
        var target = mutation.target, child = mutation.child, index = mutation.index;
        var childNode = this.findTargetASTNode(node, child);
        this._sourceMutations.push(new MarkupStringMutation(childNode.__location.startOffset, childNode.__location.endOffset, "", node, mutation));
        var afterChild = (node.childNodes[index] || node.childNodes[node.childNodes.length - 1]);
        this._sourceMutations.push(new MarkupStringMutation(childNode.__location.startOffset, childNode.__location.endOffset, "", node, mutation));
        this._sourceMutations.push(new MarkupStringMutation(afterChild.__location.endOffset, childNode.__location.endOffset, this.content.substr(childNode.__location.startOffset, childNode.__location.endOffset - childNode.__location.startOffset), node, mutation));
    };
    MarkupEditor.prototype.findTargetASTNode = function (root, synthetic) {
        return dom_1.findDOMNodeExpression(root, function (expression) {
            var location = dom_1.getHTMLASTNodeLocation(expression);
            return aerial_common_1.sourcePositionEquals(location, synthetic.source.start);
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
        var editorProvider = aerial_sandbox_1.ContentEditorFactoryProvider.find(contentMimeType, this.kernel);
        if (!editorProvider) {
            return this.logger.error("Cannot edit " + element.nodeName + ":" + contentMimeType + " element text content.");
        }
        var nodeLocation = dom_1.getHTMLASTNodeLocation(matchingTextNode);
        // need to add whitespace before the text node since the editor needs the proper line number in order to apply the
        // mutation. The column number should match.
        var lines = Array.from({ length: nodeLocation.line - 1 }).map(function () { return "\n"; }).join("");
        var newTextContent = editorProvider.create(this.uri, lines + matchingTextNode.value).applyMutations([mutation]);
        this._sourceMutations.push(new MarkupStringMutation(matchingTextNode.__location.startOffset, matchingTextNode.__location.endOffset, newTextContent, matchingTextNode, mutation));
    };
    MarkupEditor.prototype.parseContent = function (content) {
        return parse5.parse(content, { locationInfo: true });
    };
    MarkupEditor.prototype.getFormattedContent = function (root) {
        return new aerial_common_1.StringEditor(this.content).applyMutations(this._sourceMutations);
    };
    return MarkupEditor;
}(aerial_sandbox_1.BaseContentEditor));
exports.MarkupEditor = MarkupEditor;
/*

<div>anchor</div>
<div></div>

*/
//# sourceMappingURL=markup-editor.js.map