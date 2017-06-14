"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mesh_1 = require("mesh");
var messages_1 = require("../messages");
function shouldBubbleEvents(proto, property) {
    return proto["$bubbleEvents$" + property];
}
function bindable(bubbles) {
    if (bubbles === void 0) { bubbles = false; }
    var BindableValue = (function () {
        function BindableValue(target, property) {
            this.target = target;
            this.property = property;
            if (shouldBubbleEvents(target, property)) {
                this._valueObserver = new mesh_1.CallbackBus(this.onValueEvent.bind(this));
            }
        }
        BindableValue.prototype.getValue = function () {
            return this._value;
        };
        BindableValue.prototype.setValue = function (value) {
            if (this._valueObserver && this._value && this._value.unobserve) {
                this._value.unobserve(this._valueObserver);
            }
            this._value = value;
            if (this._valueObserver && this._value && this._value.observe) {
                this._value.observe(this._valueObserver);
            }
        };
        BindableValue.prototype.onValueEvent = function (event) {
            this.target.notify(event);
        };
        return BindableValue;
    }());
    return function (proto, property, descriptor) {
        if (property === void 0) { property = undefined; }
        if (descriptor === void 0) { descriptor = undefined; }
        function getBindableValue(object) {
            return object["$binding$" + property] || (object["$binding$" + property] = new BindableValue(object, property));
        }
        Object.defineProperty(proto, property, {
            get: function () {
                return getBindableValue(this).getValue();
            },
            set: function (newValue) {
                var bv = getBindableValue(this);
                var oldValue = bv.getValue();
                if (oldValue !== newValue) {
                    bv.setValue(newValue);
                    this.notify(new messages_1.PropertyMutation(messages_1.PropertyMutation.PROPERTY_CHANGE, this, property, newValue, oldValue).toEvent(bubbles));
                }
            }
        });
    };
}
exports.bindable = bindable;
function bubble() {
    return function (proto, property, descriptor) {
        if (property === void 0) { property = undefined; }
        if (descriptor === void 0) { descriptor = undefined; }
        proto["$bubbleEvents$" + property] = true;
    };
}
exports.bubble = bubble;
//# sourceMappingURL=bindable.js.map