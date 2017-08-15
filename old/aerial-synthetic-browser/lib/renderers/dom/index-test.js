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
var index_1 = require("./index");
var __1 = require("../..");
var test_1 = require("../../test");
describe(__filename + "#", function () {
    var removeExtraWhitespace = function (str) { return str.replace(/[\s\r\n\t]+/g, " "); };
    var createDocument = function (html) {
        if (html === void 0) { html = ""; }
        var document = new __1.SyntheticWindow().document;
        document.registerElement("style", __1.SyntheticHTMLStyleElement);
        document.body.innerHTML = html;
        return document;
    };
    var createRenderer = function (sourceDocument) {
        var fakeDocument = createDocument();
        var renderer = new index_1.SyntheticDOMRenderer({ nodeFactory: fakeDocument });
        fakeDocument.body.appendChild(renderer.element);
        renderer.start();
        renderer.document = sourceDocument;
        return {
            render: function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, renderer.requestRender()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    css: fakeDocument.styleSheets[0].cssText,
                                    html: renderer.element.lastChild.lastChild.innerHTML,
                                }];
                    }
                });
            }); }
        };
    };
    var fuzzyCSSCases = Array.from({ length: 10 }).map(function (v) { return [removeExtraWhitespace(test_1.generateRandomStyleSheet(4).cssText), ""]; });
    var fuzzyHTMLCases = Array.from({ length: 10 }).map(function (v) { return ["", test_1.generateRandomSyntheticHTMLElementSource(5, 5, 2)]; });
    [
        // basic rendering
        [["", "<div>hello</div>"]],
        [["", "<div a=\"b\">hello</div>"]],
        [["", "<div a=\"b\" c=\"d\">hello</div>"]],
        [["", "<ul><li>a</li><li>b</li><li>c</li></ul>"]],
        [["", "<!--comment-->"]],
        [[".container { color: red; } ", "<div></div>"]],
        // fuzzy
        // [[``, generateRandomSyntheticHTMLElementSource(10, 10, 2)]],
        // // HTML mutations
        [["", "<div>a</div>"], ["", "<div>b</div>"]],
        [["", "<div a=\"b\"></div>"], ["", "<div a=\"c\"></div>"]],
        [["", "<div a=\"b\"></div>"], ["", "<div c=\"d\"></div>"]],
        [["", "<div>a</div><span>b</span>"], ["", "<span>b</span><div>a</div>"]],
        // fuzzyHTMLCases,
        // CSS Mutations
        [[".a { color: red; } ", "<div class=\"a\">a</div>"], [".a { color: blue; } ", "<div class=\"a\">a</div>"]],
        [[".a { color: red; } ", "<div class=\"a\">a</div>"], [".a { color: red; } .b { color: green; } ", "<div class=\"a\">a</div>"]],
        [[".a { color: red; } .b { color: green; } ", "<div class=\"a\">a</div>"], [".a { color: red; } .b { color: blue; } ", "<div class=\"a\">a</div>"]],
        [[".a { color: red; } .b { color: green; } ", "<div class=\"a\">a</div>"], [".a { color: red; } ", "<div class=\"a\">a</div>"]],
        [["@media a { .b { color: red; } } ", "<div class=\"a\">a</div>"], ["@media a { .b { color: blue; } } ", "<div class=\"a\">a</div>"]],
    ].forEach(function (_a) {
        var _b = _a[0], inputCSS = _b[0], inputHTML = _b[1], mutations = _a.slice(1);
        it("Can render " + inputCSS + " " + inputHTML + " -> " + mutations.join(" "), function () { return __awaiter(_this, void 0, void 0, function () {
            var createdStyledDocument, inputDocument, renderer, assertHTML, _a, _i, mutations_1, _b, mutatedCSS, mutatedHTML, outputDocument, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        createdStyledDocument = function (css, html) { return createDocument("<style>" + css + "</style>" + html); };
                        inputDocument = createdStyledDocument(inputCSS, inputHTML);
                        renderer = createRenderer(inputDocument);
                        assertHTML = function (_a, inputCSS, inputHTML) {
                            var html = _a.html, css = _a.css;
                            chai_1.expect(removeExtraWhitespace(css)).to.equal(removeExtraWhitespace(inputCSS));
                            chai_1.expect(html).to.equal("<div><div></div><div>" + inputHTML + "</div></div>");
                        };
                        _a = assertHTML;
                        return [4 /*yield*/, renderer.render()];
                    case 1:
                        _a.apply(void 0, [_d.sent(), inputCSS, inputHTML]);
                        _i = 0, mutations_1 = mutations;
                        _d.label = 2;
                    case 2:
                        if (!(_i < mutations_1.length)) return [3 /*break*/, 5];
                        _b = mutations_1[_i], mutatedCSS = _b[0], mutatedHTML = _b[1];
                        outputDocument = createdStyledDocument(mutatedCSS, mutatedHTML);
                        inputDocument.createEdit().fromDiff(outputDocument).applyMutationsTo(inputDocument);
                        _c = assertHTML;
                        return [4 /*yield*/, renderer.render()];
                    case 3:
                        _c.apply(void 0, [_d.sent(), mutatedCSS, mutatedHTML]);
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=index-test.js.map