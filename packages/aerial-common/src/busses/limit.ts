import { CoreEvent } from "../messages";
import { IBus, IStreamableBus, DuplexStream, ReadableStream, WritableStream } from "mesh7";


// TODO - remove me - use LimitBus from mesh instead
export class LimitBus implements IStreamableBus<any> {
  private _queue: Array<{ message: any, input: ReadableStream<any>, output: WritableStream<any> }> = [];
  private _running: number = 0;

  constructor(readonly max: number, readonly actor: IStreamableBus<any>) { }

  dispatch(message: CoreEvent) {
    return new DuplexStream((input, output) => {
      if (this._running > this.max) {
        this._queue.push({ message, input, output });
        return;
      }
      this._running++;

      const complete = () => {
        this._running--;
        if (this._queue.length) {
          const { message, input, output } = this._queue.shift();
          input.pipeThrough(this.dispatch(message)).pipeTo(output);
        }
      };

      input.pipeThrough(this.actor.dispatch(message)).pipeTo(output).then(complete, complete);
    });
  }
}