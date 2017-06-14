import { FileEditor } from "./edit";
import { DependencyGraph } from "./dependency-graph";
import { FileURIProtocol } from "./file-system";
import { FileCache, FileCacheProtocol } from "./file-cache";
import { ENV_IS_NODE, IProvider } from "aerial-common";
import { IFileResolver } from "./resolver";
import { DependencyGraphProvider, DependencyGraphStrategyProvider } from "./dependency-graph";
import {
  FileCacheProvider,
  FileEditorProvider,
  // FileResolverProvider,
  ProtocolURLResolverProvider,
} from "./providers";

import { HTTPURIProtocol, URIProtocolProvider, DataURIProtocol } from "./uri";

export function createSandboxProviders(fileResoverClass?: { new(): IFileResolver }) {
  return [
    // new FileSystemProvider(fileSystemClass || (ENV_IS_NODE ?  LocalFileSystem : RemoteFileSystem)),
    // new FileResolverProvider(fileResoverClass || (ENV_IS_NODE ? LocalFileResolver : RemoteFileResolver)),
    new FileCacheProvider(FileCache),
    new URIProtocolProvider("data", DataURIProtocol),
    new URIProtocolProvider("file", FileURIProtocol),
    new URIProtocolProvider("http", HTTPURIProtocol),
    new URIProtocolProvider("https", HTTPURIProtocol),
    new URIProtocolProvider("cache", FileCacheProtocol),
    new FileEditorProvider(FileEditor),
    new DependencyGraphProvider(DependencyGraph)
  ];
}