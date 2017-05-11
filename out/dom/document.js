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
var mesh_1 = require("@tandem/mesh");
var markup_1 = require("./markup");
var common_1 = require("@tandem/common");
var SyntheticDocumentSerializer = (function () {
    function SyntheticDocumentSerializer() {
    }
    SyntheticDocumentSerializer.prototype.serialize = function (document) {
        return [
            // need to cast style sheet to vanilla array before mapping
            document.defaultNamespaceURI,
            [].concat(document.styleSheets).map(common_1.serialize),
            document.childNodes.map(common_1.serialize),
        ];
    };
    SyntheticDocumentSerializer.prototype.deserialize = function (_a, kernel) {
        var defaultNamespaceURI = _a[0], styleSheets = _a[1], childNodes = _a[2];
        var document = new SyntheticDocument(defaultNamespaceURI);
        (_b = document.styleSheets).push.apply(_b, styleSheets.map(function (raw) { return common_1.deserialize(raw, kernel); }));
        for (var i = 0, n = childNodes.length; i < n; i++) {
            document.appendChild(common_1.deserialize(childNodes[i], kernel));
        }
        return document;
        var _b;
    };
    return SyntheticDocumentSerializer;
}());
var SyntheticDocumentMutationTypes;
(function (SyntheticDocumentMutationTypes) {
    SyntheticDocumentMutationTypes.ADD_DOCUMENT_STYLE_SHEET_EDIT = "addDocumentStyleSheetEdit";
    SyntheticDocumentMutationTypes.REMOVE_DOCUMENT_STYLE_SHEET_EDIT = "removeDocumentStyleSheetEdit";
    SyntheticDocumentMutationTypes.MOVE_DOCUMENT_STYLE_SHEET_EDIT = "moveDocumentStyleSheetEdit";
    ;
})(SyntheticDocumentMutationTypes = exports.SyntheticDocumentMutationTypes || (exports.SyntheticDocumentMutationTypes = {}));
// TODO - this shouldn't be here
var SyntheticDocumentEdit = (function (_super) {
    __extends(SyntheticDocumentEdit, _super);
    function SyntheticDocumentEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticDocumentEdit.prototype.addStyleSheet = function (stylesheet, index) {
        return this.addChange(new common_1.InsertChildMutation(SyntheticDocumentMutationTypes.ADD_DOCUMENT_STYLE_SHEET_EDIT, this.target, stylesheet, index));
    };
    SyntheticDocumentEdit.prototype.removeStyleSheet = function (stylesheet) {
        return this.addChange(new common_1.RemoveChildMutation(SyntheticDocumentMutationTypes.REMOVE_DOCUMENT_STYLE_SHEET_EDIT, this.target, stylesheet, this.target.styleSheets.indexOf(stylesheet)));
    };
    SyntheticDocumentEdit.prototype.moveStyleSheet = function (stylesheet, index) {
        return this.addChange(new common_1.MoveChildMutation(SyntheticDocumentMutationTypes.MOVE_DOCUMENT_STYLE_SHEET_EDIT, this.target, stylesheet, this.target.styleSheets.indexOf(stylesheet), index));
    };
    SyntheticDocumentEdit.prototype.addDiff = function (newDocument) {
        var _this = this;
        common_1.diffArray(this.target.styleSheets, newDocument.styleSheets, function (oldStyleSheet, newStyleSheet) {
            if (oldStyleSheet.source && newStyleSheet.source) {
                return oldStyleSheet.source.uri === newStyleSheet.source.uri ? 0 : -1;
            }
            // simple distance function
            return Math.abs(oldStyleSheet.cssText.length - newStyleSheet.cssText.length);
        }).accept({
            visitInsert: function (_a) {
                var index = _a.index, value = _a.value;
                _this.addStyleSheet(value, index);
            },
            visitRemove: function (_a) {
                var index = _a.index;
                _this.removeStyleSheet(_this.target.styleSheets[index]);
            },
            visitUpdate: function (_a) {
                var originalOldIndex = _a.originalOldIndex, patchedOldIndex = _a.patchedOldIndex, newValue = _a.newValue, index = _a.index;
                if (patchedOldIndex !== index) {
                    _this.moveStyleSheet(_this.target.styleSheets[originalOldIndex], index);
                }
                _this.addChildEdit(_this.target.styleSheets[originalOldIndex].createEdit().fromDiff(newValue));
            }
        });
        return _super.prototype.addDiff.call(this, newDocument);
    };
    return SyntheticDocumentEdit;
}(markup_1.SyntheticDOMContainerEdit));
SyntheticDocumentEdit = __decorate([
    common_1.serializable("SyntheticDocumentEdit", {
        serialize: function (_a) {
            var mutations = _a.mutations;
            return {
                mutations: mutations.map(common_1.serialize)
            };
        },
        deserialize: function (_a, kernel, ctor) {
            var mutations = _a.mutations;
            var edit = new ctor();
            (_b = edit.mutations).push.apply(_b, mutations.map(function (mutation) { return common_1.deserialize(mutation, kernel); }));
            return edit;
            var _b;
        }
    })
], SyntheticDocumentEdit);
exports.SyntheticDocumentEdit = SyntheticDocumentEdit;
var SyntheticDocumentEditor = (function (_super) {
    __extends(SyntheticDocumentEditor, _super);
    function SyntheticDocumentEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticDocumentEditor.prototype.applySingleMutation = function (mutation) {
        _super.prototype.applySingleMutation.call(this, mutation);
        var target = this.target;
        if (mutation.type === SyntheticDocumentMutationTypes.REMOVE_DOCUMENT_STYLE_SHEET_EDIT) {
            target.styleSheets.splice(mutation.index, 1);
        }
        else if (mutation.type === SyntheticDocumentMutationTypes.ADD_DOCUMENT_STYLE_SHEET_EDIT) {
            target.styleSheets.splice(mutation.index, 0, mutation.child.clone(true));
        }
        else if (mutation.type === SyntheticDocumentMutationTypes.MOVE_DOCUMENT_STYLE_SHEET_EDIT) {
            var oldIndex = mutation.oldIndex;
            target.styleSheets.splice(oldIndex, 1);
            target.styleSheets.splice(mutation.index, 0);
        }
    };
    return SyntheticDocumentEditor;
}(markup_1.SyntheticDOMContainerEditor));
exports.SyntheticDocumentEditor = SyntheticDocumentEditor;
function isDOMDocumentMutation(mutation) {
    return !!(_a = {},
        _a[SyntheticDocumentMutationTypes.REMOVE_DOCUMENT_STYLE_SHEET_EDIT] = true,
        _a[SyntheticDocumentMutationTypes.ADD_DOCUMENT_STYLE_SHEET_EDIT] = true,
        _a[SyntheticDocumentMutationTypes.MOVE_DOCUMENT_STYLE_SHEET_EDIT] = true,
        _a)[mutation.type];
    var _a;
}
exports.isDOMDocumentMutation = isDOMDocumentMutation;
var filterDOMElement = function (element) { return element.nodeType === markup_1.DOMNodeType.ELEMENT; };
var SyntheticDocument = SyntheticDocument_1 = (function (_super) {
    __extends(SyntheticDocument, _super);
    // namespaceURI here is non-standard, but that's
    function SyntheticDocument(defaultNamespaceURI, implementation) {
        var _this = _super.call(this, "#document") || this;
        _this.defaultNamespaceURI = defaultNamespaceURI;
        _this.nodeType = markup_1.DOMNodeType.DOCUMENT;
        _this.cookie = "";
        _this.$implementation = implementation;
        _this.styleSheets = common_1.ObservableCollection.create();
        _this.styleSheets.observe(new mesh_1.CallbackDispatcher(_this.onStyleSheetsEvent.bind(_this)));
        _this.$registeredElements = {};
        return _this;
    }
    Object.defineProperty(SyntheticDocument.prototype, "implementation", {
        get: function () {
            return this.$implementation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDocument.prototype, "sandbox", {
        get: function () {
            return this.defaultView.sandbox;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDocument.prototype, "scripts", {
        get: function () {
            return this.getElementsByTagName("script");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDocument.prototype, "browser", {
        get: function () {
            return this.$window.browser;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDocument.prototype, "ownerNode", {
        get: function () {
            return this.$ownerNode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDocument.prototype, "defaultView", {
        get: function () {
            return this.$window;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDocument.prototype, "documentElement", {
        get: function () {
            return this.childNodes.find(filterDOMElement);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDocument.prototype, "head", {
        get: function () {
            return this.documentElement.childNodes.find(filterDOMElement);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDocument.prototype, "body", {
        get: function () {
            return this.documentElement.childNodes.filter(filterDOMElement)[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDocument.prototype, "location", {
        get: function () {
            return this.$window.location;
        },
        set: function (value) {
            this.$window.location = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticDocument.prototype, "URL", {
        get: function () {
            return this.location.toString();
        },
        enumerable: true,
        configurable: true
    });
    SyntheticDocument.prototype.open = function () {
    };
    SyntheticDocument.prototype.close = function () {
    };
    SyntheticDocument.prototype.accept = function (visitor) {
        return visitor.visitDocument(this);
    };
    SyntheticDocument.prototype.getElementById = function (id) {
        return this.querySelector("#" + id);
    };
    SyntheticDocument.prototype.createElementNS = function (ns, tagName) {
        var nsElements = this.$registeredElements[ns] || {};
        var elementClass = this.$getElementClassNS(ns, tagName);
        var element = this.own(new elementClass(ns, tagName));
        element.$createdCallback();
        return element;
    };
    SyntheticDocument.prototype.$getElementClassNS = function (ns, tagName) {
        var nsElements = this.$registeredElements[ns] || {};
        var elementClass = nsElements[tagName.toLowerCase()] || nsElements.default || markup_1.SyntheticDOMElement;
        return elementClass;
    };
    SyntheticDocument.prototype.createEdit = function () {
        return new SyntheticDocumentEdit(this);
    };
    SyntheticDocument.prototype.createElement = function (tagName) {
        return this.own(this.createElementNS(this.defaultNamespaceURI, tagName));
    };
    SyntheticDocument.prototype.registerElement = function (tagName, options) {
        return this.registerElementNS(this.defaultNamespaceURI, tagName, options);
    };
    SyntheticDocument.prototype.registerElementNS = function (ns, tagName, ctor) {
        if (!this.$registeredElements[ns]) {
            this.$registeredElements[ns] = {};
        }
        return this.$registeredElements[ns][tagName.toLowerCase()] = ctor;
    };
    SyntheticDocument.prototype.createComment = function (nodeValue) {
        return this.own(new markup_1.SyntheticDOMComment(nodeValue));
    };
    SyntheticDocument.prototype.createTextNode = function (nodeValue) {
        return this.own(new markup_1.SyntheticDOMText(nodeValue));
    };
    SyntheticDocument.prototype.createDocumentFragment = function () {
        return this.own(new markup_1.SyntheticDocumentFragment());
    };
    SyntheticDocument.prototype.visitWalker = function (walker) {
        this.styleSheets.forEach(function (styleSheet) { return walker.accept(styleSheet); });
        _super.prototype.visitWalker.call(this, walker);
    };
    SyntheticDocument.prototype.onChildAdded = function (child, index) {
        _super.prototype.onChildAdded.call(this, child, index);
        child.$attach(this);
    };
    SyntheticDocument.prototype.cloneShallow = function () {
        return new SyntheticDocument_1(this.defaultNamespaceURI, this.implementation);
    };
    SyntheticDocument.prototype.hasFocus = function () {
        return false;
    };
    SyntheticDocument.prototype.$linkClone = function (clone) {
        clone.$window = this.defaultView;
        clone.$implementation = clone.implementation;
        return _super.prototype.$linkClone.call(this, clone);
    };
    SyntheticDocument.prototype.own = function (node) {
        node.$setOwnerDocument(this);
        return node;
    };
    SyntheticDocument.prototype.createEditor = function () {
        return new SyntheticDocumentEditor(this);
    };
    SyntheticDocument.prototype.write = function (content) {
        console.error("document.write is not currently supported");
    };
    SyntheticDocument.prototype.onStyleSheetsEvent = function (_a) {
        var _this = this;
        var mutation = _a.mutation;
        if (!mutation)
            return;
        if (mutation.type === common_1.ArrayMutation.ARRAY_DIFF) {
            mutation.accept({
                visitUpdate: function (_a) {
                    var newValue = _a.newValue, index = _a.index, patchedOldIndex = _a.patchedOldIndex;
                    if (index !== patchedOldIndex) {
                        _this.notify(new common_1.MoveChildMutation(SyntheticDocumentMutationTypes.MOVE_DOCUMENT_STYLE_SHEET_EDIT, _this, newValue, patchedOldIndex, index).toEvent());
                    }
                },
                visitInsert: function (_a) {
                    var value = _a.value, index = _a.index;
                    if (!value.$ownerNode) {
                        value.$ownerNode = _this;
                    }
                    _this.notify(new common_1.InsertChildMutation(SyntheticDocumentMutationTypes.ADD_DOCUMENT_STYLE_SHEET_EDIT, _this, value, index).toEvent());
                },
                visitRemove: function (_a) {
                    var value = _a.value, index = _a.index;
                    value.$ownerNode = undefined;
                    _this.notify(new common_1.RemoveChildMutation(SyntheticDocumentMutationTypes.REMOVE_DOCUMENT_STYLE_SHEET_EDIT, _this, value, index).toEvent());
                }
            });
        }
    };
    return SyntheticDocument;
}(markup_1.SyntheticDOMContainer));
SyntheticDocument = SyntheticDocument_1 = __decorate([
    common_1.serializable("SyntheticDocument", new markup_1.SyntheticDOMNodeSerializer(new SyntheticDocumentSerializer()))
], SyntheticDocument);
exports.SyntheticDocument = SyntheticDocument;
var SyntheticDocument_1;
//# sourceMappingURL=document.js.map