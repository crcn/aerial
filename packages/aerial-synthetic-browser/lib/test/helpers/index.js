"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common_1 = require("aerial-common");
var lodash_1 = require("lodash");
// import { createTestMasterApplication } from "@tandem/editor/test";
var aerial_sandbox_1 = require("aerial-sandbox");
var parse5 = require("parse5");
var __1 = require("../..");
function createMockBrowser() {
    var deps = aerial_sandbox_1.createSandboxProviders();
    return new __1.SyntheticBrowser(new aerial_common_1.Kernel(deps));
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
// export const loadTestBrowser = async (mockFiles: any, entryFilePath: string) => {
//   const app = createTestMasterApplication({
//     log: {
//       level: LogLevel.VERBOSE
//     },
//     sandboxOptions: {
//       mockFiles: mockFiles
//     }
//   });
//   const browser = new SyntheticBrowser(app.kernel);
//   await browser.open({
//     uri: entryFilePath
//   });
//   return browser;
// } 
//# sourceMappingURL=index.js.map