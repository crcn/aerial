

/*
TODOS:
- cancelable messages
- bubbleable messages
*/

export class CoreEvent {

  private _target: any;
  private _currentTarget: any;
  private _canPropagate: boolean = true;
  private _canPropagateImmediately: boolean = true;

  constructor(readonly type: string, readonly bubbles: boolean = true) { }

  set currentTarget(value) {

    // always maintain the initial target so that messages
    // can be tracked back to their origin
    if (!this._target) {
      this._target = value;
    }

    this._currentTarget = value;
  }

  // TODO - target is not an appropriate name in some cases since
  // the term refers to the current dispatcher dispatching *this* message. And in some cases,
  // the target may not exist
  get target() {
    return this._target;
  }

  get currentTarget() {
    return this._currentTarget;
  }

  get canPropagate() {
    return this._canPropagate;
  }

  get canPropagateImmediately() {
    return this._canPropagateImmediately;
  }

  stopPropagation() {
    this._canPropagate = false;
  }

  stopImmediatePropagation() {
    this._canPropagateImmediately = false;
  }
}
