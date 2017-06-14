"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO - change "notify" to "dispatch"
var Observable = (function () {
    function Observable(_target) {
        this._target = _target;
        if (!this._target) {
            this._target = this;
        }
    }
    Observable.prototype.observe = function () {
        var busses = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            busses[_i] = arguments[_i];
        }
        for (var i = 0, n = busses.length; i < n; i++) {
            var actor = busses[i];
            if (!actor && !actor.dispatch) {
                throw new Error("Attempting to add a non-observable object.");
            }
            if (!this._observers) {
                this._observers = actor;
            }
            else if (!Array.isArray(this._observers)) {
                this._observers = [actor, this._observers];
            }
            else {
                this._observers.unshift(actor);
            }
        }
    };
    Observable.prototype.unobserve = function () {
        var busses = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            busses[_i] = arguments[_i];
        }
        for (var i = 0, n = busses.length; i < n; i++) {
            var actor = busses[i];
            if (this._observers === actor) {
                this._observers = null;
            }
            else if (Array.isArray(this._observers)) {
                var i_1 = this._observers.indexOf(actor);
                if (i_1 !== -1) {
                    this._observers.splice(i_1, 1);
                }
                // only one left? Move to a more optimal method for notifying
                // observers.
                if (this._observers.length === 1) {
                    this._observers = this._observers[0];
                }
            }
        }
    };
    Observable.prototype.notify = function (event) {
        if (event.canPropagate === false)
            return;
        if (event.target && event.bubbles === false)
            return;
        event.currentTarget = this._target;
        if (!this._observers)
            return;
        if (!Array.isArray(this._observers))
            return this._observers.dispatch(event);
        // fix case where observable unlistens and re-listens to events during a notifiction
        var observers = this._observers.concat();
        for (var i = observers.length; i--;) {
            if (event.canPropagateImmediately === false)
                break;
            observers[i].dispatch(event);
        }
    };
    return Observable;
}());
exports.Observable = Observable;
//# sourceMappingURL=core.js.map