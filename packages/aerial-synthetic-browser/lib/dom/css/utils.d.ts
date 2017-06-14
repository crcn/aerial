import { SyntheticDOMElement, SyntheticHTMLElement } from "../../dom";
import { ArrayMutation } from "aerial-common";
import { SyntheticCSSFontFace } from "./font-face";
import { SyntheticCSSGroupAtRule } from "./atrule";
import { SyntheticCSSElementStyleRule } from "./style-rule";
export declare type syntheticCSSRuleType = SyntheticCSSElementStyleRule | SyntheticCSSGroupAtRule;
export declare function diffStyleSheetRules(oldRules: syntheticCSSRuleType[], newRules: syntheticCSSRuleType[]): ArrayMutation<syntheticCSSRuleType>;
export declare class MatchedCSSStyleRule {
    readonly target: SyntheticDOMElement;
    readonly rule: SyntheticCSSElementStyleRule;
    readonly overriddenStyleProperties: any;
    readonly inherited: boolean;
    constructor(target: SyntheticDOMElement, rule: SyntheticCSSElementStyleRule, overriddenStyleProperties: any, inherited: boolean);
}
export declare function eachMatchingStyleRule(element: SyntheticDOMElement, each: (rule: SyntheticCSSElementStyleRule) => any, filter?: (rule: SyntheticCSSElementStyleRule) => boolean): void;
export declare function eachInheritedMatchingStyleRule(element: SyntheticDOMElement, each: (element: SyntheticDOMElement, rule: SyntheticCSSElementStyleRule | SyntheticHTMLElement) => any, filter?: (rule: SyntheticCSSElementStyleRule) => boolean): void;
export declare function getMatchingCSSStyleRules(target: SyntheticDOMElement): any[];
export declare function isCSSMutation(mutation: any): boolean;
export declare function getCSSFontFaceRules(element: SyntheticDOMElement): SyntheticCSSFontFace[];
