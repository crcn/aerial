import { 
  HTTPService,
  FrontEndService, 
} from "./services";

import {
  Kernel,
  BrokerBus,
  KernelProvider,
  ConsoleLogService,
  ServiceApplication, 
  PrivateBusProvider,
  ApplicationServiceProvider,
} from "aerial-common";

export class BackEndApplication extends ServiceApplication {
  protected registerProviders() {
    super.registerProviders();
    this.kernel.register(

      // core
      new KernelProvider(),

      // services
      new ApplicationServiceProvider(HTTPService.name, HTTPService),
      new ApplicationServiceProvider(FrontEndService.name, FrontEndService),
      new ApplicationServiceProvider(ConsoleLogService.name, ConsoleLogService),
    );
  }
}