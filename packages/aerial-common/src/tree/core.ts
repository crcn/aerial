import { ITreeNode } from "./base";
import { ITreeWalker, IWalkable } from "./walker";
import { Observable, IObservable } from "../observable";
import { CallbackBus, IBus } from "mesh7";
import { CoreEvent, Mutation, InsertChildMutation, RemoveChildMutation } from "../messages";

export { ITreeNode };

export namespace TreeNodeMutationTypes {
  export const NODE_ADDED   = "nodeAdded";
  export const NODE_REMOVED = "nodeRemoved";
}

export class TreeNode<T extends TreeNode<any>> extends Observable implements ITreeNode<T>, IWalkable {

  private _parent: T;
  private _children: Array<T>;
  private _childObserver: IBus<any, any>;

  constructor() {
    super();
    this._children = this.createChildren();
    this._childObserver = new CallbackBus(this.onChildAction.bind(this));
  }

  get children(): Array<T> {
    return this._children;
  }

  get firstChild(): T {
    return this._children[0];
  }

  get lastChild(): T {
    return this._children[this._children.length - 1];
  }

  appendChild(child: T): T {
    this.insertChildAt(child, this._children.length);
    return child;
  }

  removeAllChildren() {
    while (this._children.length) {
      this.removeChild(this._children[0]);
    }
  }

  protected createChildren(): T[] {
    return [];
  }

  removeChild(child: T): T {
    const index = this._children.indexOf(child);
    if (index === -1) {
      return undefined;
    }

    this._children.splice(index, 1);
    this.onChildRemoved(child, index);
    return child;
  }

  insertChildAt(newChild: T, index: number) {
    if (newChild._parent) {
      newChild._parent.removeChild(newChild);
    }
    this._children.splice(index, 0, newChild);
    this.onChildAdded(newChild, index);
  }

  insertBefore(newChild: T, existingChild: T) {
    if (existingChild == null) return this.appendChild(newChild);
    const index = this._children.indexOf(existingChild);
    if (index !== -1) {
      this.insertChildAt(newChild, index);
    }
    return newChild;
  }

  replaceChild(newChild: T, existingChild: T) {
    const index = this._children.indexOf(existingChild);
    if (index !== -1) {
      this.insertChildAt(newChild, index);
      this.removeChild(existingChild);
    }
    return existingChild;
  }

  get parent(): T {
    return this._parent;
  }

  get root(): T {
    let p: TreeNode<T> = this;
    while (p.parent) p = p.parent;
    return <T>p;
  }

  get ancestors(): Array<T> {
    const ancestors = [];
    let p = this.parent;
    while (p) {
      ancestors.push(p);
      p = p.parent;
    }
    return ancestors;
  }

  get nextSibling(): T {
    return this._parent ? this._parent.children[this._parent.children.indexOf(this) + 1] : undefined;
  }

  get previousSibling(): T {
    return this._parent ? this._parent.children[this._parent.children.indexOf(this) - 1] : undefined;
  }

  get depth(): number {
    return this.ancestors.length;
  }

  protected onChildAdded(child: T, index: number) {
    child._parent = this;    
    child.observe(this._childObserver);
    child.notify(new InsertChildMutation(TreeNodeMutationTypes.NODE_ADDED, this, child, index).toEvent());
    child.onAdded();
  }

  protected onChildRemoved(child: T, index: number) {
    child.onRemoved();
    child.notify(new RemoveChildMutation(TreeNodeMutationTypes.NODE_REMOVED, this, child, index).toEvent());
    child.unobserve(this._childObserver);
    child._parent = undefined;
  }

  protected onAdded() {
  }

  protected onRemoved() {
  }

  public clone(deep?: boolean): T {
    const clone = this.cloneLeaf();
    if (deep) {
      for (let i = 0, n = this.children.length; i < n; i++) {
        clone.appendChild(this.children[i].clone(deep));
      }
    }
    return <T>clone;
  }

  protected cloneLeaf(): T {
    return <T>new TreeNode<T>();
  }

  protected onChildAction(message: CoreEvent) {
    this.notify(message);
  }

  visitWalker(walker: ITreeWalker) {
    this.children.forEach(child => walker.accept(child));
  }
}