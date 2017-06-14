import { RawSourceMap } from "source-map";
import { IDependencyGraph } from "./graph";
import { FileCacheItem } from "../file-cache";
import { IDependencyLoaderResult, IResolvedDependencyInfo } from "./strategies";
import { DependencyGraphWatcher } from "./watcher";
import { Logger, Status, IWalkable, IInjectable, ITreeWalker, BaseActiveRecord } from "aerial-common";
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
export declare class Dependency extends BaseActiveRecord<IDependencyData> implements IInjectable, IWalkable {
    private _graph;
    protected readonly logger: Logger;
    readonly idProperty: string;
    private _uri;
    private _watcher;
    private _ready;
    private _shouldLoadAgain;
    private _importedDependencyInfo;
    private _includedDependencyInfo;
    private _type;
    private _content;
    private _loaderOptions;
    private _hash;
    private _changeWatchers;
    private _fileCache;
    private _map;
    private _fileCacheItem;
    private _fileCacheItemObserver;
    private _updatedAt;
    private _loadedDependencies;
    private _sourceUpdatedAt;
    private _kernel;
    constructor(source: IDependencyData, collectionName: string, _graph: IDependencyGraph);
    $didInject(): void;
    /**
     * The file cache reference that contains
     *
     * @readonly
     * @type {FileCacheItem}
     */
    getSourceFileCacheItem(): Promise<FileCacheItem>;
    readonly graph: IDependencyGraph;
    /**
     * Timestamp of when the bundle was last persisted to the data store.
     *
     * @readonly
     * @type {number}
     */
    readonly updatedAt: number;
    /**
     */
    readonly hash: string;
    /**
     * The source map of the transformed content.
     *
     * @readonly
     */
    readonly map: RawSourceMap;
    /**
     * The source file path
     *
     * @readonly
     */
    readonly uri: string;
    /**
     */
    readonly importedDependencyInfo: IResolvedDependencyInfo[];
    /**
     */
    readonly includedDependencyInfo: IResolvedDependencyInfo[];
    /**
     */
    readonly loaderOptions: any;
    status: Status;
    /**
     * The loaded bundle type
     *
     * @readonly
     */
    readonly type: string;
    /**
     * The dependency bundle references
     *
     * @readonly
     * @type {Dependency[]}
     */
    readonly importedDependencies: Dependency[];
    /**
     * The loaded bundle content
     *
     * @readonly
     * @type {string}
     */
    readonly content: string;
    willSave(): void;
    getDependencyHash(uri: string): string;
    eagerGetDependency(uri: string): Dependency;
    serialize(): {
        uri: string;
        map: any;
        hash: string;
        type: string;
        content: string;
        updatedAt: number;
        loaderOptions: any;
        sourceUpdatedAt: number;
        includedDependencyInfo: IResolvedDependencyInfo[];
        importedDependencyInfo: IResolvedDependencyInfo[];
    };
    setPropertiesFromSource({uri, loaderOptions, type, updatedAt, map, content, importedDependencyInfo, includedDependencyInfo, hash, sourceUpdatedAt}: IDependencyData): void;
    readonly watcher: DependencyGraphWatcher;
    load(): Promise<Dependency>;
    protected load2: () => Promise<Dependency>;
    private getLatestSourceFileUpdateTimestamp();
    private getSourceFiles();
    /**
     */
    private loadHard();
    /**
     */
    private loadDependencies();
    /**
     * TODO: may be better to make this part of the loader
     */
    protected getInitialSourceContent(): Promise<IDependencyLoaderResult>;
    shouldDeserialize(b: IDependencyData): boolean;
    private watchForChanges();
    visitWalker(walker: ITreeWalker): void;
    private resolveDependencies(dependencyPaths, info);
    private reload();
    private onFileCacheAction({mutation});
}
