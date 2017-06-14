import { URIProtocol, IURIProtocolReadResult } from "../uri";
import { FileCacheItem } from "./item";
export declare const getCacheUri: (uri: any) => string;
export declare class FileCacheProtocol extends URIProtocol {
    private _fileCache;
    private _kernel;
    read(uri: string): Promise<IURIProtocolReadResult>;
    watch2(uri: string, onChange: () => any): {
        dispose(): void;
    };
    decode(uri: string): string;
    fileExists(uri: string): Promise<boolean>;
    write(uri: string, content: any): Promise<FileCacheItem>;
    _find(uri: string): Promise<FileCacheItem>;
}
