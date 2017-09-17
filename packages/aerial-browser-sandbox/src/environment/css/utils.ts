import * as postcss from "postcss";
import * as sm from "source-map";
import { camelCase, without } from "lodash";
import { getSEnvCSSStyleSheetClass } from "./style-sheet";
import { getSEnvCSSRuleClasses } from "./rules";
import { SEnvCSSObjectInterface } from "./base";


// TODO - memoize this
export const parseCSS = (source: string) => {
  const expression = postcss.parse(source);
  return expression;
}

// TODO - memoize this
export const evaluateCSS = (source: string, sourceURI: string, context: any, map?: sm.RawSourceMap) => {

  const expression = parseCSS(source);
  const sourceMapConsumer = map && new sm.SourceMapConsumer(map);
  const sourceRoot = map && map.sourceRoot || "";
  const SEnvCSSStyleSheet = getSEnvCSSStyleSheetClass(context);
  const { SEnvCSSStyleRule, SEnvUnknownGroupingRule, SEnvCSSMediaRule } = getSEnvCSSRuleClasses(context);

  function getStyleDeclaration(rules: postcss.Declaration[]) {

    const obj = {};

    for (let i = 0, n = rules.length; i < n; i++) {
      const decl = rules[i];

      if (!decl.value) continue;

      // Priority level is not part of the value in regular CSSStyleDeclaration instances. We're
      // Adding it here because it's faster for the app, and easier to work with (for now).
      obj[camelCase(decl.prop)] = decl.value + (decl.important ? " !important" : "");
    }

    // return SyntheticCSSStyle.fromObject(obj);
    return obj as CSSStyleDeclaration;
  }

  function link<T extends SEnvCSSObjectInterface>(expression: postcss.Node, synthetic: T): T {
    
    let uri   = sourceURI;
    let start =  expression.source.start;
    let end   = expression.source.end;

    if (sourceMapConsumer) {
      const originalPosition = sourceMapConsumer.originalPositionFor({
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
    }
    return synthetic;
  }

  const mapRoot = (root: postcss.Root) => {
    const ret = link(root, new SEnvCSSStyleSheet(acceptAll(root.nodes)));
    return ret;
  };

  const mapAtRule = (atRule: postcss.AtRule): any => {

    if (atRule.name === "keyframes") {
      // return link(atRule, new SyntheticCSSKeyframesRule(atRule.params, acceptAll(atRule.nodes)));
    } else if (atRule.name === "media") {
      // return link(atRule, new SyntheticCSSMediaRule([atRule.params], acceptAll(atRule.nodes)));
    } else if (atRule.name === "font-face") {
      // return link(atRule, new SyntheticCSSFontFace(getStyleDeclaration(atRule.nodes as postcss.Declaration[])));
    }

    return link(atRule, new SEnvUnknownGroupingRule(acceptAll(atRule.nodes)));
  };

  const mapComment = (comment: postcss.Comment) => {
    return null;
  };

  const mapDeclaration = (declaration: postcss.Declaration) => {
    return null;
  };

  const mapRule = (rule: postcss.Rule) => {
    return link(rule, new SEnvCSSStyleRule(rule.selector, getStyleDeclaration(rule.nodes as postcss.Declaration[])));
  };

  const acceptAll = (nodes: postcss.Node[]) => {
    return without((nodes || []).map((child) => accept(child)), null);
  }

  function accept(expression: postcss.Node) {
    switch(expression.type) {
      case "root": return mapRoot(<postcss.Root>expression);
      case "rule": return mapRule(<postcss.Rule>expression);
      case "atrule": return mapAtRule(<postcss.AtRule>expression);
      case "comment": return mapComment(<postcss.Comment>expression);
      case "decl": return mapDeclaration(<postcss.Declaration>expression);
    }
  }

  return accept(expression);
}