import { FakeBlob } from "./blob";
export declare class FakeURL {
    static createObjectURL(blob: FakeBlob): string;
    static revokeObjectURL(url: any): void;
}
export declare const URL: {
    new (url: string, base?: string): URL;
    prototype: URL;
    createObjectURL(object: any, options?: ObjectURLOptions): string;
    revokeObjectURL(url: string): void;
} | typeof FakeURL;
