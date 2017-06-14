import { ITreeNode } from "./base";
import { ITreeWalker, IWalkable } from "./walker";
import { Observable } from "../observable";
import { CoreEvent } from "../messages";
export { ITreeNode };
export declare namespace TreeNodeMutationTypes {
    const NODE_ADDED = "nodeAdded";
    const NODE_REMOVED = "nodeRemoved";
}
export declare class TreeNode<T extends TreeNode<any>> extends Observable implements ITreeNode<T>, IWalkable {
    private _parent;
    private _children;
    private _childObserver;
    constructor();
    readonly children: Array<T>;
    readonly firstChild: T;
    readonly lastChild: T;
    appendChild(child: T): T;
    removeAllChildren(): void;
    protected createChildren(): T[];
    removeChild(child: T): T;
    insertChildAt(newChild: T, index: number): void;
    insertBefore(newChild: T, existingChild: T): T;
    replaceChild(newChild: T, existingChild: T): T;
    readonly parent: T;
    readonly root: T;
    readonly ancestors: Array<T>;
    readonly nextSibling: T;
    readonly previousSibling: T;
    readonly depth: number;
    protected onChildAdded(child: T, index: number): void;
    protected onChildRemoved(child: T, index: number): void;
    protected onAdded(): void;
    protected onRemoved(): void;
    clone(deep?: boolean): T;
    protected cloneLeaf(): T;
    protected onChildAction(message: CoreEvent): void;
    visitWalker(walker: ITreeWalker): void;
}
