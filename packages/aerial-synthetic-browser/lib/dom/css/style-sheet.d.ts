import { SyntheticCSSGroupingRuleEditor, SyntheticCSSGroupingRule } from "./grouping";
import { ITreeWalker, SerializedContentType } from "aerial-common";
import { syntheticCSSRuleType } from "./utils";
export interface ISerializedCSSStyleSheet {
    rules: Array<SerializedContentType<any>>;
}
export declare class CSSStyleSheetEditor<T extends SyntheticCSSStyleSheet> extends SyntheticCSSGroupingRuleEditor<T> {
}
export declare class SyntheticCSSStyleSheet extends SyntheticCSSGroupingRule<syntheticCSSRuleType> {
    readonly rules: syntheticCSSRuleType[];
    constructor(rules: syntheticCSSRuleType[]);
    protected linkRule(rule: syntheticCSSRuleType): void;
    cssText: string;
    regenerateUID(): this;
    addImport(bstrURL: string, lIndex?: number): number;
    toString(): string;
    countShallowDiffs(target: SyntheticCSSStyleSheet): number;
    protected cloneShallow(): SyntheticCSSStyleSheet;
    visitWalker(walker: ITreeWalker): void;
}
