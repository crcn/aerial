"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aerial_common_1 = require("aerial-common");
var test_1 = require("../test");
var __1 = require("..");
describe(__filename + "#", function () {
    // fuzzy
    it("can serialize & deserialize a random DOM node", function () {
        var window = new __1.SyntheticWindow(null);
        var node = test_1.generateRandomSyntheticHTMLElement(window.document, 10, 5, 10, true);
        var data = aerial_common_1.serialize(node);
        var clone = aerial_common_1.deserialize(data, null);
        chai_1.expect(node.toString()).to.equal(clone.toString());
    });
});
//# sourceMappingURL=dom-serialization-test.js.map