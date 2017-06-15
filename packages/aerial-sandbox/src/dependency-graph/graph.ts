import memoize =  require("memoizee");
import { IModule } from "../sandbox";

import { 
  IDependencyLoader,
  IResolvedDependencyInfo,
  IDependencyGraphStrategy,
  DefaultDependencyGraphStrategy,
} from "./strategies";

import { 
  Dependency,
  IDependencyData,
} from "./dependency";

import {
  Logger,
  inject,
  loggable,
  Kernel,
  Observable,
  KernelProvider,
  ActiveRecordCollection,
} from "aerial-common";


export interface IDependencyGraphStrategyOptions {
  name?: string;
  rootDirectoryUri?: string;
  config?: any;
}

export interface IDependencyGraph {
  createGlobalContext();
  createModuleContext(module: IModule);
  getLoader(options: any): IDependencyLoader;
  eagerFindByHash(hash): Dependency;
  resolve(uri: string, cwd: string): Promise<IResolvedDependencyInfo>;
  getDependency(info: IResolvedDependencyInfo): Promise<Dependency>;
  loadDependency(info: IResolvedDependencyInfo): Promise<Dependency>;
}

/**
 * Singleton graph dependency for mapping and transforming application source code
 * into one bundle file.
 */

@loggable()
export class DependencyGraph extends Observable implements IDependencyGraph {

  protected readonly logger: Logger;

  private _collection: ActiveRecordCollection<Dependency, IDependencyData>;
  public $strategy: IDependencyGraphStrategy;

  @inject(KernelProvider.ID)
  public $kernel: Kernel;

  constructor(private _strategy: IDependencyGraphStrategy) {
    super();
  }

  $didInject() {

    // temporary - this should be passed into the constructor
    this.$strategy = this._strategy;
    this._collection = new ActiveRecordCollection(this.collectionName, this.$kernel, (source: IDependencyData) => {
      return this.$kernel.inject(new Dependency(source, this.collectionName, this));
    });

    this.logger.generatePrefix = () => `(~${this.$strategy.constructor.name}~) `;
    this.logger.debug("Created");

    this.collection.sync();
  }

  get collection() {
    return this._collection;
  }

  createGlobalContext() {
    return this.$strategy.createGlobalContext();
  }

  createModuleContext(module: IModule) {
    return this.$strategy.createModuleContext(module);
  }

  getLoader(options: any) {
    return this.$strategy.getLoader(options);
  }

  get collectionName() {
    return "dependencyGraph";
  }

  /**
   * Looks for a loaded item. Though, it may not exist in memory, but it *may* exist in some other
   * process.
   */

  eagerFindByHash(hash): Dependency {
    return this.collection.find((entity) => entity.hash === hash);
  }

  /**
   */

  resolve(uri: string, origin?: string): Promise<IResolvedDependencyInfo> {
    return this.$strategy.resolve(uri, origin);
  }

  /**
   */

  getDependency = memoize(async (ops: IResolvedDependencyInfo): Promise<Dependency> => {
    return this.eagerFindByHash(ops.hash) || await this.collection.loadOrInsertItem({ hash: ops.hash }, ops);
  }, { promise: true, normalizer: args => args[0].hash }) as (ops: IResolvedDependencyInfo) => Promise<Dependency>;

  /**
   */

  loadDependency = memoize(async (ops: IResolvedDependencyInfo): Promise<Dependency> => {
    const entry  = await this.getDependency(ops);
    const logTimer = this.logger.startTimer();
    await entry.load();
    logTimer.stop(`Loaded ${ops.uri}`);
    return entry;
  }, { promise: true, normalizer: args => args[0].hash }) as (ops: IResolvedDependencyInfo) => Promise<Dependency>;
}
