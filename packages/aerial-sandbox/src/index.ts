import { CommandFactoryProvider } from "aerial-common";
import { ReadFileRequest, WriteFileRequest, UpdateFileCacheRequest } from "./messages";
import { WriteFileCommand, ReadFileCommand, UpdateFileCacheCommand } from "./commands";

export const createCommandProviders = () => {
  return [
    new CommandFactoryProvider(ReadFileRequest.READ_FILE, ReadFileCommand),
    new CommandFactoryProvider(WriteFileRequest.WRITE_FILE, WriteFileCommand),
    new CommandFactoryProvider(UpdateFileCacheRequest.UPDATE_FILE_CACHE, UpdateFileCacheCommand)
  ];
}



export * from "./providers";
export * from "./messages";
export * from "./synthetic";
export * from "./file-system";
export * from "./resolver";
export * from "./dependency-graph";
export * from "./file-cache";
export * from "./sandbox";
export * from "./edit";
export * from "./core";
export * from "./uri";
export * from "./commands";
