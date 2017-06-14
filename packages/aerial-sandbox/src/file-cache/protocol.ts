import { inject, Kernel, KernelProvider } from "aerial-common";
import { URIProtocol, IURIProtocolReadResult, URIProtocolProvider } from "../uri";
import { FileCacheProvider } from "../providers";
import { FileCacheItem } from "./item";

import { FileCache } from "./file-cache";

export const getCacheUri = (uri) => {
  return `cache://${new Buffer(uri).toString("base64")}`;
}

export class FileCacheProtocol extends URIProtocol {

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  async read(uri: string) {
    const item = await this._find(uri);
    return item && await item.read();
  }

  watch2(uri: string, onChange: () => any) {
    this.logger.info(`Cannot currently watch file cache items`);
    return {
      dispose() {
      }
    }
  }
  
  decode(uri: string) {
    return new Buffer(this.removeProtocol(uri), "base64").toString("utf8");
  }

  async fileExists(uri: string) {
    return !!(await this._find(uri));
  }

  async write(uri: string, content: any) {
    let type;

    const decodedUri = this.decode(uri);

    // inefficient, but we need to store the content as the same data type
    // as the source URI -- which can only (currently) be fetched by reading the doc.
    // Might be good to implement a separate protocol.readContentType() method instead.
    try {
      type = (await URIProtocolProvider.lookup(decodedUri, this._kernel).read(decodedUri)).type;
    } catch(e) {
      // eat it -- file cache will provide content type
    }
    
    return this._fileCache.save(decodedUri, { type, content });
  }

  _find(uri: string) {
    return this._fileCache.collection.loadItem({ sourceUri: this.decode(uri) });
  }
}