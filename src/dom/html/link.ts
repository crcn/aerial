import {
  serialize,
  deserialize,
  CSS_MIME_TYPE,
  HTML_MIME_TYPE,
} from "@tandem/common";

import { SyntheticHTMLElement } from "./element";
import { SyntheticCSSStyleSheet } from "../css";

import path =  require("path");

const _cache = {};

// TODO - implement imports
export class SyntheticHTMLLinkElement extends SyntheticHTMLElement {

  public stylesheet: SyntheticCSSStyleSheet;
  public import: SyntheticHTMLElement;

  private _addedToDocument: boolean;

  get href() {
    return this.getAttribute("href");
  }

  get rel() {
    return this.getAttribute("rel");
  }

  get type() {
    return this.getAttribute("type");
  }

  set href(value: string) {
    this.setAttribute("href", value);
    this.reload();
  }

  createdCallback() {
    const rel     = this.getAttribute("rel") || "stylesheet";
    const href    = this.getAttribute("href");
    if (href) this.reload();
  }

  attachedCallback() {
    this.attachStylesheet();
  }

  detachedCallback() {
    this.detachStylesheet();
  }

  private reload() {
    const rel     = (this.getAttribute("rel") || "stylesheet").toLowerCase();

    if (rel !== "stylesheet") return;
    const href    = this.href;

    const dep = this.module && this.module.source.eagerGetDependency(href);
    let content, type;
    let ret;

    if (dep) {
      this.stylesheet = this.module.sandbox.evaluate(dep) as SyntheticCSSStyleSheet;
    } else {
      const result = parseDataURI(href);
      content = result && decodeURIComponent(result.content);
      this.stylesheet = new SyntheticCSSStyleSheet([]);
      this.stylesheet.cssText = content || "";
    }

    this.stylesheet.$ownerNode = this;
    this.attachStylesheet();
  }

  private attachStylesheet() {
    if (this._addedToDocument || !this.ownerDocument || !this._attached || !this.stylesheet) return;
    this._addedToDocument = true;
    this.ownerDocument.styleSheets.push(this.stylesheet);
  }

  private detachStylesheet() {
    if (!this.ownerDocument || !this._attached || !this.stylesheet) return;
    this._addedToDocument = false;
    const index = this.ownerDocument.styleSheets.indexOf(this.stylesheet);
    if (index !== -1) {
      this.ownerDocument.styleSheets.splice(index, 1);
    }
  }
}



function parseDataURI(uri: string): { type: string, content: string } {
  const parts = uri.match(/data:(.*?),(.*)/);
  return parts && { type: parts[1], content: parts[2] };
}