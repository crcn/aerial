// import { SyntheticWindow } from "../window";
import { URIProtocolProvider } from "aerial-sandbox";
import { IStreamableBus, DuplexStream } from "mesh7";
import { inject, Kernel, KernelProvider, loggable, Logger } from "aerial-common";
import { IHTTPHeaders, HTTPRequest, HTTPResponse, HTTPStatusType } from "./messages";

@loggable()
export class XHRServer implements IStreamableBus<HTTPRequest> {
  
  protected readonly logger: Logger;

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  constructor(window: any) {
    
  }
  
  dispatch(request: HTTPRequest) {
    if (request.type !== HTTPRequest.HTTP_REQUEST) return;
    return new DuplexStream((input, output) => {

      const writer = output.getWriter();

      this.logger.info(`XHR ${request.method} ${request.url}`);

      URIProtocolProvider.lookup(request.url, this._kernel).read(request.url).catch((e) => {
        writer.abort(e);
      }).then((data) => {

        const response = new HTTPResponse(data ? HTTPStatusType.OK : HTTPStatusType.INTERNAL_SERVER_ERROR, {
          contentType: data && data.type || "text/plain"
        });

        writer.write(response);

        writer.write(String(data && data.content));
        writer.close();
      });
    });
  }
}