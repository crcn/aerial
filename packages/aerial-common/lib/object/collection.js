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
var array_collection_1 = require("../array-collection");
var ObservableCollection = (function (_super) {
    __extends(ObservableCollection, _super);
    function ObservableCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObservableCollection.prototype.push = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return this.splice.apply(this, [this.length, 0].concat(items)).length;
    };
    ObservableCollection.prototype.unshift = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return this.splice.apply(this, [0, 0].concat(items)).length;
    };
    ObservableCollection.prototype.shift = function () {
        return this.splice(0, 1).pop();
    };
    ObservableCollection.prototype.pop = function () {
        return this.splice(this.length - 1, 1).pop();
    };
    ObservableCollection.prototype.splice = function (start, deleteCount) {
        var items = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            items[_i - 2] = arguments[_i];
        }
        return _super.prototype.splice.apply(this, [start, deleteCount].concat(items));
    };
    return ObservableCollection;
}(array_collection_1.ArrayCollection));
exports.ObservableCollection = ObservableCollection;
//# sourceMappingURL=collection.js.map