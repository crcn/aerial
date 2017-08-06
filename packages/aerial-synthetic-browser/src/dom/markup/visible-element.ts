import { IEqualable } from "aerial-common";
import { SyntheticDOMElement } from "./element";
import { ISyntheticDocumentRenderer } from "../../renderers";
import { bindable, BoundingRect, IPoint, waitForPropertyChange } from "aerial-common";

// TODO - possibly move this over to aerial-common/display or similar
export class VisibleDOMNodeCapabilities {
  constructor(
    readonly movable: boolean,
    readonly resizable: boolean
  ) {}

  merge(...capabilities: VisibleDOMNodeCapabilities[]) {
    return VisibleDOMNodeCapabilities.merge(this, ...capabilities);
  }

  static notCapableOfAnything() {
    return new VisibleDOMNodeCapabilities(false, false);
  }

  equalTo(capabilities: VisibleDOMNodeCapabilities) {
    return capabilities.movable === this.movable && capabilities.resizable === this.resizable;
  }

  static merge(...capabilities: VisibleDOMNodeCapabilities[]) {
    return capabilities.reduce((a, b) => (
      new VisibleDOMNodeCapabilities(
        a ? a.movable   && b.movable   : b.movable,
        b ? a.resizable && b.resizable : b.resizable
      )
    ));
  }
}

export abstract class VisibleSyntheticDOMElement<T extends { uid: string }> extends SyntheticDOMElement {

  @bindable()
  private _absoluteBounds: BoundingRect;

  @bindable()
  private _capabilities: VisibleDOMNodeCapabilities;

  private _computedStyle: T;

  private _currentBounds: BoundingRect;
  private _computedVisibility: boolean;

  protected get renderer(): ISyntheticDocumentRenderer {
    return null;
    // return this.browser.renderer;
  }

  getComputedStyle(): T {
    return this.renderer.getComputedStyle(this.uid);
  }

  getBoundingClientRect(): BoundingRect {
    return this.renderer.getBoundingRect(this.uid);
  }

  getAbsoluteBounds(): BoundingRect {
    if (!this.computeVisibility()) return BoundingRect.zeros();
    return this._absoluteBounds;
  }

  getCapabilities(): VisibleDOMNodeCapabilities {
    if (!this.computeVisibility()) return VisibleDOMNodeCapabilities.notCapableOfAnything();
    return this._capabilities;
  }

  abstract setAbsolutePosition(value: IPoint): void;
  abstract setAbsoluteBounds(value: BoundingRect): void;

  private computeVisibility() {

    const newStyle        = this.getComputedStyle();
    const newBounds       = this.getBoundingClientRect();

    if (!newStyle || !newBounds.visible) {
      this._computedStyle = undefined;
      this._currentBounds = undefined;
      return this._computedVisibility = false;
    }

    const newCapabilities = this.computeCapabilities(newStyle);

    if (this._computedVisibility) {
      if (this._computedStyle.uid === newStyle.uid  && this._currentBounds.equalTo(newBounds) && this._capabilities.equalTo(newCapabilities)) {
        return true;
      }
    }

    this._computedStyle  = newStyle;
    this._currentBounds  = newBounds;
    this._capabilities   = newCapabilities;

    this._absoluteBounds = this.computeAbsoluteBounds(this._computedStyle, this._currentBounds);

    this.onUpdateComputedVisibility();

    return this._computedVisibility = true;
  }
  
  protected onUpdateComputedVisibility() { }

  protected abstract computeAbsoluteBounds(style: any, computedBounds: BoundingRect): BoundingRect;
  protected abstract computeCapabilities(style: any): VisibleDOMNodeCapabilities;
}