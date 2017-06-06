import { Dependency } from "@tandem/sandbox";
import { kebabCase } from "lodash";
import { CallbackDispatcher } from "@tandem/mesh";
import { SyntheticDOMElement, getSelectorTester } from "..";
import { BaseContentEdit, SyntheticObjectChangeTypes, BaseEditor } from "@tandem/sandbox";
import { ISerializedSyntheticCSSStyle, SyntheticCSSStyle, isValidCSSDeclarationProperty } from "./style";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer, SyntheticCSSObjectEdit, SyntheticCSSObjectEditor } from "./base";
import {
  Mutation,
  serialize,
  Metadata,
  diffArray,
  CoreEvent,
  deserialize,
  ISerializer,
  ITreeWalker,
  serializable,
  ArrayMutation,
  PropertyMutation,
  SetValueMutation,
  SerializedContentType,
} from "@tandem/common";

export namespace SyntheticCSSStyleRuleMutationTypes {
  export const SET_DECLARATION = "setDeclaration";
}

export function isCSSStyleRuleMutation(mutation: Mutation<SyntheticCSSStyleRule>){
  return !!{
    [SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION]: true
  }[mutation.type];
}

// TODO - move this to synthetic-browser
export class SyntheticCSSStyleRuleEdit<T extends SyntheticCSSStyleRule> extends SyntheticCSSObjectEdit<T> {


  setDeclaration(name: string, value: string, oldName?: string, index?: number) {
    return this.addChange(new PropertyMutation(SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION, this.target, name, value, undefined, oldName, index));
  }

  addDiff(newRule: T) {
    super.addDiff(newRule);

    const oldKeys = Object.keys(this.target.style).filter(isValidCSSDeclarationProperty as any);
    const newKeys = Object.keys(newRule.style).filter(isValidCSSDeclarationProperty as any);

    diffArray(oldKeys, newKeys, (a, b) => {
      return a === b ? 0 : -1;
    }).accept({
      visitInsert: ({ value, index }) => {
        this.setDeclaration(value, newRule.style[value], undefined, index);
      },
      visitRemove: ({ index }) => {

        // don't apply a move edit if the value doesn't exist.
        if (this.target.style[oldKeys[index]]) {
          this.setDeclaration(oldKeys[index], undefined);
        }
      },
      visitUpdate: ({ originalOldIndex, newValue, index }) => {
        if (this.target.style[newValue] !== newRule.style[newValue]) {
          this.setDeclaration(newValue, newRule.style[newValue], undefined, index);
        }
      }
    });

    return this;
  }
}

export class CSSStyleRuleEditor extends BaseEditor<CSSStyleRule|SyntheticCSSStyleRule> {
  applySingleMutation(mutation: Mutation<any>) {
    if (mutation.type === SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION) {
      const { name, newValue, oldName } = <PropertyMutation<any>>mutation;
      (<SyntheticCSSStyleRule>this.target).style.setProperty(kebabCase(name), newValue);
      if (newValue == null) {
        this.target.style.removeProperty(name);
      }
      if (oldName) {
        this.target.style.removeProperty(oldName);
      }
    }
  }
}

export class SyntheticCSSStyleRuleEditor extends BaseEditor<SyntheticCSSStyleRule> {
  applyMutations(mutations: Mutation<SyntheticCSSStyleRule>[]) {
    super.applyMutations(mutations);
    new SyntheticCSSObjectEditor(this.target).applyMutations(mutations);
    new CSSStyleRuleEditor(this.target).applyMutations(mutations);
  }
}

export abstract class SyntheticCSSStyleRule extends SyntheticCSSObject {
  
  private _metadata: Metadata;
  private _metadataObserver: CallbackDispatcher<any, any>;

  constructor(public style: SyntheticCSSStyle) {
    super();
    if (!style) style = this.style = new SyntheticCSSStyle();
    style.$parentRule = this;
  }

  get metadata() {
    if (this._metadata) return this._metadata;
    this._metadata = new Metadata();
    this._metadata.observe(this._metadataObserver = new CallbackDispatcher(this._onMetadataEvent.bind(this)));
    return this._metadata;
  }

  createEdit() {
    return new SyntheticCSSStyleRuleEdit(this);
  }

  toString() {
    return this.cssText;
  }

  abstract cssText: string;

  createEditor() {
    return new SyntheticCSSStyleRuleEditor(this);
  }

  protected abstract cloneShallow(); 

  abstract countShallowDiffs(target: SyntheticCSSStyleRule): number;

  visitWalker(walker: ITreeWalker) {
    walker.accept(this.style);
  }

  private _onMetadataEvent(event: CoreEvent) {
    const ownerNode = this.$ownerNode || (this.$parentStyleSheet && this.$parentStyleSheet.$ownerNode);
    if (ownerNode) ownerNode.notify(event);
  }
}


export namespace SyntheticCSSElementStyleRuleMutationTypes {
  export const SET_DECLARATION = SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION;
  export const SET_RULE_SELECTOR = "setRuleSelector";
}

export function isCSSSElementtyleRuleMutation(mutation: Mutation<SyntheticCSSStyleRule>){
  return isCSSStyleRuleMutation(mutation) || !!{
    [SyntheticCSSElementStyleRuleMutationTypes.SET_RULE_SELECTOR]: true
  }[mutation.type];
}


export class SyntheticCSSElementStyleRuleEdit<T extends SyntheticCSSElementStyleRule> extends SyntheticCSSStyleRuleEdit<T> {
  setSelector(selector: string) {
    return this.addChange(new SetValueMutation(SyntheticCSSElementStyleRuleMutationTypes.SET_RULE_SELECTOR, this.target, selector));
  }
  addDiff(newRule: T) {
    super.addDiff(newRule);
    if (this.target.selector !== newRule.selector) {
      this.setSelector(newRule.selector);
    }
    return this;
  }
}


class SyntheticCSSElementStyleRuleSerializer implements ISerializer<SyntheticCSSStyleRule, any[]> {
  serialize(value: SyntheticCSSElementStyleRule) {
    return [value.selector, serialize(value.style)];
  }
  deserialize([ selector, style ], kernel): SyntheticCSSElementStyleRule {
    return new SyntheticCSSElementStyleRule(selector, deserialize(style, kernel));
  }
}

@serializable("SyntheticCSSElementStyleRule", new SyntheticCSSObjectSerializer(new SyntheticCSSElementStyleRuleSerializer()))
export class SyntheticCSSElementStyleRule extends SyntheticCSSStyleRule {
  constructor(public selector: string, style: SyntheticCSSStyle) {
    super(style);
  }
  get cssText() {
    return `${this.selector} {\n${this.style.cssText}}\n`;
  }
  
  createEdit() {
    return new SyntheticCSSElementStyleRuleEdit(this);
  }

  protected cloneShallow() {
    return new SyntheticCSSElementStyleRule(this.selector, undefined);
  }

  matchesElement(element: SyntheticDOMElement) {
    return getSelectorTester(this.selector, element).test(element);
  }

  countShallowDiffs(target: SyntheticCSSElementStyleRule): number {
    return this.selector === target.selector ? 0 : -1;
  }
}