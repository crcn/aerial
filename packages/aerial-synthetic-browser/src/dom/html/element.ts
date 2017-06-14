import { SyntheticDocument } from "../document";
import { SyntheticCSSStyle } from "../css";
import { bindDOMEventMethods } from "../utils";
import { localizeFixedPosition } from "./utils";
import { DOMEventListenerFunction } from "../events";
import { BoundingRect, serializable, IPoint, bindable, ArrayCollection } from "aerial-common";

import {
  evaluateMarkup,
  SyntheticDOMElement,
  SyntheticDOMAttribute,
  VisibleSyntheticDOMElement,
  VisibleDOMNodeCapabilities,
} from "../markup";


import parse5 = require("parse5");

class ElementClassList extends ArrayCollection<string> {
  protected constructor(readonly target: SyntheticDOMElement) {
    super(...String(target.getAttribute("class") || "").split(" "));
  }
  add(value: string) {
    this.push(value);
    this._reset();
  }
  remove(value: string) {
    const index = this.indexOf(value);
    if (index !== -1) this.splice(index, 1);
    this._reset();
  }

  _reset() {
    this.target.setAttribute("className", this.join(" "));
  }
}

// http://www.w3schools.com/jsref/dom_obj_event.asp
// TODO - proxy dataset
@serializable("SyntheticHTMLElement")
export class SyntheticHTMLElement extends VisibleSyntheticDOMElement<SyntheticCSSStyle> {

  private _style: SyntheticCSSStyle;
  private _styleProxy: SyntheticCSSStyle;
  private _classList: string[];
  protected _native: HTMLElement;

  @bindable()
  public onclick: (event?) => any;

  @bindable()
  public ondblclick: (event?) => any;

  @bindable()
  public onmousedown: (event?) => any;

  @bindable()
  public onmouseenter: (event?) => any;

  @bindable()
  public onmouseleave: (event?) => any;

  @bindable()
  public onmousemove: (event?) => any;

  @bindable()
  public onmouseover: (event?) => any;

  @bindable()
  public onmouseup: (event?) => any;

  @bindable()
  public onkeydown: (event?) => any;

  @bindable()
  public onkeypress: (event?) => any;

  @bindable()
  public onkeyup: (event?) => any;

  constructor(ns: string, tagName: string) {
    super(ns, tagName);
    this._style = new SyntheticCSSStyle();
    bindDOMEventMethods([
      "click", 
      "dblClick",
      "mouseDown", 
      "mouseEnter", 
      "mouseLeave", 
      "mouseMove",  
      "mouseOver",  
      "mouseOut", 
      "mouseUp",
      "keyUp",
      "keyPress",
      "keyDown",
    ], this);
  }

  getClientRects() {
    return [BoundingRect.zeros()];
  }

  getBoundingClientRect() {
    return (this.browser && this.browser.renderer.getBoundingRect(this.uid)) || BoundingRect.zeros();
  }

  get classList() {
    return this._classList;
  }

  get style(): SyntheticCSSStyle {
    return this._styleProxy || this._resetStyleProxy();
  }

  get text(): string {
    return this.getAttribute("text");
  }

  focus() {
    // TODO - possibly set activeElement on synthetic document
  }

  blur() {
    // TODO
  }
  
  get className(): string {
    return this.class;
  }

  set className(value: string) {
    this.class = value;
  }

  get class(): string {
    return this.getAttribute("class") || "";
  }

  set class(value: string) {
    this.setAttribute("class", value);
  }

  set text(value: string) {
    this.setAttribute("text", value);
  }

  set style(value: SyntheticCSSStyle) {
    this._style.clearAll();
    Object.assign(this._style, value);
    this.onStyleChange();
  }

  protected attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "style") {
      this._resetStyleFromAttribute();
    } else if (name === "class") {
      this._classList = ElementClassList.create(this) as any as ElementClassList;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  get innerHTML(): string {
    return this.childNodes.map((child) => child.toString()).join("");
  }

  get outerHTML(): string {
    return this.toString();
  }

  set innerHTML(value: string) {
    this.removeAllChildren();
    this.appendChild(evaluateMarkup(parse5.parseFragment(value, { locationInfo: true }) as any, this.ownerDocument, this.namespaceURI));
  }

  private _resetStyleFromAttribute() {
    this._style.clearAll();
    Object.assign(this._style, SyntheticCSSStyle.fromString(this.getAttribute("style") || ""));
  }

  private _resetStyleProxy() {

    // Proxy the style here so that any changes get synchronized back
    // to the attribute
    // element.
    return this._styleProxy = new Proxy(this._style, {
      get: (target, propertyName, receiver) => {
        return target[propertyName];
      },
      set: (target, propertyName, value, receiver) => {

        // normalize the value if it's a pixel unit. Numbers are invalid for CSS declarations.
        if (typeof value === "number") {
          value = Math.round(value) + "px";
        }


        target.setProperty(propertyName.toString(), value);
        this.onStyleChange();
        return true;
      }
    });
  }

  protected onStyleChange() {
    this.setAttribute("style", this.style.cssText.replace(/[\n\t\s]+/g, " "));
  }

  protected computeCapabilities(style: SyntheticCSSStyle): VisibleDOMNodeCapabilities {
    return new VisibleDOMNodeCapabilities(
      /fixed|absolute|relative/.test(style.position),
      /fixed|absolute|relative/.test(style.position)
    );
  }

  protected computeAbsoluteBounds(style: SyntheticCSSStyle): BoundingRect {
    return this.getBoundingClientRect();
  }

  public setAbsolutePosition({ left, top }: IPoint) {
    const localizedPoint = localizeFixedPosition({ left, top }, this);
    Object.assign(this.style, localizedPoint);
  }

  public setAbsoluteBounds(newBounds: BoundingRect) {
    // const oldBounds = this.getAbsoluteBounds();

    Object.assign(this.style, {
      left: newBounds.left,
      top: newBounds.top,
      width: newBounds.width,
      height: newBounds.height
    });
  }
}