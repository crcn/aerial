"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./array"));
__export(require("./component"));
__export(require("./html"));
__export(require("./platform"));
__export(require("./comment"));
__export(require("./uri"));
var seed = fill0(Math.round(Math.random() * 100), 3);
var _i = 0;
exports.createUID = function () {
    var now = new Date();
    return "" + seed + fill0(now.getSeconds()) + _i++;
};
function fill0(num, min) {
    if (min === void 0) { min = 2; }
    var buffer = "" + num;
    while (buffer.length < min) {
        buffer = "0" + buffer;
    }
    return buffer;
}
//# sourceMappingURL=index.js.map