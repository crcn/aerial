import "reflect-metadata";
import { Kernel } from "../ioc";
export declare type SerializedContentType<T> = any[];
export interface ISerializer<T, U> {
    serialize(value: T): U;
    deserialize(value: U, kernel: Kernel, ctor?: any): T;
}
export interface ISerializable<T> {
    serialize(): T;
    deserialize(value: T): void;
}
export declare function createSerializer(ctor: {
    new (...rest: any[]): any;
}): ISerializer<any, any>;
export declare function getSerializeType(value: any): any;
export declare function serializable(type: string, serializer?: ISerializer<any, any>): (ctor: new (...rest: any[]) => any) => void;
export declare function isSerializable(value: Object): boolean;
export declare function serialize(value: any): SerializedContentType<any>;
export declare function deserialize(content: SerializedContentType<any>, kernel: Kernel): any;
