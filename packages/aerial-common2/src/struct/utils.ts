
import { 
  getPath,
  updateIn,
  immutable,
  mapImmutable,
  getValueByPath,
  ImmutableObject,
} from "../immutable";

/**
 * Creates a typed structure
 */

export type Typed  = { $$type: string };
export type IDd    = { $$id: string };
export type Struct = Typed & IDd;

export const typed = <TType extends string, VInst>($$type: TType, factory: (...args) => VInst): ((...args) => VInst & Typed) => {
   return (...args) => {
     return immutable({ ...factory(...args) as any, $$type });
   };
};

/**
 * Creates an id'd structure
 */

let _idCount: number = 0;

const generateDefaultId = (...args) => String(++_idCount);

export const idd = <VInst>(factory: (...args) => VInst, generateId: (...args) => string = generateDefaultId): ((...args) => VInst & IDd) => {
   return (...args) => {
     return immutable({ ...factory(...args) as any, $$id: generateDefaultId(...args) });
   }
};

/**
 */

export const getPathById = (root: any, id: string) => getPath(root, (value: IDd) => value && value.$$id === id);

/**
 */

export const getPathByType = (root: any, type: string) => getPath(root, (value: Typed) => value && value.$$type === type);

/**
 */

export const getValueById = (root: any, id: string) => getValueByPath(root, getPathById(root, id));

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
