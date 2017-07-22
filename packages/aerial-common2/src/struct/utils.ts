import { 
  immutable,
  mapImmutable,
  ImmutableObject,
} from "../immutable";

/**
 * Creates a typed structure
 */

export type Typed  = { $$type: string };
export type IDd    = { $$id: string };
export type Struct = Typed & IDd;

export const typed = <TType extends string, UProps, VInst>($$type: TType, factory: (props: UProps) => VInst): ((props?: UProps) => VInst & Typed) => {
   return (props?: UProps) => {
     return immutable({ ...factory(props) as any, $$type });
   };
};

/**
 * Creates an id'd structure
 */

let _idCount: number = 0;

const generateDefaultId = (props: any) => String(++_idCount);

export const idd = <UProps, VInst>(factory: (props?: UProps) => VInst, generateId: (props: UProps) => string = generateDefaultId): ((props?: UProps) => VInst & IDd) => {
   return (props?: UProps) => {
     return immutable({ ...factory(props) as any, $$id: generateDefaultId(props) });
   }
};

/**
 * @param type 
 */

export const createImmutableStructFactory = <T>(type: string, defaults: Partial<T> = {}) => {
  return idd(typed(type, ((props: Partial<T> = {}) => {
    return mapImmutable(defaults, props)
  }) as ((props?: Partial<T>) => ImmutableObject<T>)))
}
