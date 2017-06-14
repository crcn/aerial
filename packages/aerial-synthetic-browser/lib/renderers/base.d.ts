import { CoreEvent, MutationEvent } from "aerial-common";
import { Logger, Observable, IObservable, BoundingRect, PropertyWatcher } from "aerial-common";
import { SyntheticDocument, SyntheticCSSStyle } from "../dom";
export interface ISyntheticDocumentRenderer extends IObservable {
    readonly element: HTMLElement;
    document: SyntheticDocument;
    rects: any;
    rectsWatcher: PropertyWatcher<ISyntheticDocumentRenderer, any>;
    /**
     * Called by whatever is mounting the document renderer
     */
    start(): any;
    /**
     * Pauses the renderer
     */
    stop(): any;
    /**
     * Returns the bounding rects exactly as they're computed by the target renderer.
     */
    getBoundingRect(uid: string): BoundingRect;
    /**
     * Returns the bounding rects exactly as they're computed by the target renderer.
     */
    getAllBoundingRects(): BoundingRect[];
    /**
     * Resolves when the renderer is running
     */
    whenRunning(): Promise<any>;
    /**
     * Fetches and returns a computed style by the target rendering engine.
     */
    getComputedStyle(uid: string): any;
    /**
     */
    requestRender(): void;
}
export declare abstract class BaseRenderer extends Observable implements ISyntheticDocumentRenderer {
    readonly element: HTMLElement;
    private _document;
    private _rendering;
    $rects: any;
    protected _rendered: boolean;
    protected _running: boolean;
    readonly rectsWatcher: PropertyWatcher<BaseRenderer, any>;
    private _shouldRenderAgain;
    private _targetObserver;
    private _computedStyles;
    private _currentRenderPromise;
    protected readonly logger: Logger;
    readonly nodeFactory: Document;
    constructor(nodeFactory?: Document);
    readonly rects: any;
    document: SyntheticDocument;
    getAllBoundingRects(): BoundingRect[];
    whenRunning(): Promise<void>;
    whenRendered(): Promise<void>;
    start(): void;
    stop(): void;
    getComputedStyle(uid: string): any;
    getBoundingRect(uid: string): any;
    protected abstract render(): any;
    protected reset(): void;
    protected createElement(): HTMLDivElement;
    protected setRects(rects: {
        [IDentifier: string]: BoundingRect;
    }, styles: {
        [IDentifier: string]: SyntheticCSSStyle;
    }): void;
    protected onDocumentEvent(event: CoreEvent): void;
    protected onDocumentMutationEvent(event: MutationEvent<any>): void;
    requestRender(): Promise<any>;
    protected getRequestUpdateTimeout(): number;
}
export declare class BaseDecoratorRenderer extends Observable implements ISyntheticDocumentRenderer {
    protected _renderer: ISyntheticDocumentRenderer;
    constructor(_renderer: ISyntheticDocumentRenderer);
    readonly rects: any;
    readonly rectsWatcher: PropertyWatcher<ISyntheticDocumentRenderer, any>;
    getComputedStyle(uid: any): any;
    getBoundingRect(uid: any): BoundingRect;
    getAllBoundingRects(): BoundingRect[];
    whenRunning(): Promise<any>;
    start(): void;
    stop(): void;
    readonly element: HTMLElement;
    document: SyntheticDocument;
    requestRender(): void;
    protected onTargetRendererEvent(message: CoreEvent): void;
    protected onTargetRendererSetRectangles(): void;
}
export declare class NoopRenderer extends BaseRenderer implements ISyntheticDocumentRenderer {
    readonly element: HTMLElement;
    document: SyntheticDocument;
    getBoundingRect(): BoundingRect;
    readonly rects: {};
    getEagerComputedStyle(): any;
    getAllBoundingRects(): any[];
    whenRunning(): Promise<void>;
    start(): void;
    stop(): void;
    getComputedStyle(): any;
    hasLoadedComputedStyle(): boolean;
    render(): void;
    createElement(): any;
}
