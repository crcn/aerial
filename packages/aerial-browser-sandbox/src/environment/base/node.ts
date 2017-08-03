import { weakMemo } from "aerial-common2";
import { getSEnvEventTargetClass } from "../events";
import { getSEnvNamedNodeMapClass } from "./named-node-map";

export const getSEnvNodeClass = weakMemo((window: Window) => {
  
  const SEnvEventTarget = getSEnvEventTargetClass(window);
  const SEnvNamedNodeMap = getSEnvNamedNodeMapClass(window);

  return class SEnvNode extends SEnvEventTarget implements Node {

    readonly attributes: NamedNodeMap;
    readonly baseURI: string | null;
    readonly childNodes: NodeList;
    readonly firstChild: Node | null;
    readonly lastChild: Node | null;
    readonly localName: string | null;
    readonly namespaceURI: string | null;
    readonly nextSibling: Node | null;
    readonly nodeName: string;
    readonly nodeType: number;
    nodeValue: string | null;
    readonly ownerDocument: Document = window.document;
    readonly parentElement: HTMLElement | null;
    readonly parentNode: Node | null;
    readonly previousSibling: Node | null;
    textContent: string | null;
    readonly ATTRIBUTE_NODE: number;
    readonly CDATA_SECTION_NODE: number;
    readonly COMMENT_NODE: number;
    readonly DOCUMENT_FRAGMENT_NODE: number;
    readonly DOCUMENT_NODE: number;
    readonly DOCUMENT_POSITION_CONTAINED_BY: number;
    readonly DOCUMENT_POSITION_CONTAINS: number;
    readonly DOCUMENT_POSITION_DISCONNECTED: number;
    readonly DOCUMENT_POSITION_FOLLOWING: number;
    readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number;
    readonly DOCUMENT_POSITION_PRECEDING: number;
    readonly DOCUMENT_TYPE_NODE: number;
    readonly ELEMENT_NODE: number;
    readonly ENTITY_NODE: number;
    readonly ENTITY_REFERENCE_NODE: number;
    readonly NOTATION_NODE: number;
    readonly PROCESSING_INSTRUCTION_NODE: number;
    readonly TEXT_NODE: number;

    appendChild<T extends Node>(newChild: T): T {
      return null;
    }

    cloneNode(deep?: boolean): Node {
      return null;
    }

    compareDocumentPosition(other: Node): number {
      return 0;
    }

    contains(child: Node): boolean {
      return false;
    }

    hasAttributes(): boolean {
      return this.attributes.length > 0;
    }

    hasChildNodes(): boolean {
      return this.childNodes.length > 0;
    }

    insertBefore<T extends Node>(newChild: T, refChild: Node | null): T {
      return null;
    }
    isDefaultNamespace(namespaceURI: string | null): boolean {
      return false;
    }

    isEqualNode(arg: Node): boolean {
      return false;
    }

    isSameNode(other: Node): boolean {
      return false;
    }

    lookupNamespaceURI(prefix: string | null): string | null {
      return null;
    }

    lookupPrefix(namespaceURI: string | null): string | null {
      return null;
    }

    normalize(): void {

    }

    removeChild<T extends Node>(oldChild: T): T {
      return null;
    }

    replaceChild<T extends Node>(newChild: Node, oldChild: T): T {
      return null;
    }
  }
});
