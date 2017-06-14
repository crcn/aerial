import { ReadFileRequest } from "../messages";
import { inject, BaseCommand } from "aerial-common";
import { URIProtocolProvider, IURIProtocolReadResult } from "../uri";

export class ReadFileCommand extends BaseCommand { 
  execute({ uri }: ReadFileRequest) {
    const protocol = URIProtocolProvider.lookup(uri, this.kernel);
    return protocol.read(uri);
  }
}