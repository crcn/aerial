/// <reference types="node" />
import { URIProtocol } from "./protocol";
export declare class DataURIProtocol extends URIProtocol {
    read(uri: string): Promise<{
        type: string;
        content: Buffer;
    }>;
    write(uri: string, content: string): Promise<void>;
    fileExists(uri: string): Promise<boolean>;
    watch2(uri: string, listener: () => any): {
        dispose(): void;
    };
}
