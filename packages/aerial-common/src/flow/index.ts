export class Queue {
  private _items: any[];
  private _running: boolean;

  constructor() {
    this._items = [];
  }

  add(callback: () => Promise<any>) {
    return new Promise((resolve, reject) => {
      this._items.push([resolve, reject, callback]);

      if (this._running) return;
      this._running = true;
      const next = () => {
        if (!this._items.length) {
          this._running = false;
          return;
        }
        const [resolve, reject, callback] = this._items.shift();
        const complete = (err, ...rest) => {
          if (err != null) {
            reject();
          } else {
            resolve(...rest);
          }
          next();
        }
        callback().then(complete.bind(this, undefined), complete);
      }
      next();
    })
  }
}
