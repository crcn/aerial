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
var core_1 = require("./core");
var messages_1 = require("../messages");
var PropertyWatcher = (function (_super) {
    __extends(PropertyWatcher, _super);
    function PropertyWatcher(target, propertyName) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.propertyName = propertyName;
        _this.onEvent = function (_a) {
            var mutation = _a.mutation;
            if (mutation && mutation.type === messages_1.PropertyMutation.PROPERTY_CHANGE && mutation.name === _this.propertyName && mutation.target === _this.target) {
                var oldValue = _this._currentValue;
                _this._currentValue = mutation.newValue;
                _this.notify(new messages_1.PropertyMutation(messages_1.PropertyMutation.PROPERTY_CHANGE, _this, "currentValue", _this._currentValue, oldValue).toEvent());
            }
        };
        _this._currentValue = target[propertyName];
        return _this;
    }
    Object.defineProperty(PropertyWatcher.prototype, "currentValue", {
        get: function () {
            return this._currentValue;
        },
        enumerable: true,
        configurable: true
    });
    PropertyWatcher.prototype.connect = function (listener) {
        var _this = this;
        if (!this._listening) {
            this._currentValue = this.target[this.propertyName];
            this._listening = true;
            this.target.observe(this._observer = { dispatch: this.onEvent });
        }
        var currentValue = this.currentValue;
        var previousTrigger;
        var observer = {
            dispatch: function (event) {
                if (_this.currentValue !== currentValue) {
                    if (previousTrigger && previousTrigger.dispose)
                        previousTrigger.dispose();
                    var oldValue = currentValue;
                    currentValue = _this.currentValue;
                    previousTrigger = listener(_this.currentValue, oldValue);
                }
            }
        };
        this.observe(observer);
        return {
            trigger: function () {
                listener(currentValue);
                return this;
            },
            dispose: function () {
                _this.unobserve(observer);
            }
        };
    };
    PropertyWatcher.prototype.connectToProperty = function (target, property) {
        return this.connect(function (newValue) {
            target[property] = newValue;
        });
    };
    return PropertyWatcher;
}(core_1.Observable));
exports.PropertyWatcher = PropertyWatcher;
// DEPRECATED - use PropertyWatcher instead
function watchProperty(target, property, callback) {
    var observer = {
        dispatch: function (_a) {
            var mutation = _a.mutation;
            if (mutation && mutation.type === messages_1.PropertyMutation.PROPERTY_CHANGE) {
                var propertyMutation = mutation;
                if (propertyMutation.name === property && propertyMutation.target === target) {
                    callback(propertyMutation.newValue, propertyMutation.oldValue);
                }
            }
        }
    };
    if (target.observe) {
        target.observe(observer);
    }
    var ret = {
        dispose: function () {
            if (target.unobserve)
                target.unobserve(observer);
        },
        trigger: function () {
            if (target[property] != null) {
                callback(target[property], undefined);
            }
            return ret;
        }
    };
    return ret;
}
exports.watchProperty = watchProperty;
function watchPropertyOnce(target, property, callback) {
    var watcher = watchProperty(target, property, function (newValue, oldValue) {
        watcher.dispose();
        callback(newValue, oldValue);
    });
    return {
        dispose: function () { return watcher.dispose(); },
        trigger: function () { return watcher.trigger(); }
    };
}
exports.watchPropertyOnce = watchPropertyOnce;
function bindProperty(source, sourceProperty, target, destProperty) {
    if (destProperty === void 0) { destProperty = sourceProperty; }
    return watchProperty(source, sourceProperty, function (newValue, oldValue) {
        target[destProperty] = newValue;
    }).trigger();
}
exports.bindProperty = bindProperty;
function waitForPropertyChange(target, property, filter) {
    if (filter === void 0) { filter = function () { return true; }; }
    return new Promise(function (resolve, reject) {
        var watcher = watchProperty(target, property, function (newValue) {
            if (filter(newValue)) {
                resolve();
                watcher.dispose();
            }
        });
    });
}
exports.waitForPropertyChange = waitForPropertyChange;
//# sourceMappingURL=watch-property.js.map