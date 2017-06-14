import { IMessage, IBus, IStreamableBus, DuplexStream, WritableStream, TransformStream } from "mesh";
import { DSInsertRequest, DSRemoveRequest, DSUpdateRequest } from "mesh-crud";
import { PostDSMessage } from "../messages";

export class PostDsNotifierBus implements IStreamableBus<any> {
  constructor(private _dsBus: IStreamableBus<any>, private _dispatcher: IBus<any, any>) { }

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