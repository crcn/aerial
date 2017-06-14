import { IDisposable } from "../object";
import { IActiveRecord } from "./base";
import { ObservableCollection } from "../observable";
import { Kernel, IInjectable } from "../ioc";
export declare class ActiveRecordCollection<T extends IActiveRecord<any>, U> extends ObservableCollection<T> implements IInjectable {
    private _sync;
    collectionName: string;
    query: Object;
    createActiveRecord: (source: U) => T;
    private _bus;
    private _globalMessageObserver;
    static create<T extends IActiveRecord<any>, U>(collectionName: string, kernel: Kernel, createActiveRecord: (source: U) => T, query?: any): ActiveRecordCollection<T, U>;
    setup(collectionName: string, kernel: Kernel, createActiveRecord: (source: U) => T, query?: Object): this;
    reload(): Promise<void>;
    load(): Promise<void>;
    sync(): IDisposable;
    /**
     * loads an item with the given query from the DS
     */
    loadItem(query: any): Promise<T | undefined>;
    /**
     * Loads an item into this collection if it exists, otherwise creates an item
     */
    loadOrInsertItem(query: any, source?: U): Promise<any>;
    /**
     * Synchronously creates a new active record (without persisting) with the given data
     * source.
     *
     * @param {U} source The source data represented by the new active record.
     * @returns
     */
    create(source: U): T;
    private onPostDSMessage(message);
    private _updateActiveRecord(source);
}
