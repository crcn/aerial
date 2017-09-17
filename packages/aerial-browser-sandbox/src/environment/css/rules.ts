import { weakMemo } from "aerial-common2";
import { SEnvCSSObjectInterface } from "./base";
import { getSEnvCSSCollectionClasses } from "./collections";

// https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
export enum CSSRuleType {
  STYLE_RULE, // 1
  CHARSET_RULE,
  IMPORT_RULE,
  MEDIA_RULE,
  FONT_FACE_RULE,
  PAGE_RULE,
  KEYFRAMES_RULE,
  KEYFRAME_RULE,
  __FUTURE_NS,  // 9
  NAMESPACE_RULE,
  COUNTER_STYLE_RULE,
  SUPPORTS_RULE,
  DOCUMENT_RULE,
  FONT_FEATURE_VALUES_RULE,
  VIEWPORT_RULE,
  REGION_STYLE_RULE,
  UNKNOWN_RULE
};

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
    constructor(selectorText: string, style: CSSStyleDeclaration) {
      super();
      this.selectorText = selectorText;
      this.style = style;
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
    readonly style: CSSStyleDeclaration;
    protected cssTextDidChange() {

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
    SEnvCSSFontFace,
    SEnvUnknownGroupingRule
  };
});