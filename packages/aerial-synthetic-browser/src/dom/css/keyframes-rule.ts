import { SyntheticCSSElementStyleRule } from "./style-rule";
import { SyntheticCSSStyle } from "./style";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import { BaseContentEdit } from "aerial-sandbox";
import {
  ISerializer,
  deserialize,
  serializable,
  Mutation,
  PropertyMutation,
  serialize,
  diffArray,
  SerializedContentType,
  ITreeWalker
} from "aerial-common";
import { SyntheticCSSGroupAtRule, SyntheticCSSGroupAtRuleEdit, SyntheticCSSGroupAtRuleMutationTypes } from "./atrule";

export interface ISerializedSyntheticCSSKeyframesRule {
  name: string;
  cssRules: Array<SerializedContentType<any>>;
}

class SyntheticCSSKeyframesRuleSerializer implements ISerializer<SyntheticCSSKeyframesRule, ISerializedSyntheticCSSKeyframesRule> {
  serialize({ name, cssRules }: SyntheticCSSKeyframesRule) {
    return {
      name: name,
      cssRules: cssRules.map(serialize)
    };
  }
  deserialize({ name, cssRules }: ISerializedSyntheticCSSKeyframesRule, kernel) {
    return new SyntheticCSSKeyframesRule(name, cssRules.map((cs) => deserialize(cs, kernel)));
  }
}

export class SyntheticCSSKeyframesRuleEdit extends SyntheticCSSGroupAtRuleEdit<SyntheticCSSKeyframesRule> {
  setName(value: string) {
    this.addChange(new PropertyMutation(SyntheticCSSGroupAtRuleMutationTypes.SET_NAME_EDIT, this.target, "name", value));
  }
  addDiff(newAtRule: SyntheticCSSKeyframesRule) {
    if (this.target.name !== newAtRule.name) {
      this.setName(newAtRule.name);
    }
    return super.addDiff(newAtRule);
  }
}

@serializable("SyntheticCSSKeyframesRule", new SyntheticCSSObjectSerializer(new SyntheticCSSKeyframesRuleSerializer()))
export class SyntheticCSSKeyframesRule extends SyntheticCSSGroupAtRule {
  readonly atRuleName: string = "keyframes";

  constructor(public name: string, rules: SyntheticCSSElementStyleRule[]) {
    super(rules);
  }
  

  get params() {
    return this.name;
  }

  get cssText() {
    return `@keyframes ${this.name} {
      ${this.innerText}
    }`
  }

  protected cloneShallow() {
    return new SyntheticCSSKeyframesRule(this.name, []);
  }

  createEdit() {
    return new SyntheticCSSKeyframesRuleEdit(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.cssRules.forEach(rule => walker.accept(rule));
  }
}