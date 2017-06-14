import { URIProtocol } from "./protocol";
import { Kernel, IProvider } from "aerial-common";
export declare class URIProtocolProvider implements IProvider {
    readonly clazz: {
        new (): URIProtocol;
    };
    readonly priority: number;
    private _value;
    readonly id: string;
    owner: Kernel;
    readonly overridable: boolean;
    readonly test: (name: string) => boolean;
    constructor(test: string | ((name: string) => boolean), clazz: {
        new (): URIProtocol;
    }, priority?: number);
    static getId(name: string): string;
    clone(): URIProtocolProvider;
    readonly value: URIProtocol;
    static lookup(uri: string, kernel: Kernel): URIProtocol;
}
