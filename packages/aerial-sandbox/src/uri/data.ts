import { URIProtocol } from "./protocol";
import { ENV_IS_NODE } from "aerial-common";


function parseDataURI(uri: string): { type: string, content: string } {
  const parts = uri.match(/data:(.*?),(.*)/);
  return parts && { type: parts[1], content: parts[2] };
}

export class DataURIProtocol extends URIProtocol {
  read(uri: string) {
    const data = parseDataURI(uri);
    if (!data) throw new Error(`Cannot load ${uri}.`);
    return Promise.resolve({
      type: data.type, 
      content: new Buffer(data.content, "base64")
    });
  }

  async write(uri: string, content: string) {
    // nothing for now
  }

  fileExists(uri: string) {
    return Promise.resolve(!!parseDataURI(uri));
  }

  watch2(uri: string, listener: () => any) {
    return {
      dispose() { }
    }
  }
}