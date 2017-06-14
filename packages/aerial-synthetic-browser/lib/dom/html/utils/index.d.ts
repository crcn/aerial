import { IPoint } from "aerial-common";
import { SyntheticHTMLElement } from "../element";
/**
 * Localizes a fixed point according to the relative element. In other words, convert the fixed point into one
 * that is relative to the element.
 *
 * TODO - need to consider right / bottom constraints
 */
export declare const localizeFixedPosition: (point: IPoint, element: SyntheticHTMLElement) => {
    left: number;
    top: number;
};
export declare const convertComputedStylePositionToPixels: (element: SyntheticHTMLElement) => {
    left: number;
    top: number;
    right: number;
    bottom: number;
};
