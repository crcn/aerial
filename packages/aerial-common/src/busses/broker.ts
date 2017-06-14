import { IBrokerBus } from "./base";
import assert = require("assert");
import {
  IBus,
  IMessage,
  ParallelBus,
  IStreamableBus,
  TransformStream,
  FanoutBusTargetsParamType,
  IMessageTester
} from "mesh";

/**
 * @deprecated apps should never directly register listeners to a main bus. Instead they should interface
 * with a public collection
 *
 * @export
 * @class BrokerBus
 * @implements {IBrokerBus}
 */

export class BrokerBus implements IBrokerBus {

  readonly actors: Array<IBus<any, any>>;
  private _bus: IStreamableBus<any>;

  constructor(busClass: { new(actors: FanoutBusTargetsParamType<any>): IStreamableBus<any> } = ParallelBus, ...actors: Array<IBus<any, any>>) {
    this.actors = [];

    this._bus = new busClass((message: IMessage) => {

      // dispatches are expensive since they typically use streams. This chunk reduces
      // unecessary operations to dispatch handlers that can't handle a given message.
      const actors = this.actors.filter((actor) => {
        return !(<IMessageTester<any>><any>actor).testMessage || (<IMessageTester<any>><any>actor).testMessage(message);
      });

      return actors;
    });
    this.register(...actors);
  }

  register(...actors: Array<IBus<any, any>>) {
    for (const actor of actors) assert(actor && actor.dispatch);
    this.actors.push(...actors);
  }

  unregister(...actors: Array<IBus<any, any>>) {
    for (const actor of actors) {
      const i = this.actors.indexOf(actor);
      if (i !== -1) {
        this.actors.splice(i, 1);
      }
    }
  }

  dispatch(message: IMessage) {
    return this._bus.dispatch(message);
  }
}