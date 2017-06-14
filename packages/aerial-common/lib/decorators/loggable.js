"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("../decorators");
var logger_1 = require("../logger");
var mesh_1 = require("mesh");
var ioc_1 = require("../ioc");
// TODO - use a singleton here? It might be okay
function loggable() {
    return function (clazz) {
        var loggerBusProperty = "$$loggerBus";
        // this assumes the object is being injected -- it may not be.
        decorators_1.inject(ioc_1.PrivateBusProvider.ID)(clazz.prototype, loggerBusProperty);
        Object.defineProperty(clazz.prototype, "logger", {
            get: function () {
                if (this.$$logger)
                    return this.$$logger;
                var bus = this[loggerBusProperty];
                // create a child logger so that the prefix here does
                // not get overwritten
                return this.$$logger = (new logger_1.Logger(bus || mesh_1.noopBusInstance, this.constructor.name + ": ").createChild());
            }
        });
    };
}
exports.loggable = loggable;
// export function logCall() {
// }
//# sourceMappingURL=loggable.js.map