"use strict";
/**
 * Adds documentation for method - used particularly for stdin util for the
 * backend
 */
Object.defineProperty(exports, "__esModule", { value: true });
function document(documentation) {
    return function (proto, name) {
        if (!proto.__documentation) {
            proto.__documentation = {};
        }
        proto.__documentation[name] = documentation;
    };
}
exports.document = document;
//# sourceMappingURL=document.js.map