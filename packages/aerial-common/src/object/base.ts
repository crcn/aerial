import { ArrayCollection } from "../array-collection";

// performs cleanup of object for GC
export interface IDisposable {
  dispose(): void;
}

export class DisposableCollection extends  ArrayCollection<IDisposable> implements IDisposable {
  dispose() {
    for (const disposable of this) disposable.dispose();
  }
}

export interface IRemovable {
  remove(): void;
}

export interface INamed {
  readonly name: string;
}

export interface ITyped {
  readonly type: string;
}

export interface IValued {
  value: any;
}

export interface ICloneable {
  clone(deep?: boolean): ICloneable;
}

export interface IOwnable {
  readonly owner: any;
}

export interface IComparable {
  compare(node: IComparable): number;
}

export interface IEqualable {
  equalTo(value: IEqualable): boolean;
}

export interface IPatchable {
  patch(node: IPatchable);
}

export interface IUnique {
  readonly uid: any;
}