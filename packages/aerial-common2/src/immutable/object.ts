export type ImmutableObject<TProps> = {
  set<K extends keyof TProps>(key: K, value: TProps[K]): ImmutableObject<TProps>;
} & TProps;

export interface ImmutableObjectClass {
  new<TProps>(properties: TProps): ImmutableObject<TProps>;
}

export declare const ImmutableObject: ImmutableObjectClass;

// const People: ImmutableArrayIdentity<{ name: string }> = ImmutableArray;
export type ImmutableObjectIdentity<T> = { new<T>(...items: T[]): ImmutableObject<T> };

function _ImmutableObject({..._this}) {
  _this["__proto__"] = this.constructor.prototype;
  return Object.freeze(_this);
}

Object.assign(_ImmutableObject.prototype, {
  $$immutable: true,
  constructor: _ImmutableObject,
  set(key: string, value: any) {
    return new this.constructor({...this, [key]: value });
  }
});

exports.ImmutableObject = _ImmutableObject;

export const createImmutableObject = <T>(properties: T): ImmutableObject<T> => new exports.ImmutableObject(properties);