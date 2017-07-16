import { noop } from "lodash";
import { documentReady } from "./events";
import { createRootState } from "./state";
import { bootstrapFrontend } from "./index";

window.onload = () => {
  const dispatch = window["_dispatch"] = bootstrapFrontend()({}, createRootState(document.getElementById("application")))(noop);
  documentReady(dispatch);
}
