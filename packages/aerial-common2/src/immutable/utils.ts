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
    let result = immutable(target || {} as T);
    for (const key in map) {
      try {
        result = result.set(key, mapImmutable(result[key], map[key]));
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

export function update<T, K extends keyof T>(object: T, key: K, value: T[K]) {
  if (Array.isArray(object) && !isNaN(Number(key))) {
    const index = Number(key);
    return [...object.slice(0, index), value, object.slice(index + 1)];
  } else {
    return {
      ...(object as Object),
      [key as string]: value
    }
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

export const flattenObject = weakMemo((target: any) => {
  const keys = new Map();
  const flattened = {};
  traverseObject(target, (value, key, object) => {
    const prefix = keys.get(object) || "";
    const path   = prefix ? `${prefix}.${key}` : key;
    flattened[path] = value;
    keys.set(value, path);
  });
  return flattened;
});

export const getPath = weakMemo(<T>(root: any, filter: (a: any) => boolean) => {
  const flattened = flattenObject(root);
  for (const path in flattened) {
    const value = flattened[path];
    if (filter(value)) return path.split(".");
  }
});


export const getValueByPath = weakMemo(<T>(root: any, path: string[] | ReadonlyArray<string>) => path && flattenObject(root)[path.join(".")]);