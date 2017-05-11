"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SyntheticWindowTimers = (function () {
    function SyntheticWindowTimers() {
        this._timerIDs = new Map();
    }
    SyntheticWindowTimers.prototype.setTimeout = function (callback, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var timeoutID = setTimeout.apply(void 0, [callback, timeout].concat(args));
        this._timerIDs.set(timeoutID, clearTimeout);
        return timeoutID;
    };
    SyntheticWindowTimers.prototype.setInterval = function (callback, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var intervalID = setInterval.apply(void 0, [callback, timeout].concat(args));
        this._timerIDs.set(intervalID, clearInterval);
        return intervalID;
    };
    SyntheticWindowTimers.prototype.setImmediate = function (callback) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var immediateID = setImmediate.apply(void 0, [callback].concat(args));
        this._timerIDs.set(immediateID, clearImmediate);
        return immediateID;
    };
    SyntheticWindowTimers.prototype.clearTimeout = function (timerID) { this.clearTimer(timerID); };
    SyntheticWindowTimers.prototype.clearInterval = function (timerID) { this.clearTimer(timerID); };
    SyntheticWindowTimers.prototype.clearImmediate = function (timerID) { this.clearTimer(timerID); };
    SyntheticWindowTimers.prototype.clearTimer = function (timerID) {
        var clearTimer = this._timerIDs.get(timerID);
        if (clearTimer) {
            this._timerIDs[timerID] = undefined;
            clearTimer(timerID);
        }
    };
    SyntheticWindowTimers.prototype.dispose = function () {
        var _this = this;
        this._timerIDs.forEach(function (value, timerID) {
            _this.clearTimer(timerID);
        });
    };
    return SyntheticWindowTimers;
}());
exports.SyntheticWindowTimers = SyntheticWindowTimers;
//# sourceMappingURL=timers.js.map