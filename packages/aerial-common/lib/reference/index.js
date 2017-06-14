"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValueReference = (function () {
    function ValueReference(value) {
        this.value = value;
    }
    return ValueReference;
}());
exports.ValueReference = ValueReference;
var MetadataValueReference = (function () {
    function MetadataValueReference(_metadata, _key) {
        this._metadata = _metadata;
        this._key = _key;
    }
    Object.defineProperty(MetadataValueReference.prototype, "value", {
        get: function () {
            return this._metadata.get(this._key);
        },
        set: function (value) {
            this._metadata.set(this._key, value);
        },
        enumerable: true,
        configurable: true
    });
    return MetadataValueReference;
}());
exports.MetadataValueReference = MetadataValueReference;
var MinMaxValueReference = (function () {
    function MinMaxValueReference(_target, _min, _max) {
        if (_min === void 0) { _min = -Infinity; }
        if (_max === void 0) { _max = Infinity; }
        this._target = _target;
        this._min = _min;
        this._max = _max;
    }
    Object.defineProperty(MinMaxValueReference.prototype, "value", {
        get: function () {
            return this._minMax(this._target.value);
        },
        set: function (value) {
            this._target.value = this._minMax(value);
        },
        enumerable: true,
        configurable: true
    });
    MinMaxValueReference.prototype._minMax = function (value) {
        return Math.max(this._min, Math.min(this._max, value));
    };
    return MinMaxValueReference;
}());
exports.MinMaxValueReference = MinMaxValueReference;
var DefaultValueReference = (function () {
    function DefaultValueReference(_target, defaultValue) {
        this._target = _target;
        this.defaultValue = defaultValue;
    }
    Object.defineProperty(DefaultValueReference.prototype, "value", {
        get: function () {
            var value = this._target.value;
            return value == null ? this.defaultValue : value;
        },
        set: function (value) {
            this._target.value = value;
        },
        enumerable: true,
        configurable: true
    });
    return DefaultValueReference;
}());
exports.DefaultValueReference = DefaultValueReference;
//# sourceMappingURL=index.js.map