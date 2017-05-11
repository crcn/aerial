"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var common_1 = require("@tandem/common");
var helpers_1 = require("../test/helpers");
var __1 = require("..");
describe(__filename + "#", function () {
    // fuzzy
    it("can serialize & deserialize a random DOM node", function () {
        var window = new __1.SyntheticWindow(null);
        var node = helpers_1.generateRandomSyntheticHTMLElement(window.document, 10, 5, 10, true);
        var data = common_1.serialize(node);
        var clone = common_1.deserialize(data, null);
        chai_1.expect(node.toString()).to.equal(clone.toString());
    });
});
//# sourceMappingURL=dom-serialization-test.js.map