import { IProvider } from "../ioc";
/**
 * inject decorator for properties of classes that live in a Kernel object
 */
export declare function inject(id?: string, map?: (provider: IProvider) => any): (target: any, property: any, index?: any) => void;
export declare function injectProvider(id?: string): (target: any, property: any, index?: any) => void;
