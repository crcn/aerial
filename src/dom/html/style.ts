import { omit } from "lodash";
import React =  require("react");
import { CSS_MIME_TYPE } from "@tandem/common";
import sm = require("source-map");
import postcss = require("postcss");

import { SyntheticDOMElement } from "../markup/element";
import { parseCSS, evaluateCSS, SyntheticCSSStyleSheet } from "../css";

export class SyntheticHTMLStyleElement extends SyntheticDOMElement {

  private _styleSheet: SyntheticCSSStyleSheet;

  attachedCallback() {
    super.attachedCallback();
    this.ownerDocument.styleSheets.push(this.getStyleSheet());
  }

  getStyleSheet() {
    if (this._styleSheet) return this._styleSheet;
    this._styleSheet = new SyntheticCSSStyleSheet([]);
    const firstChild = this.firstChild;
    this._styleSheet.$ownerNode = this;
    this._styleSheet.cssText = this.textContent;
    return this._styleSheet;
  }

  detachedCallback() {
    this.ownerDocument.styleSheets.splice(this.ownerDocument.styleSheets.indexOf(this._styleSheet), 1);
  }

  onChildAdded(child, index) {
    super.onChildAdded(child, index);
    if (this._styleSheet) {
      this._styleSheet.cssText = this.textContent;
    }
  }

  get styleSheet() {
    return this._styleSheet;
  }
}