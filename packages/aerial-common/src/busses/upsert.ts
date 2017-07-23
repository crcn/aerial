import sift = require("sift");
import { DuplexStream, IBus, IStreamableBus, readOneChunk } from "mesh7";

export class UpsertBus implements IStreamableBus<any> {
  constructor(private _child: IStreamableBus<any>) {

  }
  dispatch(request) {
    return new DuplexStream(async (input, output) => {
      const writer = output.getWriter();

      const { value, done } = await readOneChunk(this._child.dispatch({
        type           : "find",
        query          : request.query,
        collectionName : request.collectionName,
      }));

      writer.write((await readOneChunk(this._child.dispatch({
        type           : !done ? "update" : "insert",
        data           : request.data,
        query          : request.query,
        collectionName : request.collectionName,
      }))).value);

      writer.close();
    });
  }
}
