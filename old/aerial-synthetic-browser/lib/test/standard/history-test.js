"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var test_1 = require("../../test");
// poorly organized DOM spec tests. TODO - move these into sep fiels
describe(__filename + "#", function () {
    it("Can change the location of the page by manipulating pushState", function () { return __awaiter(_this, void 0, void 0, function () {
        var browser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                        "/path/to/index.html": "\n        <script>\n          history.pushState(\"a\", \"page 1\", \"hello.html\");\n        </script>\n      "
                    }, "file:///path/to/index.html")];
                case 1:
                    browser = _a.sent();
                    chai_1.expect(browser.window.location.pathname).to.equal("/path/to/hello.html");
                    chai_1.expect(browser.window.history.length).to.equal(2);
                    return [4 /*yield*/, test_1.loadTestBrowser({
                            "/path/to/index.html": "\n        <script>\n          history.pushState(\"a\", \"page 1\", \"/hello.html\");\n          history.pushState(\"a\", \"page 1\", \"/hello2.html\");\n        </script>\n      "
                        }, "file:///path/to/index.html")];
                case 2:
                    browser = _a.sent();
                    chai_1.expect(browser.window.location.pathname).to.equal("/hello2.html");
                    chai_1.expect(browser.window.history.length).to.equal(3);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Can replace the current history state", function () { return __awaiter(_this, void 0, void 0, function () {
        var browser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                        "/path/to/index.html": "\n        <script>\n          history.pushState(\"a\", \"page 1\", \"hello.html\");\n          history.replaceState(\"b\", \"page 2\", \"hello2.html\");\n        </script>\n      "
                    }, "file:///path/to/index.html")];
                case 1:
                    browser = _a.sent();
                    chai_1.expect(browser.window.location.pathname).to.equal("/path/to/hello2.html");
                    chai_1.expect(browser.window.history.length).to.equal(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Returns the current state of the browser", function () { return __awaiter(_this, void 0, void 0, function () {
        var browser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                        "/path/to/index.html": "\n        <script>\n          history.pushState(\"a\", \"page 1\", \"hello.html\");\n          history.replaceState(\"b\", \"page 2\", \"hello2.html\");\n        </script>\n      "
                    }, "file:///path/to/index.html")];
                case 1:
                    browser = _a.sent();
                    chai_1.expect(browser.window.history.state).to.equal("b");
                    return [2 /*return*/];
            }
        });
    }); });
    it("Can call back/forward/go", function () { return __awaiter(_this, void 0, void 0, function () {
        var browser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                        "/path/to/index.html": "\n        <script>\n          history.pushState(\"a\", \"page 1\", \"a.html\");\n          history.pushState(\"b\", \"page 1\", \"b.html\");\n          history.pushState(\"c\", \"page 1\", \"c.html\");\n\n          \n        </script>\n      "
                    }, "file:///path/to/index.html")];
                case 1:
                    browser = _a.sent();
                    chai_1.expect(browser.window.history.state).to.equal("c");
                    browser.window.history.back();
                    chai_1.expect(browser.window.history.state).to.equal("b");
                    browser.window.history.go(1);
                    chai_1.expect(browser.window.history.state).to.equal("a");
                    browser.window.history.go(3);
                    chai_1.expect(browser.window.history.state).to.equal("c");
                    browser.window.history.go(1);
                    browser.window.history.forward();
                    chai_1.expect(browser.window.history.state).to.equal("b");
                    return [2 /*return*/];
            }
        });
    }); });
    it("window.onpopstate is called when the history changes", function () { return __awaiter(_this, void 0, void 0, function () {
        var browser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                        "/path/to/index.html": "\n        <span>\n        </span>\n        <script>\n          let locations = [];\n          window.onpopstate = () => locations.push(window.location.toString());\n\n          history.pushState(\"a\", \"page 1\", \"a.html\");\n          history.pushState(\"b\", \"page 1\", \"b.html\");\n          history.pushState(\"c\", \"page 1\", \"c.html\");\n\n          location.hash = \"d\";\n\n          document.querySelector(\"span\").textContent = locations.join(\", \");\n        </script>\n      "
                    }, "file:///path/to/index.html")];
                case 1:
                    browser = _a.sent();
                    chai_1.expect(browser.window.document.querySelector("span").textContent).to.equal("file:///path/to/a.html, file:///path/to/b.html, file:///path/to/c.html, file:///path/to/c.html#d");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=history-test.js.map