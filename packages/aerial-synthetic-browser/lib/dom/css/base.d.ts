import { ITreeWalker } from "aerial-common";
import { SyntheticCSSStyleSheet } from "./style-sheet";
import { SyntheticDOMNode } from "../../dom";
import { IEditable, IEditor, BaseContentEdit, SyntheticObjectEdit, ISyntheticObject, ISyntheticSourceInfo, SyntheticObjectEditor, SyntheticObjectSerializer } from "aerial-sandbox";
export declare class SyntheticCSSObjectEdit<T extends SyntheticCSSObject> extends SyntheticObjectEdit<T> {
}
export declare class SyntheticCSSObjectEditor<T extends SyntheticCSSObject> extends SyntheticObjectEditor<T> {
}
export declare abstract class SyntheticCSSObject implements ISyntheticObject, IEditable {
    $source: ISyntheticSourceInfo;
    $uid: any;
    $parentStyleSheet: SyntheticCSSStyleSheet;
    $parentRule: SyntheticCSSObject;
    $ownerNode: SyntheticDOMNode;
    constructor();
    readonly parentStyleSheet: any;
    readonly ownerNode: any;
    readonly parentRule: SyntheticCSSObject;
    readonly uid: any;
    readonly source: ISyntheticSourceInfo;
    clone(deep?: boolean): any;
    regenerateUID(deep?: boolean): this;
    $linkClone(clone: SyntheticCSSObject): SyntheticCSSObject;
    protected abstract cloneShallow(): SyntheticCSSObject;
    abstract createEdit(): BaseContentEdit<SyntheticCSSObject>;
    abstract createEditor(): IEditor;
    abstract visitWalker(walker: ITreeWalker): any;
    /**
     * Counts attribute differences of the target node, omitting children diffs.
     *
     * @abstract
     * @param {*} target
     * @param {boolean} [deep]
     */
    abstract countShallowDiffs(target: SyntheticCSSObject): number;
}
export declare const SyntheticCSSObjectSerializer: typeof SyntheticObjectSerializer;
