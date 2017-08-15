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
var aerial_common_1 = require("aerial-common");
var aerial_sandbox_1 = require("aerial-sandbox");
var test_1 = require("../test");
describe(__filename + "#", function () {
    [
        [
            { "index.html": "\n      <html lang=\"en\">\n        <head>\n          <meta charset=\"utf-8\">\n          <style>\n            html, body {\n              color: red;\n            }\n          </style>\n        </head>\n        <body>\n          Hola Mundo!!\n        </body>\n      </html>\n      " },
            { "index.html": "\n        <html lang=\"en\">\n          <head>\n            <meta charset=\"utf-8\">\n            <style>\n              html, body {\n                color: red;\n              }\n            </style>\n            <style>\n              html, div {\n                color: blue;\n              }\n            </style>\n          </head>\n          <body>\n            Hola Mundo!!\n          </body>\n        </html>\n      " },
            { "index.html": "\n      <html lang=\"en\">\n        <head>\n          <meta charset=\"utf-8\">\n          <style>\n            html, body {\n              color: red;\n            }\n          </style>\n        </head>\n        <body>\n          Hola Mundo!!\n        </body>\n      </html>\n      " }
        ],
        [
            {
                "index.html": "\n          <html lang=\"en\">\n            <head>\n              <link rel=\"stylesheet\" href=\"./index.css\">\n              <meta charset=\"utf-8\">\n              <style>\n                html, body {\n                  color: red;\n                }\n              </style>\n            </head>\n            <body>\n              Hola Mundo!!\n            </body>\n          </html>\n          ",
                "index.css": "\n          html, body, span {\n            padding: 0;\n            margin: 0;\n\n            font-family: Helvetica;\n          }\n        "
            },
            {
                "index.html": "\n          <html lang=\"en\">\n            <head>\n              <meta charset=\"utf-8\">\n              <style>\n                html, body {\n                  color: red;\n                }\n              </style>\n            </head>\n            <body>\n              Hola Mundo!!\n            </body>\n          </html>\n          "
            },
            {
                "index.html": "\n          <html lang=\"en\">\n            <head>\n              <link rel=\"stylesheet\" href=\"./index.css\">\n              <meta charset=\"utf-8\">\n              <style>\n                html, body {\n                  color: red;\n                }\n              </style>\n            </head>\n            <body>\n              Hola Mundo!!\n            </body>\n          </html>\n          "
            },
        ]
    ].forEach(function (changes) {
        it("properly diffs " + JSON.stringify(changes), function () { return __awaiter(_this, void 0, void 0, function () {
            var clone, browser, watcher, stringifyStyleSheets, testClone, fileChanges, _a, _b, _i, fileName;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, test_1.loadTestBrowser(changes.shift(), "index.html")];
                    case 1:
                        browser = _c.sent();
                        watcher = new aerial_sandbox_1.SyntheticObjectChangeWatcher(function (mutations) {
                            new aerial_sandbox_1.SyntheticObjectTreeEditor(clone).applyMutations(mutations.map(function (mutation) {
                                return aerial_common_1.deserialize(JSON.parse(JSON.stringify(aerial_common_1.serialize(mutation))), browser.kernel);
                            }));
                        }, function (c) {
                            clone = c.cloneNode(true);
                        });
                        stringifyStyleSheets = function (document) {
                            return document.styleSheets.map(function (ss) { return ss.cssText; }).join("");
                        };
                        testClone = function () {
                            watcher.target = browser.document;
                            chai_1.expect(browser.document.toString()).to.equal(clone.toString());
                            chai_1.expect(stringifyStyleSheets(clone)).to.equal(stringifyStyleSheets(browser.document));
                        };
                        testClone();
                        _c.label = 2;
                    case 2:
                        if (!changes.length) return [3 /*break*/, 8];
                        fileChanges = changes.shift();
                        _a = [];
                        for (_b in fileChanges)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        fileName = _a[_i];
                        return [4 /*yield*/, aerial_sandbox_1.URIProtocolProvider.lookup(fileName, browser.kernel).write(fileName, fileChanges[fileName])];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [4 /*yield*/, test_1.timeout()];
                    case 7:
                        _c.sent();
                        testClone();
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=document-diff-test.js.map