import { IReference } from "./base";
import { Metadata } from "../metadata";
export { IReference };
export declare class ValueReference implements IReference {
    readonly value: any;
    constructor(value: any);
}
export declare class MetadataValueReference implements IReference {
    private _metadata;
    private _key;
    constructor(_metadata: Metadata, _key: string);
    value: any;
}
export declare class MinMaxValueReference implements IReference {
    private _target;
    private _min;
    private _max;
    constructor(_target: IReference, _min?: number, _max?: number);
    value: number;
    private _minMax(value);
}
export declare class DefaultValueReference implements IReference {
    private _target;
    readonly defaultValue: any;
    constructor(_target: IReference, defaultValue: any);
    value: any;
}
