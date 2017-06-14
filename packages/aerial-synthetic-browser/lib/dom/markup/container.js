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
var node_types_1 = require("./node-types");
var node_1 = require("./node");
var aerial_common_1 = require("aerial-common");
var collections_1 = require("../collections");
var selector_1 = require("../selector");
var aerial_sandbox_1 = require("aerial-sandbox");
var SyntheticDOMContainerMutationTypes;
(function (SyntheticDOMContainerMutationTypes) {
    SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT = aerial_common_1.TreeNodeMutationTypes.NODE_ADDED;
    SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT = aerial_common_1.TreeNodeMutationTypes.NODE_REMOVED;
    SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT = "moveChildNodeEdit";
})(SyntheticDOMContainerMutationTypes = exports.SyntheticDOMContainerMutationTypes || (exports.SyntheticDOMContainerMutationTypes = {}));
function isDOMContainerMutation(mutation) {
    return !!(_a = {},
        _a[SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT] = true,
        _a[SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT] = true,
        _a[SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT] = true,
        _a)[mutation.type];
    var _a;
}
exports.isDOMContainerMutation = isDOMContainerMutation;
var SyntheticDOMContainerEdit = (function (_super) {
    __extends(SyntheticDOMContainerEdit, _super);
    function SyntheticDOMContainerEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticDOMContainerEdit.prototype.insertChild = function (newChild, index) {
        // Clone child here to freeze it from any changes. It WILL be cloned again, but that's also important to ensure
        // that this edit can be applied to multiple targets.
        return this.addChange(new aerial_common_1.InsertChildMutation(SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT, this.target, newChild.cloneNode(true), index));
    };
    SyntheticDOMContainerEdit.prototype.removeChild = function (child) {
        return this.addChange(new aerial_common_1.RemoveChildMutation(SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT, this.target, child, this.target.childNodes.indexOf(child)));
    };
    SyntheticDOMContainerEdit.prototype.moveChild = function (child, index, patchedOldIndex) {
        return this.addChange(new aerial_common_1.MoveChildMutation(SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT, this.target, child, patchedOldIndex || this.target.childNodes.indexOf(child), index));
    };
    SyntheticDOMContainerEdit.prototype.appendChild = function (newChild) {
        return this.insertChild(newChild, Number.MAX_SAFE_INTEGER);
    };
    SyntheticDOMContainerEdit.prototype.remove = function () {
        return this.addChange(new aerial_common_1.RemoveMutation(this.target));
    };
    SyntheticDOMContainerEdit.prototype.addDiff = function (newContainer) {
        var _this = this;
        aerial_common_1.diffArray(this.target.childNodes, newContainer.childNodes, function (oldNode, newNode) {
            if (oldNode.nodeName !== newNode.nodeName || oldNode.namespaceURI !== newNode.namespaceURI)
                return -1;
            return 0;
        }).accept({
            visitInsert: function (_a) {
                var index = _a.index, value = _a.value;
                _this.insertChild(value, index);
            },
            visitRemove: function (_a) {
                var index = _a.index;
                _this.removeChild(_this.target.childNodes[index]);
            },
            visitUpdate: function (_a) {
                var originalOldIndex = _a.originalOldIndex, patchedOldIndex = _a.patchedOldIndex, newValue = _a.newValue, index = _a.index;
                if (patchedOldIndex !== index) {
                    _this.moveChild(_this.target.childNodes[originalOldIndex], index, patchedOldIndex);
                }
                var oldValue = _this.target.childNodes[originalOldIndex];
                _this.addChildEdit(oldValue.createEdit().fromDiff(newValue));
            }
        });
        return _super.prototype.addDiff.call(this, newContainer);
    };
    return SyntheticDOMContainerEdit;
}(node_1.SyntheticDOMNodeEdit));
exports.SyntheticDOMContainerEdit = SyntheticDOMContainerEdit;
var DOMContainerEditor = (function (_super) {
    __extends(DOMContainerEditor, _super);
    function DOMContainerEditor(target, createNode) {
        if (createNode === void 0) { createNode = function (source) { return source.cloneNode(true); }; }
        var _this = _super.call(this, target) || this;
        _this.target = target;
        _this.createNode = createNode;
        return _this;
    }
    DOMContainerEditor.prototype.applySingleMutation = function (mutation) {
        if (mutation.type === SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT) {
            var _a = mutation, child = _a.child, index = _a.index;
            this.target.removeChild(this.target.childNodes[index]);
        }
        if (mutation.type === SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT) {
            var moveMutation = mutation;
            this._insertChildAt(this.target.childNodes[moveMutation.oldIndex], moveMutation.index);
        }
        else if (mutation.type === SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT) {
            var insertMutation = mutation;
            var newChild = this.createNode(insertMutation.child);
            this._insertChildAt(newChild, insertMutation.index);
        }
    };
    DOMContainerEditor.prototype._insertChildAt = function (child, index) {
        if (child.parentNode) {
            child.parentNode.removeChild(child);
        }
        if (index === this.target.childNodes.length) {
            this.target.appendChild(child);
        }
        else {
            var existingChild = this.target.childNodes[index];
            this.target.insertBefore(child, existingChild);
        }
    };
    return DOMContainerEditor;
}(aerial_sandbox_1.BaseEditor));
exports.DOMContainerEditor = DOMContainerEditor;
var SyntheticDOMContainerEditor = (function (_super) {
    __extends(SyntheticDOMContainerEditor, _super);
    function SyntheticDOMContainerEditor(target) {
        var _this = _super.call(this, target) || this;
        _this._domContainerEditor = _this.createDOMEditor(target);
        _this._nodeEditor = new node_1.SyntheticDOMNodeEditor(target);
        return _this;
    }
    SyntheticDOMContainerEditor.prototype.createDOMEditor = function (target) {
        return new DOMContainerEditor(target);
    };
    SyntheticDOMContainerEditor.prototype.applyMutations = function (mutations) {
        _super.prototype.applyMutations.call(this, mutations);
        this._domContainerEditor.applyMutations(mutations);
        this._nodeEditor.applyMutations(mutations);
    };
    return SyntheticDOMContainerEditor;
}(aerial_sandbox_1.BaseEditor));
exports.SyntheticDOMContainerEditor = SyntheticDOMContainerEditor;
var SyntheticDOMContainer = (function (_super) {
    __extends(SyntheticDOMContainer, _super);
    function SyntheticDOMContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticDOMContainer.prototype.createEdit = function () {
        return new SyntheticDOMContainerEdit(this);
    };
    SyntheticDOMContainer.prototype.getChildSyntheticByUID = function (uid) {
        return aerial_common_1.findTreeNode(this, function (child) { return child.uid === uid; });
    };
    // TODO - insertBefore here
    SyntheticDOMContainer.prototype.appendChild = function (child) {
        var _this = this;
        if (child.nodeType === node_types_1.DOMNodeType.DOCUMENT_FRAGMENT) {
            child.children.concat().forEach(function (child) { return _this.appendChild(child); });
            return child;
        }
        return _super.prototype.appendChild.call(this, child);
    };
    Object.defineProperty(SyntheticDOMContainer.prototype, "textContent", {
        get: function () {
            return this.childNodes.map(function (child) { return child.textContent; }).join("");
        },
        set: function (value) {
            this.removeAllChildren();
            this.appendChild(this.ownerDocument.createTextNode(value));
        },
        enumerable: true,
        configurable: true
    });
    SyntheticDOMContainer.prototype.toString = function () {
        return this.childNodes.map(function (child) { return child.toString(); }).join("");
    };
    SyntheticDOMContainer.prototype.querySelector = function (selector) {
        return selector_1.querySelector(this, selector);
    };
    SyntheticDOMContainer.prototype.querySelectorAll = function (selector) {
        return selector_1.querySelectorAll(this, selector);
    };
    SyntheticDOMContainer.prototype.getElementsByTagName = function (tagName) {
        return collections_1.SyntheticHTMLCollection.create.apply(collections_1.SyntheticHTMLCollection, aerial_common_1.filterTree(this, function (node) {
            return node.nodeType === node_types_1.DOMNodeType.ELEMENT && (tagName === "*" || node.nodeName === tagName);
        }));
    };
    SyntheticDOMContainer.prototype.getElementsByClassName = function (className) {
        return collections_1.SyntheticHTMLCollection.create.apply(collections_1.SyntheticHTMLCollection, this.querySelectorAll("." + className));
    };
    SyntheticDOMContainer.prototype.createEditor = function () {
        return new SyntheticDOMContainerEditor(this);
    };
    SyntheticDOMContainer.prototype.visitWalker = function (walker) {
        this.childNodes.forEach(function (child) { return walker.accept(child); });
    };
    return SyntheticDOMContainer;
}(node_1.SyntheticDOMNode));
exports.SyntheticDOMContainer = SyntheticDOMContainer;
function isShadowRootOrDocument(node) {
    return (node.nodeType === node_types_1.DOMNodeType.DOCUMENT_FRAGMENT || node.nodeType === node_types_1.DOMNodeType.DOCUMENT);
}
//# sourceMappingURL=container.js.map