import { LogLevel } from "aerial-common2";
import { initApplication } from "./index";
import { applicationStarted } from "./actions";

const app = initApplication({
  element: document.getElementById("application"),
  log: {
    level: LogLevel.ALL
  }
});

app.dispatch(applicationStarted());
