import { 
  weakMemo, 
  Mutation,
  SetValueMutation,
  createSetValueMutation,
  createPropertyMutation,
} from "aerial-common2";
import { SyntheticCSSRule, SyntheticCSSStyleRule, createSyntheticCSSStyleRule, SYNTHETIC_CSS_STYLE_RULE } from "../../state";
import { diffCSStyleDeclaration, SEnvCSSStyleDeclaration, cssStyleDeclarationMutators } from "./declaration";
import { SEnvCSSObjectInterface, getSEnvCSSBaseObjectClass, SEnvCSSObjectParentInterface } from "./base";
import { SEnvCSSStyleSheetInterface } from "./style-sheet";
import { getSEnvCSSCollectionClasses } from "./collections";
import { CSSRuleType } from "../constants";

export interface SEnvCSSRuleInterface extends CSSRule, SEnvCSSObjectInterface {
  struct: SyntheticCSSRule;
}

export interface SEnvCSSParentRuleInterface extends SEnvCSSRuleInterface, SEnvCSSObjectParentInterface {
  struct: SyntheticCSSRule;
}

export interface SEnvCSSStyleRuleInterface extends CSSStyleRule, SEnvCSSParentRuleInterface {

}


export const getSEnvCSSRuleClasses = weakMemo((context: any) => {
  const { SEnvCSSRuleList } =  getSEnvCSSCollectionClasses(context);
  const SEnvBaseObjectClass = getSEnvCSSBaseObjectClass(context);

  abstract class SEnvCSSRule extends SEnvBaseObjectClass implements SEnvCSSRuleInterface {
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
    struct: SyntheticCSSRule;

    get cssText() {
      return this.getCSSText();
    }

    set cssText(value: string) {
      this.setCSSText(value);
      this._struct = undefined;
      // TODO - notify parent rune
    }

    protected abstract setCSSText(value: string);
    protected abstract getCSSText();

    abstract readonly type: number;
    $parentRule: SEnvCSSParentRuleInterface;
    $parentStyleSheet: SEnvCSSStyleSheetInterface;

    get parentRule() {
      return this.$parentRule;
    }

    get parentStyleSheet() {
      return this.$parentStyleSheet;
    }

    protected didChange() {

      // cache already cleared -- stop bubbling
      if (!this._struct) {
        return;
      }

      if (this.parentRule) {
        this.parentRule.childDidChange();
      } else if (this.parentStyleSheet) {
        this.parentStyleSheet.childDidChange();
      }
    }
  }

  abstract class SEnvCSSStyleParentRule extends SEnvCSSRule implements SEnvCSSParentRuleInterface {
    childDidChange() {
      this.didChange(); // bubble it
    }
  }

  class SEnvCSSStyleRule extends SEnvCSSStyleParentRule implements SEnvCSSStyleRuleInterface {
    readonly readOnly: boolean;
    private _selectorText: string;
    get selectorText() {
      return this._selectorText;
    }
    set selectorText(value: string) {
      this._selectorText = value;
      this.didChange();
    }
    readonly style: SEnvCSSStyleDeclaration;
    readonly type = CSSRuleType.STYLE_RULE;
    constructor(selectorText: string, style: SEnvCSSStyleDeclaration) {
      super();
      this.selectorText = selectorText;
      this.style = style;
      style.parentRule = this;
    }
    $createStruct() {
      return createSyntheticCSSStyleRule({
        $id: this.$id,
        source: this,
        style: this.style.struct
      });
    }

    getCSSText() {
      return `${this.selectorText} { 
        ${this.style.cssText}
      }`;
    }

    protected setCSSText(value: string) {
      // NOTHING FOR NOW
    }
  }
  
  abstract class SEnvCSSGroupingRule extends SEnvCSSStyleParentRule implements CSSGroupingRule {
    readonly cssRules: CSSRuleList;
    constructor(rules: CSSRule[] = []) {
      super();
      this.cssRules = new SEnvCSSRuleList(...rules);
    }
    getCSSText() {
      return null;
    }
    protected setCSSText(value: string) {

    }
    $createStruct() {
      return null;
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
    getCSSText() {
      return `@font-face {}`
    }
    $createStruct() {
      return null;
    }
    protected setCSSText(value: string) {

    }
  }

  class SEnvCSSKeyframesRule extends SEnvCSSRule implements CSSKeyframesRule {
    readonly type = CSSRuleType.FONT_FACE_RULE;
    readonly cssRules: CSSRuleList;
    constructor(readonly name: string, rules: CSSRule[] = []) {
      super();
      this.cssRules = new SEnvCSSRuleList(...rules);
    }

    $createStruct() {
      return null;
    }
    protected getCSSText() {
      return `@keyframes ${this.name} { }`;
    }

    protected setCSSText(value: string) {

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
    getCSSText() {
      return null;
    }
    protected setCSSText(value: string) {

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
    mutations.push(styleRuleSetSelectorText(oldRule, newRule.selectorText));
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

export const cssStyleRuleMutators = {
  ...cssStyleDeclarationMutators,
  [CSS_STYLE_RULE_SET_SELECTOR_TEXT]: (target: CSSStyleRule, mutation: SetValueMutation<any>) => {
    target.selectorText = mutation.newValue;
  }
}

export const cssRuleMutators = {
  ...cssStyleRuleMutators
};

export const flattenCSSRuleSources = weakMemo((rule: SyntheticCSSRule) => {
  const flattened: any = { [rule.$id]: rule.source };
  if (rule.$type === SYNTHETIC_CSS_STYLE_RULE) {
    const styleRule = rule as SyntheticCSSStyleRule;
    flattened[styleRule.style.$id] = styleRule.style.source;
  } else {
    throw new Error(`Unable to flatten ${rule.$type}`);
  }
  return flattened;
});

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