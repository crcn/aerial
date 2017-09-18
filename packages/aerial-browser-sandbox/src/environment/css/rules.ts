import { 
  weakMemo, 
  Mutation,
  createSetValueMutation,
  createPropertyMutation,
} from "aerial-common2";
import { diffCSStyleDeclaration, SEnvCSSStyleDeclaration } from "./declaration";
import { SEnvCSSObjectInterface } from "./base";
import { getSEnvCSSCollectionClasses } from "./collections";
import { CSSRuleType } from "../constants";



export const getSEnvCSSRuleClasses = weakMemo((context: any) => {
  const { SEnvCSSRuleList } =  getSEnvCSSCollectionClasses(context);

  abstract class SEnvCSSRule implements CSSRule, SEnvCSSObjectInterface {
    private _cssText: string;
    readonly CHARSET_RULE: number;
    readonly FONT_FACE_RULE: number;
    readonly IMPORT_RULE: number;
    readonly KEYFRAME_RULE: number;
    readonly KEYFRAMES_RULE: number;
    readonly MEDIA_RULE: number;
    readonly NAMESPACE_RULE: number;
    readonly PAGE_RULE: number;
    readonly STYLE_RULE: number;
    readonly SUPPORTS_RULE: number;
    readonly UNKNOWN_RULE: number;
    readonly VIEWPORT_RULE: number;
    $source: any;

    get cssText() {
      return this._cssText;
    }

    set cssText(value: string) {
      this._cssText = value;
      this.cssTextDidChange();
    }

    protected abstract cssTextDidChange();

    abstract readonly type: number;
    $parentRule: CSSRule;
    $parentStyleSheet: CSSStyleSheet;

    get parentRule() {
      return this.$parentRule;
    }

    get parentStyleSheet() {
      return this.$parentStyleSheet;
    }
  }

  class SEnvCSSStyleRule extends SEnvCSSRule implements CSSStyleRule {
    readonly readOnly: boolean;
    selectorText: string;
    readonly style: CSSStyleDeclaration;
    readonly type = CSSRuleType.STYLE_RULE;
    constructor(selectorText: string, style: SEnvCSSStyleDeclaration) {
      super();
      this.selectorText = selectorText;
      this.style = style;
      style.parentRule = this;
    }
    protected cssTextDidChange() {
      // NOTHING FOR NOW
    }
  }
  
  abstract class SEnvCSSGroupingRule extends SEnvCSSRule implements CSSGroupingRule {
    readonly cssRules: CSSRuleList;
    constructor(rules: CSSRule[] = []) {
      super();
      this.cssRules = new SEnvCSSRuleList(...rules);
    }
    protected cssTextDidChange() {

    }
    deleteRule(index: number): void {
      throw new Error(`Not currently supported`);
    }
    insertRule(rule: string, index: number): number {
      throw new Error(`Not currently supported`);
    }
  }

  class SEnvCSSMediaRule extends SEnvCSSGroupingRule implements CSSMediaRule {
    readonly type = CSSRuleType.MEDIA_RULE;
    readonly media: MediaList;
    conditionText: string;
  }

  class SEnvCSSFontFace extends SEnvCSSRule implements CSSFontFaceRule {
    readonly type = CSSRuleType.FONT_FACE_RULE;
    constructor(readonly style: CSSStyleDeclaration) {
      super();
    }
    protected cssTextDidChange() {

    }
  }

  class SEnvCSSKeyframesRule extends SEnvCSSRule implements CSSKeyframesRule {
    readonly type = CSSRuleType.FONT_FACE_RULE;
    readonly cssRules: CSSRuleList;
    constructor(readonly name: string, rules: CSSRule[] = []) {
      super();
      this.cssRules = new SEnvCSSRuleList(...rules);
    }

    protected cssTextDidChange() {

    }

    appendRule(rule: string) {

    }
    deleteRule(rule: string) {

    }
    findRule(rule: string) {
      return null;
    }
  }

  class SEnvUnknownGroupingRule extends SEnvCSSGroupingRule {
    readonly type = CSSRuleType.UNKNOWN_RULE;
    protected cssTextDidChange() {

    }
  }


  return {
    SEnvCSSStyleRule,
    SEnvCSSMediaRule,
    SEnvCSSKeyframesRule,
    SEnvCSSFontFace,
    SEnvUnknownGroupingRule
  };
});

export const CSS_STYLE_RULE_SET_SELECTOR_TEXT = "STYLE_RULE_SET_SELECTOR_TEXT"; 

const styleRuleSetSelectorText = (rule: CSSStyleRule, selectorText: string) => createSetValueMutation(CSS_STYLE_RULE_SET_SELECTOR_TEXT, rule, selectorText);

const diffStyleRule = (oldRule: CSSStyleRule, newRule: CSSStyleRule) => {
  const mutations = [];

  if (oldRule.selectorText !== newRule.selectorText) {
    throw new Error(`Not implemented yet`);
    // mutations.push(styleRuleSetSelectorText
  }

  mutations.push(...diffCSStyleDeclaration(oldRule.style, newRule.style));

  return mutations;
};


export const diffCSSRule = (oldRule: CSSRule, newRule: CSSRule) => {
  if (oldRule.type === CSSRuleType.STYLE_RULE) {
    return diffStyleRule(oldRule as CSSStyleRule, newRule as CSSStyleRule);
  }
  return [];
};

export const patchCSSRule = (oldRule: CSSRule, mutations: Mutation<any>[]) => {
  console.log("PATCH");
};

export const compareCSSRule = (a: CSSRule, b: CSSRule) => {
  if (a.type !== b.type) {
    return -1;
  }

  if (a.cssText === b.cssText) {
    return 0;
  }

  if (a.type === CSSRuleType.STYLE_RULE) {
    const a2 = a as CSSStyleRule;
    const b2 = b as CSSStyleRule;

    if (a2.selectorText === b2.selectorText) {
      return 0;
    }

    return 1;
  } else if (a.type === CSSRuleType.MEDIA_RULE) {
    
  } else if (a.type === CSSRuleType.FONT_FACE_RULE) {

  } else if (a.type === CSSRuleType.KEYFRAMES_RULE) {
    
  } else if (a.type === CSSRuleType.KEYFRAME_RULE) {

  } else if (a.type === CSSRuleType.UNKNOWN_RULE) {

  }

  return 1;
}