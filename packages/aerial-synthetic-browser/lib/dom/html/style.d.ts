import { SyntheticDOMElement } from "../markup/element";
import { SyntheticCSSStyleSheet } from "../css";
export declare class SyntheticHTMLStyleElement extends SyntheticDOMElement {
    private _styleSheet;
    attachedCallback(): void;
    getStyleSheet(): SyntheticCSSStyleSheet;
    detachedCallback(): void;
    onChildAdded(child: any, index: any): void;
    readonly styleSheet: SyntheticCSSStyleSheet;
}
