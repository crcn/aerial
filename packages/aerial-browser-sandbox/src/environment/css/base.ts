import { weakMemo, Struct, generateDefaultId, ExpressionLocation } from "aerial-common2";

export interface SEnvCSSObjectInterface {
  $id: string;
  $source: ExpressionLocation;
  struct: Struct;
}

export interface SEnvCSSObjectParentInterface extends SEnvCSSObjectInterface {
  childDidChange();
}

export const getSEnvCSSBaseObjectClass = weakMemo((context: any) => {
  abstract class SEnvCSSBaseObject implements SEnvCSSObjectInterface {

    protected _struct: Struct;
    readonly $id: string;
    public $source: ExpressionLocation;

    constructor() {
      this.$id = generateDefaultId();
    }

    get struct(): Struct {
      return this._struct || this.resetStruct();
    }

    abstract $createStruct(): Struct;

    protected resetStruct() {
      return this._struct = this.$createStruct();
    }
  }

  return SEnvCSSBaseObject;
});