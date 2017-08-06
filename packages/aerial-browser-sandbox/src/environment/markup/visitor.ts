import { SyntheticDOMElement } from "./element";
import { SyntheticDOMComment } from "./comment";
import { SyntheticDOMText } from "./text-node";
import { SyntheticDocument } from "../document";
import { SyntheticDocumentFragment } from "./document-fragment";

export interface IMarkupNodeVisitor {
  visitDocument(node: SyntheticDocument);
  visitElement(node: SyntheticDOMElement);
  visitDocumentFragment(node: SyntheticDocumentFragment);
  visitText(node: SyntheticDOMText);
  visitComment(node: SyntheticDOMComment);
}