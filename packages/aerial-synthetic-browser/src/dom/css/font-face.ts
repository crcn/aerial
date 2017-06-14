import { SyntheticCSSStyleRule } from "./style-rule";
import { BaseContentEdit } from "@tandem/sandbox";
import { SyntheticCSSStyle } from "./style";
import { SyntheticCSSGroupAtRule, ISyntheticCSSAtRule } from "./atrule";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import {
  Mutation,
  serialize,
  ITreeWalker,
  ISerializer,
  deserialize,
  serializable,
  SerializedContentType,
} from "aerial-common";

export interface ISerializedSyntheticCSSFontFace {
  style: SerializedContentType<any>;
}

class SyntheticCSSFontFaceSerializer implements ISerializer<SyntheticCSSFontFace, Object> {
  serialize({ style }: SyntheticCSSFontFace) {
    return serialize(style);
  }
  deserialize(style, kernel) {
    return new SyntheticCSSFontFace(deserialize(style, kernel));
  }
}

@serializable("SyntheticCSSFontFace", new SyntheticCSSObjectSerializer(new SyntheticCSSFontFaceSerializer()))
export class SyntheticCSSFontFace extends SyntheticCSSStyleRule implements ISyntheticCSSAtRule {

  readonly atRuleName = "font-face";

  constructor(style: SyntheticCSSStyle) {
    super(style);
  }

  get params() {
    return "";
  }

  get cssText() {
    return `@font-face {
      ${this.style.cssText}
    }`;
  }

  cloneShallow() {
    return new SyntheticCSSFontFace(new SyntheticCSSStyle());
  }

  countShallowDiffs(target: SyntheticCSSFontFace) {
    return this.cssText === target.cssText ? 0 : -1;
  }
}