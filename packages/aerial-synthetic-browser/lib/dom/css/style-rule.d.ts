import { SyntheticDOMElement } from "..";
import { BaseEditor } from "aerial-sandbox";
import { SyntheticCSSStyle } from "./style";
import { SyntheticCSSObject, SyntheticCSSObjectEdit } from "./base";
import { Mutation, Metadata, ITreeWalker, PropertyMutation, SetValueMutation } from "aerial-common";
export declare namespace SyntheticCSSStyleRuleMutationTypes {
    const SET_DECLARATION = "setDeclaration";
}
export declare function isCSSStyleRuleMutation(mutation: Mutation<SyntheticCSSStyleRule>): boolean;
export declare class SyntheticCSSStyleRuleEdit<T extends SyntheticCSSStyleRule> extends SyntheticCSSObjectEdit<T> {
    setDeclaration(name: string, value: string, oldName?: string, index?: number): PropertyMutation<T>;
    addDiff(newRule: T): this;
}
export declare class CSSStyleRuleEditor extends BaseEditor<CSSStyleRule | SyntheticCSSStyleRule> {
    applySingleMutation(mutation: Mutation<any>): void;
}
export declare class SyntheticCSSStyleRuleEditor extends BaseEditor<SyntheticCSSStyleRule> {
    applyMutations(mutations: Mutation<SyntheticCSSStyleRule>[]): void;
}
export declare abstract class SyntheticCSSStyleRule extends SyntheticCSSObject {
    style: SyntheticCSSStyle;
    private _metadata;
    private _metadataObserver;
    constructor(style: SyntheticCSSStyle);
    readonly metadata: Metadata;
    createEdit(): SyntheticCSSStyleRuleEdit<this>;
    toString(): string;
    abstract cssText: string;
    createEditor(): SyntheticCSSStyleRuleEditor;
    protected abstract cloneShallow(): any;
    abstract countShallowDiffs(target: SyntheticCSSStyleRule): number;
    visitWalker(walker: ITreeWalker): void;
    private _onMetadataEvent(event);
}
export declare namespace SyntheticCSSElementStyleRuleMutationTypes {
    const SET_DECLARATION = "setDeclaration";
    const SET_RULE_SELECTOR = "setRuleSelector";
}
export declare function isCSSSElementtyleRuleMutation(mutation: Mutation<SyntheticCSSStyleRule>): boolean;
export declare class SyntheticCSSElementStyleRuleEdit<T extends SyntheticCSSElementStyleRule> extends SyntheticCSSStyleRuleEdit<T> {
    setSelector(selector: string): SetValueMutation<T>;
    addDiff(newRule: T): this;
}
export declare class SyntheticCSSElementStyleRule extends SyntheticCSSStyleRule {
    selector: string;
    constructor(selector: string, style: SyntheticCSSStyle);
    readonly cssText: string;
    createEdit(): SyntheticCSSElementStyleRuleEdit<this>;
    protected cloneShallow(): SyntheticCSSElementStyleRule;
    matchesElement(element: SyntheticDOMElement): any;
    countShallowDiffs(target: SyntheticCSSElementStyleRule): number;
}
