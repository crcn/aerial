"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var mesh_1 = require("mesh");
/**
 * @deprecated apps should never directly register listeners to a main bus. Instead they should interface
 * with a public collection
 *
 * @export
 * @class BrokerBus
 * @implements {IBrokerBus}
 */
var BrokerBus = (function () {
    function BrokerBus(busClass) {
        if (busClass === void 0) { busClass = mesh_1.ParallelBus; }
        var actors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            actors[_i - 1] = arguments[_i];
        }
        var _this = this;
        this.actors = [];
        this._bus = new busClass(function (message) {
            // dispatches are expensive since they typically use streams. This chunk reduces
            // unecessary operations to dispatch handlers that can't handle a given message.
            var actors = _this.actors.filter(function (actor) {
                return !actor.testMessage || actor.testMessage(message);
            });
            return actors;
        });
        this.register.apply(this, actors);
    }
    BrokerBus.prototype.register = function () {
        var actors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actors[_i] = arguments[_i];
        }
        for (var _a = 0, actors_1 = actors; _a < actors_1.length; _a++) {
            var actor = actors_1[_a];
            assert(actor && actor.dispatch);
        }
        (_b = this.actors).push.apply(_b, actors);
        var _b;
    };
    BrokerBus.prototype.unregister = function () {
        var actors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actors[_i] = arguments[_i];
        }
        for (var _a = 0, actors_2 = actors; _a < actors_2.length; _a++) {
            var actor = actors_2[_a];
            var i = this.actors.indexOf(actor);
            if (i !== -1) {
                this.actors.splice(i, 1);
            }
        }
    };
    BrokerBus.prototype.dispatch = function (message) {
        return this._bus.dispatch(message);
    };
    return BrokerBus;
}());
exports.BrokerBus = BrokerBus;
//# sourceMappingURL=broker.js.map