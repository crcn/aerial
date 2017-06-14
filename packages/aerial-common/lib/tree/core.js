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
var observable_1 = require("../observable");
var mesh_1 = require("mesh");
var messages_1 = require("../messages");
var TreeNodeMutationTypes;
(function (TreeNodeMutationTypes) {
    TreeNodeMutationTypes.NODE_ADDED = "nodeAdded";
    TreeNodeMutationTypes.NODE_REMOVED = "nodeRemoved";
})(TreeNodeMutationTypes = exports.TreeNodeMutationTypes || (exports.TreeNodeMutationTypes = {}));
var TreeNode = (function (_super) {
    __extends(TreeNode, _super);
    function TreeNode() {
        var _this = _super.call(this) || this;
        _this._children = _this.createChildren();
        _this._childObserver = new mesh_1.CallbackBus(_this.onChildAction.bind(_this));
        return _this;
    }
    Object.defineProperty(TreeNode.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "firstChild", {
        get: function () {
            return this._children[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "lastChild", {
        get: function () {
            return this._children[this._children.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    TreeNode.prototype.appendChild = function (child) {
        this.insertChildAt(child, this._children.length);
        return child;
    };
    TreeNode.prototype.removeAllChildren = function () {
        while (this._children.length) {
            this.removeChild(this._children[0]);
        }
    };
    TreeNode.prototype.createChildren = function () {
        return [];
    };
    TreeNode.prototype.removeChild = function (child) {
        var index = this._children.indexOf(child);
        if (index === -1) {
            return undefined;
        }
        this._children.splice(index, 1);
        this.onChildRemoved(child, index);
        return child;
    };
    TreeNode.prototype.insertChildAt = function (newChild, index) {
        if (newChild._parent) {
            newChild._parent.removeChild(newChild);
        }
        this._children.splice(index, 0, newChild);
        this.onChildAdded(newChild, index);
    };
    TreeNode.prototype.insertBefore = function (newChild, existingChild) {
        if (existingChild == null)
            return this.appendChild(newChild);
        var index = this._children.indexOf(existingChild);
        if (index !== -1) {
            this.insertChildAt(newChild, index);
        }
        return newChild;
    };
    TreeNode.prototype.replaceChild = function (newChild, existingChild) {
        var index = this._children.indexOf(existingChild);
        if (index !== -1) {
            this.insertChildAt(newChild, index);
            this.removeChild(existingChild);
        }
        return existingChild;
    };
    Object.defineProperty(TreeNode.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "root", {
        get: function () {
            var p = this;
            while (p.parent)
                p = p.parent;
            return p;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "ancestors", {
        get: function () {
            var ancestors = [];
            var p = this.parent;
            while (p) {
                ancestors.push(p);
                p = p.parent;
            }
            return ancestors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "nextSibling", {
        get: function () {
            return this._parent ? this._parent.children[this._parent.children.indexOf(this) + 1] : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "previousSibling", {
        get: function () {
            return this._parent ? this._parent.children[this._parent.children.indexOf(this) - 1] : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "depth", {
        get: function () {
            return this.ancestors.length;
        },
        enumerable: true,
        configurable: true
    });
    TreeNode.prototype.onChildAdded = function (child, index) {
        child._parent = this;
        child.observe(this._childObserver);
        child.notify(new messages_1.InsertChildMutation(TreeNodeMutationTypes.NODE_ADDED, this, child, index).toEvent());
        child.onAdded();
    };
    TreeNode.prototype.onChildRemoved = function (child, index) {
        child.onRemoved();
        child.notify(new messages_1.RemoveChildMutation(TreeNodeMutationTypes.NODE_REMOVED, this, child, index).toEvent());
        child.unobserve(this._childObserver);
        child._parent = undefined;
    };
    TreeNode.prototype.onAdded = function () {
    };
    TreeNode.prototype.onRemoved = function () {
    };
    TreeNode.prototype.clone = function (deep) {
        var clone = this.cloneLeaf();
        if (deep) {
            for (var i = 0, n = this.children.length; i < n; i++) {
                clone.appendChild(this.children[i].clone(deep));
            }
        }
        return clone;
    };
    TreeNode.prototype.cloneLeaf = function () {
        return new TreeNode();
    };
    TreeNode.prototype.onChildAction = function (message) {
        this.notify(message);
    };
    TreeNode.prototype.visitWalker = function (walker) {
        this.children.forEach(function (child) { return walker.accept(child); });
    };
    return TreeNode;
}(observable_1.Observable));
exports.TreeNode = TreeNode;
//# sourceMappingURL=core.js.map