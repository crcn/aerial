import { IObservable } from "../observable";
import { ArrayCollection } from "../array-collection";

export class ObservableCollection<T> extends ArrayCollection<T> {
  push(...items: Array<T>) {
    return this.splice(this.length, 0, ...items).length;
  }
  unshift(...items: Array<T>) {
    return this.splice(0, 0, ...items).length;
  }
  shift() {
    return this.splice(0, 1).pop();
  }
  pop() {
    return this.splice(this.length - 1, 1).pop();
  }

  splice(start: number, deleteCount?: number, ...items: T[]) {
    return super.splice(start, deleteCount, ...items);
  }
}