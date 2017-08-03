import Url =  require("url");
import path = require("path");
import { weakMemo } from "aerial-common2";

export const getSEnvLocationClass = weakMemo((window: Window) => {

  return class SEnvLocation implements Location {

    private _ignoreRebuild: boolean;


    public hash: string = "";
    public hostname: string = "";
    public href: string = "";
    readonly origin: string;
    public pathname: string = "";
    public port: string = "";
    public protocol: string = "";
    public search: string = "";

    constructor(urlStr: string) {
      // super();
      this.origin = urlStr;
    }

    get host() {
      return "";
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