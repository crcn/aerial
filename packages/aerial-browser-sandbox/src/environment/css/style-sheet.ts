import { parseCSS, evaluateCSS } from "./utils";
import { compareCSSRule, diffCSSRule, patchCSSRule } from "./rules";
import { 
  weakMemo, 
  Mutation, 
  diffArray, 
  patchArray, 
  eachArrayValueMutation,
  createSetValueMutation,
  createRemoveChildMutation,
  createMoveChildMutation,
  createInsertChildMutation,
} from "aerial-common2";
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

export const STYLE_SHEET_INSERT_RULE = "STYLE_SHEET_INSERT_RULE";
export const STYLE_SHEET_DELETE_RULE = "STYLE_SHEET_DELETE_RULE";
export const STYLE_SHEET_MOVE_RULE   = "STYLE_SHEET_MOVE_RULE";

export const styleSheetInsertRule = (styleSheet: CSSStyleSheet, rule: CSSRule, newIndex: number) => createInsertChildMutation(STYLE_SHEET_MOVE_RULE, styleSheet, rule, newIndex);

export const styleSheetDeleteRule = (styleSheet: CSSStyleSheet, rule: CSSRule, newIndex: number, index?: number) => createRemoveChildMutation(STYLE_SHEET_MOVE_RULE, styleSheet, rule, index);

export const styleSheetMoveRule = (styleSheet: CSSStyleSheet, rule: CSSRule, newIndex: number, oldIndex: number) => createMoveChildMutation(STYLE_SHEET_MOVE_RULE, styleSheet, rule, newIndex, oldIndex);

export const diffCSSStyleSheet = (oldSheet: CSSStyleSheet, newSheet: CSSStyleSheet) => {
  const oldSheetRules = Array.prototype.slice.call(oldSheet.cssRules) as CSSRule[];
  const diffs = diffArray(oldSheetRules, Array.prototype.slice.call(newSheet.cssRules) as CSSRule[], compareCSSRule);

  const mutations = [];

  eachArrayValueMutation(diffs, {
    insert({ value, index }) {
      mutations.push(styleSheetInsertRule(oldSheet, value, index));
    },
    delete({ value, index }) {
      mutations.push(styleSheetInsertRule(oldSheet, value, index));
    },
    update({ newValue, patchedOldIndex, index, originalOldIndex }) {
      if (patchedOldIndex !== index) { 
        mutations.push(styleSheetMoveRule(oldSheet, newValue, index, patchedOldIndex));
      }
      mutations.push(...diffCSSRule(oldSheetRules[originalOldIndex], newValue));
    }
  });

  return mutations;
}

export const patchCSSStyleSheet = (oldSheet: CSSStyleSheet, mutations: Mutation<any>[]) => {
  console.log(mutations);
}