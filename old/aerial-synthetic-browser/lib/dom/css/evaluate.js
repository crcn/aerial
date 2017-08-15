"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sm = require("source-map");
var parsers_1 = require("./parsers");
var lodash_1 = require("lodash");
var lodash_2 = require("lodash");
var atrule_1 = require("./atrule");
var font_face_1 = require("./font-face");
var style_rule_1 = require("./style-rule");
var media_rule_1 = require("./media-rule");
var style_sheet_1 = require("./style-sheet");
var keyframes_rule_1 = require("./keyframes-rule");
var style_1 = require("./style");
var _smcache = {};
function parseSourceMaps(value) {
    if (String(value).indexOf("sourceMappingURL=data") == -1)
        return undefined;
    if (_smcache[value])
        return _smcache[value];
    var sourceMappingURL = String(value).match(/sourceMappingURL=(data\:[^\s\*]+)/)[1];
    // assuming that it's inlined here... shouldn't.
    return _smcache[value] = JSON.parse(new Buffer(sourceMappingURL.split(",").pop(), "base64").toString("utf8"));
}
var _cache = {};
function evaluateCSSSource(source, map, module) {
    var hash = source + (module && module.uri);
    if (_cache[hash])
        return _cache[hash].clone(true).regenerateUID();
    if (!map)
        map = parseSourceMaps(source);
    var ast = parsers_1.parseCSS(source, map);
    var styleSheet = _cache[hash] = evaluateCSS(ast, map, module);
    // re-exec to ensure that the cached version doesn't get mutated
    return evaluateCSSSource(source, map, module);
}
exports.evaluateCSSSource = evaluateCSSSource;
setInterval(function () { return _cache = {}; }, 1000 * 60);
function evaluateCSS(expression, map, module) {
    var dependency = module && module.source;
    var sourceMapConsumer = map && new sm.SourceMapConsumer(map);
    var sourceRoot = map && map.sourceRoot || "";
    function getStyleDeclaration(rules) {
        var obj = {};
        for (var i = 0, n = rules.length; i < n; i++) {
            var decl = rules[i];
            if (!decl.value)
                continue;
            // Priority level is not part of the value in regular CSSStyleDeclaration instances. We're
            // Adding it here because it's faster for the app, and easier to work with (for now).
            obj[lodash_2.camelCase(decl.prop)] = decl.value + (decl.important ? " !important" : "");
        }
        return style_1.SyntheticCSSStyle.fromObject(obj);
    }
    function link(expression, synthetic) {
        var uri = dependency && dependency.uri;
        var start = expression.source.start;
        var end = expression.source.end;
        if (sourceMapConsumer) {
            var originalPosition = sourceMapConsumer.originalPositionFor({
                line: start.line,
                column: start.column
            });
            start = {
                line: originalPosition.line,
                // Bad. Fixes Discrepancy between postcss & source-map source information.
                // There's also an issue with sass and at rules when inlining styles (which isn't covered here). For example
                // @media { body { color: red; }} will produce incorrect source maps
                column: originalPosition.column + 1
            };
            // source-map will automatically prefix with file:// if root / is present, so replace file:// with the actual
            // source root. This MAY not be a bug, but I'm treating it as one for now.
            uri = originalPosition.source; // && originalPosition.source.replace("file:///", sourceRoot + "/"); 
            end = undefined;
        }
        synthetic.$source = {
            kind: expression.type,
            // todo - this may not be correct.
            uri: uri,
            start: start,
            end: end
        };
        return synthetic;
    }
    var visitor = {
        visitRoot: function (root) {
            var ret = link(root, new style_sheet_1.SyntheticCSSStyleSheet(acceptAll(root.nodes)));
            return ret;
        },
        visitAtRule: function (atRule) {
            if (atRule.name === "keyframes") {
                return link(atRule, new keyframes_rule_1.SyntheticCSSKeyframesRule(atRule.params, acceptAll(atRule.nodes)));
            }
            else if (atRule.name === "media") {
                return link(atRule, new media_rule_1.SyntheticCSSMediaRule([atRule.params], acceptAll(atRule.nodes)));
            }
            else if (atRule.name === "font-face") {
                return link(atRule, new font_face_1.SyntheticCSSFontFace(getStyleDeclaration(atRule.nodes)));
            }
            return link(atRule, new atrule_1.SyntheticCSSUnknownGroupAtRule(atRule.name, atRule.params, acceptAll(atRule.nodes)));
        },
        visitComment: function (comment) {
            return null;
        },
        visitDeclaration: function (declaration) {
            return null;
        },
        visitRule: function (rule) {
            return link(rule, new style_rule_1.SyntheticCSSElementStyleRule(rule.selector, getStyleDeclaration(rule.nodes)));
        }
    };
    function acceptAll(nodes) {
        return lodash_1.without((nodes || []).map(function (child) { return accept(child); }), null);
    }
    function accept(expression) {
        switch (expression.type) {
            case "root": return visitor.visitRoot(expression);
            case "rule": return visitor.visitRule(expression);
            case "atrule": return visitor.visitAtRule(expression);
            case "comment": return visitor.visitComment(expression);
            case "decl": return visitor.visitDeclaration(expression);
        }
    }
    return accept(expression);
}
exports.evaluateCSS = evaluateCSS;
//# sourceMappingURL=evaluate.js.map