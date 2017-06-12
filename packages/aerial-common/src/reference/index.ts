import { IReference } from "./base";
import { Metadata } from "@tandem/common/metadata";

export { IReference };

export class ValueReference implements IReference {
  constructor(readonly value: any) {

  }
}

export class MetadataValueReference implements IReference {
  constructor(private _metadata: Metadata, private _key: string) {

  }

  get value() {
    return this._metadata.get(this._key);
  }

  set value(value: any) {
    this._metadata.set(this._key, value);
  }
}

export class MinMaxValueReference implements IReference {
  constructor(private _target: IReference, private _min: number = -Infinity, private _max: number = Infinity) { }

  get value(): number{
    return this._minMax(this._target.value);
  }

  set value(value: number) {
    this._target.value = this._minMax(value);
  }

  private _minMax(value: number) {
    return Math.max(this._min, Math.min(this._max, value));
  }
}

export class DefaultValueReference implements IReference {
  constructor(private _target: IReference, readonly defaultValue: any) {

  }

  get value() {
    const value = this._target.value;
    return value == null ? this.defaultValue : value;
  }

  set value(value: any) {
    this._target.value = value;
  }
}