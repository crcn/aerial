import net =  require("net");
import { ISerializer } from "..";
import { IBus, IMessageTester, IStreamableBus, RemoteBus, RemoteBusMessageTester, DuplexStream, TransformStream } from "mesh";

// Important that the boundary is computed is to prevent the case where the boundary is part of the payload. This
// has happened with Tandem since the app is used to build itself.
const PAYLOAD_BOUNDARY = `___${"payload end"}___`;

export interface ISockBusOptions {
  family: string;
  connection: net.Socket;
  testMessage: RemoteBusMessageTester<any>;
}

export class SockBus implements IStreamableBus<any>, IMessageTester<any> {
  private _remoteBus: RemoteBus<any>;
  constructor({ family, connection, testMessage }: ISockBusOptions, localBus: IBus<any, any>, serializer?: ISerializer<any, any>) {

    connection.once("close", () => {
      this._remoteBus.dispose();
    });

    this._remoteBus = new RemoteBus({
      family: family,
      testMessage: testMessage,
      adapter: {
        send: (data) => {
          connection.write(`${JSON.stringify(data)}${PAYLOAD_BOUNDARY}`);
        },
        addListener: (listener: (data) => any) => {
          let currentBuffer = '';

          connection.on("data", (chunk) => {
            let value = String(chunk);

            currentBuffer += value;

            if (currentBuffer.indexOf(PAYLOAD_BOUNDARY) !== -1) {
              const payloadParts = currentBuffer.split(PAYLOAD_BOUNDARY);
              const last = payloadParts.pop();
              payloadParts.map(text => JSON.parse(text)).forEach(listener);
              currentBuffer = last;
            }
          });
        }
      }
    }, localBus, serializer);
  }

  testMessage(message) {
    return this._remoteBus.testMessage(message);
  }

  dispose() {
    this._remoteBus.dispose();
  }

  dispatch(message: any) {
    return this._remoteBus.dispatch(message);
  }
}