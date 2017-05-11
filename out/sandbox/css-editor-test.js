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
var fs = require("fs");
var path = require("path");
var chai_1 = require("chai");
var helpers_1 = require("../test/helpers");
var sandbox_1 = require("@tandem/sandbox");
var common_1 = require("@tandem/common");
var test_1 = require("@tandem/editor/test");
var __1 = require("..");
exports.cssEditorTestCases = [
    ["a { color: red; }", "a{ color: blue; }"],
    [".a { color: red; }", ".a{ color: blue; }"],
    [".a { color: red; }", ".a{ }"],
    [".a { color: red;  }", ".a{ color: red; background: orange; }"],
    [".a { color: red; background: orange; }", ".a{ }"],
    [".a { color: red; }", ".a{ color: red; } .b { color: blue; }"],
    [".a { color: red; }", ".a{ color: red; } @media screen { .b { color: blue; }}"],
    [".a { color: black; }", ".a{ color: black; } @keyframes a { 0% { color: blue; }}"],
    [".a{color:red}.b{color:blue}", ".b { color: blue; } .a{ color: red; }"],
    ["@media screen {\n.b{color:red}}", "@media screen { .c { color: red; }}"],
    [
        "@keyframes g { 0% { color: green; }}",
        "@keyframes a { 0% { color: orange; } }"
    ],
    [
        "@keyframes e { 0% { color: blue } }",
        "@keyframes e { 1% { color: blue } } "
    ],
    [
        "@keyframes a { 0% { color: red; } }",
        "@keyframes b { 0% { color: red; } } @keyframes a { 0% { color: blue } }",
    ],
    [
        ".a { color: red; } @media screen { .c { color: white }}",
        ".b { color: blue; } .a { color: green; }"
    ],
    [
        "@media screen and (min-width: 480px) { .a { color: red; }} .h { } @media screen and (min-width: 500px) { .a { color: red; }}",
        ".l { color: blue; }  @media screen and (min-width: 500px) { .a { color: blue; } }"
    ],
    [
        ".c { color: red; text-decoration: none; }",
        ".c { text-decoration: none; color: blue; }"
    ],
];
describe(__filename + "#", function () {
    var cssLoaderPath = path.join(process.cwd(), "node_modules", "css-loader");
    var addStylePath = path.join(process.cwd(), "node_modules", "style-loader", "addStyles.js");
    var cssBasePath = path.join(cssLoaderPath, "lib", "css-base.js");
    var app;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    app = test_1.createTestMasterApplication({
                        log: {
                            level: common_1.LogLevel.NONE
                        },
                        sandboxOptions: {
                            mockFiles: (_a = {},
                                _a[cssBasePath] = fs.readFileSync(cssBasePath, "utf8"),
                                _a[addStylePath] = fs.readFileSync(addStylePath, "utf8"),
                                _a)
                        }
                    });
                    return [4 /*yield*/, app.initialize()];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var loadCSS = function (content) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var kernel, entryCSSFilePath, entryJSFilePath, fs, browser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    kernel = app.kernel;
                    entryCSSFilePath = test_1.createRandomFileName("css");
                    entryJSFilePath = test_1.createRandomFileName("js");
                    fs = sandbox_1.URIProtocolProvider.lookup(entryCSSFilePath, kernel);
                    return [4 /*yield*/, fs.write(entryCSSFilePath, content)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs.write(entryJSFilePath, "\n      require(\"" + entryCSSFilePath + "\");\n    ")];
                case 2:
                    _a.sent();
                    browser = new __1.SyntheticBrowser(kernel);
                    return [4 /*yield*/, browser.open({
                            uri: entryJSFilePath,
                            dependencyGraphStrategyOptions: {
                                name: "webpack"
                            }
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, {
                            styleSheet: browser.document.styleSheets[0],
                            fileEditor: sandbox_1.FileEditorProvider.getInstance(kernel),
                            reloadStylesheet: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, common_1.waitForPropertyChange(browser.sandbox, "exports")];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, browser.document.styleSheets[0]];
                                    }
                                });
                            }); }
                        }];
            }
        });
    }); };
    var fuzzyTests = Array.from({ length: 30 }).map(function (v) { return [
        helpers_1.generateRandomStyleSheet(4, 2).cssText.replace(/[\s\r\n\t]+/g, " "),
        helpers_1.generateRandomStyleSheet(4, 2).cssText.replace(/[\s\r\n\t]+/g, " ")
    ]; });
    exports.cssEditorTestCases.concat(fuzzyTests).forEach(function (_a) {
        var oldSource = _a[0], newSource = _a[1];
        xit("can apply a file edit from " + oldSource + " to " + newSource, function () { return __awaiter(_this, void 0, void 0, function () {
            var a, b, edit, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loadCSS(oldSource)];
                    case 1:
                        a = _b.sent();
                        return [4 /*yield*/, loadCSS(newSource)];
                    case 2:
                        b = _b.sent();
                        chai_1.expect(a.styleSheet.cssRules.length).not.to.equal(0);
                        chai_1.expect(b.styleSheet.cssRules.length).not.to.equal(0);
                        edit = a.styleSheet.createEdit().fromDiff(b.styleSheet);
                        chai_1.expect(edit.mutations.length).not.to.equal(0);
                        a.fileEditor.applyMutations(edit.mutations);
                        _a = chai_1.expect;
                        return [4 /*yield*/, a.reloadStylesheet()];
                    case 3:
                        _a.apply(void 0, [(_b.sent()).cssText]).to.equal(b.styleSheet.cssText);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    xit("doesn't save the file if there's a syntax error in an edit");
});
//# sourceMappingURL=css-editor-test.js.map