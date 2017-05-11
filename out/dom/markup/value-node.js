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
var ent_1 = require("ent");
var node_types_1 = require("./node-types");
var node_1 = require("./node");
var common_1 = require("@tandem/common");
var sandbox_1 = require("@tandem/sandbox");
var SyntheticDOMValueNodeMutationTypes;
(function (SyntheticDOMValueNodeMutationTypes) {
    SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT = "setValueNodeEdit";
})(SyntheticDOMValueNodeMutationTypes = exports.SyntheticDOMValueNodeMutationTypes || (exports.SyntheticDOMValueNodeMutationTypes = {}));
var SyntheticDOMValueNodeEdit = (function (_super) {
    __extends(SyntheticDOMValueNodeEdit, _super);
    function SyntheticDOMValueNodeEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticDOMValueNodeEdit.prototype.setValueNode = function (nodeValue) {
        return this.addChange(new common_1.SetValueMutation(SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT, this.target, nodeValue));
    };
    SyntheticDOMValueNodeEdit.prototype.addDiff = function (newValueNode) {
        if (this.target.nodeValue !== newValueNode.nodeValue) {
            this.setValueNode(newValueNode.nodeValue);
        }
        return _super.prototype.addDiff.call(this, newValueNode);
    };
    return SyntheticDOMValueNodeEdit;
}(node_1.SyntheticDOMNodeEdit));
exports.SyntheticDOMValueNodeEdit = SyntheticDOMValueNodeEdit;
var DOMValueNodeEditor = (function (_super) {
    __extends(DOMValueNodeEditor, _super);
    function DOMValueNodeEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DOMValueNodeEditor.prototype.applySingleMutation = function (mutation) {
        if (mutation.type === SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT) {
            this.target.nodeValue = ent_1.decode(mutation.newValue);
        }
    };
    return DOMValueNodeEditor;
}(sandbox_1.BaseEditor));
exports.DOMValueNodeEditor = DOMValueNodeEditor;
function isDOMValueNodeMutation(mutation) {
    return (mutation.target.nodeType === node_types_1.DOMNodeType.COMMENT || mutation.target.nodeType === node_types_1.DOMNodeType.TEXT) && (!!(_a = {},
        _a[SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT] = true,
        _a)[mutation.type]);
    var _a;
}
exports.isDOMValueNodeMutation = isDOMValueNodeMutation;
var SyntheticDOMValueNodeSerializer = (function () {
    function SyntheticDOMValueNodeSerializer() {
    }
    SyntheticDOMValueNodeSerializer.prototype.serialize = function (_a) {
        var nodeValue = _a.nodeValue;
        return nodeValue;
    };
    SyntheticDOMValueNodeSerializer.prototype.deserialize = function (nodeValue, kernel, ctor) {
        return new ctor(nodeValue);
    };
    return SyntheticDOMValueNodeSerializer;
}());
exports.SyntheticDOMValueNodeSerializer = SyntheticDOMValueNodeSerializer;
var SyntheticDOMValueNode = (function (_super) {
    __extends(SyntheticDOMValueNode, _super);
    function SyntheticDOMValueNode(nodeName, nodeValue) {
        var _this = _super.call(this, nodeName) || this;
        _this.nodeValue = nodeValue;
        return _this;
    }
    Object.defineProperty(SyntheticDOMValueNode.prototype, "nodeValue", {
        get: function () {
            return this._nodeValue;
        },
        set: function (value) {
            this._nodeValue = String(value);
            this.notify(new common_1.PropertyMutation(SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT, this, "nodeValue", value).toEvent(true));
        },
        enumerable: true,
        configurable: true
    });
    SyntheticDOMValueNode.prototype.createEdit = function () {
        return new SyntheticDOMValueNodeEdit(this);
    };
    SyntheticDOMValueNode.prototype.createEditor = function () {
        return new sandbox_1.GroupEditor(new DOMValueNodeEditor(this), _super.prototype.createEditor.call(this));
    };
    return SyntheticDOMValueNode;
}(node_1.SyntheticDOMNode));
exports.SyntheticDOMValueNode = SyntheticDOMValueNode;
//# sourceMappingURL=value-node.js.map