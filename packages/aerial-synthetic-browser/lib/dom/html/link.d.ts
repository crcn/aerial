import { SyntheticHTMLElement } from "./element";
import { SyntheticCSSStyleSheet } from "../css";
export declare class SyntheticHTMLLinkElement extends SyntheticHTMLElement {
    stylesheet: SyntheticCSSStyleSheet;
    import: SyntheticHTMLElement;
    private _addedToDocument;
    href: string;
    readonly rel: any;
    readonly type: any;
    createdCallback(): void;
    attachedCallback(): void;
    detachedCallback(): void;
    private reload();
    private attachStylesheet();
    private detachStylesheet();
}
