"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SyntheticLocalStorage = (function () {
    function SyntheticLocalStorage(_data) {
        if (_data === void 0) { _data = new Map(); }
        this._data = _data;
    }
    Object.defineProperty(SyntheticLocalStorage.prototype, "length", {
        get: function () {
            return this._data.size;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticLocalStorage.prototype.getItem = function (key) {
        // note that null is parsable here -- important to ensure that operations such as JSON.parse work
        return this._data.get(key) || null;
    };
    SyntheticLocalStorage.prototype.setItem = function (key, value) {
        this._data.set(key, value);
    };
    SyntheticLocalStorage.prototype.removeItem = function (key) {
        this._data.delete(key);
    };
    SyntheticLocalStorage.prototype.clear = function () {
        this._data.clear();
    };
    SyntheticLocalStorage.prototype.key = function (index) {
        return this._data.keys[index];
    };
    return SyntheticLocalStorage;
}());
exports.SyntheticLocalStorage = SyntheticLocalStorage;
//# sourceMappingURL=index.js.map