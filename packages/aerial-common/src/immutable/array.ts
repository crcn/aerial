class _ImmutableArray<T> extends Array<T> {
  constructor(...items: T[]) {
    super(...items);
  }
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