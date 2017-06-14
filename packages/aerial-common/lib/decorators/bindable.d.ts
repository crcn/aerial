import { IObservable } from "../observable";
export declare function bindable(bubbles?: boolean): (proto: IObservable, property?: string, descriptor?: PropertyDescriptor) => void;
export declare function bubble(): (proto: IObservable, property?: string, descriptor?: PropertyDescriptor) => void;
