import { DOMNodeType } from "./node-types";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDOMContainer } from "./container";

import { serializable, ISerializer, serialize, deserialize, SerializedContentType } from "aerial-common";


class SyntheticDocumentFragmentSerializer implements ISerializer<SyntheticDocumentFragment, any[]> {
  serialize({ childNodes }) {
    return childNodes.map(serialize);
  }
  deserialize(childNodes, kernel) {
    const fragment = new SyntheticDocumentFragment();
    for (let i = 0, n = childNodes.length; i < n; i++) {
      fragment.appendChild(deserialize(childNodes[i], kernel));
    }
    return fragment;
  }
}

@serializable("SyntheticDocumentFragment", new SyntheticDocumentFragmentSerializer())
export class SyntheticDocumentFragment extends SyntheticDOMContainer {
  readonly nodeType: number = DOMNodeType.DOCUMENT_FRAGMENT;
  constructor() {
    super("#document-fragment");
  }
  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitDocumentFragment(this);
  }
  protected cloneShallow() {
    return new SyntheticDocumentFragment();
  }
}