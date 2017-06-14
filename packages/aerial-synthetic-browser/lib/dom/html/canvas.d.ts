import { SyntheticHTMLElement } from "./element";
export declare class SyntheticHTMLCanvasElement extends SyntheticHTMLElement {
    private _canvas;
    createdCallback(): void;
    height: number;
    msToBlob(): any;
    toDataURL(type?: string, ...args: any[]): string;
    toBlob(callback: (result: Blob | null) => void, type?: string, ...args: any[]): void;
    width: number;
    getContext(contextId: string, contextAttributes?: any): {
        clearRect(): void;
        canvas: {
            width: number;
            height: number;
        };
        arc(): void;
        closePath(): void;
        fill(): void;
        beginPath(): void;
    };
}
