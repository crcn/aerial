import { IBus, IDispatcher } from "@tandem/mesh";

export interface IBrokerBus extends IBus<any> {
  actors: Array<IDispatcher<any, any>>;
  register(actor: IDispatcher<any, any>);
  unregister(actor: IDispatcher<any, any>);
}