"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./services");
const aerial_common_1 = require("aerial-common");
class FrontEndApplication extends aerial_common_1.ServiceApplication {
    registerProviders() {
        this.kernel.register(new aerial_common_1.ApplicationServiceProvider(services_1.ReactService.name, services_1.ReactService));
    }
}
exports.FrontEndApplication = FrontEndApplication;
//# sourceMappingURL=application.js.map