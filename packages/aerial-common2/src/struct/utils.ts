
import { 
  updateIn,
  immutable,
  mapImmutable,
  ImmutableObject,
} from "../immutable";

import {
  weakMemo
} from "../memo";

import { each } from "lodash";

import {
  omit
} from "lodash";

/**
 * Creates a typed structure
 */

export type Typed  = { $$type: string };
export type IDd    = { $$id: string };
export type Struct = Typed & IDd;

export type ErrorShape = {
  type: string;
  message: string;
}

export const typed = <TType extends string, VInst>($$type: TType, factory: (...args) => VInst): ((...args) => VInst & Typed) => {
   return (...args) => {
     return { ...factory(...args) as any, $$type };
   };
};

/**
 * Creates an id'd structure
 */

let _idCount: number = 0;
const ID_SEED = Math.round(Math.random() * 9999);

export const generateDefaultId = (...args) => `${ID_SEED}.${String(++_idCount)}`;

export const idd = <VInst>(factory: (...args) => VInst, generateId: (...args) => string = generateDefaultId): ((...args) => VInst & IDd) => {
   return (...args) => {
     return { $$id: generateDefaultId(...args), ...factory(...args) as any };
   }
};

/**
 */

const pathIdFilter = weakMemo(id => (value: IDd) => value && value.$$id === id);

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


export type StructReference = [string, string];

export const getReferenceString = ({ $$id, $$type }: Struct) => `${$$type}:${$$id}`;
export const getStructReference = ({ $$id, $$type }: Struct): [string, string] => [$$type, $$id];