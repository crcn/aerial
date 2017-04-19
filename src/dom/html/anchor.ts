import Url =  require("url");
import { bindable, PropertyWatcher } from "@tandem/common";
import { SyntheticHTMLElement } from "./element";
import { SyntheticLocation } from "../../location";

export class SyntheticHTMLAnchorElement extends SyntheticHTMLElement {

  private _location: SyntheticLocation;

  get hostname() { return this._location.hostname; }
  set hostname(value) { this._location.hostname = value; }

  get pathname() { return this._location.pathname; }
  set pathname(value) { this._location.pathname = value; }

  get port() { return this._location.port; }
  set port(value) { this._location.port = value; }

  get protocol() { return this._location.protocol; }
  set protocol(value) { this._location.protocol = value; }

  get hash() { return this._location.hash; }
  set hash(value) { this._location.hash = value; }

  get search() { return this._location.search; }
  set search(value) { this._location.search = value; }


  get host() { return this._location.host; }
  set host(value) { this._location.host = value; }
  
  get href() {
    return this.getAttribute("href");
  }

  set href(value: string) {
    this.setAttribute("href", value);
  }

  createdCallback() {
    super.createdCallback();
    this._location = new SyntheticLocation(this.href || "");
    new PropertyWatcher<SyntheticLocation, string>(this._location, "href").connect((value) => {
      this.setAttribute("href", value);
    });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "href" && this._location) {
      this._location.href = newValue;
    }
  }
}