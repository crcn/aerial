
import { SequenceBus } from "mesh";
import { ApplicationServiceProvider } from "./providers";
import { LoadApplicationRequest, InitializeApplicationRequest, ApplicationReadyMessage } from "../messages";
import {
  Kernel,
  Provider,
  PrivateBusProvider,
} from '../ioc';


/**
 * @deprecated
 */

export class Application {

  readonly dispatch: any;
  private _initialized: boolean;

  constructor(readonly kernel: Kernel) {
    this.dispatch = PrivateBusProvider.getInstance(kernel);
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

    await this.dispatch(new LoadApplicationRequest());

    this.didLoad();
    this.willInitialize();

    // Notify the application that everything is ready
    await this.dispatch(new InitializeApplicationRequest());
    await this.dispatch(new ApplicationReadyMessage());

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