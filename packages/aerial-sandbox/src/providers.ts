import { FileCache } from "./file-cache";
import { ENV_IS_NODE, IProvider } from "aerial-common";
import { FileEditor, contentEditorType, IEditor } from "./edit";
import { IFileResolver } from "./resolver";

import {
  Provider,
  Kernel,
  FactoryProvider,
  MimeTypeProvider,
  ClassFactoryProvider,
  CommandFactoryProvider,
  createSingletonProviderClass,
} from "aerial-common";


export class ContentEditorFactoryProvider extends ClassFactoryProvider {
  static readonly NS = "contentEditors";
  constructor(readonly mimeType: string, readonly clazz: contentEditorType, readonly autoSave: boolean = false) {
    super(ContentEditorFactoryProvider.getNamespace(mimeType), clazz);
  }

  clone() {
    return new ContentEditorFactoryProvider(this.mimeType, this.clazz, this.autoSave);
  }

  static getNamespace(mimeType: string) {
    return [ContentEditorFactoryProvider.NS, mimeType].join("/");
  }

  create(uri: string, content: string): IEditor {
    return super.create(uri, content);
  }

  static find(mimeType: string, kernel: Kernel) {
    return kernel.query<ContentEditorFactoryProvider>(this.getNamespace(mimeType));
  }
}

export interface IProtocolResolver {
  resolve(url: string): Promise<any>;
}

// DEPRECATED - use URIProtocolProvider instead
export class ProtocolURLResolverProvider extends ClassFactoryProvider {
  static readonly NS = "protocolReader";
  constructor(readonly name: string, readonly clazz: { new(): IProtocolResolver }) {
    super(ProtocolURLResolverProvider.getId(name), clazz);
  }
  clone() {
    return new ProtocolURLResolverProvider(this.name, this.clazz);
  }
  create(): IProtocolResolver {
    return super.create();
  }
  static getId(name) {
    return [this.NS, name].join("/");
  }
  static find(url: string, kernel: Kernel): ProtocolURLResolverProvider {
    const provider = kernel.query<ProtocolURLResolverProvider>(this.getId(url.split(":").shift()));
    return provider;
  }
  static resolve(url: string, kernel: Kernel) {
    const provider = this.find(url, kernel);
    return (provider && provider.create().resolve(url)) || url;
  }
}

// export const FileSystemProvider  = createSingletonProviderClass<IFileSystem>("fileSystem");
// export const FileResolverProvider  = createSingletonProviderClass<IFileResolver>("fileResolver");
export const FileCacheProvider  = createSingletonProviderClass<FileCache>("fileCache");
export const FileEditorProvider = createSingletonProviderClass<FileEditor>("fileEditor");

// TODO - this needs to be a singleton based on a given strategy (webpack, systemjs, rollup)
// export const DependencyGraphProvider    = createSingletonProviderClass<DependencyGraph>("bundler");
