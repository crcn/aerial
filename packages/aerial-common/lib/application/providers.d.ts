import { Provider, Kernel, ClassFactoryProvider } from "../ioc";
import { IBus } from "mesh";
export declare class ApplicationServiceProvider<T extends IBus<any, any>> extends ClassFactoryProvider {
    static readonly NS: string;
    constructor(name: string, value: {
        new (): T;
    });
    static getId(name: string): string;
    create(): T;
    static findAll(kernel: Kernel): ApplicationServiceProvider<any>[];
}
/**
 * The application configuration dependency
 */
export declare class ApplicationConfigurationProvider<T> extends Provider<T> {
    static ID: string;
    constructor(value: T);
}
