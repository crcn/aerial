"use strict";
/*
TODOS:
- cancelable messages
- bubbleable messages
*/
Object.defineProperty(exports, "__esModule", { value: true });
var CoreEvent = (function () {
    function CoreEvent(type, bubbles) {
        if (bubbles === void 0) { bubbles = true; }
        this.type = type;
        this.bubbles = bubbles;
        this._canPropagate = true;
        this._canPropagateImmediately = true;
    }
    Object.defineProperty(CoreEvent.prototype, "currentTarget", {
        get: function () {
            return this._currentTarget;
        },
        set: function (value) {
            // always maintain the initial target so that messages
            // can be tracked back to their origin
            if (!this._target) {
                this._target = value;
            }
            this._currentTarget = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreEvent.prototype, "target", {
        // TODO - target is not an appropriate name in some cases since
        // the term refers to the current dispatcher dispatching *this* message. And in some cases,
        // the target may not exist
        get: function () {
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreEvent.prototype, "canPropagate", {
        get: function () {
            return this._canPropagate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreEvent.prototype, "canPropagateImmediately", {
        get: function () {
            return this._canPropagateImmediately;
        },
        enumerable: true,
        configurable: true
    });
    CoreEvent.prototype.stopPropagation = function () {
        this._canPropagate = false;
    };
    CoreEvent.prototype.stopImmediatePropagation = function () {
        this._canPropagateImmediately = false;
    };
    return CoreEvent;
}());
exports.CoreEvent = CoreEvent;
//# sourceMappingURL=base.js.map