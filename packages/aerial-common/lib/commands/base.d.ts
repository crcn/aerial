import { IMessage } from "mesh";
import { IBrokerBus } from "../busses";
import { Kernel, IInjectable } from "../ioc";
import { Logger } from "../logger";
export interface ICommand {
    execute(message?: IMessage): any;
}
export declare abstract class BaseCommand implements ICommand, IInjectable {
    protected readonly logger: Logger;
    protected bus: IBrokerBus;
    protected kernel: Kernel;
    abstract execute(message: IMessage): any;
}
