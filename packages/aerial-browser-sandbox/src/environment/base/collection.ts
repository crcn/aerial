import { weakMemo } from "aerial-common2";

export const getSEnvCollection = weakMemo((context: any) => {

  interface Collection<T> extends Array<T> { } 

  interface CollectionClass {
    new<T>(...items: T[]): Collection<T>;
  }

  const _Collection = function(..._this) {
    _this["__proto__"] = this.constructor.prototype;
    return _this;
  } as any as CollectionClass;

  _Collection.prototype = [];

  return _Collection;
}); 
