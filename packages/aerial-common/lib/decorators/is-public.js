"use strict";
/**
 * flags a property as public so that a remote API / service
 * can execute it. Used in services/io.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (proto, name) {
    if (!proto.__publicProperties) {
        proto.__publicProperties = [];
    }
    proto.__publicProperties.push(name);
};
//# sourceMappingURL=is-public.js.map