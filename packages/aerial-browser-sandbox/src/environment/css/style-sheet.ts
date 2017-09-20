import { parseCSS, evaluateCSS } from "./utils";
import { SyntheticCSSStyleSheet, createSyntheticCSSStyleSheet, SYNTHETIC_CSS_STYLE_SHEET } from "../../state";
import { CSSRuleType } from "../constants";
import { compareCSSRule, diffCSSRule, flattenCSSRuleSources, cssRuleMutators, diffCSSParentObject, cssParentMutators, cssInsertRule, cssDeleteRule } from "./rules";
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
import { SEnvCSSObjectInterface, getSEnvCSSBaseObjectClass } from "./base";

export interface SEnvCSSStyleSheetInterface extends CSSStyleSheet, SEnvCSSObjectInterface {
  struct: SyntheticCSSStyleSheet;
  childDidChange();
}

export const getSEnvCSSStyleSheetClass = weakMemo((context: any) => {
  const { SEnvCSSRuleList } =  getSEnvCSSCollectionClasses(context);
  const SEnvCSSBaseObject = getSEnvCSSBaseObjectClass(context);
  return class SEnvCSSSytyleSheet extends SEnvCSSBaseObject implements SEnvCSSStyleSheetInterface {
    disabled: boolean;
    private _rules: CSSRuleList;
    readonly href: string;
    readonly media: MediaList;
    readonly ownerNode: Node;
    readonly parentStyleSheet: StyleSheet;
    readonly title: string;
    readonly type: string;
    readonly id: string;
    readonly imports: StyleSheetList;
    readonly isAlternate: boolean;
    readonly isPrefAlternate: boolean;
    readonly ownerRule: CSSRule;
    readonly owningElement: Element;
    readonly pages: StyleSheetPageList;
    readonly readOnly: boolean;
    struct: SyntheticCSSStyleSheet;

    constructor(rules: CSSRule[] = []) {
      super();
      this._reset(rules);
    }

    get cssText() {
      return Array.prototype.map.call(this.cssRules, rule => rule.cssText).join(" \n");
    }

    get rules(): CSSRuleList {
      return this._rules;
    }

    get cssRules(): CSSRuleList {
      return this._rules;
    }

    $createStruct(): SyntheticCSSStyleSheet {
      return createSyntheticCSSStyleSheet({ 
        $id: this.$id,
        instance: this,
        cssRules: Array.prototype.map.call(this.cssRules, ((rule: SEnvCSSObjectInterface) => rule.struct))
      });
    }

    childDidChange() {
      this._struct = undefined;
    }

    set cssText(value: string) {
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
      return cssDeleteRule(this, index);
    }
    insertRule(rule: string|CSSRule, index?: number): number {
      return cssInsertRule(this, rule, index, context);
    }
    removeImport(lIndex: number): void {
      throw new Error(`not currently supported`);
    }
    removeRule(lIndex: number): void {
      return cssDeleteRule(this, lIndex);
    }
    didChange() {

    }
  }
});

export const STYLE_SHEET_INSERT_RULE = "STYLE_SHEET_INSERT_RULE";
export const STYLE_SHEET_DELETE_RULE = "STYLE_SHEET_DELETE_RULE";
export const STYLE_SHEET_MOVE_RULE   = "STYLE_SHEET_MOVE_RULE";

export const cssStyleSheetMutators = {
  ...cssParentMutators,
  // [STYLE_SHEET_INSERT_RULE]: ()
}

export const styleSheetInsertRule = (styleSheet: CSSStyleSheet, rule: CSSRule, newIndex: number) => createInsertChildMutation(STYLE_SHEET_MOVE_RULE, styleSheet, rule, newIndex);

export const styleSheetDeleteRule = (styleSheet: CSSStyleSheet, rule: CSSRule, newIndex: number, index?: number) => createRemoveChildMutation(STYLE_SHEET_MOVE_RULE, styleSheet, rule, index);

export const styleSheetMoveRule = (styleSheet: CSSStyleSheet, rule: CSSRule, newIndex: number, oldIndex: number) => createMoveChildMutation(STYLE_SHEET_MOVE_RULE, styleSheet, rule, newIndex, oldIndex);

export const diffCSSStyleSheet = (oldSheet: CSSStyleSheet, newSheet: CSSStyleSheet) => {
  return diffCSSParentObject(oldSheet, newSheet);
}

export const flattenSyntheticCSSStyleSheetSources = weakMemo((sheet: SyntheticCSSStyleSheet): { [identifier: string]: SEnvCSSObjectInterface } => {
  const flattened = { [sheet.$id]: sheet.instance };
  for (let i = 0, n = sheet.cssRules.length; i < n; i++) {
    Object.assign(flattened, flattenCSSRuleSources(sheet.cssRules[i]));
  }
  return flattened;
});

export const patchCSSStyleSheet = (target: SEnvCSSObjectInterface, mutation: Mutation<any>) => {
  const mutate = cssStyleSheetMutators[mutation.$type] as any as (target: SEnvCSSObjectInterface, mutation: Mutation<any>) => any;

  if (!mutate) {
    throw new Error(`Cannot apply mutation ${mutation.$type} on CSS object`);
  }
  return mutate(target, mutation);
}
