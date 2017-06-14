import { SyntheticDOMNode } from "../markup";
import { ArrayCollection } from "aerial-common";

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
export class SyntheticHTMLCollection<T extends SyntheticDOMNode> extends  ArrayCollection<T> {
  item(index: number) {
    return this[index];
  }
}