import { IBrokerBus } from "./base";
import { IBus, IMessage, IStreamableBus, TransformStream, FanoutBusTargetsParamType } from "mesh";
/**
 * @deprecated apps should never directly register listeners to a main bus. Instead they should interface
 * with a public collection
 *
 * @export
 * @class BrokerBus
 * @implements {IBrokerBus}
 */
export declare class BrokerBus implements IBrokerBus {
    readonly actors: Array<IBus<any, any>>;
    private _bus;
    constructor(busClass?: {
        new (actors: FanoutBusTargetsParamType<any>): IStreamableBus<any>;
    }, ...actors: Array<IBus<any, any>>);
    register(...actors: Array<IBus<any, any>>): void;
    unregister(...actors: Array<IBus<any, any>>): void;
    dispatch(message: IMessage): TransformStream<any, any>;
}
