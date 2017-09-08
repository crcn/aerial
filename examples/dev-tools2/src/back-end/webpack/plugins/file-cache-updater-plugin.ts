import { Action } from "aerial-common2";
import { EventEmitter } from "events";
import { Plugin, Compiler } from "webpack";
import * as path from "path";
import { FILE_CONTENT_MUTATED, FileContentMutated } from "../../actions";
import { ApplicationState, getFileCacheItem } from "../../state";
import { VirtualStats } from "./virtual-stats";

export class FileCacheUpdaterPlugin implements Plugin {
  private _appState: ApplicationState;
  private _compiler: any;

  constructor() {
  }

  setRootState(state: ApplicationState) {
    this._appState = state;
  }

  apply(compiler: any) {
    this._compiler = compiler;    
    const self: FileCacheUpdaterPlugin = this;

    function resolverPlugin({ path: directory, request: relativePath }, cb) {
      let filePath: string;

      // may bust if loader is part of the request path. Not 
      // suported for now. 
      try {
        filePath = relativePath.charAt(0) === "/" ? relativePath : require.resolve(path.join(directory, relativePath));
      } catch(e) {
        return cb();
      }

      const fs = this.fileSystem;

      // check file cache AND make sure that it is not older than the file system
      // copy. 
      const fileCache = getFileCacheItem(filePath, self._appState);
      if (fileCache) {
        fs._readFileStorage.data.set(filePath, [null, fileCache[filePath].content]);
      }
      cb();
    }

    if (!compiler.resolvers.normal) {
      compiler.plugin("after-resolvers", () => {
        compiler.resolvers.normal.plugin("before-resolve", resolverPlugin);
      });
    } else {
      compiler.resolvers.normal.plugin("before-resolve", resolverPlugin);
    }
  }
}