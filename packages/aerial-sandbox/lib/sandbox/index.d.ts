/// <reference types="node" />
import vm = require("vm");
import { Dependency } from "../dependency-graph";
import { Logger, Status, Kernel, Observable } from "aerial-common";
export declare type sandboxDependencyEvaluatorType = {
    new (): ISandboxDependencyEvaluator;
};
export interface ISandboxDependencyEvaluator {
    evaluate(module: SandboxModule): void;
}
export interface IModule {
    exports: any;
    source: Dependency;
}
export declare class SandboxModule implements IModule {
    readonly sandbox: Sandbox;
    readonly source: Dependency;
    exports: any;
    constructor(sandbox: Sandbox, source: Dependency);
    readonly uri: string;
}
/**
 * TODO - consider removing require() statement and using evaluate(bundle) instead
 */
export declare class Sandbox extends Observable {
    private _kernel;
    private createGlobal;
    protected readonly logger: Logger;
    private _modules;
    private _entry;
    private _paused;
    private _mainModule;
    private _shouldEvaluate;
    private _graphWatcherWatcher;
    private _waitingForAllLoaded;
    private _global;
    private _context;
    private _exports;
    status: Status;
    constructor(_kernel: Kernel, createGlobal?: () => any);
    pause(): void;
    resume(): void;
    readonly vmContext: vm.Context;
    readonly exports: any;
    readonly global: any;
    readonly entry: Dependency;
    open(entry: Dependency): Promise<void>;
    protected onDependencyGraphStatusChange(newValue: Status, oldValue: Status): void;
    evaluate(dependency: Dependency): Object;
    private reset();
}
export * from "./providers";
export * from "./utils";
