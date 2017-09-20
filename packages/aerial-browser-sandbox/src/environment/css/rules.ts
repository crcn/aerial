import { 
  weakMemo, 
  Mutation,
  diffArray,
  SetValueMutation,
  MoveChildMutation,
  InsertChildMutation,
  RemoveChildMutation,
  createInsertChildMutation,
  createRemoveChildMutation,
  createMoveChildMutation,
  eachArrayValueMutation,
  createSetValueMutation,
  createPropertyMutation,
} from "aerial-common2";
import { 
  SyntheticCSSRule, 
  SyntheticCSSStyleRule, 
  SyntheticCSSGroupingRule,
  SyntheticCSSMediaRule,
  SyntheticCSSKeyframeRule,
  SyntheticCSSFontFaceRule,
  SYNTHETIC_CSS_STYLE_RULE,
  SYNTHETIC_CSS_MEDIA_RULE,
  SYNTHETIC_CSS_FONT_FACE_RULE,
  SYNTHETIC_CSS_KEYFRAME_RULE,
  SYNTHETIC_CSS_KEYFRAMES_RULE,
  SyntheticCSSKeyframesRule,
  createSyntheticCSSStyleRule, 
  createSyntheticCSSMediaRule,
  createSyntheticCSSFontFaceRule,
  createSyntheticCSSKeyframeRule,
  createSyntheticCSSKeyframesRule,
  createSyntheticCSSUnknownGroupingRule,
} from "../../state";
import { diffCSStyleDeclaration, SEnvCSSStyleDeclaration, cssStyleDeclarationMutators } from "./declaration";
import { SEnvCSSObjectInterface, getSEnvCSSBaseObjectClass, SEnvCSSObjectParentInterface } from "./base";
import { SEnvCSSStyleSheetInterface } from "./style-sheet";
import { getSEnvCSSCollectionClasses } from "./collections";
import { CSSRuleType } from "../constants";
import { evaluateCSS } from "./utils";

export interface SEnvCSSRuleInterface extends CSSRule, SEnvCSSObjectInterface {
  struct: SyntheticCSSRule;
}

export interface SEnvCSSParentRuleInterface extends SEnvCSSRuleInterface, SEnvCSSObjectParentInterface {
  struct: SyntheticCSSRule;
}

export interface SEnvCSSStyleRuleInterface extends CSSStyleRule, SEnvCSSParentRuleInterface {

}

export interface CSSParentObject {
  cssRules: CSSRuleList;
  deleteRule(index: number): void;
  insertRule(rule: string|CSSRule, index: number): number;
}

export const cssInsertRule = (parent: CSSStyleSheet|CSSGroupingRule, child: string|CSSRule, index: number, context: any) => {
  const styleSheet = parent.type != null ? (parent as CSSGroupingRule).parentStyleSheet : parent as CSSStyleSheet;
  if (typeof child === "string") {
    child = evaluateCSS(child, styleSheet.href, context);
  }
  Array.prototype.splice.call(parent.cssRules, index, 0, child);
  parent["didChange"]();
  return index;
}


export const cssDeleteRule = (parent: CSSStyleSheet|CSSGroupingRule, index: number) => {
  const child = parent.cssRules[index];
  Array.prototype.splice.call(parent.cssRules, index, 1);
  parent["didChange"]();
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
        instance: this,
        style: this.style.struct
      });
    }

    getCSSText() {
      return `${this.selectorText} { ${this.style.cssText} }`;
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
    deleteRule(index: number): void {
      return cssDeleteRule(this, index);
    }
    insertRule(rule: string, index: number): number {
      return cssInsertRule(this, rule, index, context);
    }
  }

  class SEnvCSSMediaRule extends SEnvCSSGroupingRule implements CSSMediaRule {
    readonly type = CSSRuleType.MEDIA_RULE;
    readonly media: MediaList;
    constructor(private _conditionText: string, rules: CSSRule[]) {
      super(rules);
    }

    getCSSText() {
      return `@media ${this.conditionText} { ${Array.prototype.map.call(this.cssRules, rule => rule.cssText).join(" ")} }`;
    }

    $createStruct() {
      return createSyntheticCSSMediaRule({
        $id: this.$id,
        instance: this,
        conditionText: this.conditionText,
        rules: Array.prototype.map.call(this.cssRules, rule => rule.struct)
      });
    }

    get conditionText() {
      return this._conditionText;
    }

    set conditionText(value: string) {
      this._conditionText = value;
      this.didChange();
    }
  }

  class SEnvCSSFontFace extends SEnvCSSRule implements CSSFontFaceRule {
    readonly type = CSSRuleType.FONT_FACE_RULE;
    constructor(readonly style: SEnvCSSStyleDeclaration) {
      super();
    }
    getCSSText() {
      return `@font-face {}`
    }
    $createStruct() {
      return createSyntheticCSSFontFaceRule({
        $id: this.$id,
        instance: this,
        style: this.style.struct,
      });
    }
    protected setCSSText(value: string) {

    }
  }

  class SEnvCSSKeyframeRule extends SEnvCSSRule implements CSSKeyframeRule {
    readonly type = CSSRuleType.KEYFRAME_RULE;
    public style: SEnvCSSStyleDeclaration;

    constructor(private _keyText: string, style: SEnvCSSStyleDeclaration) {
      super();
      this.style = style;
    }

    get keyText() {
      return this._keyText;
    }

    set keyText(value: string) {
      this._keyText = value;
      this.didChange();
    }

    $createStruct() {
      return createSyntheticCSSKeyframeRule({
        $id: this.$id,
        instance: this
      });
    }

    getCSSText() {
      return `${this.keyText} { ${this.style.cssText} }`;
    }
    
    setCSSText(value: string) {
      throw new Error(`Not implemented`);
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
      return createSyntheticCSSKeyframesRule({
        $id: this.$id,
        instance: this,
        rules: Array.prototype.map.call(this.cssRules, rule => rule.struct)
      });
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
      return ``;
    }
    $createStruct() {
      return createSyntheticCSSUnknownGroupingRule({
        $id: this.$id,
        instance: this,
        rules: []
      })
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


export const CSS_PARENT_INSERT_RULE = "CSS_PARENT_INSERT_RULE";
export const CSS_PARENT_DELETE_RULE = "CSS_PARENT_DELETE_RULE";
export const CSS_PARENT_MOVE_RULE   = "CSS_PARENT_MOVE_RULE";

export const cssParentInsertRule = (parent: CSSParentObject, rule: CSSRule, newIndex: number) => createInsertChildMutation(CSS_PARENT_INSERT_RULE, parent, rule, newIndex);

export const cssParentDeleteRule = (parent: CSSParentObject, rule: CSSRule, newIndex: number, index?: number) => createRemoveChildMutation(CSS_PARENT_DELETE_RULE, parent, rule, index);

export const cssParentMoveRule = (parent: CSSParentObject, rule: CSSRule, newIndex: number, oldIndex: number) => createMoveChildMutation(CSS_PARENT_MOVE_RULE, parent, rule, newIndex, oldIndex);

export const diffCSSParentObject = (oldParent: CSSParentObject, newParent: CSSParentObject) => {
  const mutations = [];

  const oldSheetRules = Array.prototype.slice.call(oldParent.cssRules) as CSSRule[];
  const diffs = diffArray(oldSheetRules, Array.prototype.slice.call(newParent.cssRules) as CSSRule[], compareCSSRule);

  eachArrayValueMutation(diffs, {
    insert({ value, index }) {
      mutations.push(cssParentInsertRule(oldParent, value, index));
    },
    delete({ value, index }) {
      mutations.push(cssParentDeleteRule(oldParent, value, index));
    },
    update({ newValue, patchedOldIndex, index, originalOldIndex }) {
      if (patchedOldIndex !== index) { 
        mutations.push(cssParentMoveRule(oldParent, newValue, index, patchedOldIndex));
      }
      mutations.push(...diffCSSRule(oldSheetRules[originalOldIndex], newValue));
    }
  });

  return mutations;
};


export const CSS_MEDIA_RULE_SET_CONDITION_TEXT = "CSS_MEDIA_RULE_SET_CONDITION_TEXT"; 

const mediaRuleSetConditionText = (rule: CSSMediaRule, conditionText: string) => createSetValueMutation(CSS_MEDIA_RULE_SET_CONDITION_TEXT, rule, conditionText);


const diffMediaRule = (oldRule: CSSMediaRule, newRule: CSSMediaRule) => {
  const mutations = [];
  if (oldRule.conditionText !== newRule.conditionText) {
    mutations.push(mediaRuleSetConditionText(oldRule, newRule.conditionText))
  }
  mutations.push(...diffCSSParentObject(oldRule, newRule));
  return mutations;
}

export const diffCSSRule = (oldRule: CSSRule, newRule: CSSRule) => {
  if (oldRule.type === CSSRuleType.STYLE_RULE) {
    return diffStyleRule(oldRule as CSSStyleRule, newRule as CSSStyleRule);
  } else if (oldRule.type === CSSRuleType.MEDIA_RULE) {
    return diffMediaRule(oldRule as CSSMediaRule, newRule as CSSMediaRule);
  }
  return [];
};

export const cssStyleRuleMutators = {
  ...cssStyleDeclarationMutators,
  [CSS_STYLE_RULE_SET_SELECTOR_TEXT]: (target: CSSStyleRule, mutation: SetValueMutation<any>) => {
    target.selectorText = mutation.newValue;
  }
}

export const cssMediaRuleMutators = {
  [CSS_MEDIA_RULE_SET_CONDITION_TEXT](target: CSSMediaRule, mutation: SetValueMutation<any>) {
    target.conditionText = mutation.newValue;
  }
}

export const cssRuleMutators = {
  ...cssStyleRuleMutators,
  ...cssMediaRuleMutators
};

export const cssParentMutators = {
  ...cssRuleMutators,
  [CSS_PARENT_INSERT_RULE](target: CSSParentObject, mutation: InsertChildMutation<any, CSSRule>) {
    target.insertRule(mutation.child.cssText, mutation.index);
  },
  [CSS_PARENT_MOVE_RULE](target: CSSParentObject, mutation: MoveChildMutation<any, CSSRule>) {
    const child = target.cssRules[mutation.oldIndex];
    target.deleteRule(mutation.oldIndex);
    target.insertRule(child, mutation.index);
  },
  [CSS_PARENT_DELETE_RULE](target: CSSParentObject, mutation: RemoveChildMutation<any, CSSRule>) {
    target.deleteRule(mutation.index);
  }
};

export const flattenCSSRuleSources = weakMemo((rule: SyntheticCSSRule) => {
  const flattened: any = { [rule.$id]: rule.instance };
  if (rule.$type === SYNTHETIC_CSS_STYLE_RULE) {
    const styleRule = rule as SyntheticCSSStyleRule;
    flattened[styleRule.style.$id] = styleRule.style.instance;
  } else if (rule.$type === SYNTHETIC_CSS_FONT_FACE_RULE) {
    const styleRule = rule as SyntheticCSSFontFaceRule;
    flattened[styleRule.style.$id] = styleRule.style.instance;
  } else if (rule["rules"]) {
    const groupingRule = rule as SyntheticCSSGroupingRule;
    for (let i = groupingRule.rules.length; i--;) {
      Object.assign(flattened, flattenCSSRuleSources(groupingRule.rules[i]));
    }
  } else {
    throw new Error(`Cannot flatten ${rule.$type}`);
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