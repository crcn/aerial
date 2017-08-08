import { SyntheticWindow } from "../window";
import { SyntheticHTMLElement } from "./element";


export class SyntheticHTMLIframeElement extends SyntheticHTMLElement  {
  private _contentWindow: SyntheticWindow;
  createdCallback() {
    super.createdCallback();
    this._contentWindow = new SyntheticWindow();
  }
  
  get contentWindow() {
    return this._contentWindow;
  }
}