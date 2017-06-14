import { IProvider } from "aerial-common";
import { IFileResolver } from "./resolver";
export declare function createSandboxProviders(fileResoverClass?: {
    new (): IFileResolver;
}): IProvider[];
