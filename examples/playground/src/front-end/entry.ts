import {FrontEndApplication, IFrontEndConfig} from "./index";
import {
  Kernel, 
  BrokerBus,
  PrivateBusProvider,
  ApplicationConfigurationProvider, 
} from "aerial-common";

const initialize = () => {
  const bus = new BrokerBus();

  const app = window["_app"] = new FrontEndApplication(
    new Kernel(
      new ApplicationConfigurationProvider<IFrontEndConfig>({
        element: document.querySelector("#application") as HTMLElement
      }),
      new PrivateBusProvider(bus)
    )
  );

  return app.initialize();
}


window.onload = initialize;