import { SEnvNodeTypes } from "../constants";
import { SEnvNodeInterface } from "./node";
import { SyntheticNode } from "../../state";
import { SEnvParentNodeMutationTypes } from "./parent-node";
import { getSEnvEventClasses, SEnvMutationEventInterface } from "../events";
import { weakMemo, RemoveChildMutation, InsertChildMutation, diffArray, eachArrayValueMutation } from "aerial-common2";

export interface SEnvNodeListInterface extends Array<SEnvNodeInterface>, NodeList {
  length: number;
  [index: number]: SEnvNodeInterface;
}

export interface SEnvHTMLAllCollectionInterface extends Array<Element>, HTMLCollection {
  length: number;
  [index: number]: Element;
  update(): SEnvHTMLAllCollectionInterface;
}

export const getSEnvHTMLCollectionClasses = weakMemo((context: any) => {
  
  const { SEnvMutationEvent } = getSEnvEventClasses(context);

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

  class SEnvDOMStringMap implements DOMStringMap {
    [name: string]: string | undefined;
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
    private _stale: boolean;
    $init(target: Node & ParentNode) {
      this._target = target;
      this._stale = true;
      target.addEventListener(SEnvMutationEvent.MUTATION, this._onChildMutation);
      return this;
    }
    update() {
      if (this._stale) {
        this._stale = false;
        const diff = diffArray(
          this, 
          Array.prototype.filter.call(this._target.childNodes, a => a.nodeType === SEnvNodeTypes.ELEMENT),
          (a, b) => a === b ? 0 : -1
        );
        
        eachArrayValueMutation(diff, {
          insert: ({ value, index }) => {
            this.splice(index, 0, value);
          },
          delete: ({ index }) => {
            this.splice(index, 1);
          },
          update() {

          }
        });
      }
      
      return this;
    }
    namedItem(name: string) {
      return this.find(element => element.getAttribute("name") === name);
    }
    item(index: number) {
      return this[index];
    }
    private _onChildMutation = (event: SEnvMutationEventInterface) => {
      if (event.target !== this._target) {
        return;
      }
      this._stale = true;
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
    SEnvDOMStringMap,
    SEnvHTMLCollection,
    SEnvStyleSheetList,
    SEnvHTMLAllCollection,
  }
});