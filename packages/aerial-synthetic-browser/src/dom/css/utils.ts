import { camelCase, values, uniq } from "lodash";
import { SyntheticCSSObject } from "./base";
import { SyntheticDOMElement, DOMNodeType } from "../../dom/markup";
import { SyntheticHTMLElement } from "../../dom/html";
import { diffArray, ArrayMutation } from "aerial-common";
import { SyntheticCSSFontFace } from "./font-face";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { isCSSGroupingStyleMutation } from "./grouping";
import { isInheritedCSSStyleProperty, SyntheticCSSStyle } from "./style";
import { SyntheticCSSGroupAtRule, isCSSAtRuleMutaton } from "./atrule";
import { SyntheticCSSElementStyleRule, isCSSStyleRuleMutation } from "./style-rule";

export type syntheticCSSRuleType = SyntheticCSSElementStyleRule|SyntheticCSSGroupAtRule;

export function diffStyleSheetRules(oldRules: syntheticCSSRuleType[], newRules: syntheticCSSRuleType[]) {
  return diffArray<syntheticCSSRuleType>(oldRules, newRules, (oldRule, newRule) => {
    if (oldRule.constructor.name !== newRule.constructor.name) return -1;
    return (<SyntheticCSSObject>oldRule).countShallowDiffs(<SyntheticCSSObject>newRule);
  });
}

export class MatchedCSSStyleRule {
  constructor(readonly target: SyntheticDOMElement, readonly rule: SyntheticCSSElementStyleRule, readonly overriddenStyleProperties: any, readonly inherited: boolean) {
  }
}

export function eachMatchingStyleRule(element: SyntheticDOMElement, each: (rule: SyntheticCSSElementStyleRule) => any, filter?: (rule: SyntheticCSSElementStyleRule) => boolean) {
  if (!filter) filter = () => true;
  for (let i = element.ownerDocument.styleSheets.length; i--;) {
    const styleSheet = element.ownerDocument.styleSheets[i];
    for (let j = styleSheet.rules.length; j--;) {
      const rule = <SyntheticCSSElementStyleRule>styleSheet.rules[j]
      if (!(rule instanceof SyntheticCSSElementStyleRule) || !filter(rule) || !rule.matchesElement(element)) continue;
      each(rule);
    }
  }
}

export function eachInheritedMatchingStyleRule(element: SyntheticDOMElement, each: (element: SyntheticDOMElement, rule: SyntheticCSSElementStyleRule|SyntheticHTMLElement) => any, filter?: (rule: SyntheticCSSElementStyleRule) => boolean) {
  if (!filter) filter = () => true;

  const visited = {};

  const run = (current: SyntheticHTMLElement) => {
    if (current.nodeType !== DOMNodeType.ELEMENT) return;
    if (current.style) {
      each(current, current);
    }
    eachMatchingStyleRule(current, (rule) => {
      visited[rule.uid] = true;
      each(current, rule);
    }, (rule) => !visited[rule.uid]);
  }

  run(element as SyntheticHTMLElement);
  element.ancestors.forEach(run);
}

export function getMatchingCSSStyleRules(target: SyntheticDOMElement) {

  const visited = {};
  const usedStyles = {};

  const matches = [];

  eachInheritedMatchingStyleRule(target, (current: SyntheticDOMElement, rule: SyntheticCSSElementStyleRule) => {
    const inherited = current !== target;
    const overriddenStyleProperties = {};
    for (const property of rule.style.getProperties()) {
      if (usedStyles[property]) {
        overriddenStyleProperties[property] = true;
      } else {
        usedStyles[property] = true;
      }
    }

    matches.push(new MatchedCSSStyleRule(current, rule, overriddenStyleProperties, inherited));
  });

  return matches;
}

export function isCSSMutation(mutation) {
  return isCSSGroupingStyleMutation(mutation) || isCSSStyleRuleMutation(mutation) || isCSSAtRuleMutaton(mutation);
}

export function getCSSFontFaceRules(element: SyntheticDOMElement): SyntheticCSSFontFace[] {
  const ownerDocument = element.ownerDocument;

  const fontFaces: SyntheticCSSFontFace[] = [];

  const used = {};
  
  for (let i = ownerDocument.styleSheets.length; i--;) {
    const styleSheet = ownerDocument.styleSheets[i];
    for (let j = styleSheet.rules.length; j--;) {
      const rule = styleSheet.rules[j] as any;
      if (rule["atRuleName"] && (rule as SyntheticCSSFontFace).atRuleName === "font-face") {
        const fontFamily = String((rule as SyntheticCSSFontFace).style.fontFamily);
        if (used[fontFamily]) continue;
        used[fontFamily] = true;
        fontFaces.push(rule);
      }
    }
  }

  return fontFaces;
}
