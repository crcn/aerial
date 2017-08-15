"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var browser_1 = require("../../browser");
var test_1 = require("../../test");
var index_1 = require("./index");
describe(__filename + "#", function () {
    it("can be created", function () {
        index_1.initSyntheticBrowserBridge(new browser_1.SyntheticBrowser(test_1.createTestKernel()));
    });
    it("synchronizes the browser windows", function () {
    });
});
//# sourceMappingURL=index-test.js.map