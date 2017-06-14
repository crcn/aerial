import { SyntheticLocation } from "./location";
import { SyntheticRendererEvent } from "./messages";
import { SyntheticDocument, SyntheticWindow, SyntheticDOMElement } from "./dom";
import { ISyntheticDocumentRenderer } from "./renderers";
import { Logger, Status, Kernel, LogEvent, CoreEvent, Observable, IInjectable, IObservable, PropertyWatcher, ObservableCollection } from "aerial-common";
import { Sandbox, IDependencyGraphStrategyOptions } from "aerial-sandbox";
export interface ISyntheticBrowserOpenOptions {
    uri: string;
    injectScript?: string;
    dependencyGraphStrategyOptions?: IDependencyGraphStrategyOptions;
}
export interface ISyntheticBrowser extends IObservable {
    open(options: ISyntheticBrowserOpenOptions): Promise<any>;
    window: SyntheticWindow;
    uid: any;
    logs: ObservableCollection<LogEvent>;
    sandbox?: Sandbox;
    parent?: ISyntheticBrowser;
    renderer: ISyntheticDocumentRenderer;
    document: SyntheticDocument;
    kernel: Kernel;
    location: SyntheticLocation;
}
export interface IMainEntryExports {
    documentElement?: SyntheticDOMElement;
    bodyElement?: SyntheticDOMElement;
    createDocumentElement: () => SyntheticDOMElement;
    createBodyElement: () => SyntheticDOMElement;
}
export declare abstract class BaseSyntheticBrowser extends Observable implements ISyntheticBrowser, IInjectable {
    protected _kernel: Kernel;
    readonly parent: ISyntheticBrowser;
    status: Status;
    protected readonly logger: Logger;
    private _url;
    private _window;
    private _documentObserver;
    private _windowObserver;
    private _location;
    private _openOptions;
    private _renderer;
    readonly logs: ObservableCollection<LogEvent>;
    readonly statusWatcher: PropertyWatcher<BaseSyntheticBrowser, Status>;
    readonly uid: string;
    constructor(_kernel: Kernel, renderer?: ISyntheticDocumentRenderer, parent?: ISyntheticBrowser);
    $didInject(): void;
    readonly document: SyntheticDocument;
    readonly kernel: Kernel;
    readonly location: SyntheticLocation;
    readonly window: SyntheticWindow;
    protected onRendererEvent(event: SyntheticRendererEvent): void;
    /**
     *
     */
    clearLogs(): void;
    protected onRendererNodeEvent(event: SyntheticRendererEvent): void;
    protected setWindow(value: SyntheticWindow, clearLogs?: boolean): void;
    /**
     * Adds a log from the current VM. Used particularly for debugging.
     */
    protected addLog(log: LogEvent): void;
    readonly renderer: ISyntheticDocumentRenderer;
    protected readonly openOptions: ISyntheticBrowserOpenOptions;
    open(options: ISyntheticBrowserOpenOptions): Promise<void>;
    protected abstract open2(options: ISyntheticBrowserOpenOptions): any;
    protected onDocumentEvent(event: CoreEvent): void;
    protected onWindowEvent(event: CoreEvent): void;
}
export declare class SyntheticBrowser extends BaseSyntheticBrowser {
    private _sandbox;
    private _entry;
    private _graph;
    private _script;
    $didInject(): void;
    readonly sandbox: Sandbox;
    protected open2({uri, dependencyGraphStrategyOptions, injectScript}: ISyntheticBrowserOpenOptions): Promise<void>;
    protected onSandboxStatusChange(newStatus: Status): void;
    readonly document: SyntheticDocument;
    protected createSandboxGlobals(): SyntheticWindow;
    private _injectScript(window);
    private _registerElementClasses(document);
    private onSandboxExportsChange(exports);
}
