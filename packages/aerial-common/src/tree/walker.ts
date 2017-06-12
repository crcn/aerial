export interface IWalkable {
  visitWalker(walker: ITreeWalker);
}

export interface ITreeWalker {
  accept(visitor: IWalkable);
}

export class TreeWalker implements ITreeWalker {

  private _stopped: boolean;

  constructor(readonly each: (node: any) => any) { }

  accept(visitor: IWalkable) {
    if (!this._stopped && this.each(visitor) !== false) {
      visitor.visitWalker(this);
    } else {
      this._stopped = true;
    }
  }
}