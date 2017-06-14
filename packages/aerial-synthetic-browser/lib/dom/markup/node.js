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
var aerial_sandbox_1 = require("aerial-sandbox");
var events_1 = require("../events");
var aerial_common_1 = require("aerial-common");
exports.SyntheticDOMNodeSerializer = aerial_sandbox_1.SyntheticObjectSerializer;
var SyntheticDOMNodeEdit = (function (_super) {
    __extends(SyntheticDOMNodeEdit, _super);
    function SyntheticDOMNodeEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SyntheticDOMNodeEdit;
}(aerial_sandbox_1.SyntheticObjectEdit));
exports.SyntheticDOMNodeEdit = SyntheticDOMNodeEdit;
var SyntheticDOMNodeEditor = (function (_super) {
    __extends(SyntheticDOMNodeEditor, _super);
    function SyntheticDOMNodeEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SyntheticDOMNodeEditor;
}(aerial_sandbox_1.SyntheticObjectEditor));
exports.SyntheticDOMNodeEditor = SyntheticDOMNodeEditor;
// TODO - possibly have metadata here since it's generic and can be used with any synthetic
var SyntheticDOMNode = (function (_super) {
    __extends(SyntheticDOMNode, _super);
    function SyntheticDOMNode(nodeName) {
        var _this = _super.call(this) || this;
        _this.nodeName = nodeName;
        _this.regenerateUID();
        _this.metadata = new aerial_common_1.Metadata(_this.getInitialMetadata());
        _this.metadata.observe(new aerial_common_1.BubbleDispatcher(_this));
        return _this;
    }
    Object.defineProperty(SyntheticDOMNode.prototype, "eventDispatcher", {
        get: function () {
            return this._eventDispatcher || (this._eventDispatcher = new events_1.DOMEventDispatcherMap(this));
        },
        enumerable: true,
        configurable: true
    });
    // necessary after cloning
    SyntheticDOMNode.prototype.regenerateUID = function () {
        this.$uid = aerial_sandbox_1.generateSyntheticUID();
        for (var i = this.children.length; i--;) {
            this.children[i].regenerateUID();
        }
        return this;
    };
    Object.defineProperty(SyntheticDOMNode.prototype, "uid", {
        get: function () {
            return this.$uid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDOMNode.prototype, "ownerDocument", {
        get: function () {
            return this._ownerDocument;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDOMNode.prototype, "source", {
        get: function () {
            return this.$source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDOMNode.prototype, "browser", {
        get: function () {
            return this.ownerDocument.defaultView.browser;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDOMNode.prototype, "module", {
        get: function () {
            return this.$module;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDOMNode.prototype, "childNodes", {
        get: function () {
            return this.children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDOMNode.prototype, "parentElement", {
        get: function () {
            var parent = this.parentNode;
            if (!parent || parent.nodeType !== node_types_1.DOMNodeType.ELEMENT) {
                // NULL is standard here, otherwise undefined would be a better option.
                return null;
            }
            return parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDOMNode.prototype, "parentNode", {
        get: function () {
            return this.parent;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticDOMNode.prototype.addEventListener = function (type, listener) {
        this.eventDispatcher.add(type, listener);
    };
    SyntheticDOMNode.prototype.removeEventListener = function (type, listener) {
        this.eventDispatcher.remove(type, listener);
    };
    SyntheticDOMNode.prototype.dispatchEvent = function (event) {
        this.notify(event);
    };
    SyntheticDOMNode.prototype.contains = function (node) {
        return !!aerial_common_1.findTreeNode(this, function (child) { return child === node; });
    };
    /**
     * TODO - change this method name to something such as computeDifference
     *
     * @param {SyntheticDOMNode<any>} source
     * @returns
     */
    SyntheticDOMNode.prototype.compare = function (source) {
        return Number(source.constructor === this.constructor && this.nodeName === source.nodeName);
    };
    SyntheticDOMNode.prototype.isEqualNode = function (node) {
        return !!this.compare(node);
    };
    SyntheticDOMNode.prototype.getInitialMetadata = function () {
        return {};
    };
    SyntheticDOMNode.prototype.isSameNode = function (node) {
        return this === node;
    };
    /**
     * Attaches a native DOM node. TODO - possibly
     * change this to addProduct since the renderer can attach anything
     * that it wants -- even non-native elements that share an identical
     * API.
     *
     * @param {Node} node
     */
    SyntheticDOMNode.prototype.attachNative = function (node) {
        this._native = node;
    };
    Object.defineProperty(SyntheticDOMNode.prototype, "mountedToNative", {
        get: function () {
            return this._native;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticDOMNode.prototype.hasChildNodes = function () {
        return this.childNodes.length !== 0;
    };
    SyntheticDOMNode.prototype.onChildAdded = function (child, index) {
        // must come before super to ensure that ownerDocument is present
        // if mutation listeners look for it.
        child.$setOwnerDocument(this.ownerDocument);
        _super.prototype.onChildAdded.call(this, child, index);
        if (this.ownerDocument) {
            if (this._attached) {
                child.$attach(this.ownerDocument);
            }
            else if (child._attached) {
                child.$detach();
            }
        }
    };
    SyntheticDOMNode.prototype.onChildRemoved = function (child, index) {
        _super.prototype.onChildRemoved.call(this, child, index);
        if (this._attached) {
            child.$detach();
        }
    };
    SyntheticDOMNode.prototype.$setOwnerDocument = function (document) {
        this._ownerDocument = document;
        for (var i = 0, n = this.childNodes.length; i < n; i++) {
            this.childNodes[i].$setOwnerDocument(document);
        }
    };
    SyntheticDOMNode.prototype.$createdCallback = function () {
        if (this._createdCallbackCalled) {
            throw new Error("createdCallback() has already been called.");
        }
        this._createdCallbackCalled = true;
        this.createdCallback();
        if (this._attachedBeforeCreatedCallback) {
            this.$attachedCallback();
        }
    };
    SyntheticDOMNode.prototype.createdCallback = function () {
    };
    SyntheticDOMNode.prototype.$attach = function (document) {
        if (this._attached && this._ownerDocument === document) {
            return console.warn("Trying to attach an already attached node");
        }
        this._attached = true;
        this._ownerDocument = document;
        this.$attachedCallback();
        for (var i = 0, n = this.childNodes.length; i < n; i++) {
            this.childNodes[i].$attach(document);
        }
    };
    SyntheticDOMNode.prototype.$attachedCallback = function () {
        // this will happen during the loading phase of the document
        if (!this._createdCallbackCalled) {
            this._attachedBeforeCreatedCallback = true;
            return;
        }
        this.attachedCallback();
    };
    SyntheticDOMNode.prototype.$detach = function () {
        if (!this._attached)
            return;
        this._attached = false;
        this.detachedCallback();
        for (var i = 0, n = this.childNodes.length; i < n; i++) {
            this.childNodes[i].$detach();
        }
    };
    SyntheticDOMNode.prototype.$linkClone = function (clone) {
        clone.$source = this.$source;
        clone.$module = this.$module;
        clone.$uid = this.uid;
        clone.$setOwnerDocument(this.ownerDocument);
        return clone;
    };
    SyntheticDOMNode.prototype.attachedCallback = function () { };
    SyntheticDOMNode.prototype.detachedCallback = function () { };
    /**
     * Clone alias for standard DOM API. Note that there's a slight difference
     * with how these work -- cloneNode for the DOM calls createdCallback on elements. Whereas
     * cloneNode in this context doesn't. Instead cloneNode here serializes & deserializes the node -- reloading
     * the exact state of the object
     *
     * @param {boolean} [deep]
     * @returns
     */
    SyntheticDOMNode.prototype.cloneNode = function (deep) {
        return this.clone(deep);
    };
    SyntheticDOMNode.prototype.clone = function (deep) {
        if (deep)
            return aerial_common_1.deserialize(aerial_common_1.serialize(this), undefined);
        return this.$linkClone(this.cloneShallow());
    };
    SyntheticDOMNode.prototype.createEditor = function () {
        return new SyntheticDOMNodeEditor(this);
    };
    return SyntheticDOMNode;
}(aerial_common_1.TreeNode));
exports.SyntheticDOMNode = SyntheticDOMNode;
//# sourceMappingURL=node.js.map