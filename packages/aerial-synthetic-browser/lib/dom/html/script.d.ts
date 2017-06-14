import { SyntheticHTMLElement } from "./element";
export declare class SyntheticHTMLScriptElement extends SyntheticHTMLElement {
    private _executed;
    src: string;
    text: string;
    attachedCallback(): void;
    readonly type: any;
    executeScript(): void;
}
