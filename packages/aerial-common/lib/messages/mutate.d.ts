import { CoreEvent } from "./base";
import { ICloneable } from "../object";
export declare class Mutation<T> {
    readonly type: string;
    readonly target: T;
    constructor(type: string, target?: T);
    toString(): string;
    protected paramsToString(): string;
    toEvent(bubbles?: boolean): any;
}
export declare class MutationEvent<T> extends CoreEvent {
    readonly mutation: Mutation<T>;
    static readonly MUTATION: string;
    constructor(mutation: Mutation<T>, bubbles?: boolean);
}
export declare class SetValueMutation<T> extends Mutation<T> {
    newValue: any;
    constructor(type: string, target: T, newValue: any);
    paramsToString(): string;
}
export declare abstract class ChildMutation<T, U extends ICloneable> extends Mutation<T> {
    readonly child: U;
    readonly index: number;
    constructor(type: string, target: T, child: U, index: number);
    paramsToString(): string;
}
export declare class InsertChildMutation<T extends ICloneable, U extends ICloneable> extends ChildMutation<T, U> {
    constructor(type: string, target: T, child: U, index?: number);
    paramsToString(): string;
}
export declare class RemoveChildMutation<T extends ICloneable, U extends ICloneable> extends ChildMutation<T, U> {
    constructor(type: string, target: T, child: U, index: number);
}
export declare class PropertyMutation<T> extends Mutation<T> {
    name: string;
    newValue: any;
    oldValue: any;
    oldName: string;
    index: number;
    static readonly PROPERTY_CHANGE: string;
    constructor(type: string, target: T, name: string, newValue: any, oldValue?: any, oldName?: string, index?: number);
    toEvent(bubbles?: boolean): any;
    paramsToString(): string;
}
/**
 * Removes the target synthetic object
 */
export declare class RemoveMutation<T> extends Mutation<T> {
    static readonly REMOVE_CHANGE: string;
    constructor(target?: T);
}
export declare class MoveChildMutation<T, U extends ICloneable> extends ChildMutation<T, U> {
    readonly oldIndex: number;
    constructor(type: string, target: T, child: U, oldIndex: number, index: number);
    paramsToString(): string;
}
