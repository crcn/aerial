import { atob } from "abab";
import { weakMemo } from "aerial-common2";
import { parseCSS } from "./parsers";
import { RawSourceMap } from "source-map";
import { SyntheticCSSFontFace } from "./font-face";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { SyntheticCSSElementStyleRule } from "./style-rule";
import { evaluateCSS, evaluateCSSSource } from "./evaluate";
import { SyntheticObjectChangeTypes, BaseEditor } from "aerial-sandbox";
import { 
  SyntheticCSSGroupingRuleEdit, 
  SyntheticCSSGroupingRuleEditor, 
  SyntheticCSSGroupingRule 
} from "./grouping";
import { 
  SyntheticCSSObject, 
  SyntheticCSSObjectEdit, 
  SyntheticCSSObjectEditor, 
  SyntheticCSSObjectSerializer, 
} from "./base";

import {
  serialize,
  Mutation,
  diffArray,
  deserialize,
  ITreeWalker,
  ISerializer,
  serializable,
  ISourceLocation,
  MoveChildMutation,
  SerializedContentType,
  RemoveChildMutation,
  InsertChildMutation,
} from "aerial-common";

import { syntheticCSSRuleType, diffStyleSheetRules } from "./utils";

export interface ISerializedCSSStyleSheet {
  rules: Array<SerializedContentType<any>>;
}

// class SyntheticCSSStyleSheetSerializer implements ISerializer<SyntheticCSSStyleSheet, ISerializedCSSStyleSheet> {
//   serialize(value: SyntheticCSSStyleSheet): ISerializedCSSStyleSheet {
//     return {
//       rules: value.rules.map(serialize)
//     };
//   }
//   deserialize(value: ISerializedCSSStyleSheet, kernel): SyntheticCSSStyleSheet {
//     return new SyntheticCSSStyleSheet(value.rules.map(raw => deserialize(raw, kernel)));
//   }
// }

// export class CSSStyleSheetEditor<T extends SyntheticCSSStyleSheet> extends SyntheticCSSGroupingRuleEditor<T> { }


export const getSEnvCSSStyleSheetClass = weakMemo((context: any) => {
  return class SyntheticCSSStyleSheet extends SyntheticCSSGroupingRule<syntheticCSSRuleType> implements CSSStyleSheet {

    constructor(readonly rules: syntheticCSSRuleType[]) {
      super(rules);
    }

    protected linkRule(rule: syntheticCSSRuleType) {
      super.linkRule(rule);
      // rule.$parentStyleSheet = this;
    }

    set cssText(value: string) {
      // let map: RawSourceMap = parseSourceMaps(value);
      // this
      // .createEdit()
      // .fromDiff(evaluateCSSSource(SyntheticCSSStyleSheet)(value))
      // .applyMutationsTo(this);
    }

    regenerateUID() {
      super.regenerateUID();
      for (const rule of this.rules) {
        rule.regenerateUID();
      }
      return this;
    }

    addImport(bstrURL: string, lIndex?: number): number {
      // TODO -
      return -1;
    }

    get cssText() {
      return this.rules.map((rule) => rule.cssText).join("\n");
    }

    toString() {
      return this.cssText;
    }

    countShallowDiffs(target: SyntheticCSSStyleSheet) {

      // This condition won't work as well for cases where the stylesheet is defined
      // by some other code such as <style /> blocks. It *will* probably break if the source
      // that instantiated this SyntheticCSSStyleSheet instance maintains a reference to it. Though, that's
      // a totally different problem that needs to be resolved.
      if (target.source.uri === this.source.uri) return 0;

      return diffStyleSheetRules(this.rules, target.rules).count;
    }

    protected cloneShallow() {
      return new SyntheticCSSStyleSheet([]);
    }

    visitWalker(walker: ITreeWalker) {
      this.rules.forEach((rule) => walker.accept(rule));
    }


    readonly cssRules: CSSRuleList;
    readonly id: string;
    readonly imports: StyleSheetList;
    readonly isAlternate: boolean;
    readonly isPrefAlternate: boolean;
    readonly ownerRule: CSSRule;
    readonly owningElement: Element;
    readonly pages: StyleSheetPageList;
    readonly readOnly: boolean;
    addPageRule(bstrSelector: string, bstrStyle: string, lIndex?: number): number;
    addRule(bstrSelector: string, bstrStyle?: string, lIndex?: number): number;
    deleteRule(index?: number): void;
    insertRule(rule: string, index?: number): number;
    removeImport(lIndex: number): void;
    removeRule(lIndex: number): void;
  }  
});