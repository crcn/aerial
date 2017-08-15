import { SyntheticWindow } from "../window";
import { SyntheticElement } from "./element";


export class SyntheticHTMLIframeElement extends SyntheticElement  {
  private _contentWindow: SyntheticWindow;
  createdCallback() {
    super.createdCallback();
    this._contentWindow = new SyntheticWindow();
  }
  
  get contentWindow() {
    return this._contentWindow;
  }
}