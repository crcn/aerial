export declare class FakeBlob {
    readonly parts: any[];
    readonly type: string;
    constructor(parts: any[], {type}: any);
}
export declare const Blob: {
    new (blobParts?: any[], options?: BlobPropertyBag): Blob;
    prototype: Blob;
} | typeof FakeBlob;
