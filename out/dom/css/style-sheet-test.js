"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var _1 = require("./");
describe(__filename + "#", function () {
    it("can be created", function () {
        new _1.SyntheticCSSStyleSheet([]);
    });
    it("properly parses !important flags", function () {
        var styleSheet = new _1.SyntheticCSSStyleSheet([]);
        styleSheet.cssText = "\n      .a {\n        color: red !important;\n      }\n    ";
        chai_1.expect(styleSheet.rules[0].style["color"]).to.equal("red !important");
    });
});
//# sourceMappingURL=style-sheet-test.js.map