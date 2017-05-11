"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var parse = require("./parser.peg").parse;
exports.parseCSSDeclValue = parse;
__export(require("./ast"));
__export(require("./evaluate"));
//# sourceMappingURL=index.js.map