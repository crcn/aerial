import Url =  require("url");
import path = require("path");
import { bindable, PropertyWatcher, Observable } from "@tandem/common";

export class SyntheticLocation extends Observable {

  private _ignoreRebuild: boolean;

  @bindable()
  public href: string = "";

  @bindable()
  public hash: string = "";

  @bindable()
  public search: string = "";

  @bindable()
  public pathname: string = "";

  @bindable()
  public port: string = "";

  @bindable()
  public hostname: string = "";

  @bindable()
  public protocol: string = "";

  constructor(urlStr: string) {
    super();
    this.$copyPropertiesFromUrl(urlStr);

    
    ["hostname", "pathname", "port", "protocol", "hash", "query"].forEach((part) => {
      new PropertyWatcher(this, part).connect(this._rebuildHref);
    });

    new PropertyWatcher(this, "href").connect(this._parseHref);
  }

  get host() {
    return this.hostname + (this.port && this.port.length ? ":" + this.port : "");
  }

  set host(value: string) {

    const [hostname, port] = (value || ":").split(":");

    this._ignoreRebuild = true;
    this.hostname = hostname;
    this._ignoreRebuild = false;
    this.port = port;
  }

  toString() {
    return this.href;
  }

  clone() {
    return new SyntheticLocation(this.toString());
  }

  $copyPropertiesFromUrl(url: string) {
    const parts = Url.parse(url);
    for (const part in parts) {
      const value = parts[part];
      if (value) this[part] = value;
    };
    return this;
  }

  $redirect(url: string) {
    this._ignoreRebuild = true;
    const parts = Url.parse(url);
    if (parts.pathname) {
      this.pathname = parts.pathname.charAt(0) === "/" ? parts.pathname : path.dirname(this.pathname) + "/" + parts.pathname;
    }
    this._ignoreRebuild = false;
    this._rebuildHref();
  }

  private _parseHref = () => {
    this._ignoreRebuild = true;
    const href = this.href;
    const parts = Url.parse(href);
    for (const key in parts) {
      if (key === "host") continue;
      this[key] = parts[key] || "";
    }
    this._ignoreRebuild = false;
  }

  private _rebuildHref = () => {
    if (this._ignoreRebuild) return;
    this.href = (this.protocol ? this.protocol + "//" : "") + 
    this.host + 
    this.pathname + this.search + 
    (this.hash && (this.hash.charAt(0) === "#" ? this.hash : "#" + this.hash));
  }
}