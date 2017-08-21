import { weakMemo } from "../memo";
import { ImmutableArray } from "./array";
import { mapValues, each } from "lodash";
import { ImmutableObject } from "./object";

export function immutable<T extends T[]>(value: T[]): ImmutableArray<T>;
export function immutable<T extends Object>(value: T): ImmutableObject<T>;

export function immutable(value) {
  if (!value || value.$$immutable) return value;
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
  } else if (typeof map === 'object' && map && map.constructor === Object) {
    let result = (immutable as any)(target || {} as T);
    for (const key in (map as any)) {
      try {
        result = result.set(key as any, mapImmutable(result[key], map[key]));
      } catch(e) {
        throw e;
      }
    }
    return result;
  } else {
    return map as any;
  }
}

export function traverseObject(target: any, _each: (value: any, key: any, object: any) => void | boolean) {
  if (Array.isArray(target) || (target && (target.constructor === Object || target.constructor === ImmutableObject))) {
    each(target, (value, key, object) => {
      if (_each(value, key, object) !== false) {
        traverseObject(value, _each);
      }
    });
  }
}

export function update<T, K extends keyof T>(object: T, key: K, value: T[K]): T {
  if (object[key] === value) return object;
  if (Array.isArray(object) && !isNaN(Number(key))) {
    const index = Number(key);
    return [...object.slice(0, index), value, object.slice(index + 1)] as any as T;
  } else {
    return {
      ...(object as Object),
      [key as string]: value
    } as any as T;
  }
};

export const shallowClone = (object: any) => Array.isArray(object) ? [].concat(object) : object && (object.constructor === Object || object.constructor === ImmutableObject) ? {...object} : object;
  
export function updateIn(target: any, path: string[], value: any) {
  let newTarget = shallowClone(target);
  let current = newTarget;
  let i = 0, n = path.length - 1;
  for (; i < n; i++) {
    current = current[path[i]] = shallowClone(current[path[i]]) || {};
  }
  current[path[i]] = value;
  return newTarget;
};


export const arraySplice = <T>(target: T[], startIndex: number, deleteCount: number, ...newValues: T[]) => [...target.slice(0, startIndex), ...newValues, ...target.slice(startIndex + deleteCount)];

export const arrayReplaceIndex = <T>(target: T[], index: number, newItem: T) => arraySplice(target, index, 1, newItem);
export const arrayReplaceItem = <T>(target: T[], oldItem: T, newItem: T) => arrayReplaceIndex(target, target.indexOf(oldItem), newItem);

export const arrayRemoveIndex = <T>(target: T[], index: number) => arraySplice(target, index, 1);
export const arrayRemoveItem = <T>(target: T[], item: T) => arraySplice(target, target.indexOf(item), 1);