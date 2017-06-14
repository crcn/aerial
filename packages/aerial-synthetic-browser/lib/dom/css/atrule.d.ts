import { SyntheticCSSElementStyleRule } from "./style-rule";
import { SyntheticCSSGroupingRule, SyntheticCSSGroupingRuleEditor, SyntheticCSSGroupingRuleEdit } from "./grouping";
import { Mutation, ITreeWalker } from "aerial-common";
export declare namespace SyntheticCSSGroupAtRuleMutationTypes {
    const SET_NAME_EDIT = "setNameEdit";
}
export declare function isCSSAtRuleMutaton(mutation: Mutation<SyntheticCSSGroupAtRule>): boolean;
export interface ISyntheticCSSAtRule {
    atRuleName: string;
    params: string;
    cssText: string;
}
export declare class SyntheticCSSGroupAtRuleEdit<T extends SyntheticCSSGroupAtRule> extends SyntheticCSSGroupingRuleEdit<T> {
}
export declare class SyntheticCSSGroupAtRuleEditor<T extends SyntheticCSSGroupAtRule> extends SyntheticCSSGroupingRuleEditor<T> {
}
export declare abstract class SyntheticCSSGroupAtRule extends SyntheticCSSGroupingRule<SyntheticCSSElementStyleRule> implements ISyntheticCSSAtRule {
    abstract atRuleName: string;
    abstract params: string;
    abstract cssText: string;
    constructor(cssRules?: SyntheticCSSElementStyleRule[]);
    toString(): string;
    readonly innerText: string;
    protected abstract cloneShallow(): any;
    countShallowDiffs(target: SyntheticCSSGroupAtRule): 0 | -1;
    visitWalker(walker: ITreeWalker): void;
}
export declare class SyntheticCSSUnknownGroupAtRule extends SyntheticCSSGroupAtRule {
    readonly atRuleName: string;
    readonly params: string;
    constructor(atRuleName: string, params: string, cssRules?: SyntheticCSSElementStyleRule[]);
    readonly cssText: string;
    cloneShallow(): SyntheticCSSUnknownGroupAtRule;
}
