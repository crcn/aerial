import { ICloneable } from "../object";
export interface IInjectable {
    $didInject?(): void;
}
export interface IProvider extends ICloneable {
    /**
     */
    readonly overridable: boolean;
    /**
     * The unique id of the the dependency
     */
    readonly id: string;
    /**
     * The actual dependency object itself
     */
    readonly value: any;
    /**
     * The collection that this dependency belongs to
     */
    owner: Kernel;
    /**
     * Clones the dependency. Required in case the dependency
     * is added to any other collection
     */
    clone(): IProvider;
    /**
     */
    readonly priority?: number;
}
export declare class Provider<T> implements IProvider {
    readonly id: string;
    value: T;
    readonly overridable: boolean;
    readonly priority: number;
    owner: Kernel;
    constructor(id: string, value: T, overridable?: boolean, priority?: number);
    /**
     * Clones the dependency - works with base classes.
     */
    clone(): Provider<T>;
}
/**
 */
export interface IFactory {
    create(...rest: any[]): any;
}
/**
 * Factory Provider for creating new instances of things
 */
export declare class FactoryProvider extends Provider<IFactory> implements IFactory {
    create(...rest: any[]): any;
}
/**
 * factory Provider for classes
 */
export declare class ClassFactoryProvider extends Provider<{
    new (...rest): any;
}> implements IFactory {
    readonly clazz: {
        new (...rest): any;
    };
    readonly priority: number;
    constructor(id: string, clazz: {
        new (...rest): any;
    }, priority?: number);
    create(...rest: any[]): any;
}
export declare type registerableProviderType = Array<IProvider | Kernel | any[]>;
/**
 * Contains a collection of Kernel
 */
export declare class Kernel implements ICloneable {
    private _providersByNs;
    constructor(...items: registerableProviderType);
    /**
     */
    readonly length: number;
    /**
     * Queries for one Provider with the given namespace
     * @param {string} ns namespace to query.
     */
    query<T extends IProvider>(ns: string): T;
    /**
     * queries for all Kernel with the given namespace
     */
    queryAll<T extends IProvider>(ns: string): T[];
    /**
     */
    link(dependency: IProvider): IProvider;
    /**
     */
    clone(): Kernel;
    /**
     */
    inject<T>(instance: T & IInjectable): T & IInjectable;
    /**
     */
    create(clazz: {
        new (...rest: any[]): any;
    }, parameters: any[]): any;
    /**
     */
    register(...providers: registerableProviderType): Kernel;
    private getPropertyValues(target);
}
