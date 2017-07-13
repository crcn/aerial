import {ImmutableObject} from "./object";

export type ImmutableArray<T> = {
  constructor(...items: T[]);
  [index: number]: T;
  set(index: number, value: T): ImmutableArray<T>;
  push(...items: any[]): ImmutableArray<T>;
  unshift(...items: any[]): ImmutableArray<T>;
  splice(index: number, removeCount: number, ...items: any[]): ImmutableArray<T>;
  [Symbol.iterator]();
} & Array<T>;

export interface ImmutableArrayClass {
  new<T>(...items: T[]): ImmutableArray<T>;
}

export declare const ImmutableArray: ImmutableArrayClass;

export type ImmutableArrayIdentity<T> = { new<T>(...items: T[]): ImmutableArray<T> };

function _ImmutableArray(..._this: any[]) {
  _this["__proto__"] = this.constructor.prototype;
  return Object.freeze(_this);
}

exports.ImmutableArray = _ImmutableArray;

_ImmutableArray.prototype = [];

Object.assign(_ImmutableArray.prototype, {
  constructor: _ImmutableArray,
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
  filter(fn: Function) {
    return new this.constructor(...Array.prototype.filter.call(this, fn));
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

export const createImmutableArray = <T>(...items: T[]): ImmutableArray<T> => new exports.ImmutableArray(...items);
