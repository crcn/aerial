import { weakMemo } from "aerial-common2";

export const getSEnvCSSStyleSheetClass = weakMemo((context: any) => {
  return class SEnvCSSStyleSheet implements CSSStyleSheet {
    private _cssText: string;
    disabled: boolean;
    readonly href: string;
    readonly media: MediaList;
    readonly ownerNode: Node;
    readonly parentStyleSheet: StyleSheet;
    readonly title: string;
    readonly type: string;
    readonly cssRules: CSSRuleList;
    readonly id: string;
    readonly imports: StyleSheetList;
    readonly isAlternate: boolean;
    readonly isPrefAlternate: boolean;
    readonly ownerRule: CSSRule;
    readonly owningElement: Element;
    readonly pages: StyleSheetPageList;
    readonly readOnly: boolean;
    readonly rules: CSSRuleList;
    get cssText() {
      return this._cssText;
    }
    set cssText(value: string) {
      this._cssText = value;
    }
    addImport(bstrURL: string, lIndex?: number): number {
      return null;
    }
    addPageRule(bstrSelector: string, bstrStyle: string, lIndex?: number): number {
      return null;
    }
    addRule(bstrSelector: string, bstrStyle?: string, lIndex?: number): number {
      return null;
    }
    deleteRule(index?: number): void {
      return;
    }
    insertRule(rule: string, index?: number): number {
      return -1;
    }
    removeImport(lIndex: number): void { }
    removeRule(lIndex: number): void { }
  }
});
