import { IContentEdit } from "../edit";
// import { IReadFileResultItem } from "aerial-sandbox/file-system";

import {
  IASTNode,
  serialize,
  deserialize,
  IDisposable,
  Mutation,
  serializable
} from "aerial-common";

import { 
  Message,
  IMessage,
  IBus,
  IStreamableBus,
  readAllChunks,
  readOneChunk,
  ReadableStream,
  WritableStream,
} from "mesh7";

import { IURIProtocolReadResult } from "../uri";


@serializable("UpdateFileCacheRequest")
export class UpdateFileCacheRequest implements IMessage {
  static readonly UPDATE_FILE_CACHE = "updateFileCache";
  readonly type = UpdateFileCacheRequest.UPDATE_FILE_CACHE;
  constructor(readonly uri: string, readonly content: string, readonly updatedAt = Date.now()) {

  }
}

@serializable("ApplyFileEditRequest", {
  serialize({ mutations }: ApplyFileEditRequest) {
    return {
      mutations: mutations.map(serialize)
    }
  },
  deserialize({ mutations }, kernel) {
    return new ApplyFileEditRequest(mutations.map(message => deserialize(message, kernel)));
  }
})
export class ApplyFileEditRequest extends Message {
  static readonly APPLY_EDITS = "applyMutations";
  constructor(readonly mutations: Mutation<any>[], readonly saveFile: boolean = false) {
    super(ApplyFileEditRequest.APPLY_EDITS);
  }
}

export class ModuleImporterAction extends Message {
  static readonly MODULE_CONTENT_CHANGED = "moduleContentChanged";
}

export class SandboxModuleAction extends Message {
  static readonly EVALUATING = "evaluating";
  static readonly EDITED = "edited";
}

export class FileCacheAction extends Message {
  static readonly ADDED_ENTITY = "addedEntity";
  constructor(type: string, readonly item?: any) {
    super(type);
  }
}

@serializable("ReadFileRequest")
export class ReadFileRequest extends Message {
  static readonly READ_FILE = "readFile";
  constructor(readonly uri: string) {
    super(ReadFileRequest.READ_FILE);
  }

  static async dispatch(uri: string, bus: IStreamableBus<any>): Promise<IURIProtocolReadResult> {
    return (await readOneChunk(bus.dispatch(new ReadFileRequest(uri)))).value;
  }
}

@serializable("WriteFileRequest")
export class WriteFileRequest extends Message {
  static readonly WRITE_FILE = "writeFile";
  constructor(readonly uri: string, readonly content: string, readonly options?: any) {
    super(WriteFileRequest.WRITE_FILE);
  }

  static async dispatch(uri: string, content: string, options: any, bus: IStreamableBus<any>): Promise<any> {
    return (await readOneChunk(bus.dispatch(new WriteFileRequest(uri, content, options)))).value;
  }
}

// @serializable("ReadDirectoryRequest")
// export class ReadDirectoryRequest extends Message {
//   static readonly READ_DIRECTORY = "readDirectory";
//   constructor(readonly directoryPath: string) {
//     super(ReadDirectoryRequest.READ_DIRECTORY);
//   }

//   static dispatch(directoryPath: string, bus: IStreamableBus<any>): ReadableStream<IReadFileResultItem[]> {
//     return bus.dispatch(new ReadDirectoryRequest(directoryPath)).readable;
//   }
// }

@serializable("WatchFileRequest")
export class WatchFileRequest extends Message {
  static readonly WATCH_FILE = "watchFile";
  constructor(readonly uri: string) {
    super(WatchFileRequest.WATCH_FILE);
  }

  static dispatch(uri: string, bus: IStreamableBus<any>, onFileChange: () => any): IDisposable {
    const { readable } = bus.dispatch(new WatchFileRequest(uri));
    readable.pipeTo(new WritableStream({
      write: onFileChange
    }));

    return {
      dispose: () => readable.cancel(undefined)
    };
  }
}