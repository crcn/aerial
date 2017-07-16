import { noop } from "lodash";
import { immutable, LogLevel, loadAppAction } from "aerial-common2";
import { initApplication } from "./index";

window.onload = () => 
  Promise.resolve(
    initApplication(immutable({
      element: document.querySelector("#application") as HTMLElement,
      log: {
        level: LogLevel.VERBOSE
      }
    })).run(immutable({
      dispatch: noop
    }))
  ).then((context) => {
    window["_appContext"] = context;
    context.dispatch(loadAppAction());
  });