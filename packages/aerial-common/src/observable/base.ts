import { IBus } from "mesh";
import { CoreEvent } from "../messages";

export interface IObservable {
  observe(actor: IBus<any, any>);
  unobserve(actor: IBus<any, any>);
  notify(event: CoreEvent);
}
