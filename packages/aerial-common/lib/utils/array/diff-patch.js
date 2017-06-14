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
var mutate_1 = require("../../messages/mutate");
var ArrayItemMutationTypes;
(function (ArrayItemMutationTypes) {
    ArrayItemMutationTypes.INSERT = "insert";
    ArrayItemMutationTypes.UPDATE = "update";
    ArrayItemMutationTypes.DELETE = "delete";
})(ArrayItemMutationTypes = exports.ArrayItemMutationTypes || (exports.ArrayItemMutationTypes = {}));
var ArraItemMutation = (function (_super) {
    __extends(ArraItemMutation, _super);
    function ArraItemMutation(type) {
        return _super.call(this, type) || this;
    }
    return ArraItemMutation;
}(mutate_1.Mutation));
exports.ArraItemMutation = ArraItemMutation;
var ArrayInsertMutation = (function (_super) {
    __extends(ArrayInsertMutation, _super);
    function ArrayInsertMutation(index, value) {
        var _this = _super.call(this, ArrayItemMutationTypes.INSERT) || this;
        _this.index = index;
        _this.value = value;
        return _this;
    }
    ArrayInsertMutation.prototype.accept = function (visitor) {
        return visitor.visitInsert(this);
    };
    return ArrayInsertMutation;
}(ArraItemMutation));
exports.ArrayInsertMutation = ArrayInsertMutation;
var ArrayRemoveMutation = (function (_super) {
    __extends(ArrayRemoveMutation, _super);
    function ArrayRemoveMutation(value, index) {
        var _this = _super.call(this, ArrayItemMutationTypes.DELETE) || this;
        _this.value = value;
        _this.index = index;
        return _this;
    }
    ArrayRemoveMutation.prototype.accept = function (visitor) {
        return visitor.visitRemove(this);
    };
    return ArrayRemoveMutation;
}(ArraItemMutation));
exports.ArrayRemoveMutation = ArrayRemoveMutation;
var ArrayUpdateMutation = (function (_super) {
    __extends(ArrayUpdateMutation, _super);
    function ArrayUpdateMutation(originalOldIndex, patchedOldIndex, newValue, index) {
        var _this = _super.call(this, ArrayItemMutationTypes.UPDATE) || this;
        _this.originalOldIndex = originalOldIndex;
        _this.patchedOldIndex = patchedOldIndex;
        _this.newValue = newValue;
        _this.index = index;
        return _this;
    }
    ArrayUpdateMutation.prototype.accept = function (visitor) {
        return visitor.visitUpdate(this);
    };
    return ArrayUpdateMutation;
}(ArraItemMutation));
exports.ArrayUpdateMutation = ArrayUpdateMutation;
var ArrayMutation = (function (_super) {
    __extends(ArrayMutation, _super);
    function ArrayMutation(mutations) {
        var _this = _super.call(this, ArrayMutation.ARRAY_DIFF) || this;
        _this.mutations = mutations;
        _this.count = mutations.length;
        return _this;
    }
    ArrayMutation.prototype.accept = function (visitor) {
        return Promise.all(this.mutations.map(function (change) { return change.accept(visitor); }));
    };
    return ArrayMutation;
}(mutate_1.Mutation));
ArrayMutation.ARRAY_DIFF = "arrayDiff";
exports.ArrayMutation = ArrayMutation;
function diffArray(oldArray, newArray, countDiffs) {
    // model used to figure out the proper mutation indices
    var model = [].concat(oldArray);
    // remaining old values to be matched with new values. Remainders get deleted.
    var oldPool = [].concat(oldArray);
    // remaining new values. Remainders get inserted.
    var newPool = [].concat(newArray);
    var mutations = [];
    var matches = [];
    for (var i = 0, n = oldPool.length; i < n; i++) {
        var oldValue = oldPool[i];
        var bestNewValue = void 0;
        var fewestDiffCount = Infinity;
        // there may be multiple matches, so look for the best one
        for (var j = 0, n2 = newPool.length; j < n2; j++) {
            var newValue = newPool[j];
            // -1 = no match, 0 = no change, > 0 = num diffs
            var diffCount = countDiffs(oldValue, newValue);
            if (~diffCount && diffCount < fewestDiffCount) {
                bestNewValue = newValue;
                fewestDiffCount = diffCount;
            }
            // 0 = exact match, so break here.
            if (fewestDiffCount === 0)
                break;
        }
        // subtract matches from both old & new pools and store
        // them for later use
        if (bestNewValue != null) {
            oldPool.splice(i--, 1);
            n--;
            newPool.splice(newPool.indexOf(bestNewValue), 1);
            // need to manually set array indice here to ensure that the order
            // of operations is correct when mutating the target array.
            matches[newArray.indexOf(bestNewValue)] = [oldValue, bestNewValue];
        }
    }
    for (var i = oldPool.length; i--;) {
        var oldValue = oldPool[i];
        var index = oldArray.indexOf(oldValue);
        mutations.push(new ArrayRemoveMutation(oldValue, index));
        model.splice(index, 1);
    }
    // sneak the inserts into the matches so that they're
    // ordered propertly along with the updates - particularly moves.
    for (var i = 0, n = newPool.length; i < n; i++) {
        var newValue = newPool[i];
        var index = newArray.indexOf(newValue);
        matches[index] = [undefined, newValue];
    }
    // apply updates last using indicies from the old array model. This ensures
    // that mutations are properly applied to whatever target array.
    for (var i = 0, n = matches.length; i < n; i++) {
        var match = matches[i];
        // there will be empty values since we're manually setting indices on the array above
        if (match == null)
            continue;
        var _a = matches[i], oldValue = _a[0], newValue = _a[1];
        var newIndex = i;
        // insert
        if (oldValue == null) {
            mutations.push(new ArrayInsertMutation(newIndex, newValue));
            model.splice(newIndex, 0, newValue);
            // updated
        }
        else {
            var oldIndex = model.indexOf(oldValue);
            mutations.push(new ArrayUpdateMutation(oldArray.indexOf(oldValue), oldIndex, newValue, newIndex));
            if (oldIndex !== newIndex) {
                model.splice(oldIndex, 1);
                model.splice(newIndex, 0, oldValue);
            }
        }
    }
    return new ArrayMutation(mutations);
}
exports.diffArray = diffArray;
function patchArray(target, diff, mapUpdate, mapInsert) {
    diff.accept({
        visitInsert: function (_a) {
            var index = _a.index, value = _a.value;
            target.splice(index, 0, mapInsert(value));
        },
        visitRemove: function (_a) {
            var index = _a.index;
            target.splice(index, 1);
        },
        visitUpdate: function (_a) {
            var patchedOldIndex = _a.patchedOldIndex, newValue = _a.newValue, index = _a.index;
            var oldValue = target[patchedOldIndex];
            var patchedValue = mapUpdate(oldValue, newValue);
            if (patchedValue !== oldValue || patchedOldIndex !== index) {
                if (patchedOldIndex !== index) {
                    target.splice(patchedOldIndex, 1);
                }
                target.splice(index, 0, patchedValue);
            }
        }
    });
}
exports.patchArray = patchArray;
//# sourceMappingURL=diff-patch.js.map