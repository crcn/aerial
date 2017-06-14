import { ArrayCollection } from "../array-collection";
export declare class ObservableCollection<T> extends ArrayCollection<T> {
    push(...items: Array<T>): number;
    unshift(...items: Array<T>): number;
    shift(): T;
    pop(): T;
    splice(start: number, deleteCount?: number, ...items: T[]): T[];
}
