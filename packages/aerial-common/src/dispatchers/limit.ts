import { CoreEvent } from "@tandem/common/messages";
import { IBus, DuplexStream, ReadableStream, WritableStream } from "@tandem/mesh";


// TODO - remove me - use LimitBus from mesh instead
export class LimitBus implements IBus<any> {
  private _queue: Array<{ message: any, input: ReadableStream<any>, output: WritableStream<any> }> = [];
  private _running: number = 0;

  constructor(readonly max: number, readonly actor: IBus<any>) { }

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