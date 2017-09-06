import { Action } from "aerial-common2";
import { EventEmitter } from "events";
import { Plugin, Compiler } from "webpack";
import * as path from "path";
import * as fs from "fs";
import { FILE_CONTENT_MUTATED, FileContentMutated } from "../../actions";
import { VirtualStats } from "./virtual-stats";

export class FileCacheUpdaterPlugin implements Plugin {
  private _compiler: any;
  private _fileCache: {
    [identifier: string]: {
      mtime: Date,
      content: Buffer
    }
  }

  constructor() {
    this._fileCache = {};
  }

  dispatch(action: Action) {
    switch(action.type) {
      case FILE_CONTENT_MUTATED: {
        return this._handleFileContentMutated(action as FileContentMutated);
      }
    }
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
      if (self._fileCache[filePath] && getFileMTime(filePath).getTime() < self._fileCache[filePath].mtime.getTime()) {
        fs._readFileStorage.data.set(filePath, [null, self._fileCache[filePath].content]);
      } else {
        self._fileCache[filePath] = undefined;
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

  private _handleFileContentMutated({ filePath, content }: FileContentMutated) {

    this._fileCache[filePath] = {
      
      // add some padded time so that the cache doesn't bust on
      // the next recompile.
      mtime: new Date(Date.now() + 100),
      content: new Buffer(content),
    };

    
    // fool the watcher into emitting a file change event -- this will trigger
    // a recompile.
    fs.writeFileSync(filePath, fs.readFileSync(filePath, "utf8"));
  }
}


const getFileMTime = (filePath: string) => {
  return fs.lstatSync(filePath).mtime;
}