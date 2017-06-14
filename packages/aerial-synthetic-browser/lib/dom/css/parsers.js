"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var postcss = require("postcss");
// TODO - cache source here for a bit 
function parseCSS(source, map, syntax, useCache) {
    return postcss().process(source, {
        syntax: syntax,
        map: map && {
            prev: map
        }
    }).root;
}
exports.parseCSS = parseCSS;
//# sourceMappingURL=parsers.js.map