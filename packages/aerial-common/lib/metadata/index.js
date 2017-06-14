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
var messages_1 = require("../messages");
var Metadata = (function (_super) {
    __extends(Metadata, _super);
    function Metadata(_data) {
        if (_data === void 0) { _data = {}; }
        var _this = _super.call(this) || this;
        _this._data = _data;
        return _this;
    }
    Object.defineProperty(Metadata.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
        },
        enumerable: true,
        configurable: true
    });
    Metadata.prototype.get = function (key) {
        return this._data[key];
    };
    Metadata.prototype.setProperties = function (properties) {
        for (var key in properties) {
            this.set(key, properties[key]);
        }
    };
    Metadata.prototype.toggle = function (key) {
        var v = this.get(key);
        this.set(key, v == null ? true : !v);
        return this.get(key);
    };
    Metadata.prototype.set = function (key, value) {
        var oldValue = this.get(key);
        this._data[key] = value;
        if (value !== oldValue) {
            this.notify(new messages_1.MetadataChangeEvent(key, value));
        }
    };
    return Metadata;
}(observable_1.Observable));
exports.Metadata = Metadata;
//# sourceMappingURL=index.js.map