import { LogLevel } from "aerial-common2";
import { initApplication } from "./index";
import { applicationStarted } from "./actions";
import { getRouterLocation } from "./utils";

const app = initApplication({
  apiHost: "localhost:8083",
  element: document.getElementById("application"),
  router: {
    location: getRouterLocation(window.location)
  },
  log: {
    level: LogLevel.ALL
  }
});

app.dispatch(applicationStarted());
