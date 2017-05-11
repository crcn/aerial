"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var helpers_1 = require("../test/helpers");
var common_1 = require("@tandem/common");
var chalk = require("chalk");
var __1 = require("..");
var sandbox_1 = require("@tandem/sandbox");
describe(__filename + "#", function () {
    // all CSS edits
    [
        // style rule edits
        [".a { color: red }", ".a { color: blue }", [sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, __1.SyntheticCSSElementStyleRuleMutationTypes.SET_DECLARATION]],
        // style sheet edits
        [".a {}", ".b {}", [__1.CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, __1.CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]],
        [".a {}", ".b {} .a {}", [__1.CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
        [".a {} .b {}", ".b {}", [__1.CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
        [".a {} .b {}", ".b {} .a {}", [__1.CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT, sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
        [".a {} .b {}", ".a {} .c {} .b {}", [__1.CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
        [".a {} .b {}", ".b {} .c {} .a {}", [__1.CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT, sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, __1.CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
        ["*[class*=\"col-\"] { padding: 10px; }", "*[class*=\"col-\"] { padding: 8px; }", [sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, __1.SyntheticCSSElementStyleRuleMutationTypes.SET_DECLARATION]],
        // media query edits
        ["@media a { .a { color: red } }", "@media b { .a { color: red } }", [__1.CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, __1.CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]],
        ["@media a { .a { color: red } }", "@media b { .a { color: red } } @media a { .a { color: red } }", [__1.CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
        ["@media a { .a { color: red } }", "@media a { .b { color: red } }", [__1.CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, __1.CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]],
        // font face
        ["@font-face { font-family: Helvetica }", "@font-face { font-family: Arial }", [__1.CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, __1.CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]],
        ["@font-face { font-family: Helvetica }", "@font-face { font-family: Arial }", [__1.CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, __1.CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]],
        ["@keyframes a { 0% { color: red; }}", "@keyframes b { 0% { color: red; }}", [__1.CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, __1.CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]],
        ["@keyframes a { 0% { color: red; }}", "@keyframes a { 0% { color: blue; }}", [sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, sandbox_1.SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, __1.SyntheticCSSElementStyleRuleMutationTypes.SET_DECLARATION]],
        // failed fuzzy tests
        [".g{}.g{b:b;e:b;}.b{}.f{c:b;b:bf;}.e{}", ".c{e:cf;a:a;}.c{}.e{}.b{c:g;e:ec;d:da;}.d{a:dg;g:b;c:c;}.g{d:ea;e:f;f:b;}", false],
        [".f{g:ad;c:g;a:dg;e:fc;}.g{a:gc;d:ad;g:c;}.c{c:b;g:bc;}", ".c{g:fd;d:fg;f:ef;a:e;}.b{e:e;}.c{e:e;d:bc;}.g{a:g;b:gc;f:f;e:bc;}.f{}.g{c:af;}", false]
    ].forEach(function (_a) {
        var oldSource = _a[0], newSource = _a[1], mutationTypes = _a[2];
        it("Can diff & patch " + oldSource + " to " + newSource + " with ops: " + mutationTypes, function () {
            var a = __1.evaluateCSS(__1.parseCSS(oldSource));
            var b = __1.evaluateCSS(__1.parseCSS(newSource));
            var edit = a.createEdit().fromDiff(b);
            chai_1.expect(edit.mutations.length).not.to.equal(0);
            edit.applyMutationsTo(a, function (target, message) {
                // for debugging
                // console.log("applied %s:\n%s", chalk.magenta(message.toString()), chalk.green(removeWhitespace(a.cssText)));
            });
            chai_1.expect(removeWhitespace(a.cssText)).to.equal(removeWhitespace(b.cssText));
            if (mutationTypes) {
                chai_1.expect(edit.mutations.map(function (mutation) { return mutation.type; })).to.eql(mutationTypes);
            }
            // ensure that there are no more changes
            chai_1.expect(a.createEdit().fromDiff(b).mutations.length).to.equal(0);
        });
    });
    // TODO - use formatter instead to remove whitespace
    function removeWhitespace(str) {
        return str.replace(/[\r\n\s\t]+/g, " ");
    }
    // fuzzy testing
    it("can diff & patch random CSS style sheets", function () {
        var prev;
        for (var i = 100; i--;) {
            var curr = helpers_1.generateRandomStyleSheet(10, 5);
            if (!prev) {
                prev = curr;
                continue;
            }
            var pp = prev.clone(true);
            prev.createEdit().fromDiff(curr).applyMutationsTo(prev);
            var mutations = prev.createEdit().fromDiff(curr).mutations;
            chai_1.expect(mutations.length).to.equal(0, "\n\n        Couldn't properly patch " + chalk.grey(removeWhitespace(pp.cssText)) + " -> " + chalk.green(removeWhitespace(prev.cssText)) + " ->\n        " + chalk.magenta(removeWhitespace(curr.cssText)) + "\n\n\n        Trying to apply edit.changes from a stylesheet that should be identical: " + mutations.map(function (message) { return message.type; }) + "\n      ");
        }
    });
    it("patches the source of each synthetic object", function () {
        var a = helpers_1.generateRandomStyleSheet(10, 5);
        var b = helpers_1.generateRandomStyleSheet(10, 5);
        a.createEdit().fromDiff(b).applyMutationsTo(a);
        var asources = common_1.flattenTree(a).map(function (node) { return node.source; });
        var bsources = common_1.flattenTree(b).map(function (node) { return node.source; });
        chai_1.expect(JSON.stringify(asources)).to.eql(JSON.stringify(bsources));
    });
});
//# sourceMappingURL=css-diff-test.js.map