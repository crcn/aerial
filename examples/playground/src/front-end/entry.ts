import { noop } from "lodash";
import { readAll } from "mesh";
import { LogLevel, loadAppAction } from "aerial-common2";
import { initApplication, createApplicationState } from "./index";

window.onload = () => {
 readAll(initApplication(createApplicationState({
    element: document.querySelector("#application") as HTMLElement,
    log: {
      level: LogLevel.VERBOSE
    }
  }))(noop)(loadAppAction()));
};