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
var common_1 = require("@tandem/common");
var lodash_1 = require("lodash");
var test_1 = require("@tandem/editor/test");
var sandbox_1 = require("@tandem/sandbox");
var parse5 = require("parse5");
var __1 = require("../..");
function createMockBrowser() {
    var deps = sandbox_1.createSandboxProviders();
    return new __1.SyntheticBrowser(new common_1.Kernel(deps));
}
exports.createMockBrowser = createMockBrowser;
var CHARS = "abcdefghijkl".split("");
function generateRandomText(maxLength) {
    if (maxLength === void 0) { maxLength = 5; }
    return lodash_1.sampleSize(CHARS, lodash_1.random(1, maxLength)).join("");
}
function generateRandomChar() {
    return lodash_1.sample(CHARS);
}
function generateRandomSyntheticHTMLElementSource(maxChildCount, maxDepth, maxAttributes) {
    if (maxChildCount === void 0) { maxChildCount = 10; }
    if (maxDepth === void 0) { maxDepth = 10; }
    if (maxAttributes === void 0) { maxAttributes = 10; }
    function createRandomSyntheticFragment() {
        var fragment = [];
        if (maxDepth)
            for (var i = lodash_1.random(0, maxChildCount); i--;) {
                fragment.push(generateRandomSyntheticHTMLElementSource(maxChildCount, lodash_1.random(0, maxDepth - 1), maxAttributes));
            }
        return fragment.join("");
    }
    function createRandomElement() {
        var tagName = generateRandomChar();
        var element = ["<", tagName];
        var attribs = {};
        for (var i = lodash_1.random(0, Math.min(maxAttributes, CHARS.length - 1)); i--;) {
            var key = void 0;
            while (attribs[key = generateRandomChar()])
                ;
            attribs[key] = 1;
            element.push(" ", key, '="', generateRandomText(), '"');
        }
        element.push(">", createRandomSyntheticFragment(), "</" + tagName + ">");
        return element.join("");
    }
    function createRandomTextNode() {
        return generateRandomText();
    }
    function createRandomComment() {
        return "<!--" + generateRandomText() + "-->";
    }
    return maxDepth ? createRandomElement() : lodash_1.sample([createRandomElement, createRandomTextNode, createRandomComment])();
}
exports.generateRandomSyntheticHTMLElementSource = generateRandomSyntheticHTMLElementSource;
function generateRandomSyntheticHTMLElement(document, maxChildCount, maxDepth, maxAttributes, generateShadow) {
    if (maxChildCount === void 0) { maxChildCount = 10; }
    if (maxDepth === void 0) { maxDepth = 10; }
    if (maxAttributes === void 0) { maxAttributes = 10; }
    if (generateShadow === void 0) { generateShadow = false; }
    return __1.evaluateMarkup(parse5.parse(generateRandomSyntheticHTMLElementSource(maxChildCount, maxDepth, maxAttributes), { locationInfo: true }), document);
}
exports.generateRandomSyntheticHTMLElement = generateRandomSyntheticHTMLElement;
function generateRandomStyleSheet(maxRules, maxDeclarations) {
    if (maxRules === void 0) { maxRules = 100; }
    if (maxDeclarations === void 0) { maxDeclarations = 20; }
    function createKeyFrameRule() {
        return "@keyframes " + generateRandomChar() + " {\n      " + Array.from({ length: lodash_1.random(1, maxRules) }).map(function (v) {
            return createStyleRule();
        }).join("\n") + "\n    }";
    }
    function createStyleRule() {
        return "." + generateRandomChar() + " {\n      " + Array.from({ length: lodash_1.random(1, maxDeclarations) }).map(function (v) {
            return generateRandomChar() + ": " + generateRandomText(2) + ";";
        }).join("\n") + "\n    }";
    }
    function createMediaRule() {
        return "@media " + generateRandomChar() + " {\n      " + Array.from({ length: lodash_1.random(1, maxRules) }).map(function (v) {
            return lodash_1.sample([createStyleRule, createKeyFrameRule])();
        }).join("\n") + "\n    }";
    }
    var randomStyleSheet = Array
        .from({ length: lodash_1.random(1, maxRules) })
        .map(function (v) { return lodash_1.sample([createStyleRule, createMediaRule, createKeyFrameRule])(); }).join("\n");
    return __1.evaluateCSS(__1.parseCSS(randomStyleSheet));
}
exports.generateRandomStyleSheet = generateRandomStyleSheet;
exports.timeout = function (ms) {
    if (ms === void 0) { ms = 10; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.loadTestBrowser = function (mockFiles, entryFilePath) { return __awaiter(_this, void 0, void 0, function () {
    var app, browser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                app = test_1.createTestMasterApplication({
                    log: {
                        level: common_1.LogLevel.VERBOSE
                    },
                    sandboxOptions: {
                        mockFiles: mockFiles
                    }
                });
                browser = new __1.SyntheticBrowser(app.kernel);
                return [4 /*yield*/, browser.open({
                        uri: entryFilePath
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, browser];
        }
    });
}); };
//# sourceMappingURL=index.js.map