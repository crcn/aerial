import { CoreEvent } from "aerial-common";
import { ISyntheticBrowserOpenOptions } from "./index";
import { SyntheticDOMElement } from "./dom";
export declare class DOMNodeEvent extends CoreEvent {
    static readonly DOM_NODE_LOADED: string;
}
export declare class SyntheticRendererNodeEvent extends CoreEvent {
    readonly element: SyntheticDOMElement;
    static readonly NODE_EVENT: string;
    constructor(element: SyntheticDOMElement, event: any);
}
export declare class SyntheticRendererEvent extends CoreEvent {
    static readonly UPDATE_RECTANGLES: string;
    constructor(type: string);
}
export declare class OpenRemoteBrowserRequest extends CoreEvent {
    readonly options: ISyntheticBrowserOpenOptions;
    static readonly OPEN_REMOTE_BROWSER: string;
    constructor(options: ISyntheticBrowserOpenOptions);
}
