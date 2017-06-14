import { IObservable } from "../observable";
import { ArrayCollection } from "../array-collection";
import { CoreEvent } from "../messages";
import { IBus } from "mesh";
export declare class ObservableCollection<T> extends ArrayCollection<T> implements IObservable {
    private _observable;
    private _itemObserver;
    protected constructor(...items: T[]);
    observe(actor: IBus<any, any>): void;
    unobserve(actor: IBus<any, any>): void;
    notify(message: CoreEvent): any;
    push(...items: Array<T>): number;
    unshift(...items: Array<T>): number;
    shift(): T;
    pop(): T;
    splice(start: number, deleteCount?: number, ...newItems: T[]): T[];
    private _watchItems(newItems);
}
