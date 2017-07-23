import { IBus } from "mesh7";
import { CoreEvent } from "../messages";

export interface IObservable {
  observe(actor: IBus<any, any>);
  unobserve(actor: IBus<any, any>);
  notify(event: CoreEvent);
}
