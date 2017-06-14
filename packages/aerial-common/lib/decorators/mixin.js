"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mixin() {
    var baseCtors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        baseCtors[_i] = arguments[_i];
    }
    return function (derivedCtor) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== "constructor" && (!derivedCtor.prototype.hasOwnProperty(name) || (derivedCtor.prototype[name] && derivedCtor.prototype[name].virtual))) {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    };
}
exports.mixin = mixin;
function virtual(proto, property) {
    proto[property].virtual = true;
}
exports.virtual = virtual;
;
//# sourceMappingURL=mixin.js.map