import { IStreamableBus, IBus } from "mesh7";

export interface IBrokerBus extends IStreamableBus<any> {
  actors: Array<IBus<any, any>>;
  register(actor: IBus<any, any>);
  unregister(actor: IBus<any, any>);
}