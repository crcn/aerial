import { IBus } from "mesh";

import { SequenceBus } from "mesh";
import { IBrokerBus, BrokerBus } from "../busses";
import { ApplicationServiceProvider } from "./providers";
import { LoadApplicationRequest, InitializeApplicationRequest, ApplicationReadyMessage } from "../messages";
import {
  Provider,
  Kernel,
  PrivateBusProvider,
} from '../ioc';

/**
 */

export class Application {

  readonly bus: IBrokerBus;
  private _initialized: boolean;

  constructor(readonly kernel: Kernel) {
    this.bus = PrivateBusProvider.getInstance(kernel);
    this.registerProviders();
  }

  /**
   * Bootstraps the application
   */

  async initialize() {
    if (this._initialized) {
      throw new Error(`Attempting to initialize the application after it's already been initialized.`);
    }


    this._initialized = true;
    this.willLoad();

    // Prepare the application for initialization. Kernel that
    // need to be loaded before being used by other kernel should listen on this message
    // here.

    await this.bus.dispatch(new LoadApplicationRequest());

    this.didLoad();
    this.willInitialize();

    // Notify the application that everything is ready
    await this.bus.dispatch(new InitializeApplicationRequest());
    await this.bus.dispatch(new ApplicationReadyMessage());

    this.didInitialize();
  }

  /**
   */

  protected registerProviders() { }

  /**
   */

  protected willLoad() {
    // OVRRIDE ME
  }

  /**
   */

  protected didLoad() {
    // OVERRIDE ME
  }

  /**
   */

  protected willInitialize() {
    // OVERRIDE ME
  }

  /**
   */

  protected didInitialize() {
    // OVERRIDE ME
  }
}


export class ServiceApplication extends Application {
  willLoad() {
    super.willLoad();

    // create the services before loading so that they can hook themselves into the application
    // context.
    for (const serviceProvider of ApplicationServiceProvider.findAll(this.kernel)) {
      serviceProvider.create();
    }
  }
}