import { URIProtocol, IURIProtocolReadResult } from "./protocol";
export declare class HTTPURIProtocol extends URIProtocol {
    private _responses;
    read(uri: string): Promise<IURIProtocolReadResult>;
    private _storeResponseInfo(uri, response);
    write(uri: string, content: string): Promise<{}>;
    fileExists(uri: string): Promise<boolean>;
    watch2(uri: string, onChange: () => any): {
        dispose(): void;
    };
}
