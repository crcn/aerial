import { ReactService } from "./services";
import { RootComponent, VisualEditor } from "./components";
import { RootComponentProvider, EditorComponentProvider } from "./providers";
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

      // components
      new EditorComponentProvider(VisualEditor.name, VisualEditor),

      // services
      new ApplicationServiceProvider(ReactService.name, ReactService),
    );
  }
}