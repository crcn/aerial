"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_peg_1 = require("./parser.peg");
describe(__filename + "#", function () {
    [
        ["screen"],
        ["screen and (max-width: 100px)"],
        ["screen and (min-width: 100px) and (max-width: 200px)"],
        ["screen and (min-width: 100px), all and (max-width: 200px)"],
        ["(max-width: 100px)"],
    ].forEach(function (_a) {
        var media = _a[0];
        it("can parse " + media, function () {
            parser_peg_1.parse(media);
        });
    });
});
//# sourceMappingURL=parser-test.js.map