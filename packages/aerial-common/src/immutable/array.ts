
import {ImmutableObject, ImmutableObjectIdentity} from "./object";

class _ImmutableArray<T> extends ImmutableObject<T[]> {
  constructor(...items: T[]) {
    super(items);
  }
  set(key: number, value: T) {
    return this;
  }
}

interface IImmutableArray<T> {
  [index: number]: T;
  push(...items: any[]): IImmutableArray<T>;
  unshift(...items: any[]): IImmutableArray<T>;
  splice(index: number, removeCount: number, ...items: any[]): IImmutableArray<T>;
}

function __ImmutableArray(..._this: any[]) {
  const proto = this.constructor.prototype;
  _this["__proto__"] = proto;
  return _this;
}

Object.assign(__ImmutableArray.prototype, {
  push(...items: any[]) {
    return new this.constructor(...this, ...items);
  },
  unshift(...items: any[]) {
    return new this.constructor(...items, ...this);
  },
  splice(index: number, removeCount: number, ...items: any[]) {
    const tmp = [...this];
    tmp.splice(index, removeCount, ...items);
    return new this.constructor(...tmp);
  },
  [Symbol.iterator]: function*() {
  	for (let i = 0; i < this.length; i++) {
    	yield this[i];
    }
  }
});

export const ImmutableArray: typeof _ImmutableArray = __ImmutableArray as any;

const im = new ImmutableArray(1, 2, 3);