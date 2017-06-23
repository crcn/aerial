import {mapValues} from "lodash";
import {ImmutableArray, IImmutableArray} from "./array";
import {ImmutableObject, ImmutableObjectType} from "./object";

export function immutable<T extends T[]>(value: T[]): IImmutableArray<T>;
export function immutable<T extends Object>(value: T): ImmutableObjectType<T>;

export function immutable(value) {
  if (value.$$immutable) return value;
  return Array.isArray(value) ? 
    new ImmutableArray(...value.map(immutable)) : 
      typeof value === "object" ?
      new ImmutableObject(mapValues(value, immutable)) :
      value;
}

export function mutable(value) {
  if (!value.$$immutable) return value;
  return Array.isArray(value) ? 
    [...value.map(mutable)] : 
      typeof value === "object" ?
      mapValues(value, mutable) :
      value;
}

type Partial<T> = {
  [P in keyof T]?: Partial<T[P]>;
}

type Query<T> = {
  $set: Partial<T>
}

type MergeOptions<T> = Query<T> | T;

export function updateImmutable<T>(target: T, properties: MergeOptions<T>): ImmutableObjectType<T>;
export function updateImmutable<T extends ImmutableObjectType<any>>(target: T, properties: Partial<T>): T;

export function updateImmutable<T>(target: T, properties: MergeOptions<T> ): IImmutableArray<T>;
export function updateImmutable<T extends IImmutableArray<any>>(target: T, properties: Partial<T>): T;

// TODO - use mongodb syntax for this
export function updateImmutable(oldValue, newValue) {
  let mergedValue;

  if (Array.isArray(newValue)) {
    mergedValue = new Array(newValue.length);
    for (let i = 0, n = newValue.length; i < n; i++) {
      mergedValue[i] = i < oldValue.length ? updateImmutable(oldValue[i], newValue[i]) : immutable(newValue[i]);
    }
  } else if (typeof newValue === 'object') {
    mergedValue = {};
    for (const key in newValue) {
      mergedValue[key] = oldValue[key] != null ? updateImmutable(oldValue[key], newValue[key]) : newValue[key];
    }
  } else {
    mergedValue = newValue;
  }

  return immutable(mergedValue);
}