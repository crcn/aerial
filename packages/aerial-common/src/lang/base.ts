import { IRange } from "../geom";
import { patchable } from "../decorators";
import { diffArray } from "../utils/array";
import { ITreeNode, TreeNode } from "../tree";
import { IObservable, Observable } from "../observable";
import { IDisposable, IComparable, IPatchable } from "../object";

export interface ISourcePosition {
  line: number;
  column: number;
}

export function sourcePositionEquals(a: ISourcePosition, b: ISourcePosition) {
  return (a == null && b == null) || (a && b && (a.line === b.line && a.column === b.column));
}


export interface ISourceLocation {
  start?: ISourcePosition;
  end?: ISourcePosition;
}

export interface IASTNode {
  parent: IASTNode;
  readonly kind: number;
  accept(visitor);
}

export function cloneSourcePosition({ line, column }: ISourcePosition): ISourcePosition {
  return { line, column };
}

export function cloneSourceLocation({ start, end }: ISourceLocation): ISourceLocation {
  return {
    start: cloneSourcePosition(start),
    end: cloneSourcePosition(end)
  };
}

export interface IExpression extends IASTNode {
  location: ISourceLocation;
}


const noSource = {
  content: ""
};

export abstract class BaseExpression implements IExpression {

  abstract readonly kind: number;

  public parent: IASTNode;
  public location: ISourceLocation;

  constructor(location: ISourceLocation) {
    this.location = location;
  }

  inRange(selection: IRange) {
    // const offset = this.offset;
    // const start = this.position.start + offset;
    // const end   = this.position.end + offset;

    // return (selection.start >= start && selection.start <= end) ||
    // (selection.end   >= start && selection.end <= end) ||
    // (selection.start <= start && selection.end >= end);
  }

  abstract accept(visitor);
}

