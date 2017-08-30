import { initApplication } from "./index";
import { LogLevel } from "aerial-common2";
import { BundleEntryInfo } from "../../common";

window["startPreview"] = (hash: string, info: BundleEntryInfo) => {
  initApplication({
    entryHash: hash,
    entryInfo: info,
    log: {
      level: LogLevel.ALL
    }
  });
}