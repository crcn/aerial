import { resolve } from "path";
import { readAll } from "mesh";
import { bootstrapBackend, BackendOptions, createRootState } from "./index";
import {
  
} from "aerial-common2";

// // TODO - point to browser prop on package.json
const FRONT_END_ENTRY_PATH = resolve(__dirname, "..", "front-end", "entry.bundle.js");

const dispatch = bootstrapBackend({
  state: createRootState()
});

readAll(dispatch({
  type: "DO SOMETHING"
}));

// import {resolve} from "path";
// import {BackEndApplication, IBackEndApplicationConfig} from "./index";
// import {
//   Kernel, 
//   BrokerBus,
//   PrivateBusProvider,
//   ApplicationConfigurationProvider
// } from "aerial-common";

// const bus = new BrokerBus();


// const app = new BackEndApplication(
//   new Kernel(
//     new PrivateBusProvider(bus),
//     new ApplicationConfigurationProvider<IBackEndApplicationConfig>({
//       http: {
//         port: Number(process.env.PORT || 8080),
//       },
//       frontEnd: {
//         entryPath: FRONT_END_ENTRY_PATH
//       }
//     })
//   )
// );

// app.initialize();

