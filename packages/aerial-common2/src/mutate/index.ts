import { Struct, struct, structFactory } from "../struct";

export const MUTATED = "MUTATED";
export const SET_VALUE_MUTATION    = "SET_VALUE_MUTATION";
export const INSERT_CHILD_MUTATION = "INSERT_CHILD_MUTATION";
export const REMOVE_CHILD_MUTATION = "REMOVE_CHILD_MUTATION";
export const SET_PROPERTY_MUTATION = "SET_PROPERTY_MUTATION";
export const REMOVE_MUTATION       = "REMOVE_MUTATION";

export type Mutation<T> = {
  type: string;
  target?: T
} & Struct;

export type SetValueMutation<T> = {
  newValue: any
} & Mutation<T>;

export type ChildMutation<T, U> = {
  child: U;
  index: number;
} & Mutation<T>;

export type RemoveMutation<T> = Mutation<T>;

export type InsertChildMutation<T, U> = ChildMutation<T, U>;
export type RemoveChildMutation<T, U> = ChildMutation<T, U>;
export type MoveChildMutation<T, U>   = {
  oldIndex: number
} & ChildMutation<T, U>;

export type SetPropertyMutation<T> = {
  name: string;
  newValue: any;
  oldValue?: any;
  oldName?: string;
  index?: number;
} & Mutation<T>;

export const createMutationEvent = (mutation: Mutation<any>) => ({
  type: MUTATED,
  mutation
});

export const createSetValueMutation = <T>(type: string, target: T, newValue: any): SetValueMutation<T> => struct(type, {
  target,
  newValue
});

export const createInsertChildMutation = <T, U>(type: string, target: T, child: U, index: number = Number.MAX_SAFE_INTEGER): InsertChildMutation<T, U> => struct(type, {
  target,
  child,
  index
});

export const createRemoveChildChildMutation = <T, U>(type: string, target: T, child: U, index: number = Number.MAX_SAFE_INTEGER): RemoveChildMutation<T, U> => struct(type, {
  target,
  child,
  index
});

export const createMoveChildChildMutation = <T, U>(type: string, target: T, child: U, index: number, oldIndex: number): MoveChildMutation<T, U> => struct(type, {
  target,
  child,
  index,
  oldIndex
});

export const createPropertyMutation = <T>(type: string, target: T, name: string, newValue: any, oldValue?: any, oldName?: string, index?: number): SetPropertyMutation<T> => struct(type, {  type,
  target,
  name,
  newValue,
  oldValue,
  oldName,
  index
});

export const createRemoveMutation = <T>(type: string, target: T, newValue: any, oldValue?: any, oldName?: string, index?: number): RemoveMutation<T> => struct(type, {
  target
});

