import { SyntheticCSSElementStyleRule } from "./style-rule";
import { SerializedContentType, ITreeWalker } from "aerial-common";
import { SyntheticCSSGroupAtRule, SyntheticCSSGroupAtRuleEdit } from "./atrule";
export interface ISerializedSyntheticCSSKeyframesRule {
    name: string;
    cssRules: Array<SerializedContentType<any>>;
}
export declare class SyntheticCSSKeyframesRuleEdit extends SyntheticCSSGroupAtRuleEdit<SyntheticCSSKeyframesRule> {
    setName(value: string): void;
    addDiff(newAtRule: SyntheticCSSKeyframesRule): this;
}
export declare class SyntheticCSSKeyframesRule extends SyntheticCSSGroupAtRule {
    name: string;
    readonly atRuleName: string;
    constructor(name: string, rules: SyntheticCSSElementStyleRule[]);
    readonly params: string;
    readonly cssText: string;
    protected cloneShallow(): SyntheticCSSKeyframesRule;
    createEdit(): SyntheticCSSKeyframesRuleEdit;
    visitWalker(walker: ITreeWalker): void;
}
