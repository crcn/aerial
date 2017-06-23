"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./services");
const components_1 = require("./components");
const providers_1 = require("./providers");
const aerial_common_1 = require("aerial-common");
class FrontEndApplication extends aerial_common_1.ServiceApplication {
    registerProviders() {
        this.kernel.register(new aerial_common_1.KernelProvider(), new providers_1.RootComponentProvider(components_1.RootComponent), 
        // components
        new providers_1.EditorComponentProvider(components_1.VisualEditor.name, components_1.VisualEditor), 
        // services
        new aerial_common_1.ApplicationServiceProvider(services_1.ReactService.name, services_1.ReactService));
    }
}
exports.FrontEndApplication = FrontEndApplication;
//# sourceMappingURL=application.js.map