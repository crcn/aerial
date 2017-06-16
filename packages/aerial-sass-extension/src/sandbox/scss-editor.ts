import postcss = require("postcss");
import syntax = require("postcss-scss");
import {
  inject,
  Mutation,
  Kernel,
  PropertyMutation,
  SetValueMutation,
  KernelProvider,
  MimeTypeProvider,
  MoveChildMutation,
  sourcePositionEquals,
  InsertChildMutation,
  RemoveChildMutation,
} from "aerial-common";

import {
  CSSEditor,
  SyntheticCSSGroupAtRule,
  syntheticCSSRuleType,
  SyntheticCSSElementStyleRule,
  SyntheticCSSGroupAtRuleEdit,
  SyntheticCSSElementStyleRuleEdit,
  SyntheticCSSKeyframesRuleEdit,
  SyntheticCSSElementStyleRuleMutationTypes,
} from "aerial-synthetic-browser";

import {
  Dependency,
  IContentEdit,
  BaseContentEdit,
  ISyntheticObject,
  ISyntheticObjectChild,
  ISyntheticSourceInfo,
  BaseContentEditor,
} from "aerial-sandbox";


// TODO - follow scss variables to their original declaration
export class SCSSEditor extends CSSEditor {

  [SyntheticCSSElementStyleRuleMutationTypes.SET_RULE_SELECTOR](node: postcss.Rule, { target, newValue }: SetValueMutation<ISyntheticObject>) {
    const source = target.source;

    // prefix here is necessary
    const prefix = this.getRuleSelectorPrefix(node);
    node.selector = (node.selector.indexOf("&") === 0 ? "&" : "") + newValue.replace(prefix, "");
  }

  protected findTargetASTNode(root: postcss.Container, target: ISyntheticObject) {
    let found: postcss.ChildNode;


    const walk = (node: postcss.Node, index: number) => {

      let offsetStart = {
        line: target.source.start.line,
        column: target.source.start.column
      };

      if (!node.source) return;

      const nodeStart = node.source.start;

      // Bug fix (I need to report this): Source map column numbers shift +1 for each CSS rule. This fixes that.
      const ruleCount = this.countRulesOnLineBefore(node);

      if (ruleCount) {
        offsetStart.column -= ruleCount;
      }

      if (node.type === target.source.kind && target.source && sourcePositionEquals(nodeStart, offsetStart)) {
        // next find the actual node that the synthetic matches with -- the source position may not be
        // entirely accurate for cases such as nested selectors.
        found = this.findNestedASTNode(<any>node, target) as postcss.ChildNode;
        return false;
      }
    };

    if (walk(root, -1) !== false) {
      root.walk(walk);
    }

    return found;
  }

  private countRulesOnLineBefore(node: postcss.Node) {
    let count = 0;
    let stopped = false;

    if (this._rootASTNode === node) return 0;

    (<postcss.Root>this._rootASTNode).walk((child: postcss.Node) => {
      if (child === node) {
        stopped = true;
      }
      if (stopped) return;
      if (child.type === "rule" && child.source && child.source.start.line === node.source.start.line) {
        count++;
      }
    });

    return count;
  }

  private findNestedASTNode(node: postcss.Container, target: ISyntheticObject): postcss.Node {
    if (isRuleNode(node)) {

      // note that different SCSS engines generate *different* source maps (ugh). node-sass for instance defines source maps
      return this.findMatchingRuleNode(<postcss.Rule>node, <SyntheticCSSElementStyleRule>target) || node;
    } else {
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

  private findMatchingRuleNode(node: postcss.Rule, synthetic: SyntheticCSSElementStyleRule, prefix = ''): postcss.Rule {
    let found: postcss.Rule;
    const selector = prefix + (!prefix.length || node.selector.search(/^\&/) !== -1 ? node.selector.replace(/^\&/, "") : " " + node.selector);
    if (selector === synthetic.selector) return node;
    node.each((child) => {
      if (isRuleNode(child) && (found = this.findMatchingRuleNode(<postcss.Rule>child, synthetic, selector))) {
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

  private getRuleSelectorPrefix(node: postcss.Rule) {
    let prefix = "";
    let current = node;
    while(current = <postcss.Rule>current.parent) {
      if (!isRuleNode(current)) break;
      prefix = current.selector.replace(/^&/, "") + prefix;
    }
    return prefix;
  }

  parseContent(content: string) {
    return parseSCSS(content);
  }

  getFormattedContent(root: postcss.Rule) {

    // try parsing again. This should throw an error if any edits are invalid.
    parseSCSS(root.toString());

    return root.toString();
  }
}

function parseSCSS(content: string) {
  return postcss().process(content, {
    syntax: syntax
  }).root;
}

function isRuleNode(node: postcss.Node) {
  return node.type === "rule";
}