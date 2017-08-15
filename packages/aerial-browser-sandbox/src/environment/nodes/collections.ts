import { weakMemo } from "aerial-common2";
import { SEnvNodeTypes } from "../constants";
import { SEnvNodeInterface } from "./node";
import { SyntheticNode } from "../../state";

export interface SEnvNodeListInterface extends Array<SEnvNodeInterface>, NodeList {
  length: number;
  [index: number]: SEnvNodeInterface;
}

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

  class SEnvStyleSheetList extends _Collection<CSSStyleSheet> implements StyleSheetList {
    item(index?: number): StyleSheet {
      return this[index];
    }
  }

  class SEnvHTMLAllCollection extends _Collection<Element> implements HTMLAllCollection {
    
    item(nameOrIndex?: string): HTMLCollection | Element | null {
      return this.namedItem(nameOrIndex) || this[nameOrIndex];
    }

    namedItem(name: string): HTMLCollection | Element | null {
      return this.find((element) => element.getAttribute("name") === name);
    }
  }

  class SEnvHTMLCollection extends _Collection<Element> implements HTMLCollection {
    private _target: Node & ParentNode;
    $init(target: Node & ParentNode) {
      this._target = target;
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
      if (event.target !== this._target) {
        return;
      }
      if (event.relatedNode.nodeType === SEnvNodeTypes.ELEMENT) {
        this.push(event.relatedNode as Element);
      }
    }
    private _onChildRemoved = (event: MutationEvent) => {
      if (event.target !== this._target) {
        return;
      }
      const index = this.indexOf(event.relatedNode as Element);
      if (index !== -1) {
        this.splice(index, 1);
      }
    }
  }

  class SEnvNodeList extends _Collection<SEnvNodeInterface> implements SEnvNodeListInterface {
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
      const existing = this.getNamedItem(arg.name);
      if (existing) {
        existing.value = arg.value;
      } else {
        this.push(arg);
        this[arg.name] = arg;
      }
      return existing;
    }
    setNamedItemNS(arg: Attr): Attr {
      return null;
    }
  }

  return {
    SEnvNodeList,
    SEnvNamedNodeMap,
    SEnvHTMLCollection,
    SEnvStyleSheetList,
    SEnvHTMLAllCollection,
  }
});