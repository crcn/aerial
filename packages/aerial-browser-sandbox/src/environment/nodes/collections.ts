import { weakMemo } from "aerial-common2";
import { SEnvNodeTypes } from "../constants";

export const getSEnvHTMLCollectionClasses = weakMemo((context: any) => {

  interface Collection<T> extends Array<T> { } 

  interface CollectionClass {
    new<T>(...items: T[]): Collection<T>;
  }

  const _Collection = function() {
    const _this = [];
    _this["__proto__"] = this.constructor.prototype;
    return _this;
  } as any as CollectionClass;

  _Collection.prototype = [];
  

  class SEnvHTMLCollection extends _Collection<Element> implements HTMLCollection {
    $init(target: Node & ParentNode) {
      target.addEventListener("DOMNodeInserted", this._onChildAdded);
      target.addEventListener("DOMNodeRemoved", this._onChildRemoved);
      return this;
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

  class SEnvNodeList extends _Collection<Node> implements NodeList {
    item(index: number) {
      return this[index];
    }
  }

  class SEnvNamedNodeMap extends _Collection<Attr> implements NamedNodeMap {
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