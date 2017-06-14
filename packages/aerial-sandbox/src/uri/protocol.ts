import { inject, IDisposable, loggable, Logger } from "aerial-common"; 

export interface IURIWatcher {
  dispose(): any;
}

// TODO - URI needs to be wrapped around a file object so that certain
// protocols such data:// can be written to

export interface IURIProtocolReadResult {
  type: string;
  content: string|Buffer;
}

@loggable()
export abstract class URIProtocol {
  protected readonly logger: Logger;

  private _watchers: {
    [Identifier: string]: {
      listeners: Function[],
      instance: IURIWatcher
    }
  } = {};

  // TODO - this must return { type: mimeType, content: any }
  abstract read(uri: string): Promise<IURIProtocolReadResult>;
  abstract write(uri: string, content: any, options?: any): Promise<any>;
  abstract fileExists(uri: string): Promise<boolean>;

  watch(uri: string, onChange: () => any) {

    let _fileWatcher: { instance: IURIWatcher, listeners: Function[] };

    if (!(_fileWatcher = this._watchers[uri])) {
      _fileWatcher = this._watchers[uri] = {
        listeners: [],
        instance: this.watch2(uri, () => {
          for (let i = _fileWatcher.listeners.length; i--;) {
            _fileWatcher.listeners[i]();
          }
        })
      }
    }

    const { listeners, instance } = _fileWatcher;

    listeners.push(onChange);

    return {
      dispose: () => {
        const index = listeners.indexOf(onChange);
        if (index === -1) return;
        listeners.splice(index, 1);
        if (listeners.length === 0) {
          instance.dispose();
        }
      }
    }
  }


  protected abstract watch2(uri: string, onChange: () => any): IDisposable;

  protected removeProtocol(uri: string) {
    return uri.replace(/^\w+:\/\//, "");
  }
}
