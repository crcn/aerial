import { IMessage, IDispatcher, DSInsertRequest, DSRemoveRequest, DSUpdateRequest, IBus, DuplexStream, WritableStream, TransformStream } from "@tandem/mesh";
import { PostDSMessage } from "@tandem/common/messages";

export class PostDsNotifierBus implements IBus<any> {
  constructor(private _dsBus: IBus<any>, private _dispatcher: IDispatcher<any, any>) { }

  dispatch(message: IMessage) {

    if ([DSInsertRequest.DS_INSERT, DSRemoveRequest.DS_REMOVE, DSUpdateRequest.DS_UPDATE].indexOf(message.type) > -1) {
      return new DuplexStream((input, output) => {
        const writer = output.getWriter();
        this._dsBus.dispatch(message).readable.pipeTo(new WritableStream({
          write: (chunk) => {
            writer.write(chunk);
            this._dispatcher.dispatch(PostDSMessage.createFromDSRequest(<any>message, chunk));
          }
        })).then(writer.close.bind(writer)).catch(writer.abort.bind(writer));
      });
    }

    return this._dsBus.dispatch(message);
  }
}