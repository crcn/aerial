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
var base_1 = require("./base");
var serialize_1 = require("../serialize");
var Mutation = Mutation_1 = (function () {
    function Mutation(type, target) {
        this.type = type;
        this.target = target;
    }
    Mutation.prototype.toString = function () {
        return this.constructor.name + "(" + this.paramsToString() + ")";
    };
    Mutation.prototype.paramsToString = function () {
        // target is omitted here since you can inspect the *actual* target by providing an "each" function
        // for the synthetic object editor, and logging the target object there.
        return "" + this.type;
    };
    Mutation.prototype.toEvent = function (bubbles) {
        return new MutationEvent(this, bubbles);
    };
    return Mutation;
}());
Mutation = Mutation_1 = __decorate([
    serialize_1.serializable("Mutation", {
        serialize: function (_a) {
            var type = _a.type, target = _a.target;
            return [type, serialize_1.serialize(target && (target.clone ? target.clone(false) : target))];
        },
        deserialize: function (_a, kernel) {
            var type = _a[0], target = _a[1];
            return new Mutation_1(type, serialize_1.deserialize(target, kernel));
        }
    })
], Mutation);
exports.Mutation = Mutation;
var MutationEvent = (function (_super) {
    __extends(MutationEvent, _super);
    function MutationEvent(mutation, bubbles) {
        var _this = _super.call(this, MutationEvent.MUTATION, bubbles) || this;
        _this.mutation = mutation;
        return _this;
    }
    return MutationEvent;
}(base_1.CoreEvent));
MutationEvent.MUTATION = "mutation";
exports.MutationEvent = MutationEvent;
var SetValueMutation = SetValueMutation_1 = (function (_super) {
    __extends(SetValueMutation, _super);
    function SetValueMutation(type, target, newValue) {
        var _this = _super.call(this, type, target) || this;
        _this.newValue = newValue;
        return _this;
    }
    SetValueMutation.prototype.paramsToString = function () {
        return _super.prototype.paramsToString.call(this) + ", " + this.newValue;
    };
    return SetValueMutation;
}(Mutation));
SetValueMutation = SetValueMutation_1 = __decorate([
    serialize_1.serializable("SetValueMutation", {
        serialize: function (_a) {
            var type = _a.type, target = _a.target, newValue = _a.newValue;
            return [type, serialize_1.serialize(target.clone(false)), newValue];
        },
        deserialize: function (_a, kernel) {
            var type = _a[0], target = _a[1], newValue = _a[2];
            return new SetValueMutation_1(type, serialize_1.deserialize(target, kernel), newValue);
        }
    })
], SetValueMutation);
exports.SetValueMutation = SetValueMutation;
var ChildMutation = (function (_super) {
    __extends(ChildMutation, _super);
    function ChildMutation(type, target, child, index) {
        var _this = _super.call(this, type, target) || this;
        _this.child = child;
        _this.index = index;
        return _this;
    }
    ChildMutation.prototype.paramsToString = function () {
        return _super.prototype.paramsToString.call(this) + ", " + this.child.toString().replace(/[\n\r\s\t]+/g, " ");
    };
    return ChildMutation;
}(Mutation));
exports.ChildMutation = ChildMutation;
// TODO - change index to newIndex 
var InsertChildMutation = InsertChildMutation_1 = (function (_super) {
    __extends(InsertChildMutation, _super);
    function InsertChildMutation(type, target, child, index) {
        if (index === void 0) { index = Number.MAX_SAFE_INTEGER; }
        return _super.call(this, type, target, child, index) || this;
    }
    InsertChildMutation.prototype.paramsToString = function () {
        return _super.prototype.paramsToString.call(this) + ", " + this.index;
    };
    return InsertChildMutation;
}(ChildMutation));
InsertChildMutation = InsertChildMutation_1 = __decorate([
    serialize_1.serializable("InsertChildMutation", {
        serialize: function (_a) {
            var type = _a.type, target = _a.target, child = _a.child, index = _a.index;
            return [type, serialize_1.serialize(target.clone(false)), serialize_1.serialize(child), index];
        },
        deserialize: function (_a, kernel) {
            var type = _a[0], target = _a[1], child = _a[2], index = _a[3];
            return new InsertChildMutation_1(type, serialize_1.deserialize(target, kernel), serialize_1.deserialize(child, kernel), index);
        }
    })
], InsertChildMutation);
exports.InsertChildMutation = InsertChildMutation;
var RemoveChildMutation = RemoveChildMutation_1 = (function (_super) {
    __extends(RemoveChildMutation, _super);
    function RemoveChildMutation(type, target, child, index) {
        return _super.call(this, type, target, child, index) || this;
    }
    return RemoveChildMutation;
}(ChildMutation));
RemoveChildMutation = RemoveChildMutation_1 = __decorate([
    serialize_1.serializable("RemoveChildMutation", {
        serialize: function (_a) {
            var type = _a.type, target = _a.target, child = _a.child, index = _a.index;
            return [type, serialize_1.serialize(target.clone(false)), serialize_1.serialize(child.clone(false)), index];
        },
        deserialize: function (_a, kernel) {
            var type = _a[0], target = _a[1], child = _a[2], index = _a[3];
            return new RemoveChildMutation_1(type, serialize_1.deserialize(target, kernel), serialize_1.deserialize(child, kernel), index);
        }
    })
], RemoveChildMutation);
exports.RemoveChildMutation = RemoveChildMutation;
var PropertyMutation = PropertyMutation_1 = (function (_super) {
    __extends(PropertyMutation, _super);
    function PropertyMutation(type, target, name, newValue, oldValue, oldName, index) {
        var _this = _super.call(this, type, target) || this;
        _this.name = name;
        _this.newValue = newValue;
        _this.oldValue = oldValue;
        _this.oldName = oldName;
        _this.index = index;
        return _this;
    }
    PropertyMutation.prototype.toEvent = function (bubbles) {
        if (bubbles === void 0) { bubbles = false; }
        return new MutationEvent(this, bubbles);
    };
    PropertyMutation.prototype.paramsToString = function () {
        return _super.prototype.paramsToString.call(this) + ", " + this.name + ", " + this.newValue;
    };
    return PropertyMutation;
}(Mutation));
PropertyMutation.PROPERTY_CHANGE = "propertyChange";
PropertyMutation = PropertyMutation_1 = __decorate([
    serialize_1.serializable("PropertyMutation", {
        serialize: function (_a) {
            var type = _a.type, target = _a.target, name = _a.name, newValue = _a.newValue, oldValue = _a.oldValue, oldName = _a.oldName, index = _a.index;
            return [
                type,
                serialize_1.serialize(target.clone ? target.clone(false) : target),
                name,
                serialize_1.serialize(newValue),
                serialize_1.serialize(oldValue),
                oldName,
                index
            ];
        },
        deserialize: function (_a, kernel) {
            var type = _a[0], target = _a[1], name = _a[2], newValue = _a[3], oldValue = _a[4], oldName = _a[5], index = _a[6];
            return new PropertyMutation_1(type, serialize_1.deserialize(target, kernel), name, serialize_1.deserialize(newValue, kernel), serialize_1.deserialize(oldValue, kernel), oldName, index);
        }
    })
], PropertyMutation);
exports.PropertyMutation = PropertyMutation;
/**
 * Removes the target synthetic object
 */
var RemoveMutation = (function (_super) {
    __extends(RemoveMutation, _super);
    function RemoveMutation(target) {
        return _super.call(this, RemoveMutation.REMOVE_CHANGE, target) || this;
    }
    return RemoveMutation;
}(Mutation));
RemoveMutation.REMOVE_CHANGE = "removeChange";
exports.RemoveMutation = RemoveMutation;
// TODO - change oldIndex to index, and index to newIndex
var MoveChildMutation = MoveChildMutation_1 = (function (_super) {
    __extends(MoveChildMutation, _super);
    function MoveChildMutation(type, target, child, oldIndex, index) {
        var _this = _super.call(this, type, target, child, index) || this;
        _this.oldIndex = oldIndex;
        return _this;
    }
    MoveChildMutation.prototype.paramsToString = function () {
        return _super.prototype.paramsToString.call(this) + ", " + this.index;
    };
    return MoveChildMutation;
}(ChildMutation));
MoveChildMutation = MoveChildMutation_1 = __decorate([
    serialize_1.serializable("MoveChildMutation", {
        serialize: function (_a) {
            var type = _a.type, target = _a.target, child = _a.child, index = _a.index, oldIndex = _a.oldIndex;
            return [type, serialize_1.serialize(target), serialize_1.serialize(child.clone(false)), oldIndex, index];
        },
        deserialize: function (_a, kernel) {
            var type = _a[0], target = _a[1], child = _a[2], index = _a[3], oldIndex = _a[4];
            return new MoveChildMutation_1(type, serialize_1.deserialize(target, kernel), serialize_1.deserialize(child, kernel), oldIndex, index);
        }
    })
], MoveChildMutation);
exports.MoveChildMutation = MoveChildMutation;
var Mutation_1, SetValueMutation_1, InsertChildMutation_1, RemoveChildMutation_1, PropertyMutation_1, MoveChildMutation_1;
//# sourceMappingURL=mutate.js.map