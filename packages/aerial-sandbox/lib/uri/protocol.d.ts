/// <reference types="node" />
import { IDisposable, Logger } from "aerial-common";
export interface IURIWatcher {
    dispose(): any;
}
export interface IURIProtocolReadResult {
    type: string;
    content: string | Buffer;
}
export declare abstract class URIProtocol {
    protected readonly logger: Logger;
    private _watchers;
    abstract read(uri: string): Promise<IURIProtocolReadResult>;
    abstract write(uri: string, content: any, options?: any): Promise<any>;
    abstract fileExists(uri: string): Promise<boolean>;
    watch(uri: string, onChange: () => any): {
        dispose: () => void;
    };
    protected abstract watch2(uri: string, onChange: () => any): IDisposable;
    protected removeProtocol(uri: string): string;
}
