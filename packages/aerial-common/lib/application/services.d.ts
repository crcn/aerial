import { Logger } from "../logger";
import { IBrokerBus } from "../busses";
import { IBus, IMessageTester, IMessage } from "mesh";
import { Kernel, IInjectable } from "../ioc";
/**
 * Application services create the combined functionality of the
 * entiry application.
 */
export declare abstract class BaseApplicationService implements IBus<any, any>, IInjectable, IMessageTester<any> {
    protected readonly logger: Logger;
    protected bus: IBrokerBus;
    protected kernel: Kernel;
    private _acceptedMessageTypes;
    dispatch(message: IMessage): any;
    $didInject(): void;
    testMessage(message: any): boolean;
}
/**
 * Core service required for the app to run
 */
export declare abstract class CoreApplicationService<T> extends BaseApplicationService {
    protected config: T;
}
