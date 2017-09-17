import { weakMemo } from "aerial-common2"
import { getSEnvCollection } from "../base";

export const  getSEnvCSSCollectionClasses = weakMemo((context:any) => {
  const Collection = getSEnvCollection(context);
  class SEnvCSSRuleList extends Collection<CSSRule> implements CSSRuleList {
    item(index: number): CSSRule {
      return this[index];
    }
  }
  return {
    SEnvCSSRuleList
  };
}); 