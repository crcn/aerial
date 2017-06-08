import sm = require("source-map");
import postcss =  require("postcss");
import { parseCSS } from "./parsers";

import { without } from "lodash";
import { camelCase } from "lodash";
import { SandboxModule } from "@tandem/sandbox";
import { SyntheticCSSObject } from "./base";
import { SyntheticCSSUnknownGroupAtRule } from "./atrule";
import { SyntheticCSSFontFace } from "./font-face";
import { SyntheticCSSElementStyleRule } from "./style-rule";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSStyleSheet } from "./style-sheet";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { SyntheticCSSStyle } from "./style";
import { ISourceLocation } from "@tandem/common";


let _smcache = {};
function parseSourceMaps(value) {
  if (String(value).indexOf("sourceMappingURL=data") == -1) return undefined;
  if (_smcache[value]) return _smcache[value];

  const sourceMappingURL = String(value).match(/sourceMappingURL=(data\:[^\s\*]+)/)[1];
  

  // assuming that it's inlined here... shouldn't.
  return _smcache[value] = JSON.parse(new Buffer(sourceMappingURL.split(",").pop(), "base64").toString("utf8"));
}

let _cache: {
  [Identifier: string]: SyntheticCSSStyleSheet
} = {};

export function evaluateCSSSource(source: string, map?: sm.RawSourceMap, module?: SandboxModule) {
  if (_cache[source]) return _cache[source].clone(true).regenerateUID();
  if (!map) map = parseSourceMaps(source);
  const ast = parseCSS(source, map);
  const styleSheet = _cache[source] = evaluateCSS(ast, map, module);

  // re-exec to ensure that the cached version doesn't get mutated
  return evaluateCSSSource(source, map, module);
}

setInterval(() => _cache = {}, 1000 * 60);

export function evaluateCSS(expression: postcss.Root, map?: sm.RawSourceMap, module?: SandboxModule): SyntheticCSSStyleSheet {


  const dependency = module && module.source;

  const sourceMapConsumer = map && new sm.SourceMapConsumer(map);
  const sourceRoot = map && map.sourceRoot || "";

  function getStyleDeclaration(rules: postcss.Declaration[]) {

    const obj = {};

    for (let i = 0, n = rules.length; i < n; i++) {
      const decl = rules[i];

      if (!decl.value) continue;

      // Priority level is not part of the value in regular CSSStyleDeclaration instances. We're
      // Adding it here because it's faster for the app, and easier to work with (for now).
      obj[camelCase(decl.prop)] = decl.value + (decl.important ? " !important" : "");
    }

    return SyntheticCSSStyle.fromObject(obj);
  }

  function link<T extends SyntheticCSSObject>(expression: postcss.Node, synthetic: T): T {

    let uri: string = dependency && dependency.uri;
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

  const visitor = {
    visitRoot(root: postcss.Root) {
      const ret = link(root, new SyntheticCSSStyleSheet(acceptAll(root.nodes)));
      return ret;
    },
    visitAtRule(atRule: postcss.AtRule): any {

      if (atRule.name === "keyframes") {
        return link(atRule, new SyntheticCSSKeyframesRule(atRule.params, acceptAll(atRule.nodes)));
      } else if (atRule.name === "media") {
        return link(atRule, new SyntheticCSSMediaRule([atRule.params], acceptAll(atRule.nodes)));
      } else if (atRule.name === "font-face") {
        return link(atRule, new SyntheticCSSFontFace(getStyleDeclaration(atRule.nodes as postcss.Declaration[])));
      }

      return link(atRule, new SyntheticCSSUnknownGroupAtRule(atRule.name, atRule.params, acceptAll(atRule.nodes)));
    },
    visitComment(comment: postcss.Comment) {
      return null;
    },
    visitDeclaration(declaration: postcss.Declaration) {
      return null;
    },
    visitRule(rule: postcss.Rule) {
      return link(rule, new SyntheticCSSElementStyleRule(rule.selector, getStyleDeclaration(rule.nodes as postcss.Declaration[])));
    }
  };

  function acceptAll(nodes: postcss.Node[]) {
    return without((nodes || []).map((child) => accept(child)), null);
  }

  function accept(expression: postcss.Node) {
    switch(expression.type) {
      case "root": return visitor.visitRoot(<postcss.Root>expression);
      case "rule": return visitor.visitRule(<postcss.Rule>expression);
      case "atrule": return visitor.visitAtRule(<postcss.AtRule>expression);
      case "comment": return visitor.visitComment(<postcss.Comment>expression);
      case "decl": return visitor.visitDeclaration(<postcss.Declaration>expression);
    }
  }

  return accept(expression);
}

