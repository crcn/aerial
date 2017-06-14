import { URIProtocol } from "../uri";
import { Kernel } from "aerial-common";
export declare class FileURIProtocol extends URIProtocol {
    protected readonly kernel: Kernel;
    read(uri: string): Promise<{}>;
    fileExists(uri: string): Promise<boolean>;
    write(uri: string, content: any): Promise<{}>;
    watch2(uri: string, onChange: () => any): {
        dispose: () => void;
    };
}
