import { atob } from "abab";
import { RawSourceMap } from "source-map";
import { SyntheticCSSFontFace } from "./font-face";
import { evaluateCSS, parseCSS, evaluateCSSSource } from "../..";
import { SyntheticCSSMediaRule } from "./media-rule";
import { SyntheticCSSKeyframesRule } from "./keyframes-rule";
import { SyntheticObjectChangeTypes, BaseEditor } from "@tandem/sandbox";
import { SyntheticCSSElementStyleRule } from "./style-rule";
import { SyntheticCSSGroupingRuleEdit, SyntheticCSSGroupingRuleEditor, SyntheticCSSGroupingRule } from "./grouping";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit, SyntheticCSSObjectEditor } from "./base";

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
} from "@tandem/common";

import { syntheticCSSRuleType, diffStyleSheetRules } from "./utils";

export interface ISerializedCSSStyleSheet {
  rules: Array<SerializedContentType<any>>;
}

class SyntheticCSSStyleSheetSerializer implements ISerializer<SyntheticCSSStyleSheet, ISerializedCSSStyleSheet> {
  serialize(value: SyntheticCSSStyleSheet): ISerializedCSSStyleSheet {
    return {
      rules: value.rules.map(serialize)
    };
  }
  deserialize(value: ISerializedCSSStyleSheet, kernel): SyntheticCSSStyleSheet {
    return new SyntheticCSSStyleSheet(value.rules.map(raw => deserialize(raw, kernel)));
  }
}

export class CSSStyleSheetEditor<T extends SyntheticCSSStyleSheet> extends SyntheticCSSGroupingRuleEditor<T> {
}

// let _smcache = {};
// function parseSourceMaps(value) {
//   if (String(value).indexOf("sourceMappingURL=data") == -1) return undefined;
//   if (_smcache[value]) return _smcache[value];

//   const sourceMappingURL = String(value).match(/sourceMappingURL=(data\:[^\s]+)/)[1];
  

//   // assuming that it's inlined here... shouldn't.
//   return _smcache[value] = JSON.parse(atob(sourceMappingURL.split(",").pop()));
// }

// setInterval(() => _smcache = {}, 1000 * 60);

@serializable("SyntheticCSSStyleSheet", new SyntheticCSSObjectSerializer(new SyntheticCSSStyleSheetSerializer()))
export class SyntheticCSSStyleSheet extends SyntheticCSSGroupingRule<syntheticCSSRuleType> {

  constructor(readonly rules: syntheticCSSRuleType[]) {
    super(rules);
  }

  protected linkRule(rule: syntheticCSSRuleType) {
    super.linkRule(rule);
    rule.$parentStyleSheet = this;
  }

  set cssText(value: string) {
    // let map: RawSourceMap = parseSourceMaps(value);
    this
    .createEdit()
    .fromDiff(evaluateCSSSource(value))
    .applyMutationsTo(this);
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
}