import { inject, loggable } from "../decorators";
import { IBus, IMessage } from "mesh7";
import { IBrokerBus } from "../busses";
import {
  Kernel,
  IInjectable,
  KernelProvider,
  PrivateBusProvider,
} from "../ioc";

import { Logger } from "../logger";

export interface ICommand {
  execute(message?: IMessage): any;
}

@loggable()
export abstract class BaseCommand implements ICommand, IInjectable {

  protected readonly logger: Logger;

  @inject(PrivateBusProvider.ID)
  protected bus: IBrokerBus;

  @inject(KernelProvider.ID)
  protected kernel: Kernel;

  abstract execute(message: IMessage);

  $didInject() {}
}
