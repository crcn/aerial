import md5 =  require("md5");
import path =  require("path");
import Url = require("url");
import { IModule } from "../../../sandbox";
import { Dependency } from "../../dependency";
import { IFileResolver } from "../../../resolver";
import { IDependencyContent } from "../../base";
import { DependencyLoaderFactoryProvider } from "../../providers";

import {
  IDependencyLoader,
  IDependencyLoaderResult,
  IResolvedDependencyInfo,
  IDependencyGraphStrategy,
} from "../base";

import {
  IDependencyGraphStrategyOptions
} from "../../graph";

import {
  inject,
  Kernel,
  hasURIProtocol,
  KernelProvider,
  MimeTypeAliasProvider,
} from "aerial-common";


export type dependencyLoaderType = { new(strategy: IDependencyGraphStrategy): IDependencyLoader };

export abstract class BaseDependencyLoader implements IDependencyLoader {
  constructor(readonly strategy: IDependencyGraphStrategy) { }
  abstract load(info: IResolvedDependencyInfo, content: IDependencyContent): Promise<IDependencyLoaderResult>;
}

export class DefaultDependencyLoader implements IDependencyLoader {
  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  constructor(readonly stragegy: DefaultDependencyGraphStrategy, readonly options: any) { }

  async load(dependency: Dependency, content: IDependencyContent): Promise<IDependencyLoaderResult> {
    const importedDependencyUris: string[] = [];

    let current: IDependencyLoaderResult = Object.assign({}, content);

    let loaderProvider: DependencyLoaderFactoryProvider;

    // Some loaders may return the same mime type (such as html-loader, and css-loader which simply return an AST node).
    // This ensures that they don't get re-used.
    const used = {};
    while(current.type && (loaderProvider = DependencyLoaderFactoryProvider.find(MimeTypeAliasProvider.lookup(current.type, this._kernel), this._kernel)) && !used[loaderProvider.id]) {
      used[loaderProvider.id] = true;
      current = await loaderProvider.create(this.stragegy).load(dependency, current);
      if (current.importedDependencyUris) {
        importedDependencyUris.push(...current.importedDependencyUris);
      }
    }

    return {
      map: current.map,
      type: current.type,
      content: current.content,
      importedDependencyUris: importedDependencyUris
    };
  }
}

export class DefaultDependencyGraphStrategy implements IDependencyGraphStrategy {

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  constructor(readonly options: IDependencyGraphStrategyOptions) {
  }

  getLoader(loaderOptions: any): IDependencyLoader {
    return this._kernel.inject(new DefaultDependencyLoader(this, loaderOptions));
  }

  createGlobalContext() {
    return {
    };
  }

  createModuleContext(module: IModule) {
    return {
      module: module,
      exports: module.exports,
      __filename: module.source.uri,
      __dirname: path.dirname(module.source.uri)
    }
  }

  /**
   * TODO - move logic here to HTTP resolver since there's some logic such as resolving indexes, and redirects
   * that also need to be considered here.
   */

  async resolve(relativeUri: string, origin: string): Promise<IResolvedDependencyInfo> {
    
    // TODO - move this logic to HTTPFileResolver instead
    let resolvedUri;
    const uriParts = Url.parse(relativeUri);
    const relativeUriPathname = uriParts.pathname && path.normalize(uriParts.pathname);

    // strip to ensure that
    if (origin) origin = origin.replace("file://", "");

    // protocol?
    if (hasURIProtocol(relativeUri)) {
      resolvedUri = relativeUri;
    } else {
      // root
      if (relativeUri.charAt(0) === "/" || !origin) {
        if (origin && hasURIProtocol(origin)) {
          const originParts = Url.parse(origin);

          // omit slash if relative URI has it
          resolvedUri = originParts.protocol + "//" + originParts.host + (relativeUriPathname.charAt(0) === "/" ? relativeUriPathname : "/" + relativeUriPathname);
        } else {
          resolvedUri = (this.options.rootDirectoryUri || "file:///") + relativeUriPathname;
        }
      } else {
        const originParts = hasURIProtocol(origin) ? Url.parse(origin) : { 
          protocol: "file:",
          host: "",
          pathname: origin
        };

        resolvedUri = originParts.protocol + "//" + path.join(originParts.host || "", path.dirname(originParts.pathname), relativeUriPathname);
      }
    }


    return {
      uri: resolvedUri,
      hash: md5(resolvedUri)
    };
  }
}