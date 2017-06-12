import { inject, loggable } from "@tandem/common/decorators";
import { IBus, IMessage } from "@tandem/mesh";
import { IBrokerBus } from "../dispatchers";
import {
  Kernel,
  IInjectable,
  KernelProvider,
  PrivateBusProvider,
} from "@tandem/common/ioc";

import { Logger } from "@tandem/common/logger";

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
}
