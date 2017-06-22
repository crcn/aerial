class _ImmutableObject extends Object { }

const proxyHandler = {
  get(target, key) {
    return target[key];
  },
  set(target, key, value) {
    return new target.constructor({...target, [key]: value });
  }
};

function __ImmutableObject({..._this}: any) {
  const proto = this.constructor.prototype;
  _this["__proto__"] = proto;
  return new Proxy(_this, proxyHandler);
}

export const ImmutableObject: typeof _ImmutableObject = __ImmutableObject as any;