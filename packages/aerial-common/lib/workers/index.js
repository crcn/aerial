"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./browser"));
module.exports = typeof window === "undefined" ? require("./node") : require("./browser");
//# sourceMappingURL=index.js.map