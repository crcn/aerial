import { IStreamableBus, IBus } from "mesh";
export interface IBrokerBus extends IStreamableBus<any> {
    actors: Array<IBus<any, any>>;
    register(actor: IBus<any, any>): any;
    unregister(actor: IBus<any, any>): any;
}
