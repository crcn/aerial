import { Mutation, InsertChildMutation, RemoveChildMutation, MoveChildMutation } from "@tandem/common";
import { parseCSS } from "./parsers";
import { diffStyleSheetRules, syntheticCSSRuleType } from "./utils";
import { BaseEditor } from "@tandem/sandbox";
import { evaluateCSS } from "./evaluate";
import { SyntheticCSSObject, SyntheticCSSObjectEditor, SyntheticCSSObjectEdit } from "./base";

export namespace CSSGroupingRuleMutationTypes {
  export const INSERT_RULE_EDIT = "insertRuleEdit";
  export const REMOVE_RULE_EDIT = "removeRuleEdit";
  export const MOVE_RULE_EDIT   = "moveRuleEdit";
}

export class SyntheticCSSGroupingRuleEdit<T extends SyntheticCSSGroupingRule<syntheticCSSRuleType>> extends SyntheticCSSObjectEdit<T> {

  insertRule(rule: syntheticCSSRuleType, index: number) {
    return this.addChange(new InsertChildMutation(CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, this.target, rule.clone(true), index));
  }

  moveRule(rule: syntheticCSSRuleType, index: number, patchedOldIndex?: number) {
    return this.addChange(new MoveChildMutation(CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT, this.target, rule.clone(true), patchedOldIndex || this.target.rules.indexOf(rule), index));
  }

  removeRule(rule: syntheticCSSRuleType) {
    return this.addChange(new RemoveChildMutation(CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, this.target, rule, this.target.rules.indexOf(rule)));
  }

  protected addDiff(groupingRule: T) {
    super.addDiff(groupingRule);

    diffStyleSheetRules(this.target.rules, groupingRule.rules).accept({
      visitInsert: ({ index, value }) => {
        this.insertRule(value, index);
      },
      visitRemove: ({ index }) => {
        this.removeRule(this.target.rules[index]);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, index }) => {

        if (patchedOldIndex !== index) {
          this.moveRule(this.target.rules[originalOldIndex], index, patchedOldIndex);
        }

        const oldRule = this.target.rules[originalOldIndex];
        this.addChildEdit((<SyntheticCSSObject>oldRule).createEdit().fromDiff(<SyntheticCSSObject>newValue));
      }
    });

    return this;
  }
}

export function isCSSGroupingStyleMutation(mutation: Mutation<SyntheticCSSGroupingRule<any>>){
  return !!{
    [CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]: true,
    [CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT]: true,
    [CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT]: true
  }[mutation.type];
}

export class CSSGroupingRuleEditor<T extends CSSGroupingRule|SyntheticCSSGroupingRule<any>> extends BaseEditor<T> {

  constructor(readonly target: T, readonly createInsertableCSSRule: (parent: T, child: any|CSSRule) => any = (parent, child) => child.cssText, readonly onInsertedChild?: (child: any, index?: number) => any, readonly onDeletedChild?: (child: any, index?: number) => any) {
    super(target);
  }  

  applySingleMutation(mutation: Mutation<any>) {
    if (mutation.type === CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT) {
      const { child, index } = (<InsertChildMutation<any, any>>mutation);
      this.target.insertRule(this.createInsertableCSSRule(this.target, child), index);
      if (this.onInsertedChild) this.onInsertedChild(child, index);
    } else if (mutation.type === CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT) {
      const { child, index } = (<RemoveChildMutation<any, any>>mutation);
      this.target.deleteRule(index);
      if (this.onDeletedChild) this.onDeletedChild(child, index);
    } else if (mutation.type === CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT) {
      const { oldIndex, child, index } = <MoveChildMutation<any, any>>mutation;
      
      const existingChild = this.target.cssRules[oldIndex];

      this.target.deleteRule(oldIndex);

      // TODO - move the existing instance -- don't just create a new one
      this.target.insertRule(this.createInsertableCSSRule(this.target, existingChild), index);
      if (this.onInsertedChild) this.onInsertedChild(existingChild, index);
    }
  }
}

export class SyntheticCSSGroupingRuleEditor<T extends SyntheticCSSGroupingRule<any>> extends BaseEditor<T> {
  applyMutations(mutations: Mutation<any>[]) {
    new CSSGroupingRuleEditor(this.target, (parent, child) => {
      return child.$parentRule === parent ? child : child.clone(true);
    }).applyMutations(mutations);
    new SyntheticCSSObjectEditor(this.target).applyMutations(mutations);
  }
}

export abstract class SyntheticCSSGroupingRule<T extends syntheticCSSRuleType> extends SyntheticCSSObject {

  constructor(readonly rules: T[] = []) {
    super();
    rules.forEach((rule) => this.linkRule(rule));
  }

  get cssRules() {
    return this.rules;
  }

  deleteRule(index: number) {
    const rule = this.cssRules[index];
    this.cssRules.splice(index, 1);
    const owner = this.ownerNode;
    if (owner) owner.notify(new RemoveChildMutation(CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, this, rule, index).toEvent());
  }

  createEditor() {
    return new SyntheticCSSGroupingRuleEditor<SyntheticCSSGroupingRule<any>>(this);
  }

  regenerateUID() {
    super.regenerateUID();
    for (const rule of this.rules) {
      rule.regenerateUID();
    }
    return this;
  }

  createEdit() {
    return new SyntheticCSSGroupingRuleEdit<SyntheticCSSGroupingRule<any>>(this);
  }

  insertRule(rule: T, index?: number): number;
  insertRule(rule: string, index?: number): number;
  insertRule(rule: any, index?: number): number {
    const ruleInstance: T = typeof rule === "string" ? evaluateCSS(parseCSS(rule)).rules[0] as any : rule as T;
    if (index == undefined) {
      index = this.rules.length;
    }
    this.rules.splice(index, 0, ruleInstance);
    this.linkRule(ruleInstance);
    const owner = this.ownerNode;
    if (owner) owner.notify(new InsertChildMutation(CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, this, ruleInstance, index).toEvent());
    return index;
  }

  protected linkRule(rule: T) {
    rule.$parentRule = this;
  }
}
