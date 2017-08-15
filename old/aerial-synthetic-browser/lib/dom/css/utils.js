"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var markup_1 = require("../../dom/markup");
var aerial_common_1 = require("aerial-common");
var grouping_1 = require("./grouping");
var atrule_1 = require("./atrule");
var style_rule_1 = require("./style-rule");
function diffStyleSheetRules(oldRules, newRules) {
    return aerial_common_1.diffArray(oldRules, newRules, function (oldRule, newRule) {
        if (oldRule.constructor.name !== newRule.constructor.name)
            return -1;
        return oldRule.countShallowDiffs(newRule);
    });
}
exports.diffStyleSheetRules = diffStyleSheetRules;
var MatchedCSSStyleRule = (function () {
    function MatchedCSSStyleRule(target, rule, overriddenStyleProperties, inherited) {
        this.target = target;
        this.rule = rule;
        this.overriddenStyleProperties = overriddenStyleProperties;
        this.inherited = inherited;
    }
    return MatchedCSSStyleRule;
}());
exports.MatchedCSSStyleRule = MatchedCSSStyleRule;
function eachMatchingStyleRule(element, each, filter) {
    if (!filter)
        filter = function () { return true; };
    for (var i = element.ownerDocument.styleSheets.length; i--;) {
        var styleSheet = element.ownerDocument.styleSheets[i];
        for (var j = styleSheet.rules.length; j--;) {
            var rule = styleSheet.rules[j];
            if (!(rule instanceof style_rule_1.SyntheticCSSElementStyleRule) || !filter(rule) || !rule.matchesElement(element))
                continue;
            each(rule);
        }
    }
}
exports.eachMatchingStyleRule = eachMatchingStyleRule;
function eachInheritedMatchingStyleRule(element, each, filter) {
    if (!filter)
        filter = function () { return true; };
    var visited = {};
    var run = function (current) {
        if (current.nodeType !== markup_1.DOMNodeType.ELEMENT)
            return;
        if (current.style) {
            each(current, current);
        }
        eachMatchingStyleRule(current, function (rule) {
            visited[rule.uid] = true;
            each(current, rule);
        }, function (rule) { return !visited[rule.uid]; });
    };
    run(element);
    element.ancestors.forEach(run);
}
exports.eachInheritedMatchingStyleRule = eachInheritedMatchingStyleRule;
function getMatchingCSSStyleRules(target) {
    var visited = {};
    var usedStyles = {};
    var matches = [];
    eachInheritedMatchingStyleRule(target, function (current, rule) {
        var inherited = current !== target;
        var overriddenStyleProperties = {};
        for (var _i = 0, _a = rule.style.getProperties(); _i < _a.length; _i++) {
            var property = _a[_i];
            if (usedStyles[property]) {
                overriddenStyleProperties[property] = true;
            }
            else {
                usedStyles[property] = true;
            }
        }
        matches.push(new MatchedCSSStyleRule(current, rule, overriddenStyleProperties, inherited));
    });
    return matches;
}
exports.getMatchingCSSStyleRules = getMatchingCSSStyleRules;
function isCSSMutation(mutation) {
    return grouping_1.isCSSGroupingStyleMutation(mutation) || style_rule_1.isCSSStyleRuleMutation(mutation) || atrule_1.isCSSAtRuleMutaton(mutation);
}
exports.isCSSMutation = isCSSMutation;
function getCSSFontFaceRules(element) {
    var ownerDocument = element.ownerDocument;
    var fontFaces = [];
    var used = {};
    for (var i = ownerDocument.styleSheets.length; i--;) {
        var styleSheet = ownerDocument.styleSheets[i];
        for (var j = styleSheet.rules.length; j--;) {
            var rule = styleSheet.rules[j];
            if (rule["atRuleName"] && rule.atRuleName === "font-face") {
                var fontFamily = String(rule.style.fontFamily);
                if (used[fontFamily])
                    continue;
                used[fontFamily] = true;
                fontFaces.push(rule);
            }
        }
    }
    return fontFaces;
}
exports.getCSSFontFaceRules = getCSSFontFaceRules;
//# sourceMappingURL=utils.js.map