"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./services");
const aerial_common_1 = require("aerial-common");
class BackEndApplication extends aerial_common_1.ServiceApplication {
    registerProviders() {
        super.registerProviders();
        this.kernel.register(
        // core
        new aerial_common_1.KernelProvider(), 
        // services
        new aerial_common_1.ApplicationServiceProvider(services_1.HTTPService.name, services_1.HTTPService), new aerial_common_1.ApplicationServiceProvider(services_1.FrontEndService.name, services_1.FrontEndService), new aerial_common_1.ApplicationServiceProvider(aerial_common_1.ConsoleLogService.name, aerial_common_1.ConsoleLogService));
    }
}
exports.BackEndApplication = BackEndApplication;
//# sourceMappingURL=application.js.map