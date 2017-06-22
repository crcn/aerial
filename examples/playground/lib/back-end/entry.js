"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const index_1 = require("./index");
const aerial_common_1 = require("aerial-common");
const bus = new aerial_common_1.BrokerBus();
// TODO - point to browser prop on package.json
const FRONT_END_ENTRY_PATH = path_1.resolve(__dirname, "..", "front-end", "entry.bundle.js");
const app = new index_1.BackEndApplication(new aerial_common_1.Kernel(new aerial_common_1.PrivateBusProvider(bus), new aerial_common_1.ApplicationConfigurationProvider({
    http: {
        port: Number(process.env.PORT || 8080),
    },
    frontEnd: {
        entryPath: FRONT_END_ENTRY_PATH
    }
})));
app.initialize();
//# sourceMappingURL=entry.js.map