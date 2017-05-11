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
var SyntheticCSSObjectEdit = (function (_super) {
    __extends(SyntheticCSSObjectEdit, _super);
    function SyntheticCSSObjectEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SyntheticCSSObjectEdit;
}(sandbox_1.SyntheticObjectEdit));
exports.SyntheticCSSObjectEdit = SyntheticCSSObjectEdit;
var SyntheticCSSObjectEditor = (function (_super) {
    __extends(SyntheticCSSObjectEditor, _super);
    function SyntheticCSSObjectEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SyntheticCSSObjectEditor;
}(sandbox_1.SyntheticObjectEditor));
exports.SyntheticCSSObjectEditor = SyntheticCSSObjectEditor;
var SyntheticCSSObject = (function () {
    function SyntheticCSSObject() {
        this.$uid = sandbox_1.generateSyntheticUID();
    }
    Object.defineProperty(SyntheticCSSObject.prototype, "parentStyleSheet", {
        get: function () {
            return this.$parentStyleSheet || this.$parentRule && this.$parentRule.parentStyleSheet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSObject.prototype, "ownerNode", {
        get: function () {
            return this.$ownerNode || this.$parentRule && this.$parentRule.ownerNode || this.$parentStyleSheet && this.$parentStyleSheet.ownerNode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSObject.prototype, "parentRule", {
        get: function () {
            return this.$parentRule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSObject.prototype, "uid", {
        get: function () {
            return this.$uid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticCSSObject.prototype, "source", {
        get: function () {
            return this.$source;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticCSSObject.prototype.clone = function (deep) {
        if (deep)
            return common_1.deserialize(common_1.serialize(this), null);
        return this.$linkClone(this.cloneShallow());
    };
    SyntheticCSSObject.prototype.regenerateUID = function (deep) {
        this.$uid = sandbox_1.generateSyntheticUID();
        return this;
    };
    SyntheticCSSObject.prototype.$linkClone = function (clone) {
        clone.$source = this.$source;
        clone.$uid = this.$uid;
        return clone;
    };
    return SyntheticCSSObject;
}());
exports.SyntheticCSSObject = SyntheticCSSObject;
exports.SyntheticCSSObjectSerializer = sandbox_1.SyntheticObjectSerializer;
//# sourceMappingURL=base.js.map