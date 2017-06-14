import { inject, BaseCommand } from "aerial-common";
import { URIProtocolProvider } from "../uri";
import { WriteFileRequest } from "../messages";

export class WriteFileCommand extends BaseCommand { 
  execute({ uri, content, options }: WriteFileRequest) {
    const protocol = URIProtocolProvider.lookup(uri, this.kernel);
    return protocol.write(uri, content, options);
  }
}