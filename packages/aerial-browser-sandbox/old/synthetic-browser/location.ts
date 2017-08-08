import Url =  require("url");
import path = require("path");
import { weakMemo } from "aerial-common2";

export const getSyntheticLocationClass = weakMemo((context: any) => {

  return class SyntheticLocation implements Location {

    public hash: string = "";
    public hostname: string = "";
    public href: string = "";
    readonly origin: string;
    public pathname: string = "";
    public port: string = "";
    public protocol: string = "";
    public search: string = "";
    public host: string = "";

    constructor(urlStr: string) {
      // super();
      const parts = Url.parse(urlStr);
      for (const key in parts) {
        this[key] = parts[key] || "";
      }
      this.origin = this.protocol + "//" + this.host;
    }

    assign(url: string) {
      // TODO
    }

    reload(forceReload?: boolean) {

    }

    replace(uri: string) {

    }
  }
});

export const createProxyLocationHandler = (onChange: () => any = (() => {})): ProxyHandler<Location> => ({
  get(location, key) {
    return location[key];
  },
  set(location, key, value, receiver) {
    location[key] = value;
    onChange();
    return true;
  }
});