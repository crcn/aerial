import { ReactService } from "./services";
import { RootComponent } from "./components";
import { RootComponentProvider } from "./providers";
import { 
  KernelProvider,
  ServiceApplication, 
  ApplicationServiceProvider,
} from "aerial-common";

export class FrontEndApplication extends ServiceApplication {
  protected registerProviders() {
    this.kernel.register(
      new KernelProvider(),
      new RootComponentProvider(RootComponent),

      // services
      new ApplicationServiceProvider(ReactService.name, ReactService),
    );
  }
}