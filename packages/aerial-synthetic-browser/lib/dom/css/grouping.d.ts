import { Mutation, InsertChildMutation, RemoveChildMutation, MoveChildMutation } from "aerial-common";
import { syntheticCSSRuleType } from "./utils";
import { BaseEditor } from "aerial-sandbox";
import { SyntheticCSSObject, SyntheticCSSObjectEdit } from "./base";
export declare namespace CSSGroupingRuleMutationTypes {
    const INSERT_RULE_EDIT = "insertRuleEdit";
    const REMOVE_RULE_EDIT = "removeRuleEdit";
    const MOVE_RULE_EDIT = "moveRuleEdit";
}
export declare class SyntheticCSSGroupingRuleEdit<T extends SyntheticCSSGroupingRule<syntheticCSSRuleType>> extends SyntheticCSSObjectEdit<T> {
    insertRule(rule: syntheticCSSRuleType, index: number): InsertChildMutation<T, any>;
    moveRule(rule: syntheticCSSRuleType, index: number, patchedOldIndex?: number): MoveChildMutation<T, any>;
    removeRule(rule: syntheticCSSRuleType): RemoveChildMutation<T, syntheticCSSRuleType>;
    protected addDiff(groupingRule: T): this;
}
export declare function isCSSGroupingStyleMutation(mutation: Mutation<SyntheticCSSGroupingRule<any>>): boolean;
export declare class CSSGroupingRuleEditor<T extends CSSGroupingRule | SyntheticCSSGroupingRule<any>> extends BaseEditor<T> {
    readonly target: T;
    readonly createInsertableCSSRule: (parent: T, child: any | CSSRule) => any;
    readonly onInsertedChild: (child: any, index?: number) => any;
    readonly onDeletedChild: (child: any, index?: number) => any;
    constructor(target: T, createInsertableCSSRule?: (parent: T, child: any | CSSRule) => any, onInsertedChild?: (child: any, index?: number) => any, onDeletedChild?: (child: any, index?: number) => any);
    applySingleMutation(mutation: Mutation<any>): void;
}
export declare class SyntheticCSSGroupingRuleEditor<T extends SyntheticCSSGroupingRule<any>> extends BaseEditor<T> {
    applyMutations(mutations: Mutation<any>[]): void;
}
export declare abstract class SyntheticCSSGroupingRule<T extends syntheticCSSRuleType> extends SyntheticCSSObject {
    readonly rules: T[];
    constructor(rules?: T[]);
    readonly cssRules: T[];
    deleteRule(index: number): void;
    createEditor(): SyntheticCSSGroupingRuleEditor<SyntheticCSSGroupingRule<any>>;
    regenerateUID(): this;
    createEdit(): SyntheticCSSGroupingRuleEdit<SyntheticCSSGroupingRule<any>>;
    insertRule(rule: T, index?: number): number;
    insertRule(rule: string, index?: number): number;
    protected linkRule(rule: T): void;
}
