import { SyntheticDOMElement } from "./element";
import { SyntheticDocument } from "../document";

export type syntheticElementClassType = { new(ns: string, tagName: string): SyntheticDOMElement };
