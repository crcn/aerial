import { SyntheticCSSElementStyleRule } from "./style-rule";
import { SyntheticCSSStyle } from "./style";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit } from "./base";
import {
  ISerializer,
  serialize,
  deserialize,
  serializable,
  SerializedContentType,
  ITreeWalker,
  ChildMutation,
  Mutation,
  MoveChildMutation,
  PropertyMutation,
  InsertChildMutation,
  RemoveChildMutation,
} from "aerial-common";

import { BaseContentEdit } from "aerial-sandbox";

import { SyntheticCSSGroupAtRule, SyntheticCSSGroupAtRuleEdit } from "./atrule";

export interface ISerializedSyntheticCSSMediaRule {
  media: string[];
  cssRules: Array<SerializedContentType<any>>;
}

class SyntheticCSSMediaRuleSerializer implements ISerializer<SyntheticCSSMediaRule, ISerializedSyntheticCSSMediaRule> {
  serialize({ media, cssRules }: SyntheticCSSMediaRule) {
    return {
      media: media,
      cssRules: cssRules.map(serialize)
    };
  }
  deserialize({ media, cssRules }: ISerializedSyntheticCSSMediaRule, kernel) {
    return new SyntheticCSSMediaRule(media, cssRules.map((cs) => deserialize(cs, kernel)));
  }
}

@serializable("SyntheticCSSMediaRule", new SyntheticCSSObjectSerializer(new SyntheticCSSMediaRuleSerializer()))
export class SyntheticCSSMediaRule extends SyntheticCSSGroupAtRule {
  readonly atRuleName = "media";

  constructor(public media: string[], rules: SyntheticCSSElementStyleRule[]) {
    super(rules);
  }

  get cssText() {
    return `@media ${this.media.join(" ")} {\n${this.innerText}}\n`
  }

  get params() {
    return this.media.join(" ");
  }

  protected cloneShallow() {
    return new SyntheticCSSMediaRule(this.media.concat(), []);
  }

  createEdit() {
    return new SyntheticCSSGroupAtRuleEdit(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.cssRules.forEach(rule => walker.accept(rule));
  }
}