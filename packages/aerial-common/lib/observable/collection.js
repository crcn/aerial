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
var index_1 = require("./index");
var array_collection_1 = require("../array-collection");
var busses_1 = require("../busses");
var utils_1 = require("../utils");
var ObservableCollection = (function (_super) {
    __extends(ObservableCollection, _super);
    function ObservableCollection() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var _this = _super.apply(this, items) || this;
        _this._observable = new index_1.Observable(_this);
        _this._itemObserver = new busses_1.BubbleDispatcher(_this);
        _this._watchItems(_this);
        return _this;
    }
    ObservableCollection.prototype.observe = function (actor) {
        this._observable.observe(actor);
    };
    ObservableCollection.prototype.unobserve = function (actor) {
        this._observable.unobserve(actor);
    };
    ObservableCollection.prototype.notify = function (message) {
        return this._observable.notify(message);
    };
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
        var _this = this;
        var newItems = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            newItems[_i - 2] = arguments[_i];
        }
        var deletes = this.slice(start, start + deleteCount).map(function (item, index) {
            if (item && item["unobserve"]) {
                item.unobserve(_this._itemObserver);
            }
            return new utils_1.ArrayRemoveMutation(item, start + index);
        });
        var inserts = newItems.map(function (item, index) {
            return new utils_1.ArrayInsertMutation(start + index, item);
        });
        var ret = _super.prototype.splice.apply(this, [start, deleteCount].concat(newItems));
        this._watchItems(newItems);
        this.notify(new utils_1.ArrayMutation(deletes.concat(inserts)).toEvent());
        return ret;
    };
    ObservableCollection.prototype._watchItems = function (newItems) {
        for (var _i = 0, newItems_1 = newItems; _i < newItems_1.length; _i++) {
            var item = newItems_1[_i];
            if (item && item["observe"]) {
                item.observe(this._itemObserver);
            }
        }
    };
    return ObservableCollection;
}(array_collection_1.ArrayCollection));
exports.ObservableCollection = ObservableCollection;
//# sourceMappingURL=collection.js.map