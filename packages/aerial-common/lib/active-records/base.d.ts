import { IStreamableBus, IMessage } from "mesh";
import { IDisposable } from "../object";
import { ISerializable } from "../serialize";
import { Observable, IObservable } from "../observable";
import { IInjectable } from "../ioc";
export interface IActiveRecord<T> extends IObservable, IInjectable, IDisposable, ISerializable<T> {
    collectionName: string;
    idProperty: string;
    source: T;
    save(): any;
    insert(): any;
    remove(): any;
    update(): any;
    /**
     * @deprecated
     */
    serialize(): any;
    deserialize(value: any): any;
}
export declare abstract class BaseActiveRecord<T> extends Observable implements IActiveRecord<T> {
    private _source;
    readonly collectionName: string;
    protected dispatcher: IStreamableBus<any>;
    readonly idProperty: string;
    constructor(_source: T, collectionName: string);
    readonly isNew: boolean;
    readonly source: T;
    /**
     * Refreshes the active record from the DS if the source data
     * is stale.
     */
    refresh(): Promise<this>;
    save(): Promise<this>;
    dispose(): void;
    insert(): Promise<this>;
    remove(): Promise<this>;
    protected readonly sourceQuery: {
        [x: string]: any;
    };
    protected shouldUpdate(): boolean;
    /**
     * Called immediately before update()
     * @protected
     */
    protected willUpdate(): void;
    /**
     * Called immediately before insert() and update()
     */
    protected willSave(): void;
    update(): Promise<this>;
    abstract serialize(): T;
    toJSON(): T;
    deserialize(source: T): void;
    protected shouldDeserialize(b: T): boolean;
    protected setPropertiesFromSource(source: T): void;
    fetch(request: IMessage): Promise<this>;
}
