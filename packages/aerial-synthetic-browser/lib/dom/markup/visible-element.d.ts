import { SyntheticDOMElement } from "./element";
import { ISyntheticDocumentRenderer } from "../../renderers";
import { BoundingRect, IPoint } from "aerial-common";
export declare class VisibleDOMNodeCapabilities {
    readonly movable: boolean;
    readonly resizable: boolean;
    constructor(movable: boolean, resizable: boolean);
    merge(...capabilities: VisibleDOMNodeCapabilities[]): VisibleDOMNodeCapabilities;
    static notCapableOfAnything(): VisibleDOMNodeCapabilities;
    equalTo(capabilities: VisibleDOMNodeCapabilities): boolean;
    static merge(...capabilities: VisibleDOMNodeCapabilities[]): VisibleDOMNodeCapabilities;
}
export declare abstract class VisibleSyntheticDOMElement<T extends {
    uid: string;
}> extends SyntheticDOMElement {
    private _absoluteBounds;
    private _capabilities;
    private _computedStyle;
    private _currentBounds;
    private _computedVisibility;
    protected readonly renderer: ISyntheticDocumentRenderer;
    getComputedStyle(): T;
    getBoundingClientRect(): BoundingRect;
    getAbsoluteBounds(): BoundingRect;
    getCapabilities(): VisibleDOMNodeCapabilities;
    abstract setAbsolutePosition(value: IPoint): void;
    abstract setAbsoluteBounds(value: BoundingRect): void;
    private computeVisibility();
    protected onUpdateComputedVisibility(): void;
    protected abstract computeAbsoluteBounds(style: any, computedBounds: BoundingRect): BoundingRect;
    protected abstract computeCapabilities(style: any): VisibleDOMNodeCapabilities;
}
