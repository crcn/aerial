
import { 
  getPath,
  updateIn,
  immutable,
  mapImmutable,
  flattenObject,
  getValueByPath,
  ImmutableObject,
} from "../immutable";

import {
  weakMemo
} from "../memo";

import {
  omit
} from "lodash";

/**
 * Creates a typed structure
 */

export type Typed  = { $$type: string };
export type IDd    = { $$id: string };
export type Struct = Typed & IDd;

export const typed = <TType extends string, VInst>($$type: TType, factory: (...args) => VInst): ((...args) => VInst & Typed) => {
   return (...args) => {
     return { ...factory(...args) as any, $$type };
   };
};

/**
 * Creates an id'd structure
 */

let _idCount: number = 0;

const generateDefaultId = (...args) => String(++_idCount);

export const idd = <VInst>(factory: (...args) => VInst, generateId: (...args) => string = generateDefaultId): ((...args) => VInst & IDd) => {
   return (...args) => {
     return { ...factory(...args) as any, $$id: generateDefaultId(...args) };
   }
};

/**
 */

export const getPathById = weakMemo((root: any, id: string) => getPath(root, (value: IDd) => value && value.$$id === id));

/**
 */

export const getPathByType = (root: any, type: string) => getPath(root, (value: Typed) => value && value.$$type === type);

/**
 */

export const getValuesByType = (root: any, type: string) => {
  const flattened = flattenObject(root);
  const valuesByType = [];
  for (const k in flattened) {
    if (flattened[k] && flattened[k].$$type === type) {
      valuesByType.push(flattened[k]);
    }
  }
  return valuesByType;
}

/**
 */

export const getValueById = (root: any, id: string) => {
  return getValueByPath(root, getPathById(root, id));
}

/**
 */

export const updateStruct = <TStruct extends IDd, K extends keyof TStruct>(root: any, struct: TStruct, key: K, value: any) => updateIn(root, [...getPathById(root, struct.$$id), key], value);


/**
 * @param type 
 */

export const structFactory = <TFunc extends (...args) => any>(type: string, create: TFunc) => {
  return idd(typed(type, create));
}

export const struct = <TProps>(type: string, props: TProps) => idd(typed(type, () => props))();

/**
 * @param type 
 */

export const createImmutableStructFactory = <T>(type: string, defaults: Partial<T> = {}) => {
  return idd(typed(type, ((props: Partial<T> = {}) => {
    return mapImmutable(defaults, props)
  }) as ((props?: Partial<T>) => ImmutableObject<T>)))
}


export const createStructFactory = <T>(type: string, defaults: Partial<T> = {}) => {
  return idd(typed(type, ((props: Partial<T> = {}) => {
    return Object.assign(JSON.parse(JSON.stringify(defaults)), props) as T;
  }) as ((props?: Partial<T>) => T)))
}

/**
 */

export const deleteValueById = (root: any, id: string) => {
  const path  = getPathById(root, id);
  const key   = path[path.length - 1];
  const ownerPath = path.slice(0, path.length - 1);
  const owner = getValueByPath(root, ownerPath);
  const ownerClone = Array.isArray(owner) ? [...owner.slice(0, Number(key)), ...owner.slice(Number(key) + 1)] : omit(owner, key);
  return updateIn(root, ownerPath, ownerClone);
};
