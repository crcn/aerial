import { BoundingRect } from "aerial-common";
import { SyntheticHTMLElement } from "./element";
export declare class SyntheticTextRange {
    getBoundingClientRect(): BoundingRect;
}
export declare class SyntheticHTMLBodyElement extends SyntheticHTMLElement {
    createTextRange(): SyntheticTextRange;
}
