import { parseCSS } from "./parsers";
import { evaluateCSS } from "./evaluate";
import { SyntheticCSSElementStyleRule } from "./style-rule";
import { SyntheticCSSGroupingRule, SyntheticCSSGroupingRuleEditor, SyntheticCSSGroupingRuleEdit } from "./grouping";
import { SyntheticCSSStyle } from "./style";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit,  SyntheticCSSObjectEditor  } from "./base";
import {
  serialize,
  Mutation,
  deserialize,
  serializable,
  ISerializer,
  ITreeWalker,
  ChildMutation,
  PropertyMutation,
  MoveChildMutation,
  SerializedContentType,
  InsertChildMutation,
  RemoveChildMutation,
} from "aerial-common";

import {
  BaseEditor,
  BaseContentEdit,
} from "aerial-sandbox";

import { diffStyleSheetRules } from "./utils";

export namespace SyntheticCSSGroupAtRuleMutationTypes {
  export const SET_NAME_EDIT = "setNameEdit";
}

export function isCSSAtRuleMutaton(mutation: Mutation<SyntheticCSSGroupAtRule>) {
  return !!{
    [SyntheticCSSGroupAtRuleMutationTypes.SET_NAME_EDIT]: true
  }[mutation.type];
}

export interface ISyntheticCSSAtRule {
  atRuleName: string;
  params: string;
  cssText: string;
}

export class SyntheticCSSGroupAtRuleEdit<T extends SyntheticCSSGroupAtRule> extends SyntheticCSSGroupingRuleEdit<T> { }
export class SyntheticCSSGroupAtRuleEditor<T extends SyntheticCSSGroupAtRule>  extends SyntheticCSSGroupingRuleEditor<T> { }

export abstract class SyntheticCSSGroupAtRule extends SyntheticCSSGroupingRule<SyntheticCSSElementStyleRule> implements ISyntheticCSSAtRule {

  abstract atRuleName: string;
  abstract params: string;
  abstract cssText: string;

  constructor(cssRules: SyntheticCSSElementStyleRule[] = []) {
    super(cssRules);
  }

  toString() {
    return this.cssText;
  }

  get innerText() {
    return this.cssRules.map(rule => rule.cssText).join("\n");
  }

  protected abstract cloneShallow();

  countShallowDiffs(target: SyntheticCSSGroupAtRule) {
    return this.params === target.params ? 0 : -1;
  }

  visitWalker(walker: ITreeWalker) {
    this.cssRules.forEach(rule => walker.accept(rule));
  }
}


class SyntheticCSSUnknownAtRuleSerializer implements ISerializer<SyntheticCSSUnknownGroupAtRule, any[]> {
  serialize({ atRuleName, params, cssRules }: SyntheticCSSUnknownGroupAtRule) {
    return [atRuleName, params, cssRules.map(serialize)]
  }
  deserialize([ atRuleName, params, cssRules ], kernel) {
    return new SyntheticCSSUnknownGroupAtRule(atRuleName, params, cssRules.map((cs) => deserialize(cs, kernel)));
  }
}

export class SyntheticCSSUnknownGroupAtRule extends SyntheticCSSGroupAtRule {
  constructor(readonly atRuleName: string, readonly params: string, cssRules: SyntheticCSSElementStyleRule[] = []) {
    super(cssRules);
  }

  get cssText() {
    return `@${this.atRuleName} ${this.params} {\n${this.innerText} }`;
  }

  cloneShallow() {
    return new SyntheticCSSUnknownGroupAtRule(this.atRuleName, this.params);
  }
}