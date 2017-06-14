import { IBus } from "mesh";
export declare const isMaster: boolean;
export declare class Serializer<T> {
    readonly serialize: (value: T) => Object;
    readonly deserialize: (value: Object) => T;
    name: string;
    constructor(clazz: Function, serialize: (value: T) => Object, deserialize: (value: Object) => T);
}
/**
 */
export declare function fork(family: string, localBus: IBus<any, any>, pathName?: string, argv?: any[], env?: any): IBus<any, any>;
/**
 */
export declare function hook(family: any, localBus: IBus<any, any>): IBus<any, any>;
