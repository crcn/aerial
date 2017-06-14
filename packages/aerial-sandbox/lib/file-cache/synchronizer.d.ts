import { FileCache } from "./file-cache";
import { IBrokerBus, Logger } from "aerial-common";
export declare class FileCacheSynchronizer {
    private _cache;
    private _bus;
    protected logger: Logger;
    private _kernel;
    private _watchers;
    private _updating;
    private _shouldUpdateAgain;
    constructor(_cache: FileCache, _bus: IBrokerBus);
    private update();
    private onURISourceChange(uri);
}
