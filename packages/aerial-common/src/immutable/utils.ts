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

export function mergeImmutable<T>(a: T, b: T): T {
  return Array.isArray(a) ? 
}