import { Sandbox } from "aerial-sandbox";
import { FakeURL } from "./url";
import { FakeBlob } from "./blob";
import { SyntheticHistory } from "./history";
import { ISyntheticBrowser } from "../browser";
import { SyntheticLocation } from "../location";
import { SyntheticDocument } from "./document";
import { SyntheticHTMLElement } from "./html";
import { SyntheticLocalStorage } from "./local-storage";
import { SyntheticXMLHttpRequest } from "./xhr";
import { SyntheticCSSStyle } from "./css";
import { Logger, Observable } from "aerial-common";
import { DOMEventListenerFunction } from "./events";
export declare class SyntheticNavigator {
    readonly appCodeName: string;
    readonly platform: string;
    readonly userAgent: string;
}
export declare class SyntheticConsole {
    private _logger;
    constructor(_logger: Logger);
    log(text: any, ...rest: any[]): void;
    info(text: any, ...rest: any[]): void;
    warn(text: any, ...rest: any[]): void;
    error(text: any, ...rest: any[]): void;
}
export declare class SyntheticDOMImplementation {
    private _window;
    constructor(_window: SyntheticWindow);
    hasFeature(value: string): boolean;
    createHTMLDocument(title?: string): SyntheticDocument;
}
export declare class SyntheticWindow extends Observable {
    readonly browser: ISyntheticBrowser;
    readonly navigator: SyntheticNavigator;
    readonly console: SyntheticConsole;
    location: SyntheticLocation;
    onload: DOMEventListenerFunction;
    onpopstate: DOMEventListenerFunction;
    readonly document: SyntheticDocument;
    readonly window: SyntheticWindow;
    readonly history: SyntheticHistory;
    readonly setTimeout: Function;
    readonly setInterval: Function;
    readonly setImmediate: Function;
    readonly clearTimeout: Function;
    readonly clearInterval: Function;
    readonly clearImmediate: Function;
    readonly localStorage: SyntheticLocalStorage;
    readonly self: SyntheticWindow;
    private _implementation;
    readonly XMLHttpRequest: {
        new (): SyntheticXMLHttpRequest;
    };
    readonly HTMLElement: any;
    readonly Element: any;
    readonly WebSocket: {
        new (): any;
    };
    innerWidth: number;
    innerHeight: number;
    private _windowTimers;
    private _eventListeners;
    private _server;
    readonly Blob: {
        new (blobParts?: any[], options?: BlobPropertyBag): Blob;
        prototype: Blob;
    } | typeof FakeBlob;
    readonly URL: {
        new (url: string, base?: string): URL;
        prototype: URL;
        createObjectURL(object: any, options?: ObjectURLOptions): string;
        revokeObjectURL(url: string): void;
    } | typeof FakeURL;
    readonly btoa: any;
    readonly selector: any;
    readonly $synthetic: boolean;
    readonly requestAnimationFrame: (tick: any) => number;
    constructor(location?: SyntheticLocation, browser?: ISyntheticBrowser, document?: SyntheticDocument);
    readonly sandbox: Sandbox;
    getComputedStyle(element: SyntheticHTMLElement): SyntheticCSSStyle;
    addEventListener(type: string, listener: DOMEventListenerFunction): void;
    addEvent(type: string, listener: DOMEventListenerFunction): void;
    removeEventListener(type: string, listener: DOMEventListenerFunction): void;
    readonly depth: number;
    dispose(): void;
    readonly parent: SyntheticWindow;
    /**
     * overridable method that forces the window to wait for any async
     * processing by the loaded application. Useful to ensure that the app is properly
     * hotswapped.
     */
    syntheticDOMReadyCallback: () => void;
    private onVMLog;
    whenLoaded: any;
}
