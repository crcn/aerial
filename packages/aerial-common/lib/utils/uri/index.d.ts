/// <reference types="node" />
export declare const hasURIProtocol: (value: any) => boolean;
export declare const removeURIProtocol: (value: any) => any;
export declare const parseURI: (value: any) => void;
export declare const getProtocol: (value: any) => string;
export declare function createDataUrl(content: Buffer | string, mimeType?: string): string;
