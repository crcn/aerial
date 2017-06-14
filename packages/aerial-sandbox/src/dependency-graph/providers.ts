import {
  Kernel,
  Provider,
  MimeTypeProvider,
  ClassFactoryProvider,
} from "aerial-common";

import {
  DependencyGraph,
  IDependencyGraphStrategyOptions
} from "./graph";

import {
  IDependencyLoader,
  dependencyLoaderType,
  DefaultDependencyGraphStrategy,
  IDependencyGraphStrategy,
} from "./strategies";

export class DependencyLoaderFactoryProvider extends ClassFactoryProvider {
  static readonly NS = "bundleLoader";
  constructor(readonly mimeType: string, value: dependencyLoaderType) {
    super(DependencyLoaderFactoryProvider.getNamespace(mimeType), value);
  }
  static getNamespace(mimeType: string) {
    return [DependencyLoaderFactoryProvider.NS, mimeType].join("/");
  }
  create(strategy: IDependencyGraphStrategy): IDependencyLoader {
    return super.create(strategy);
  }
  static find(mimeType: string, kernel: Kernel): DependencyLoaderFactoryProvider {
    return kernel.query<DependencyLoaderFactoryProvider>(this.getNamespace(mimeType));
  }
  clone() {
    return new DependencyLoaderFactoryProvider(this.mimeType, this.value);
  }
}

export class DependencyGraphStrategyProvider extends ClassFactoryProvider {
  static ID = "dependencyGraphStrategies";
  constructor(readonly name: string, clazz: { new(config:any): IDependencyGraphStrategy }) {
    super(DependencyGraphStrategyProvider.getNamespace(name), clazz);
  }

  static getNamespace(name: string) {
    return [DependencyGraphStrategyProvider.ID, name].join("/");
  }

  static create(strategyName: string, options: any, kernel: Kernel): IDependencyGraphStrategy {
    const dependency = kernel.query<DependencyGraphStrategyProvider>(this.getNamespace(strategyName));
    return dependency ? dependency.create(options) : kernel.inject(new DefaultDependencyGraphStrategy(options));
  }
}

export class DependencyGraphProvider extends Provider<any> {
  static ID = "dependencyGraphs";
  private _instances: { [Identifier:string]: DependencyGraph };
  constructor(readonly clazz: { new(strategy: IDependencyGraphStrategy): DependencyGraph }) {
    super(DependencyGraphProvider.ID, clazz);
    this._instances = {};
  }
  clone() {
    return new DependencyGraphProvider(this.clazz);
  }
  getInstance(options: IDependencyGraphStrategyOptions): DependencyGraph {
    const hash = JSON.stringify(options);
    const strategyName = (options && options.name) || "default";
    if (this._instances[hash]) return this._instances[hash];
    return this._instances[hash] = this.owner.inject(new this.clazz(DependencyGraphStrategyProvider.create(strategyName, options, this.owner)));
  }
  static getInstance(options: IDependencyGraphStrategyOptions, kernel: Kernel): DependencyGraph {
    return kernel.query<DependencyGraphProvider>(this.ID).getInstance(options);
  }
}

export class DependencyGraphStrategyOptionsProvider extends Provider<IDependencyGraphStrategyOptions> {
  static readonly NS = "dependencyGraphStrategyOptions";
  constructor(readonly name: string, readonly test: (uri: string) => boolean, readonly options: IDependencyGraphStrategyOptions) {
    super(DependencyGraphStrategyOptionsProvider.getId(name), options);
  }
  static getId(name: string) {
    return [this.NS, name].join("/");
  }
  clone() {
    return new DependencyGraphStrategyOptionsProvider(this.name, this.test, this.options);
  }
  static find(uri: string, kernel: Kernel): IDependencyGraphStrategyOptions {
    const provider = kernel.queryAll<DependencyGraphStrategyOptionsProvider>(this.getId("**")).find(provider => provider.test(uri));
    return provider && provider.value;
  }
}
