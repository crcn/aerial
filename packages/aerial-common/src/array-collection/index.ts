class _ArrayCollection<T> extends Array<T> {
  constructor(...items: T[]) {
    super(...items);
  }
}

function __ArrayCollection() {
  const _this = [];
  Array.apply(_this, arguments);
  _this["__proto__"] = this.constructor.prototype;
  return _this;
}

__ArrayCollection.prototype = [];

export const ArrayCollection: typeof _ArrayCollection = __ArrayCollection as any;
