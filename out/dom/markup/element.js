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
var decorators_1 = require("@tandem/common/decorators");
var lodash_1 = require("lodash");
var node_types_1 = require("./node-types");
var selector_1 = require("../selector");
var document_fragment_1 = require("./document-fragment");
var mesh_1 = require("@tandem/mesh");
var node_1 = require("./node");
var container_1 = require("./container");
var common_1 = require("@tandem/common");
var SyntheticDOMElementMutationTypes;
(function (SyntheticDOMElementMutationTypes) {
    SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT = "setElementAttributeEdit";
    SyntheticDOMElementMutationTypes.ATTACH_SHADOW_ROOT_EDIT = "attachShadowRootEdit";
})(SyntheticDOMElementMutationTypes = exports.SyntheticDOMElementMutationTypes || (exports.SyntheticDOMElementMutationTypes = {}));
function isDOMElementMutation(mutation) {
    return (mutation.target.nodeType === node_types_1.DOMNodeType.ELEMENT) && (!!(_a = {},
        _a[SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT] = true,
        _a[SyntheticDOMElementMutationTypes.ATTACH_SHADOW_ROOT_EDIT] = true,
        _a)[mutation.type] || container_1.isDOMContainerMutation(mutation));
    var _a;
}
exports.isDOMElementMutation = isDOMElementMutation;
var SyntheticDOMAttributeSerializer = (function () {
    function SyntheticDOMAttributeSerializer() {
    }
    SyntheticDOMAttributeSerializer.prototype.serialize = function (_a) {
        var name = _a.name, value = _a.value, readonly = _a.readonly;
        return { name: name, value: value, readonly: readonly };
    };
    SyntheticDOMAttributeSerializer.prototype.deserialize = function (_a) {
        var name = _a.name, value = _a.value, readonly = _a.readonly;
        return new SyntheticDOMAttribute(name, value, readonly);
    };
    return SyntheticDOMAttributeSerializer;
}());
var SyntheticDOMAttribute = SyntheticDOMAttribute_1 = (function (_super) {
    __extends(SyntheticDOMAttribute, _super);
    function SyntheticDOMAttribute(name, value, readonly) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.readonly = readonly;
        _this.specified = true;
        _this.value = value;
        return _this;
    }
    Object.defineProperty(SyntheticDOMAttribute.prototype, "uid", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticDOMAttribute.prototype.toString = function () {
        return this.name + "=\"" + this.value + "\"";
    };
    SyntheticDOMAttribute.prototype.clone = function () {
        return new SyntheticDOMAttribute_1(this.name, this.value, this.readonly);
    };
    return SyntheticDOMAttribute;
}(common_1.Observable));
__decorate([
    decorators_1.bindable(true)
], SyntheticDOMAttribute.prototype, "value", void 0);
SyntheticDOMAttribute = SyntheticDOMAttribute_1 = __decorate([
    common_1.serializable("SyntheticDOMAttribute", new SyntheticDOMAttributeSerializer())
], SyntheticDOMAttribute);
exports.SyntheticDOMAttribute = SyntheticDOMAttribute;
var SyntheticDOMAttributes = (function (_super) {
    __extends(SyntheticDOMAttributes, _super);
    function SyntheticDOMAttributes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticDOMAttributes.prototype.splice = function (start, deleteCount) {
        if (deleteCount === void 0) { deleteCount = 0; }
        var items = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            items[_i - 2] = arguments[_i];
        }
        for (var i = start, n = Math.min(start + deleteCount, this.length); i < n; i++) {
            var rmAttribute = this[i];
            // delete the attribute to ensure that hasOwnProperty returns false
            this[rmAttribute.name] = undefined;
        }
        for (var i = 0, n = items.length; i < n; i++) {
            var newAttribute = items[i];
            this[newAttribute.name] = newAttribute;
        }
        return _super.prototype.splice.apply(this, [start, deleteCount].concat(items));
    };
    SyntheticDOMAttributes.prototype.toObject = function () {
        var only = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            only[_i] = arguments[_i];
        }
        var ret = {};
        for (var i = 0, n = this.length; i < n; i++) {
            var attribute = this[i];
            if (only.length !== 0 && only.indexOf(attribute.name) === -1) {
                continue;
            }
            ret[attribute.name] = attribute.value;
        }
        return ret;
    };
    SyntheticDOMAttributes.prototype.toString = function () {
        return this.map(function (attribute) {
            return " " + attribute;
        }).join("");
    };
    return SyntheticDOMAttributes;
}(common_1.ObservableCollection));
exports.SyntheticDOMAttributes = SyntheticDOMAttributes;
var SyntheticDOMElementSerializer = (function () {
    function SyntheticDOMElementSerializer() {
    }
    SyntheticDOMElementSerializer.prototype.serialize = function (_a) {
        var nodeName = _a.nodeName, namespaceURI = _a.namespaceURI, shadowRoot = _a.shadowRoot, attributes = _a.attributes, childNodes = _a.childNodes;
        return {
            nodeName: nodeName,
            namespaceURI: namespaceURI,
            shadowRoot: common_1.serialize(shadowRoot),
            attributes: [].concat(attributes).map(common_1.serialize),
            childNodes: [].concat(childNodes).map(common_1.serialize)
        };
    };
    SyntheticDOMElementSerializer.prototype.deserialize = function (_a, kernel, ctor) {
        var nodeName = _a.nodeName, shadowRoot = _a.shadowRoot, namespaceURI = _a.namespaceURI, attributes = _a.attributes, childNodes = _a.childNodes;
        var element = new ctor(namespaceURI, nodeName);
        for (var i = 0, n = attributes.length; i < n; i++) {
            element.attributes.push(common_1.deserialize(attributes[i], kernel));
        }
        for (var i = 0, n = childNodes.length; i < n; i++) {
            var child = common_1.deserialize(childNodes[i], kernel);
            element.appendChild(child);
        }
        var shadowRootFragment = common_1.deserialize(shadowRoot, kernel);
        if (shadowRootFragment) {
            element.attachShadow({ mode: "open" }).appendChild(shadowRootFragment);
        }
        // NOTE - $createdCallback is not called here for a reason -- serialized
        // must store the entire state of an object.
        return element;
    };
    return SyntheticDOMElementSerializer;
}());
exports.SyntheticDOMElementSerializer = SyntheticDOMElementSerializer;
var SyntheticDOMElementEdit = (function (_super) {
    __extends(SyntheticDOMElementEdit, _super);
    function SyntheticDOMElementEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticDOMElementEdit.prototype.setAttribute = function (name, value, oldName, index) {
        return this.addChange(new common_1.PropertyMutation(SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT, this.target, name, value, undefined, oldName, index));
    };
    SyntheticDOMElementEdit.prototype.removeAttribute = function (name) {
        return this.setAttribute(name, undefined);
    };
    SyntheticDOMElementEdit.prototype.attachShadowRoot = function (shadowRoot) {
        this.addChange(new common_1.InsertChildMutation(SyntheticDOMElementMutationTypes.ATTACH_SHADOW_ROOT_EDIT, this.target, shadowRoot, Number.MAX_SAFE_INTEGER));
    };
    /**
     * Adds diff messages from the new element
     *
     * @param {SyntheticDOMElement} newElement
     */
    SyntheticDOMElementEdit.prototype.addDiff = function (newElement) {
        var _this = this;
        if (this.target.nodeName !== newElement.nodeName) {
            throw new Error("nodeName must match in order to diff");
        }
        if (lodash_1.difference(this.target.readonlyAttributesNames, newElement.readonlyAttributesNames).length) {
            this.setAttribute("data-td-readonly", JSON.stringify(newElement.readonlyAttributesNames));
        }
        common_1.diffArray(this.target.attributes, newElement.attributes, function (a, b) { return a.name === b.name ? 1 : -1; }).accept({
            visitInsert: function (_a) {
                var index = _a.index, value = _a.value;
                _this.setAttribute(value.name, value.value, undefined, index);
            },
            visitRemove: function (_a) {
                var index = _a.index;
                _this.removeAttribute(_this.target.attributes[index].name);
            },
            visitUpdate: function (_a) {
                var originalOldIndex = _a.originalOldIndex, patchedOldIndex = _a.patchedOldIndex, newValue = _a.newValue, index = _a.index;
                if (_this.target.attributes[originalOldIndex].value !== newValue.value) {
                    _this.setAttribute(newValue.name, newValue.value, undefined, index);
                }
            }
        });
        if (newElement.shadowRoot) {
            if (!this.target.shadowRoot) {
                this.attachShadowRoot(newElement.shadowRoot);
            }
            else {
                this.addChildEdit(this.target.shadowRoot.createEdit().fromDiff(newElement.shadowRoot));
            }
        }
        return _super.prototype.addDiff.call(this, newElement);
    };
    return SyntheticDOMElementEdit;
}(container_1.SyntheticDOMContainerEdit));
exports.SyntheticDOMElementEdit = SyntheticDOMElementEdit;
var DOMElementEditor = (function (_super) {
    __extends(DOMElementEditor, _super);
    function DOMElementEditor(target, createNode) {
        return _super.call(this, target, createNode) || this;
    }
    DOMElementEditor.prototype.applySingleMutation = function (mutation) {
        _super.prototype.applySingleMutation.call(this, mutation);
        if (mutation.type === SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT) {
            var _a = mutation, name_1 = _a.name, oldName = _a.oldName, newValue = _a.newValue;
            // need to set the current value (property), and the default value (attribute)
            // TODO - this may need to be separated later on.
            if (this.target.constructor.prototype.hasOwnProperty(name_1)) {
                this.target[name_1] = newValue == null ? "" : newValue;
            }
            if (newValue == null) {
                this.target.removeAttribute(name_1);
            }
            else {
                // An error will be thrown by the DOM if the name is invalid. Need to ignore
                // native exceptions so that other parts of the app do not break.
                try {
                    this.target.setAttribute(name_1, newValue);
                }
                catch (e) {
                    console.warn(e);
                }
            }
            if (oldName) {
                if (this.target.hasOwnProperty(oldName)) {
                    this.target[oldName] = undefined;
                }
                this.target.removeAttribute(oldName);
            }
        }
    };
    return DOMElementEditor;
}(container_1.DOMContainerEditor));
exports.DOMElementEditor = DOMElementEditor;
var SyntheticDOMElementEditor = (function (_super) {
    __extends(SyntheticDOMElementEditor, _super);
    function SyntheticDOMElementEditor(target) {
        return _super.call(this, target) || this;
    }
    SyntheticDOMElementEditor.prototype.createDOMEditor = function (target) {
        return new DOMElementEditor(target);
    };
    SyntheticDOMElementEditor.prototype.applySingleMutation = function (mutation) {
        if (mutation.type === SyntheticDOMElementMutationTypes.ATTACH_SHADOW_ROOT_EDIT) {
            var child = mutation.child;
            var shadowRoot = child;
            this.target.$setShadowRoot(shadowRoot.cloneNode(true));
        }
    };
    return SyntheticDOMElementEditor;
}(container_1.SyntheticDOMContainerEditor));
exports.SyntheticDOMElementEditor = SyntheticDOMElementEditor;
var SyntheticDOMElement = (function (_super) {
    __extends(SyntheticDOMElement, _super);
    function SyntheticDOMElement(namespaceURI, tagName) {
        var _this = _super.call(this, tagName) || this;
        _this.namespaceURI = namespaceURI;
        _this.tagName = tagName;
        _this.nodeType = node_types_1.DOMNodeType.ELEMENT;
        _this._readonlyAttributeNames = [];
        _this._shadowRootObserver = new common_1.BubbleDispatcher(_this);
        _this.attributes = SyntheticDOMAttributes.create();
        _this.attributes.observe(new mesh_1.CallbackDispatcher(_this.onAttributesEvent.bind(_this)));
        // todo - proxy this
        _this.dataset = {};
        return _this;
    }
    SyntheticDOMElement.prototype.createEdit = function () {
        return new SyntheticDOMElementEdit(this);
    };
    SyntheticDOMElement.prototype.createEditor = function () {
        return new SyntheticDOMElementEditor(this);
    };
    SyntheticDOMElement.prototype.visitWalker = function (walker) {
        if (this.shadowRoot)
            walker.accept(this.shadowRoot);
        _super.prototype.visitWalker.call(this, walker);
    };
    SyntheticDOMElement.prototype.getAttribute = function (name) {
        return this.hasAttribute(name) ? this.attributes[name].value : null;
    };
    SyntheticDOMElement.prototype.getAttributeNode = function (name) {
        return this.hasAttribute(name) ? this.attributes[name] : null;
    };
    SyntheticDOMElement.prototype.hasAttribute = function (name) {
        // better than checking property since prop check may
        // be prototype of array
        return !!this.attributes.find(function (attrib) { return attrib.name === name; });
    };
    SyntheticDOMElement.prototype.accept = function (visitor) {
        return visitor.visitElement(this);
    };
    Object.defineProperty(SyntheticDOMElement.prototype, "readonlyAttributesNames", {
        get: function () {
            return this._readonlyAttributeNames;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticDOMElement.prototype.createShadowRoot = function () {
        return this.attachShadow({ mode: "open" });
    };
    SyntheticDOMElement.prototype.attachShadow = function (_a) {
        var mode = _a.mode;
        if (this._shadowRoot)
            return this._shadowRoot;
        return this.$setShadowRoot(new document_fragment_1.SyntheticDocumentFragment());
    };
    SyntheticDOMElement.prototype.$setShadowRoot = function (shadowRoot) {
        if (this._shadowRoot) {
            this._shadowRoot.unobserve(this._shadowRootObserver);
        }
        this._shadowRoot = shadowRoot;
        this._shadowRoot.$setOwnerDocument(this.ownerDocument);
        this._shadowRoot.observe(new common_1.BubbleDispatcher(this));
        return this._shadowRoot;
    };
    Object.defineProperty(SyntheticDOMElement.prototype, "shadowRoot", {
        get: function () {
            return this._shadowRoot;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDOMElement.prototype, "id", {
        get: function () {
            return this.getAttribute("id");
        },
        set: function (value) {
            this.setAttribute("id", value);
        },
        enumerable: true,
        configurable: true
    });
    SyntheticDOMElement.prototype.matches = function (selector) {
        return selector_1.selectorMatchesElement(selector, this);
    };
    SyntheticDOMElement.prototype.setAttribute = function (name, value) {
        // attributes that are not editable by the editor
        if (name === "data-td-readonly") {
            this._readonlyAttributeNames = JSON.parse(value);
            return this._resetReadonlyAttributes();
        }
        // Reserved attribute to help map where this element came from. Defined
        // by source transformers that scan for HTML elements.
        if (name === "data-td-source") {
            this.$source = JSON.parse(value);
            return;
        }
        var oldValue;
        var attribute = this.getAttributeNode(name);
        if (attribute) {
            attribute.value = value;
        }
        else {
            this.attributes.push(new SyntheticDOMAttribute(name, value, this._readonlyAttributeNames.indexOf(name) !== -1));
        }
    };
    SyntheticDOMElement.prototype._resetReadonlyAttributes = function () {
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var attribute = _a[_i];
            attribute.readonly = false;
        }
        for (var _b = 0, _c = this._readonlyAttributeNames; _b < _c.length; _b++) {
            var attributeName = _c[_b];
            var attribute = this.attributes[attributeName];
            if (attribute)
                attribute.readonly = true;
        }
    };
    SyntheticDOMElement.prototype.removeAttribute = function (name) {
        if (this.hasAttribute(name)) {
            var attribute = this.attributes[name];
            this.attributes.splice(this.attributes.indexOf(attribute), 1);
        }
    };
    SyntheticDOMElement.prototype.toString = function () {
        return [
            "<",
            this.nodeName,
            this.attributes,
            ">",
            this.childNodes.map(function (child) { return child.toString(); }).join(""),
            "</",
            this.nodeName,
            ">"
        ].join("");
    };
    SyntheticDOMElement.prototype.onAttributesEvent = function (_a) {
        var _this = this;
        var mutation = _a.mutation;
        if (!mutation)
            return;
        if (mutation.type === common_1.ArrayMutation.ARRAY_DIFF) {
            mutation.accept({
                visitUpdate: function () { },
                visitInsert: function (_a) {
                    var value = _a.value, index = _a.index;
                    _this.attributeChangedCallback(value.name, undefined, value.value);
                },
                visitRemove: function (_a) {
                    var value = _a.value, index = _a.index;
                    _this.attributeChangedCallback(value.name, value.value, undefined);
                }
            });
        }
        else if (mutation.type === common_1.PropertyMutation.PROPERTY_CHANGE && mutation.target instanceof SyntheticDOMAttribute) {
            var changeMutation = mutation;
            var attribute = mutation.target;
            this.attributeChangedCallback(attribute.name, changeMutation.oldValue, changeMutation.newValue);
        }
    };
    SyntheticDOMElement.prototype.$setOwnerDocument = function (document) {
        _super.prototype.$setOwnerDocument.call(this, document);
        if (this._shadowRoot) {
            this._shadowRoot.$setOwnerDocument(document);
        }
    };
    SyntheticDOMElement.prototype.$attach = function (document) {
        _super.prototype.$attach.call(this, document);
        if (this._shadowRoot) {
            this._shadowRoot.$attach(document);
        }
    };
    SyntheticDOMElement.prototype.$detach = function () {
        _super.prototype.$detach.call(this);
        if (this._shadowRoot) {
            this._shadowRoot.$detach();
        }
    };
    SyntheticDOMElement.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
        this.notify(new common_1.PropertyMutation(SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT, this, name, newValue, oldValue).toEvent(true));
    };
    SyntheticDOMElement.prototype.cloneShallow = function () {
        var constructor = this.constructor;
        var clone = new constructor(this.namespaceURI, this.tagName);
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var attribute = _a[_i];
            clone.setAttribute(attribute.name, attribute.value);
        }
        return clone;
    };
    return SyntheticDOMElement;
}(container_1.SyntheticDOMContainer));
__decorate([
    decorators_1.bindable()
], SyntheticDOMElement.prototype, "onclick", void 0);
SyntheticDOMElement = __decorate([
    common_1.serializable("SyntheticDOMElement", new node_1.SyntheticDOMNodeSerializer(new SyntheticDOMElementSerializer()))
], SyntheticDOMElement);
exports.SyntheticDOMElement = SyntheticDOMElement;
var SyntheticDOMAttribute_1;
//# sourceMappingURL=element.js.map