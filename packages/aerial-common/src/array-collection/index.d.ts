export declare class ArrayCollection<T> extends Array<T> {
  protected constructor(...items:T[]);
  public static create<T>(...items: T[]): ArrayCollection<T>;
}