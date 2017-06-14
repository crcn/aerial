import { SyntheticDOMNode } from "../markup";
import { ArrayCollection } from "aerial-common";
export declare class SyntheticHTMLCollection<T extends SyntheticDOMNode> extends ArrayCollection<T> {
    item(index: number): T;
}
