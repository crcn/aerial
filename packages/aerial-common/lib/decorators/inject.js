"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO - more kernel helpers here.
/**
 * inject decorator for properties of classes that live in a Kernel object
 */
// TODO - change this to injectProviderValue
function inject(id, map) {
    if (map === void 0) { map = undefined; }
    return function (target, property, index) {
        if (index === void 0) { index = undefined; }
        var key = typeof target === "function" ? index : property;
        var inject = Object.assign({}, Reflect.getMetadata("injectProperties", target) || {});
        inject[key] = [id || property, map || (function (provider) { return provider.value; })];
        Reflect.defineMetadata("injectProperties", inject, target);
    };
}
exports.inject = inject;
function injectProvider(id) {
    return function (target, property, index) {
        if (index === void 0) { index = undefined; }
        var key = typeof target === "function" ? index : property;
        var inject = Object.assign({}, Reflect.getMetadata("injectProperties", target) || {});
        inject[key] = [id || property, function (provider) { return provider; }];
        Reflect.defineMetadata("injectProperties", inject, target);
    };
}
exports.injectProvider = injectProvider;
//# sourceMappingURL=inject.js.map