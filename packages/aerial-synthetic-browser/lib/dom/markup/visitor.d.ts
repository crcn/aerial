import { SyntheticDOMElement } from "./element";
import { SyntheticDOMComment } from "./comment";
import { SyntheticDOMText } from "./text-node";
import { SyntheticDocument } from "../document";
import { SyntheticDocumentFragment } from "./document-fragment";
export interface IMarkupNodeVisitor {
    visitDocument(node: SyntheticDocument): any;
    visitElement(node: SyntheticDOMElement): any;
    visitDocumentFragment(node: SyntheticDocumentFragment): any;
    visitText(node: SyntheticDOMText): any;
    visitComment(node: SyntheticDOMComment): any;
}
