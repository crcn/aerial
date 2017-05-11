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
var __1 = require("..");
var sandbox_1 = require("@tandem/sandbox");
var test_1 = require("../test");
var common_1 = require("@tandem/common");
var test_2 = require("@tandem/editor/test");
describe(__filename + "#", function () {
    var app;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = test_2.createTestMasterApplication({
                        log: {
                            level: common_1.LogLevel.ERROR,
                        },
                        sandboxOptions: {
                            mockFiles: {}
                        }
                    });
                    return [4 /*yield*/, app.initialize()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var loadHTML = function (source) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var kernel, entryFilePath, protocol, browser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    kernel = app.kernel;
                    entryFilePath = test_2.createRandomFileName("html");
                    protocol = sandbox_1.URIProtocolProvider.lookup(entryFilePath, kernel);
                    return [4 /*yield*/, protocol.write(entryFilePath, "<div>" + source + "</div>")];
                case 1:
                    _a.sent();
                    browser = new __1.SyntheticBrowser(kernel);
                    return [4 /*yield*/, browser.open({
                            uri: "file://" + entryFilePath
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, {
                            entryFilePath: entryFilePath,
                            documentElement: browser.document.documentElement,
                            reloadDocumentElement: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, common_1.waitForPropertyChange(browser.sandbox, "exports")];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, browser.document.documentElement];
                                    }
                                });
                            }); }
                        }];
            }
        });
    }); };
    var fuzzyCases = Array.from({ length: 30 }).map(function () {
        return [test_1.generateRandomSyntheticHTMLElementSource(4, 3), test_1.generateRandomSyntheticHTMLElementSource(4, 3)];
    });
    [
        ["<div id=\"a\"></div>", "<div id=\"b\"></div>"],
        ["<div id=\"a\"></div>", "<div></div>"],
        ["<div></div>", "<div id=\"b\"></div>"],
        ["<div id=\"a\" class=\"b\"></div>", "<div class=\"c\" id=\"a\"></div>"],
        ["<div>a</div>", "<div>b</div>"],
        ["<div>a</div>", "<div><!--b--></div>"],
        ["<div>a<!--b--><c /></div>", "<div><!--b--><c />a</div>"],
        // busted fuzzy tests
        [
            "<g a=\"gca\" a=\"geab\"></g>",
            "<g g=\"b\" f=\"d\"></g>"
        ],
        [
            "<g b=\"ed\" g=\"ad\"></g>",
            "<g c=\"fad\" g=\"fdbe\" b=\"bdf\"></g>",
        ],
    ].forEach(function (_a) {
        var oldSource = _a[0], newSource = _a[1];
        it("Can apply file edits from " + oldSource + " to " + newSource, function () { return __awaiter(_this, void 0, void 0, function () {
            var oldResult, newResult, edit, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loadHTML(oldSource)];
                    case 1:
                        oldResult = _b.sent();
                        return [4 /*yield*/, loadHTML(newSource)];
                    case 2:
                        newResult = _b.sent();
                        chai_1.expect(oldResult.documentElement.source).not.to.be.undefined;
                        edit = oldResult.documentElement.createEdit().fromDiff(newResult.documentElement);
                        chai_1.expect(edit.mutations.length).not.to.equal(0);
                        return [4 /*yield*/, sandbox_1.FileEditorProvider.getInstance(app.kernel).applyMutations(edit.mutations)];
                    case 3:
                        _b.sent();
                        _a = chai_1.expect;
                        return [4 /*yield*/, oldResult.reloadDocumentElement()];
                    case 4:
                        _a.apply(void 0, [(_b.sent()).innerHTML.replace(/\n\s*/g, "")]).to.equal(newResult.documentElement.innerHTML);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=markup-editor-test.js.map