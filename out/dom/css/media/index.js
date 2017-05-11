"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var parser_peg_1 = require("./parser.peg");
exports.parseCSSMedia = function (source) { return parser_peg_1.parse(source); };
__export(require("./ast"));
//# sourceMappingURL=index.js.map