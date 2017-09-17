import { parseCSS, evaluateCSS } from "./utils";
import { weakMemo } from "aerial-common2";
import {  getSEnvCSSCollectionClasses } from "./collections";
import { SEnvCSSObjectInterface } from "./base";

export const getSEnvCSSStyleSheetClass = weakMemo((context: any) => {
  const { SEnvCSSRuleList } =  getSEnvCSSCollectionClasses(context);
  return class SEnvCSSSytyleSheet implements CSSStyleSheet,  SEnvCSSObjectInterface {
    disabled: boolean;
    $source: any;
    private _rules: CSSRuleList;
    readonly href: string;
    readonly media: MediaList;
    readonly ownerNode: Node;
    readonly parentStyleSheet: StyleSheet;
    readonly title: string;
    readonly type: string;
    private _cssText: string;
    readonly id: string;
    readonly imports: StyleSheetList;
    readonly isAlternate: boolean;
    readonly isPrefAlternate: boolean;
    readonly ownerRule: CSSRule;
    readonly owningElement: Element;
    readonly pages: StyleSheetPageList;
    readonly readOnly: boolean;

    constructor(rules: CSSRule[] = []) {
      this._reset(rules);
    }
    
    get cssText() {
      return this._cssText;
    }

    get rules(): CSSRuleList {
      return this._rules;
    }

    get cssRules(): CSSRuleList {
      return this._rules;
    }

    set cssText(value: string) {
      this._cssText = value;
      const styleSheet = evaluateCSS(value, this.href, context);
      this._reset(styleSheet.cssRules);
    }

    private _reset(rules: CSSRule[] = []) {
      this._rules = new SEnvCSSRuleList(...rules);
    }
    
    addImport(bstrURL: string, lIndex?: number): number {
      throw new Error(`not currently supported`);
    }
    addPageRule(bstrSelector: string, bstrStyle: string, lIndex?: number): number {
      throw new Error(`not currently supported`);
    }
    addRule(bstrSelector: string, bstrStyle?: string, lIndex?: number): number {
      throw new Error(`not currently supported`);
    }
    deleteRule(index?: number): void {
      throw new Error(`not currently supported`);
    }
    insertRule(rule: string, index?: number): number {
      throw new Error(`not currently supported`);
    }
    removeImport(lIndex: number): void {
      throw new Error(`not currently supported`);
    }
    removeRule(lIndex: number): void {
      throw new Error(`not currently supported`);
    }
  }
});