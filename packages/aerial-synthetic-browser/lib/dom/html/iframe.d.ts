import { SyntheticWindow } from "../window";
import { SyntheticHTMLElement } from "./element";
export declare class SyntheticHTMLIframeElement extends SyntheticHTMLElement {
    private _contentWindow;
    createdCallback(): void;
    readonly contentWindow: SyntheticWindow;
}
