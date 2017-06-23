export type ImmutableObjectType<TProps> = {
  [P in keyof TProps]: TProps[P];
} & { 
  set<K extends keyof TProps>(key: K, value: TProps[K]): _ImmutableObject<TProps>;
}

export interface IImmutableObject<TProps> {
  set<K extends keyof TProps>(key: K, value: TProps[K]): _ImmutableObject<TProps>;
};

class _ImmutableObject<TProps> extends Object implements IImmutableObject<TProps> {
  constructor(properties: TProps) {
    super(properties);
  }
  set<K extends keyof TProps>(key: K, value: TProps[K]): _ImmutableObject<TProps> {
    return this;
  }
}

function __ImmutableObject({..._this}) {
  _this["__proto__"] = this.constructor.prototype;
  return Object.freeze(_this);
}

Object.assign(__ImmutableObject.prototype, {
  $$immutable: true,
  constructor: __ImmutableObject,
  set(key: string, value: any) {
    return new this.constructor({...this, [key]: value });
  }
});

export const ImmutableObject: typeof _ImmutableObject = __ImmutableObject as any;

// const Person: ImmutableObjectIdentity<{ name: string }> = ImmutableObject;
export interface ImmutableObjectIdentity<T> {
  new(properties: T): _ImmutableObject<T>;
}

export const createImmutableObject = <T>(properties: T) => new ImmutableObject(properties);