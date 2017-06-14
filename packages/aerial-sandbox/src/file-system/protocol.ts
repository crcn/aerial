import fs =  require("fs");
import { URIProtocol } from "../uri";
import { ReadableStream } from "mesh";
import { 
  inject, 
  Kernel, 
  IDisposable, 
  KernelProvider, 
  MimeTypeProvider, 
} from "aerial-common";

export class FileURIProtocol extends URIProtocol {

  @inject(KernelProvider.ID)
  protected readonly kernel: Kernel;

  async read(uri: string) {
    const filePath = this.removeProtocol(uri);
    this.logger.debug("read", filePath);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) return reject(err);
        resolve({
          type: MimeTypeProvider.lookup(uri, this.kernel),
          content: data
        });
      });
    });
  }

  fileExists(uri: string): Promise<boolean> {
    const filePath = this.removeProtocol(uri);
    return new Promise((resolve) => {
      fs.stat(filePath, (err, stat) => {
        if (err) return resolve(err);
        resolve(!stat.isDirectory());
      });
    });
  }

  async write(uri: string, content: any) {
    const filePath = this.removeProtocol(uri);
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, (err, result) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  watch2(uri: string, onChange: () => any) {
    const filePath = this.removeProtocol(uri);
    this.logger.debug("watch", filePath);
    let currentStat = fs.lstatSync(filePath);
    const listener = () => {
      let newStat = fs.lstatSync(filePath);
      if (newStat.mtime.getTime() === currentStat.mtime.getTime()) return;
      currentStat = newStat;
      onChange();
    }

    fs.watchFile(filePath, { interval: 200 }, listener);

    return {
      dispose: () => {
        fs.unwatchFile(filePath, listener);
      }
    }
  }
}