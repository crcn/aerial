import { weakMemo } from "aerial-common2";
import { SEnvNodeTypes } from "../constants";

export const getSEnvHTMLCollectionClasses = weakMemo((context: any) => {

  class SEnvHTMLCollection extends Array<Element> implements HTMLCollection {
    constructor(private _target: Node & ParentNode) {
      super();
      this._target.addEventListener("DOMNodeInserted", this._onChildAdded);
      this._target.addEventListener("DOMNodeRemoved", this._onChildRemoved);
    }
    namedItem(name: string) {
      return this.find(element => element.getAttribute("name") === name);
    }
    item(index: number) {
      return this[index];
    }
    private _onChildAdded = (event: MutationEvent) => {
      if (event.relatedNode.nodeType === SEnvNodeTypes.ELEMENT) {
        this.push(event.relatedNode as Element);
      }
    }
    private _onChildRemoved = (event: MutationEvent) => {
      const index = this.indexOf(event.relatedNode as Element);
      if (index !== -1) {
        this.splice(index, 1);
      }
    }
  }

  class SEnvNodeList extends Array<Node> implements NodeList {
    item(index: number) {
      return this[index];
    }
  }

  class SEnvNamedNodeMap extends Array<Attr> implements NamedNodeMap {
    getNamedItem(name: string): Attr {
      return this.find((attr) => attr.name === name);
    }
    getNamedItemNS(namespaceURI: string | null, localName: string | null): Attr {
      return null;
    }
    item(index: number): Attr {
      return this[index];
    }
    removeNamedItem(name: string): Attr {
      const attr = this.getNamedItem(name);
      if (attr) {
        this.splice(this.indexOf(attr), 1);
      }
      return attr;
    }
    removeNamedItemNS(namespaceURI: string | null, localName: string | null): Attr {
      return null;
    }
    setNamedItem(arg: Attr): Attr {
      return null;
    }
    setNamedItemNS(arg: Attr): Attr {
      return null;
    }
  }

  return {
    SEnvNodeList,
    SEnvNamedNodeMap,
    SEnvHTMLCollection,
  }
});