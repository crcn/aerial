import { debounce, throttle } from "lodash";
import { SEnvNodeTypes } from "../constants";
import { SEnvNodeInterface } from "../nodes";
import { SEnvWindowInterface, patchWindow, patchNode } from "../window";
import { SEnvParentNodeMutationTypes, createParentNodeInsertChildMutation, SEnvParentNodeInterface, SEnvCommentInterface, SEnvElementInterface, SEnvTextInterface, createParentNodeRemoveChildMutation } from "../nodes";
import { SEnvMutationEventInterface } from "../events";
import { BaseSyntheticWindowRenderer } from "./base";
import { InsertChildMutation, RemoveChildMutation, MoveChildMutation, Mutation } from "aerial-common2";
import { SET_SYNTHETIC_SOURCE_CHANGE } from "../nodes";
import { getNodeByPath, getNodePath } from "../../utils";

const NODE_NAME_MAP = {
  style: "span",
  head: "span",
  html: "span",
  body: "span",
  link: "span",
  script: "span",
};

const HIDDEN_NODE_NAME_MAP = {
  style: true,
  script: true,
  link: true,
};

const RECOMPUTE_TIMEOUT = 1;


// TODO - this should contain an iframe
export class SyntheticDOMRenderer extends BaseSyntheticWindowRenderer {
  readonly container: HTMLIFrameElement;
  readonly mount: HTMLDivElement;
  private _rendering: boolean;
  private _mutations: Mutation<any>[];
  constructor(sourceWindow: SEnvWindowInterface, readonly targetDocument: Document) {
    super(sourceWindow);
    this.container = targetDocument.createElement("iframe");
    Object.assign(this.container.style, {
      border: "none",
      width: "100%",
      height: "100%"
    });

    this._onContainerResize = this._onContainerResize.bind(this);
    this.mount = targetDocument.createElement("div");
    this.container.onload = () => {
      this.container.contentWindow.document.body.appendChild(this.mount);
      this.container.contentWindow.addEventListener("resize", this._onContainerResize);
    };
  }

  protected _onDocumentLoad(event: Event) {
    super._onDocumentLoad(event);
    const css = this._getSourceCSSText();
    const html = this.sourceWindow.document.body.innerHTML;

    this.mount.innerHTML = `<style>${css}</style><span></span>`;
    this.mount.lastElementChild.appendChild(mapNode(this.sourceWindow.document.documentElement as any as SEnvElementInterface, this.targetDocument));

    this._resetComputedInfo();
  }

  protected _onWindowMutation({ mutation }: SEnvMutationEventInterface) {
    if (mutation.$type !== SET_SYNTHETIC_SOURCE_CHANGE) {
      this._batchMutation(mutation);
    }
  }

  private _getSourceCSSText() {
    return Array.prototype.map.call(this.sourceWindow.document.stylesheets, (ss: CSSStyleSheet) => (
      ss.cssText
    )).join("\n");
  }

  protected _onContainerResize(event) {
    this._resetComputedInfo();
  }

  private _batchMutation(mutation: Mutation<any>) {
    if (typeof window !== "undefined")  {
      if (!this._mutations) {
        this._mutations = [];

        const run = () => requestAnimationFrame(() => {
          const css = this._getSourceCSSText();

          if (this.mount.style.cssText !== css) {
            this.mount.style.cssText = css;
          }

          const mutations = this._mutations;
          this._mutations = [];
          mutations.forEach((mutation) => this._applyMutation(mutation));

          // must have a timeout since the bounding client rect
          // may change a few MS after a style is added
          setTimeout(() => {
            if (this._mutations.length) {
              run();
            } else {
              this._mutations = undefined;
            }
            this._resetComputedInfo();
          }, RECOMPUTE_TIMEOUT);
        });

        run();
        
      }
      this._mutations.push(mutation);
    } else {
      this._applyMutation(mutation);
      this._resetComputedInfo();
    }
  }

  private _applyMutation(mutation: Mutation<any>) {
    const targetNode = getNodeByPath(getNodePath(this._sourceWindow.childObjects.get(mutation.target.$id), this._sourceWindow.document), this.mount.lastElementChild);

    if (mutation.$type === SEnvParentNodeMutationTypes.MOVE_CHILD_NODE_EDIT) {
    } else if (mutation.$type === SEnvParentNodeMutationTypes.INSERT_CHILD_NODE_EDIT) {
      const insertChildMutation = mutation as InsertChildMutation<any, any>;
      mutation = createParentNodeInsertChildMutation(targetNode as SEnvParentNodeInterface, mapNode(insertChildMutation.child.cloneNode(true), this.targetDocument), insertChildMutation.index);
    } else if (mutation.$type === SEnvParentNodeMutationTypes.REMOVE_CHILD_NODE_EDIT) {
      const removeChildMutation = mutation as RemoveChildMutation<any, any>;
      mutation = createParentNodeRemoveChildMutation(targetNode, null, removeChildMutation.index);
    }

    patchNode(targetNode, mutation);
  }

  protected _onWindowResize(event: Event) {
    this._deferResetComputedInfo();
  }

  protected _deferResetComputedInfo = throttle(() => {
    this._resetComputedInfo();
  }, 10);

  protected _onWindowScroll(event: Event) {
    this.container.contentWindow.scroll(this._sourceWindow.scrollX, this._sourceWindow.scrollY);
    this._deferResetComputedInfo();
  }

  private _resetComputedInfo() {
    if (!this.mount.lastElementChild) {
      return;
    }
    const targetWindow = this.targetDocument.defaultView;
    const containerWindow = this.container.contentWindow;
    const containerBody = containerWindow.document.body;
    const body = this.mount.lastChild;

    const boundingClientRects = {};
    const allComputedStyles = {};
    const childObjectsByUID = {};
    
    for (const child of Array.from(this.sourceWindow.childObjects.values())) {
      childObjectsByUID[child.uid] = child;
    }
    Array.prototype.forEach.call(this.mount.lastElementChild.querySelectorAll("*"), (element) => {
      const sourceUID = element.dataset.sourceUID;
      const $id = childObjectsByUID[sourceUID].$id;
      boundingClientRects[$id] = element.getBoundingClientRect();
      allComputedStyles[$id] = targetWindow.getComputedStyle(element);
    });

    this.setPaintedInfo(boundingClientRects, allComputedStyles, {
      width: containerBody.scrollWidth,
      height: containerBody.scrollHeight
    }, {
      left: containerWindow.scrollX,
      top: containerWindow.scrollY
    });
  }
}

const eachMatchingElement = (a: SEnvNodeInterface, b: Node, each: (a: SEnvNodeInterface, b: Node) => any) => {
  each(a, b);
  Array.prototype.forEach.call(a.childNodes, (ac, i) => {
    eachMatchingElement(ac, b.childNodes[i], each);
  });
};

const mapNode = (a: SEnvNodeInterface, document: Document) => {
  let b: Node;
  switch(a.nodeType) {
    case SEnvNodeTypes.TEXT: 
      b = document.createTextNode((a as SEnvTextInterface).nodeValue);
    break;
    case SEnvNodeTypes.ELEMENT: 
      const el = a as SEnvElementInterface;
      const lowerNodeName = el.nodeName.toLowerCase();
      const bel = document.createElement(NODE_NAME_MAP[lowerNodeName] || encodeURIComponent(el.nodeName)) as HTMLElement;
      bel.dataset.sourceUID = el.uid;
      if (HIDDEN_NODE_NAME_MAP[lowerNodeName]) {
        bel.style.display = "none";
      }
      for (let i = 0, n = el.attributes.length; i < n; i++) {
        try {
          bel.setAttribute(el.attributes[i].name, el.attributes[i].value);
        } catch(e) {
          // ignore invalid attributes
        }
      }
      for (const child of Array.from(el.childNodes)) {
        bel.appendChild(mapNode(child as SEnvNodeInterface, document));
      }
      b = bel;
    break;
    case SEnvNodeTypes.COMMENT: 
      b = document.createComment((a as SEnvCommentInterface).nodeValue);
    break;
  }
  
  return b;
}

export const createSyntheticDOMRendererFactory = (targetDocument: Document) => (window: SEnvWindowInterface) => new SyntheticDOMRenderer(window, targetDocument);
