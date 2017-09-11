"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require("postcss");
const syntax = require("postcss-scss");
const aerial_common_1 = require("aerial-common");
const aerial_synthetic_browser_1 = require("aerial-synthetic-browser");
// TODO - follow scss variables to their original declaration
class SCSSEditor extends aerial_synthetic_browser_1.CSSEditor {
    [aerial_synthetic_browser_1.SyntheticCSSElementStyleRuleMutationTypes.SET_RULE_SELECTOR](node, { target, newValue }) {
        const source = target.source;
        // prefix here is necessary
        const prefix = this.getRuleSelectorPrefix(node);
        node.selector = (node.selector.indexOf("&") === 0 ? "&" : "") + newValue.replace(prefix, "");
    }
    findTargetASTNode(root, target) {
        let found;
        const walk = (node, index) => {
            let offsetStart = {
                line: target.source.start.line,
                column: target.source.start.column
            };
            if (!node.source)
                return;
            const nodeStart = node.source.start;
            // Bug fix (I need to report this): Source map column numbers shift +1 for each CSS rule. This fixes that.
            const ruleCount = this.countRulesOnLineBefore(node);
            if (ruleCount) {
                offsetStart.column -= ruleCount;
            }
            if (node.type === target.source.kind && target.source && aerial_common_1.sourcePositionEquals(nodeStart, offsetStart)) {
                // next find the actual node that the synthetic matches with -- the source position may not be
                // entirely accurate for cases such as nested selectors.
                found = this.findNestedASTNode(node, target);
                return false;
            }
        };
        if (walk(root, -1) !== false) {
            root.walk(walk);
        }
        return found;
    }
    countRulesOnLineBefore(node) {
        let count = 0;
        let stopped = false;
        if (this._rootASTNode === node)
            return 0;
        this._rootASTNode.walk((child) => {
            if (child === node) {
                stopped = true;
            }
            if (stopped)
                return;
            if (child.type === "rule" && child.source && child.source.start.line === node.source.start.line) {
                count++;
            }
        });
        return count;
    }
    findNestedASTNode(node, target) {
        if (isRuleNode(node)) {
            // note that different SCSS engines generate *different* source maps (ugh). node-sass for instance defines source maps
            return this.findMatchingRuleNode(node, target) || node;
        }
        else {
            return node;
        }
    }
    /**
     *
     *
     * @private
     * @param {postcss.Rule} node
     * @param {SyntheticCSSElementStyleRule} synthetic
     * @param {string} [prefix='']
     * @returns {postcss.Rule}
     */
    findMatchingRuleNode(node, synthetic, prefix = '') {
        let found;
        const selector = prefix + (!prefix.length || node.selector.search(/^\&/) !== -1 ? node.selector.replace(/^\&/, "") : " " + node.selector);
        if (selector === synthetic.selector)
            return node;
        node.each((child) => {
            if (isRuleNode(child) && (found = this.findMatchingRuleNode(child, synthetic, selector))) {
                return false;
            }
        });
        return found;
    }
    /**
     * for nested selectors
     *
     * @private
     * @param {postcss.Rule} node
     * @returns
     */
    getRuleSelectorPrefix(node) {
        let prefix = "";
        let current = node;
        while (current = current.parent) {
            if (!isRuleNode(current))
                break;
            prefix = current.selector.replace(/^&/, "") + prefix;
        }
        return prefix;
    }
    parseContent(content) {
        return parseSCSS(content);
    }
    getFormattedContent(root) {
        // try parsing again. This should throw an error if any edits are invalid.
        parseSCSS(root.toString());
        return root.toString();
    }
}
exports.SCSSEditor = SCSSEditor;
function parseSCSS(content) {
    return postcss().process(content, {
        syntax: syntax
    }).root;
}
function isRuleNode(node) {
    return node.type === "rule";
}
//# sourceMappingURL=scss-editor.js.map