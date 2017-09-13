import { initApplication } from "./index";
import { LogLevel } from "aerial-common2";

window["startMaster"] = (entryHashes: string[]) => {
  initApplication({
    entryHashes,
    log: {
      level: LogLevel.ALL
    }
  });
}