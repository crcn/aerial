"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchable = function () {
    return function (proto, property, descriptor) {
        if (property === void 0) { property = undefined; }
        if (descriptor === void 0) { descriptor = undefined; }
        var patchableProperties = proto.__patchableProperties = (proto.__patchableProperties || []).concat();
        if (patchableProperties.indexOf(property) === -1) {
            patchableProperties.push(property);
        }
    };
};
exports.getPatchableProperties = function (instance) {
    return instance.__patchableProperties || [];
};
//# sourceMappingURL=patch.js.map