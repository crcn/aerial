import { Mutation } from "../../messages/mutate";
export declare namespace ArrayItemMutationTypes {
    const INSERT = "insert";
    const UPDATE = "update";
    const DELETE = "delete";
}
export declare abstract class ArraItemMutation<T> extends Mutation<T> {
    constructor(type: string);
    abstract accept(visitor: IArrayMutationVisitor<T>): any;
}
export declare class ArrayInsertMutation<T> extends ArraItemMutation<T> {
    readonly index: number;
    readonly value: T;
    constructor(index: number, value: T);
    accept(visitor: IArrayMutationVisitor<T>): any;
}
export declare class ArrayRemoveMutation extends ArraItemMutation<any> {
    readonly value: any;
    readonly index: number;
    constructor(value: any, index: number);
    accept(visitor: IArrayMutationVisitor<any>): any;
}
export declare class ArrayUpdateMutation<T> extends ArraItemMutation<T> {
    readonly originalOldIndex: number;
    readonly patchedOldIndex: number;
    readonly newValue: T;
    readonly index: number;
    constructor(originalOldIndex: number, patchedOldIndex: number, newValue: T, index: number);
    accept(visitor: IArrayMutationVisitor<T>): any;
}
export interface IArrayMutationVisitor<T> {
    visitRemove(del: ArrayRemoveMutation): any;
    visitInsert(insert: ArrayInsertMutation<T>): any;
    visitUpdate(update: ArrayUpdateMutation<T>): any;
}
export declare class ArrayMutation<T> extends Mutation<T> {
    readonly mutations: ArraItemMutation<T>[];
    static readonly ARRAY_DIFF: string;
    readonly count: number;
    constructor(mutations: ArraItemMutation<T>[]);
    accept(visitor: IArrayMutationVisitor<T>): Promise<any[]>;
}
export declare function diffArray<T>(oldArray: Array<T>, newArray: Array<T>, countDiffs: (a: T, b: T) => number): ArrayMutation<T>;
export declare function patchArray<T>(target: Array<T>, diff: ArrayMutation<T>, mapUpdate: (a: T, b: T) => T, mapInsert?: (b: T) => T): void;
