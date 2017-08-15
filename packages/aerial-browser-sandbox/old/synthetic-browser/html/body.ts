import { BoundingRect } from "aerial-common";
import { SyntheticElement } from "./element";

export class SyntheticTextRange {
  getBoundingClientRect() {
    return  BoundingRect.zeros();
  }
}

export class SyntheticHTMLBodyElement extends SyntheticElement {
  createTextRange() {
    return new SyntheticTextRange();
  }
}