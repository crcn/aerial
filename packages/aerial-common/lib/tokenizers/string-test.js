"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_1 = require("./string");
var chai_1 = require("chai");
describe(__filename + "#", function () {
    var tok = new string_1.StringTokenizer();
    it("can tokenize a simple string", function () {
        chai_1.expect(tok.tokenize("abc  d e\n\r\t"))
            .to.eql([
            { type: "text", value: "abc", length: 3 },
            { type: "space", value: "  ", length: 2 },
            { type: "text", value: "d", length: 1 },
            { type: "space", value: " ", length: 1 },
            { type: "text", value: "e", length: 1 },
            { type: "newLine", value: "\n", length: 1 },
            { type: "newLine", value: "\r", length: 1 },
            { type: "tab", value: "\t", length: 1 }
        ]);
    });
});
//# sourceMappingURL=string-test.js.map