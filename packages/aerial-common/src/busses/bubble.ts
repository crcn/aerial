import { CoreEvent } from "../messages";
import { IBus } from "mesh";
import { IObservable } from "../observable";

export class BubbleDispatcher implements IBus<any, any> {
  constructor(readonly target: IObservable) { }
  dispatch(event: CoreEvent) {
    this.target.notify(event);
  }
}