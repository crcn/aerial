export class SyntheticWindowTimers implements WindowTimers {

  private _timerIDs: Map<any, Function> = new Map();

  setTimeout(callback: Function, timeout: number, ...args: any[]) {
    const timeoutID = setTimeout(callback, timeout, ...args);
    this._timerIDs.set(timeoutID, clearTimeout);
    return timeoutID;
  }

  setInterval(callback: Function, timeout: number, ...args: any[]) {
    const intervalID = setInterval(callback, timeout, ...args);
    this._timerIDs.set(intervalID, clearInterval);
    return intervalID;
  }

  setImmediate(callback: Function, ...args: any[]) {
    const immediateID = setImmediate(callback, ...args);
    this._timerIDs.set(immediateID, clearImmediate);
    return immediateID;
  }

  clearTimeout(timerID) { this.clearTimer(timerID); }
  clearInterval(timerID) { this.clearTimer(timerID); }
  clearImmediate(timerID) { this.clearTimer(timerID); }

  private clearTimer(timerID: any) {
    const clearTimer = this._timerIDs.get(timerID);
    if (clearTimer) {
      this._timerIDs[timerID] = undefined;
      clearTimer(timerID);
    }
  }

  dispose() {
    this._timerIDs.forEach((value, timerID) => {
      this.clearTimer(timerID);
    });
  }
}