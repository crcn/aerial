import { BaseRenderer } from "../base";
import { MutationEvent } from "aerial-common";
import { SyntheticDOMNode } from "../../dom";
export interface ISyntheticDOMRendererOptions {
    nodeFactory?: Document;
    getComputedStyle?: (node: Node) => CSSStyleDeclaration;
    createProxyUrl?: (url: string) => string;
}
export declare class SyntheticDOMRenderer extends BaseRenderer {
    private _currentCSSText;
    private _firstRender;
    private _documentElement;
    private _elementDictionary;
    private _cssRuleDictionary;
    private _getComputedStyle;
    private _createProxyUrl;
    constructor({nodeFactory, getComputedStyle, createProxyUrl}?: ISyntheticDOMRendererOptions);
    createElement(): HTMLDivElement;
    createElementInnerHTML(): string;
    protected onDocumentMutationEvent({mutation}: MutationEvent<any>): void;
    private updateCSSRules(staleStyleSheet, syntheticStyleSheet);
    private proxyCSSUrls(text);
    private removeCSSRules(syntheticStyleSheet);
    private getSyntheticStyleSheetIndex(styleSheet);
    private getSyntheticStyleSheet(styleSheet);
    private getNativeRuleIndex(index);
    protected getElementDictItem<T extends Node, U extends SyntheticDOMNode>(synthetic: SyntheticDOMNode): [T, U];
    private _registerStyleSheet(syntheticStyleSheet, index?);
    protected render(): Promise<void>;
    private onElementChange;
    private getCSSDictItem(target);
    private tryRegisteringStyleSheet(styleElement, styleSheet);
    protected reset(): void;
    private onDOMEvent(element, event);
    private updateRects();
}
