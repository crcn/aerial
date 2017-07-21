import {mapValues, each} from "lodash";
import {ImmutableArray} from "./array";
import {ImmutableObject} from "./object";

export function immutable<T extends T[]>(value: T[]): ImmutableArray<T>;
export function immutable<T extends Object>(value: T): ImmutableObject<T>;

export function immutable(value) {
  if (value.$$immutable) return value;
  return Array.isArray(value) ? 
    new ImmutableArray(...value.map(immutable)) : 
      value != null && value.constructor === Object ?
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

type MapFn<T> = (value: T) => T;

type Partial<T> = {
  [P in keyof T]?: MapFn<T[P]> | Partial<T[P]>;
}

type ObjectMap<T> = MapFn<T> | Partial<T> | T;

export function mapImmutable<T>(target: T, map: ObjectMap<T>): T;

export function mapImmutable<T>(target: T, map: ObjectMap<T>): T {
  if (typeof map === 'function') {
    return immutable(map(target));
  } else if (typeof map === 'object') {
    let result = immutable(target);
    for (const key in map) {
      result = result.set(key, mapImmutable(result[key], map[key]));
    }
    return result;
  } else {
    return map;
  }
}
