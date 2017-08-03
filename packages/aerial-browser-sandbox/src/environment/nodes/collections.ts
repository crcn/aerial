import { weakMemo } from "aerial-common2";

export const getSEnvHTMLCollectionClasses = weakMemo((window: Window) => {

  class SEnvHTMLCollection extends Array<Element> implements HTMLCollection {
    constructor(private _target: Node & ParentNode) {
      super();
      this._target.addEventListener("DOMNodeInserted", this._onChildAdded);
      this._target.addEventListener("DOMNodeRemoved", this._onChildAdded);
    }
    namedItem(name: string) {
      return this.find(element => element.getAttribute("name") === name);
    }
    item(index: number) {
      return this[index];
    }
    private _onChildAdded: (event: Event) => {

    }
    private _onChildRemoved: (event: Event) => {

    }
  }

  class SEnvNodeList extends Array<Node> implements NodeList {
    item(index: number) {
      return this[index];
    }
  }

  return {
    SEnvNodeList,
    SEnvHTMLCollection,
  }
});