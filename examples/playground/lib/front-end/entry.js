"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const aerial_common_1 = require("aerial-common");
const initialize = () => {
    const bus = new aerial_common_1.BrokerBus();
    const app = window["_app"] = new index_1.FrontEndApplication(new aerial_common_1.Kernel(new aerial_common_1.ApplicationConfigurationProvider({
        element: document.querySelector("#application")
    }), new aerial_common_1.PrivateBusProvider(bus)));
    return app.initialize();
};
window.onload = initialize;
//# sourceMappingURL=entry.js.map