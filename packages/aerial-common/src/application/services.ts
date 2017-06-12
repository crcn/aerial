import { Logger } from "../logger";
import { IBrokerBus } from "../dispatchers";
import { loggable, inject } from "../decorators";
import { ApplicationConfigurationProvider } from "./providers";
import {  IDispatcher, IMessageTester, IMessage } from "@tandem/mesh";
import { Kernel, IInjectable, KernelProvider,  PrivateBusProvider } from "../ioc";

/**
 * Application services create the combined functionality of the
 * entiry application.
 */

export abstract class BaseApplicationService implements  IDispatcher<any, any>, IInjectable, IMessageTester<any> {

  protected readonly logger: Logger;

  @inject(PrivateBusProvider.ID)
  protected bus: IBrokerBus;

  @inject(KernelProvider.ID)
  protected kernel: Kernel;

  private _acceptedMessageTypes: string[];

  dispatch(message: IMessage) {
    const method = this[message.type];
    if (method) {
      if (this.logger) {
        this.logger.debug(`${message.type}()`);
      }
      return method.call(this, message);
    }
  }

  $didInject() {
    this.bus.register(this);

    const acceptedMessageTypes = [];

    for (const property of Object.getOwnPropertyNames(this.constructor.prototype)) {
      const value = this[property];
      if (typeof value === "function" && !/^([$_]|constructor)/.test(property.charAt(0))) {
        acceptedMessageTypes.push(property);
      }
    }

    this._acceptedMessageTypes = acceptedMessageTypes;
  }

  public testMessage(message: any) {
    return this._acceptedMessageTypes.length === 0 || this._acceptedMessageTypes.indexOf(message.type) !== -1;
  }
}

/**
 * Core service required for the app to run
 */

export abstract class CoreApplicationService<T> extends BaseApplicationService {
  @inject(ApplicationConfigurationProvider.ID)
  protected config: T;
}