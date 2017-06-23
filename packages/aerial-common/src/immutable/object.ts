const shallowClone = (value) => {
  if (Array.isArray) {
    return [...value];
  } else {
    return {...value};
  }
}

class _ImmutableObject<TProps> extends Object {
  constructor(properties: TProps) {
    super(properties);
  }
  set<K extends keyof TProps>(key: K, value: TProps[K]): _ImmutableObject<TProps> {
    return this;
  }
}

const proxyHandler = {
  get(target: _ImmutableObject<any>, key) {
    return target[key];
  },
  set(target: _ImmutableObject<any>, key: any, value: any) {
    target.set(key, value);
    return true;
  }
};

function __ImmutableObject(properties: any) {
  const _this = shallowClone(properties);
  const proto = this.constructor.prototype;
  _this["__proto__"] = proto;
  return new Proxy(_this as _ImmutableObject<any>, proxyHandler);
}

Object.assign(__ImmutableObject.prototype, {
  set(key: string, value: any) {
    return new this.constructor({...this, [key]: value });
  }
});

export const ImmutableObject: typeof _ImmutableObject = __ImmutableObject as any;

// const Person: ImmutableObjectIdentity<{ name: string }> = ImmutableObject;
export interface ImmutableObjectIdentity<T> {
  new(properties: T): _ImmutableObject<T>;
}
