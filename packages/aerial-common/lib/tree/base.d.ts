import { IObservable } from "../observable";
export interface ITreeNode<T extends ITreeNode<any>> extends IObservable {
    children: Array<T>;
    firstChild: T;
    lastChild: T;
    nextSibling: T;
    previousSibling: T;
    appendChild(child: T): any;
    removeChild(child: T): any;
    insertChildAt(newChild: T, index: number): any;
    insertBefore(newChild: T, existingChild: T): any;
    replaceChild(newChild: T, existingChild: T): any;
    depth: number;
    parent: T;
    ancestors: Array<T>;
    root: T;
    clone(): T;
}
