import { Observable } from "../observable";
import { ICommand } from "../commands";
import { IBrokerBus } from "../busses";
import { IBus, IMessage } from "mesh";
import { Provider, Kernel, IProvider, ClassFactoryProvider } from "./base";
export * from "./base";
/**
 */
export declare function createSingletonBusProviderClass(name: string): {
    getInstance(providers: Kernel): IBrokerBus;
    ID: string;
    new (bus: IBrokerBus): Provider<IBrokerBus>;
};
/**
 * Private bus that can only be used within the application. This typically contains messages
 * that are junk for other outside resources.
 *
 * Bubbles messages to the protected bus.
 */
export declare const PrivateBusProvider: {
    new (bus: IBrokerBus): Provider<IBrokerBus>;
    getInstance(providers: Kernel): IBrokerBus;
    ID: string;
};
/**
 */
export declare class KernelProvider extends Provider<Kernel> {
    static ID: string;
    constructor();
    clone(): KernelProvider;
    owner: Kernel;
}
export declare class CommandFactoryProvider extends ClassFactoryProvider {
    readonly clazz: {
        new (...rest: any[]): ICommand;
    };
    static readonly NS: string;
    readonly messageFilter: Function;
    constructor(messageFilter: string | Function, clazz: {
        new (...rest: any[]): ICommand;
    }, priority?: number);
    create(): ICommand;
    static findAll(providers: Kernel): CommandFactoryProvider[];
    static findAllByMessage(message: IMessage, providers: Kernel): CommandFactoryProvider[];
    clone(): CommandFactoryProvider;
}
/**
 */
export declare class MimeTypeProvider extends Provider<string> {
    readonly fileExtension: string;
    readonly mimeType: string;
    static readonly NS: string;
    constructor(fileExtension: string, mimeType: string);
    clone(): MimeTypeProvider;
    static findAll(providers: Kernel): MimeTypeProvider[];
    static lookup(uri: string, providers: Kernel): string;
}
export declare class MimeTypeAliasProvider extends Provider<string> {
    readonly mimeType: string;
    readonly aliasMimeType: string;
    static readonly NS: string;
    constructor(mimeType: string, aliasMimeType: string);
    clone(): MimeTypeAliasProvider;
    static getNamespace(mimeType: string): string;
    static lookup(uriOrMimeType: string, providers: Kernel): string;
}
export declare class StoreProvider implements IProvider {
    readonly name: string;
    private _clazz;
    static readonly NS: string;
    private _value;
    readonly overridable: boolean;
    readonly id: string;
    owner: Kernel;
    constructor(name: string, _clazz: {
        new (): Observable;
    });
    readonly value: Observable;
    clone(): StoreProvider;
    static getId(name: string): string;
}
export declare function createSingletonProviderClass<T>(id: string): {
    getInstance(providers: Kernel): T;
    ID: string;
    new (clazz: {
        new (...rest): T;
    }): IProvider;
};
export declare class DSProvider extends Provider<IBus<any, any>> {
    static readonly ID: string;
    constructor(value: IBus<any, any>);
}
