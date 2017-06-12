import { IDispatcher } from "@tandem/mesh";
import { CoreEvent } from "@tandem/common/messages";

export interface IObservable {
  observe(actor: IDispatcher<any, any>);
  unobserve(actor: IDispatcher<any, any>);
  notify(event: CoreEvent);
}
