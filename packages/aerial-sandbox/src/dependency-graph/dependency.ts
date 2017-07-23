import path =  require("path");
import memoize =  require("memoizee");

import { pull, values } from "lodash";
import { RawSourceMap } from "source-map";
import { IDependencyGraph } from "./graph";
import { DependencyEvent } from "./messages";
import { FileCache, FileCacheItem } from "../file-cache";

import {
  IDependencyLoaderResult,
  IResolvedDependencyInfo,
} from "./strategies"
import { DependencyGraphWatcher } from "./watcher";

import {
  FileCacheProvider,
} from "../providers";



import { CallbackBus, IBus } from "mesh7";

import {
  inject,
  Logger,
  Status,
  loggable,
  Kernel,
  bindable,
  LogLevel,
  IWalkable,
  Observable,
  TreeWalker,
  IInjectable,
  ITreeWalker,
  watchProperty,
  MimeTypeProvider,
  BaseActiveRecord,
  KernelProvider,
  PropertyMutation,
  MutationEvent,
  PLAIN_TEXT_MIME_TYPE,
  DisposableCollection,
} from "aerial-common";

export interface IDependencyData {
  hash: string;
  uri: string;
  loaderOptions?: any;
  content?: string;
  map?: RawSourceMap;
  type?: string;
  updatedAt?: number;
  sourceUpdatedAt?: number;
  importedDependencyInfo?: IResolvedDependencyInfo[];
  includedDependencyInfo?: IResolvedDependencyInfo[];
}

// TODO - cover case where depenedency doesn't exist

@loggable()
export class Dependency extends BaseActiveRecord<IDependencyData> implements IInjectable, IWalkable {

  protected readonly logger: Logger;

  readonly idProperty = "hash";

  private _uri: string;
  private _watcher: DependencyGraphWatcher;
  private _ready: boolean;
  private _shouldLoadAgain: boolean;
  private _importedDependencyInfo: IResolvedDependencyInfo[];
  private _includedDependencyInfo: IResolvedDependencyInfo[];
  private _type: string;
  private _content: string;
  private _loaderOptions: any;
  private _hash: string;
  private _changeWatchers: DisposableCollection;

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;

  private _map: RawSourceMap;
  private _fileCacheItem: FileCacheItem;
  private _fileCacheItemObserver: IBus<any, any>;
  private _updatedAt: number;
  private _loadedDependencies: boolean;
  private _sourceUpdatedAt: number;

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  constructor(source: IDependencyData, collectionName: string, private _graph: IDependencyGraph) {
    super(source, collectionName);
    this._fileCacheItemObserver = new CallbackBus(this.onFileCacheAction.bind(this));
  }

  $didInject() {
    this.logger.generatePrefix = () => `${this.hash}:${this.uri} `;
  }

  /**
   * The file cache reference that contains
   *
   * @readonly
   * @type {FileCacheItem}
   */

  async getSourceFileCacheItem(): Promise<FileCacheItem> {
    if (this._fileCacheItem) return this._fileCacheItem;
    return this._fileCacheItem = await this._fileCache.findOrInsert(this.uri);
  }

  get graph(): IDependencyGraph {
    return this._graph;
  }

  /**
   * Timestamp of when the bundle was last persisted to the data store.
   *
   * @readonly
   * @type {number}
   */

  get updatedAt(): number {
    return this._updatedAt;
  }

  /**
   */

  get hash(): string {
    return this._hash;
  }

  /**
   * The source map of the transformed content.
   *
   * @readonly
   */

  get map(): RawSourceMap {
    return this._map;
  }

  /**
   * The source file path
   *
   * @readonly
   */

  get uri() {
    return this._uri;
  }

  /**
   */

  get importedDependencyInfo() {
    return this._importedDependencyInfo;
  }

  /**
   */

  get includedDependencyInfo() {
    return this._includedDependencyInfo;
  }

  /**
   */

  get loaderOptions() {
    return this._loaderOptions;
  }

  @bindable()
  public status: Status = new Status(Status.IDLE);

  /**
   * The loaded bundle type
   *
   * @readonly
   */

  get type() {
    return this._type;
  }

  /**
   * The dependency bundle references
   *
   * @readonly
   * @type {Dependency[]}
   */

  get importedDependencies(): Dependency[] {
    return this._importedDependencyInfo.map((inf) => {
      return this._graph.eagerFindByHash(inf.hash);
    }).filter(dep => !!dep);
  }

  /**
   * The loaded bundle content
   *
   * @readonly
   * @type {string}
   */

  get content(): string {
    return this._content;
  }

  willSave() {
    this._updatedAt = Date.now();
  }

  getDependencyHash(uri: string): string {
    const info = this._importedDependencyInfo.find(info => info.originalUri === uri || info.uri === uri);
    return info && info.hash;
  }

  eagerGetDependency(uri: string) {
    return this._graph.eagerFindByHash(this.getDependencyHash(uri));
  }

  serialize() {
    return {
      uri: this.uri,
      map: this._map,
      hash: this._hash,
      type: this._type,
      content: this._content,
      updatedAt: this._updatedAt,
      loaderOptions: this._loaderOptions,
      sourceUpdatedAt: this._sourceUpdatedAt,
      includedDependencyInfo: this._includedDependencyInfo,
      importedDependencyInfo: this._importedDependencyInfo,
    };
  }

  setPropertiesFromSource({ uri, loaderOptions, type, updatedAt, map, content, importedDependencyInfo, includedDependencyInfo, hash, sourceUpdatedAt }: IDependencyData) {
    this._type          = type;
    this._uri           = uri;
    this._loaderOptions = loaderOptions || {};
    this._updatedAt     = updatedAt;
    this._sourceUpdatedAt = sourceUpdatedAt;
    this._hash          = hash;
    this._map           = map;
    this._content       = content;
    this._importedDependencyInfo = importedDependencyInfo || [];
    this._includedDependencyInfo = includedDependencyInfo || [];
  }

  get watcher() {
    return this._watcher || (this._watcher = new DependencyGraphWatcher(this));
  }

  public async load(): Promise<Dependency> {

    // safe method that protects _loading from being locked
    // from errors.
    if (this.status.type === Status.LOADING || this.status.type === Status.COMPLETED) {
      return this.load2();
    }

    return new Promise<Dependency>((resolve, reject) => {
      this.status = new Status(Status.LOADING);
      this.load2().then(() => {
        this.status = new Status(Status.COMPLETED);
        this.notify(new DependencyEvent(DependencyEvent.DEPENDENCY_LOADED));
        if (this._shouldLoadAgain) {
          this._shouldLoadAgain = false;
          this.load().then(resolve, reject);
        } else {
          resolve(this);
        }
      }, (err) => {
        this.status = new Status(Status.ERROR);
        reject(err);
      })
    });
  }

  protected load2 = memoize(async (): Promise<Dependency> => {

    this.logger.debug("Loading...");
    const logTimer = this.logger.startTimer(null, null, LogLevel.DEBUG);
    const fileCache = await this.getSourceFileCacheItem();
    const sourceFileUpdatedAt = await this.getLatestSourceFileUpdateTimestamp();

    if (this._sourceUpdatedAt !== sourceFileUpdatedAt) {

      // sync update times. TODO - need to include included files as well. This is at the beginning
      // in case the file cache item changes while the dependency is loading (shouldn't happen so often).
      this._sourceUpdatedAt = sourceFileUpdatedAt;

      // catch errors during load -- this *will* happen if the content has syntax errors that the
      // loader doesn't know how to handle.
      try {
        await this.loadHard();
      } catch(e) {
        this.logger.error(`Error: ${e.stack}`);
        this._sourceUpdatedAt = undefined;
        await this.watchForChanges();
        throw e;
      }

      await this.save();
    } else {
      this.logger.debug("No change. Reusing cached content.");
    }

    await this.loadDependencies();

    logTimer.stop("loaded");

    if (this._sourceUpdatedAt !== await this.getLatestSourceFileUpdateTimestamp()) {
      this.logger.debug("File cache changed during load, reloading.")
      return this.reload();
    }

    // watch for changes now prevent cyclical dependencies from cyclically
    // listening and emitting the same "done" messages
    await this.watchForChanges();

    return this;
  }, { length: 0, promise: true }) as () => Promise<Dependency>;


  private async getLatestSourceFileUpdateTimestamp() {
    return Math.max(this._sourceUpdatedAt || 0, ...(
      (await this.getSourceFiles()).map(sourceFile => sourceFile.updatedAt || 0)
    ));
  }

  private async getSourceFiles() {
    const cacheItem = await this.getSourceFileCacheItem();
    return [
      cacheItem,
      ...(await Promise.all(this._includedDependencyInfo.map(info => this._fileCache.findOrInsert(info.uri))))
    ];
  }

  /**
   */

  private async loadHard() {

    this.logger.debug("Transforming source content using graph strategy");

    const loader = this._graph.getLoader(this._loaderOptions);
    const transformResult: IDependencyLoaderResult = await loader.load(this, await this.getInitialSourceContent());

    // must be casted since the content could be a buffer
    this._content = String(transformResult.content);
    this._map     = transformResult.map;
    this._type    = transformResult.type;

    this._importedDependencyInfo = [];
    this._includedDependencyInfo = [];

    const importedDependencyUris = transformResult.importedDependencyUris || [];

    // cases where there's overlapping between imported & included dependencies (probably)
    // a bug with the module loader, or discrepancy between how the strategy and target bundler should behave.
    const includedDependencyUris = pull(transformResult.includedDependencyUris || [], ...importedDependencyUris);

    await Promise.all([
      this.resolveDependencies(includedDependencyUris, this._includedDependencyInfo),
      this.resolveDependencies(importedDependencyUris, this._importedDependencyInfo)
    ]);
  }

  /**
   */

  private async loadDependencies() {
    await Promise.all(this.importedDependencyInfo.map(async (info: IResolvedDependencyInfo) => {
      if (!info.uri) return Promise.resolve();

      const dependency = await this._graph.getDependency(info);
      const waitLogger = this.logger.startTimer(`Waiting for dependency ${info.hash}:${info.uri} to load...`, 1000 * 10, LogLevel.DEBUG);

      // if the dependency is loading, then they're likely a cyclical dependency
      if (dependency.status.type !== Status.LOADING) {
        try {
          await dependency.load();
        } catch(e) {
          waitLogger.stop(`Error while loading dependency: ${info.uri}`);

          // do not re-throw -- error may be expected here especially if
          // the dependency 404d. Let the sandbox take the fall instead.
        }
      }

      waitLogger.stop(`Loaded dependency ${info.hash}:${info.uri}`);
    }));
  }

  /**
   * TODO: may be better to make this part of the loader
   */

  protected async getInitialSourceContent(): Promise<IDependencyLoaderResult> {
    const readResult = this.uri && await (await this.getSourceFileCacheItem()).read();
    return {
      type: readResult && readResult.type || MimeTypeProvider.lookup(this.uri, this._kernel) || PLAIN_TEXT_MIME_TYPE,
      content: readResult && readResult.content
    };
  }

  shouldDeserialize(b: IDependencyData) {
    return b.updatedAt > this.updatedAt;
  }

  private async watchForChanges() {

    if (this._changeWatchers) {
      this._changeWatchers.dispose();
    }

    const changeWatchers = this._changeWatchers = new DisposableCollection();

    // included dependencies aren't self contained, so they don't get a Dependency object. For
    // that we'll need to watch their file cache active record and watch it for any changes. Since
    // they're typically included in the
    for (const sourceFile of await this.getSourceFiles()) {
      this.logger.debug(`Watching file cache ${sourceFile.sourceUri} for changes`);
      sourceFile.observe(this._fileCacheItemObserver);
      changeWatchers.push({
        dispose: () => sourceFile.unobserve(this._fileCacheItemObserver)
      });
    }
  }

  public visitWalker(walker: ITreeWalker) {
    this.importedDependencies.forEach(dependency => walker.accept(dependency));
  }

  private resolveDependencies(dependencyPaths: string[], info: IResolvedDependencyInfo[]) {
    return Promise.all(dependencyPaths.map(async (uri) => {
      this.logger.debug("Resolving dependency", uri);
      const dependencyInfo = await this._graph.resolve(uri, this.uri);
      dependencyInfo.originalUri = uri;
      info.push(dependencyInfo);
    }));
  }

  private async reload() {
    this.load2["clear"]();
    this.status = new Status(Status.IDLE);
    this.logger.debug("Reloading");
    return this.load();
  }

  private onFileCacheAction({ mutation }: MutationEvent<any>) {
    // reload the dependency if file cache item changes -- could be the data uri, source file, etc.
    if (mutation && mutation.type === PropertyMutation.PROPERTY_CHANGE) {
      if (this.status.type !== Status.LOADING) {
        this.logger.info("Source file changed");
        this.reload();
      } else {
        this._shouldLoadAgain = true;
      }
    }
  }
}
