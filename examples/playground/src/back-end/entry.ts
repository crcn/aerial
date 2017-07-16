import { initApplication } from "./index";
import { createImmutableObject, immutable } from "aerial-common2";

initApplication({
  http: {
    port: 8080
  }
}).run(immutable({}));