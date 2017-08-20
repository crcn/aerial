import Url =  require("url");
import path = require("path");
import { weakMemo } from "aerial-common2";

export const getSEnvLocationClass = weakMemo((context: any) => {

  return class SEnvLocation implements Location {

    public hash: string = "";
    public hostname: string = "";
    public href: string = "";
    readonly origin: string;
    public pathname: string = "";
    public port: string = "";
    public protocol: string = "";
    public search: string = "";
    public host: string = "";

    constructor(private _urlStr: string, private _reload?: () => any) {
      // super();
      const parts = Url.parse(_urlStr);
      for (const key in parts) {
        this[key] = parts[key] || "";
      }
      this.origin = this.protocol + "//" + this.host;
    }

    assign(url: string) {
      // TODO
    }

    reload(forceReload?: boolean) {
      if (this._reload) {
        this._reload();
      }
    }

    replace(uri: string) {

    }

    toString() {
      return this._urlStr;
    }
  }
});