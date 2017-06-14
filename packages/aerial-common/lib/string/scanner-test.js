"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var scanner_1 = require("./scanner");
describe(__filename + "#", function () {
    it("can be created", function () {
        new scanner_1.StringScanner("source");
    });
    it("can scan for tokens", function () {
        var s = new scanner_1.StringScanner("a bcde 123 4");
        chai_1.expect(s.scan(/\w+/)).to.equal("a");
        chai_1.expect(s.scan(/\w+/)).to.equal("bcde");
        chai_1.expect(s.scan(/\s+/)).to.equal(" ");
        chai_1.expect(s.scan(/\d{1}/)).to.equal("1");
        chai_1.expect(s.scan(/\s/)).to.equal(" ");
        chai_1.expect(s.scan(/\d/)).to.equal("4");
        chai_1.expect(s.hasTerminated()).to.equal(true);
    });
});
//# sourceMappingURL=scanner-test.js.map