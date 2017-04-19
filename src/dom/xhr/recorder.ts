import { SyntheticWindow } from "../window";
import { URIProtocolProvider } from "@tandem/sandbox";
import { ObservableCollection } from "@tandem/common";
import { IStreamableDispatcher, DuplexStream, TransformStream } from "@tandem/mesh";
import { IHTTPHeaders, HTTPRequest, HTTPResponse, HTTPStatusType } from "./messages";

/**
 * Records all HTTP requests - used for inspecting network requests & also
 * watching resources that are dynamically loaded into the virtual machine.
 */

export class XHRRecorder implements IStreamableDispatcher<HTTPRequest> {
  
  readonly requests: ObservableCollection<HTTPRequest>;

  constructor(readonly target: IStreamableDispatcher<HTTPRequest>) {
    this.requests = ObservableCollection.create() as any;
  }
  
  dispatch(request: HTTPRequest) {
    this.requests.push(request);
    return this.target.dispatch(request);
  }
}