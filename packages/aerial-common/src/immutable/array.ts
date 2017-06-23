
import {ImmutableObject, ImmutableObjectIdentity} from "./object";

export interface IImmutableArray<T> {
  [index: number]: T;
  set(index: number, value: T): IImmutableArray<T>;
  push(...items: any[]): IImmutableArray<T>;
  unshift(...items: any[]): IImmutableArray<T>;
  splice(index: number, removeCount: number, ...items: any[]): IImmutableArray<T>;
}

function __ImmutableArray(..._this: any[]) {
  return ImmutableObject.call(this, _this);
}

__ImmutableArray.prototype = [];

Object.assign(__ImmutableArray.prototype, {
  constructor: __ImmutableArray,
  $$immutable: true,
  set(key: number, value: any) {
    const tmp = Array.prototype.slice.call(this);
    tmp[key] = value;
    return new this.constructor(...tmp);
  },  
  push(...items: any[]) {
    return new this.constructor(...this, ...items);
  },
  slice(startIndex: number, endIndex: number) {
    return new this.constructor(...Array.prototype.slice.call(this).slice(startIndex, endIndex));
  },  
  unshift(...items: any[]) {
    return new this.constructor(...items, ...this);
  },
  splice(index: number, removeCount: number, ...items: any[]) {
    const tmp = Array.prototype.slice.call(this);
    tmp.splice(index, removeCount, ...items);
    return new this.constructor(...tmp);
  },
  [Symbol.iterator]: function*() {
  	for (let i = 0; i < this.length; i++) {
    	yield this[i];
    }
  }
});


export const ImmutableArray: { new<T>(...items: T[]): IImmutableArray<T> & Array<T> } = __ImmutableArray as any;

export const createImmutableArray = <T>(...items: T[]) => new ImmutableArray(...items);
