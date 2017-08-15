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
var __1 = require("../..");
// poorly organized DOM spec tests. TODO - move these into sep fiels
describe(__filename + "#", function () {
    // note that this does not work yet.
    xit("the HTMLElement prototype can be modified without affecting the original", function () { return __awaiter(_this, void 0, void 0, function () {
        var window;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                        "index.js": "HTMLElement.prototype.message = \"hello\";"
                    }, "index.js")];
                case 1:
                    window = (_a.sent()).window;
                    chai_1.expect(__1.SyntheticHTMLElement.prototype["message"]).to.be.undefined;
                    return [2 /*return*/];
            }
        });
    }); });
    it("new elements are instances of HTMLElement", function () { return __awaiter(_this, void 0, void 0, function () {
        var window;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                        "index.js": "document.body.appendChild(document.createTextNode(document.createElement(\"div\") instanceof HTMLElement))"
                    }, "index.js")];
                case 1:
                    window = (_a.sent()).window;
                    chai_1.expect(window.document.body.textContent).to.equal("true");
                    return [2 /*return*/];
            }
        });
    }); });
    describe("events#", function () {
        describe("DOMContentLoaded event", function () {
            it("is dispatched after load", function () { return __awaiter(_this, void 0, void 0, function () {
                var window;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                                "index.js": "\n            window.addEventListener(\"DOMContentLoaded\", () => {\n              document.body.appendChild(document.createTextNode(\"DOM content loaded\"))\n            })\n          "
                            }, "index.js")];
                        case 1:
                            window = (_a.sent()).window;
                            chai_1.expect(window.document.body.textContent).to.equal("DOM content loaded");
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("load event", function () {
            it("is dispatched by window after DOMContentLoaded", function () { return __awaiter(_this, void 0, void 0, function () {
                var window;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                                "index.js": "\n            let i = 0;\n            window.addEventListener(\"DOMContentLoaded\", () => {\n              i++;\n            })\n\n            window.addEventListener(\"load\", () => {\n              document.body.appendChild(document.createTextNode(++i));\n            })\n          "
                            }, "index.js")];
                        case 1:
                            window = (_a.sent()).window;
                            chai_1.expect(window.document.body.textContent).to.contain("2");
                            return [2 /*return*/];
                    }
                });
            }); });
            it("can be registered with window.onload", function () { return __awaiter(_this, void 0, void 0, function () {
                var window;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                                "index.js": "\n            let i = 0;\n            window.onload = () => document.body.appendChild(document.createTextNode(++i));\n          "
                            }, "index.js")];
                        case 1:
                            window = (_a.sent()).window;
                            chai_1.expect(window.document.body.textContent).to.contain("1");
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("document", function () {
            it("scripts property returns a collection of loaded scripts", function () { return __awaiter(_this, void 0, void 0, function () {
                var window;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                                "index.html": "\n            <script>  \n              window.onload = () => {\n                document.querySelector(\"span\").appendChild(document.createTextNode(document.scripts.length));\n              }\n            </script>\n            <span>\n            </span>\n          "
                            }, "index.html")];
                        case 1:
                            window = (_a.sent()).window;
                            chai_1.expect(window.document.querySelector("span").textContent).to.contain("1");
                            return [2 /*return*/];
                    }
                });
            }); });
            it("scripts.item returns the script with the matching index", function () { return __awaiter(_this, void 0, void 0, function () {
                var window;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                                "index.html": "\n            <script a=\"b\">  \n              window.onload = () => {\n                document.querySelector(\"span\").appendChild(document.createTextNode(document.scripts.item(0).getAttribute(\"a\")));\n              }\n            </script>\n            <span>\n            </span>\n          "
                            }, "index.html")];
                        case 1:
                            window = (_a.sent()).window;
                            chai_1.expect(window.document.querySelector("span").textContent).to.contain("b");
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe("nodes", function () {
        it("getElementsByTagName returns an HTMLCollection", function () { return __awaiter(_this, void 0, void 0, function () {
            var window;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                            "index.html": "\n          <span>\n            a\n          </span>\n          <div>\n          </div>\n          <script>  \n            document.querySelector(\"div\").appendChild(\n              document.createTextNode(document.getElementsByTagName(\"span\").item(0).textContent.toUpperCase())\n            )\n          </script>\n        "
                        }, "index.html")];
                    case 1:
                        window = (_a.sent()).window;
                        chai_1.expect(window.document.querySelector("div").textContent).to.contain("A");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("script tags", function () {
        it("returns the type of script", function () { return __awaiter(_this, void 0, void 0, function () {
            var window;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, test_1.loadTestBrowser({
                            "index.html": "\n          <script type=\"text/jsx\">  \n\n          </script>\n          <span>\n          </span>\n          <script>\n            document.querySelector(\"span\").appendChild(document.createTextNode(document.scripts.item(0).type));\n          </script>\n        "
                        }, "index.html")];
                    case 1:
                        window = (_a.sent()).window;
                        chai_1.expect(window.document.querySelector("span").textContent).to.contain("text/jsx");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("XMLHttpRequest", function () {
    });
});
//# sourceMappingURL=junk-drawer-test.js.map