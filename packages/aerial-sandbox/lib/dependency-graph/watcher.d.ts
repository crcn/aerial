import { Logger, Observable, Status } from "aerial-common";
import { Dependency } from "./dependency";
export declare class DependencyGraphWatcher extends Observable {
    readonly entry: Dependency;
    protected readonly logger: Logger;
    private _dependencyObserver;
    private _dependencyObservers;
    private _resolve;
    status: Status;
    constructor(entry: Dependency);
    dispose(): void;
    waitForAllDependencies: any;
    private watchDependencies();
    private onDependencyEvent(message);
}
