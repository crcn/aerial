import { ISyntheticObject, ISyntheticSourceInfo } from "../synthetic";
import { Logger, Mutation, Kernel, CoreEvent, Observable } from "aerial-common";
export declare type contentEditorType = {
    new (uri: string, content: string): IEditor;
};
export interface IEditor {
    applyMutations(changes: Mutation<ISyntheticObject>[]): any;
}
export interface IEditable {
    createEdit(): IContentEdit;
    createEditor(): IEditor;
}
export interface IDiffable {
    createDiff(source: ISyntheticObject): IContentEdit;
}
export declare abstract class BaseContentEditor<T> implements IEditor {
    readonly uri: string;
    readonly content: string;
    readonly logger: Logger;
    protected kernel: Kernel;
    protected _rootASTNode: T;
    constructor(uri: string, content: string);
    $didInject(): void;
    applyMutations(mutations: Mutation<ISyntheticObject>[]): any;
    protected handleUnknownMutation(mutation: Mutation<ISyntheticObject>): void;
    protected abstract findTargetASTNode(root: T, target: ISyntheticObject): T;
    protected abstract parseContent(content: string): T;
    protected abstract getFormattedContent(root: T): string;
}
export interface ISyntheticObjectChild {
    uid: string;
    clone(deep?: boolean): any;
}
export interface IContentEdit {
    readonly mutations: Mutation<ISyntheticObject>[];
}
export declare abstract class BaseContentEdit<T extends ISyntheticObject> {
    readonly target: T;
    private _mutations;
    private _locked;
    constructor(target: T);
    /**
     * Lock the edit from any new modifications
     */
    lock(): this;
    readonly locked: boolean;
    readonly mutations: Mutation<ISyntheticObject>[];
    /**
     * Applies all edit.changes against the target synthetic object.
     *
     * @param {(T & IEditable)} target the target to apply the edits to
     */
    applyMutationsTo(target: T & IEditable, each?: (T, mutation: Mutation<ISyntheticObject>) => void): void;
    /**
     * creates a new diff edit -- note that diff edits can only contain diff
     * events since any other event may foo with the diffing.
     *
     * @param {T} newSynthetic
     * @returns
     */
    fromDiff(newSynthetic: T): BaseContentEdit<T>;
    protected abstract addDiff(newSynthetic: T): BaseContentEdit<T>;
    protected addChange<T extends Mutation<ISyntheticObject>>(mutation: T): T;
    protected addChildEdit(edit: IContentEdit): this;
}
export declare class FileEditor {
    protected readonly logger: Logger;
    private _editing;
    private _mutations;
    private _shouldEditAgain;
    private _promise;
    private _kernel;
    applyMutations(mutations: Mutation<ISyntheticObject>[]): Promise<any>;
    private run();
}
export declare abstract class BaseEditor<T> {
    readonly target: T;
    constructor(target: T);
    applyMutations(mutations: Mutation<T>[]): void;
    protected applySingleMutation(mutation: Mutation<T>): void;
}
export declare class GroupEditor implements IEditor {
    readonly editors: IEditor[];
    constructor(...editors: IEditor[]);
    applyMutations(mutations: Mutation<any>[]): void;
}
export declare class SyntheticObjectTreeEditor implements IEditor {
    readonly root: ISyntheticObject;
    private _each;
    constructor(root: ISyntheticObject, _each?: (target: IEditable, change: Mutation<ISyntheticObject>) => void);
    applyMutations(mutations: Mutation<ISyntheticObject>[]): void;
}
/**
 * Watches synthetic objects, and emits changes over time.
 */
export declare class SyntheticObjectChangeWatcher<T extends ISyntheticObject & IEditable & Observable> {
    private onChange;
    private onClone;
    private filterMessage;
    private _clone;
    private _target;
    private _targetObserver;
    private _diffing;
    private _shouldDiffAgain;
    private _ticking;
    constructor(onChange: (changes: Mutation<ISyntheticObject>[]) => any, onClone: (clone: T) => any, filterMessage?: (event: CoreEvent) => boolean);
    target: T;
    dispose(): void;
    private onTargetEvent(event);
    private requestDiff();
    private diff();
}
export declare namespace SyntheticObjectChangeTypes {
    const SET_SYNTHETIC_SOURCE_EDIT = "setSyntheticSourceEdit";
}
export declare abstract class SyntheticObjectEditor<T extends ISyntheticObject> extends BaseEditor<T> {
    applySingleMutation(mutation: Mutation<T>): void;
}
export declare abstract class SyntheticObjectEdit<T extends ISyntheticObject> extends BaseContentEdit<T> {
    setSource(source: ISyntheticSourceInfo): void;
    protected addDiff(from: T): this;
}
