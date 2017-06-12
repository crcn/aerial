import { Observable } from "./index";
import { IObservable } from "../observable";
import { ArrayCollection } from "../array-collection";
import { BubbleDispatcher } from "@tandem/common/dispatchers";
import { CoreEvent, MetadataChangeEvent } from "@tandem/common/messages";
import { CallbackDispatcher, IDispatcher } from "@tandem/mesh";
import { ArrayMutation, ArrayInsertMutation, ArrayRemoveMutation, ArrayUpdateMutation } from "@tandem/common/utils";

export class ObservableCollection<T> extends ArrayCollection<T> implements IObservable {
  private _observable: Observable;
  private _itemObserver: IDispatcher<any, any>;

  protected constructor(...items: T[]) {
    super(...items);
    this._observable = new Observable(this);
    this._itemObserver = new BubbleDispatcher(this);
    this._watchItems(this);
  }

  observe(actor: IDispatcher<any, any>) {
    this._observable.observe(actor);
  }

  unobserve(actor: IDispatcher<any, any>) {
    this._observable.unobserve(actor);
  }

  notify(message: CoreEvent) {
    return this._observable.notify(message);
  }

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

  splice(start: number, deleteCount?: number, ...newItems: T[]) {

    const deletes: ArrayRemoveMutation[] = this.slice(start, start + deleteCount).map((item, index) => {

      if (item && item["unobserve"]) {
        (<IObservable><any>item).unobserve(this._itemObserver);
      }

      return new ArrayRemoveMutation(item, start + index);
    });

    const inserts: ArrayInsertMutation<T>[] = newItems.map((item, index) => {
      return new ArrayInsertMutation(start + index, item);
    });

    const ret = super.splice(start, deleteCount, ...newItems);

    this._watchItems(newItems);
    this.notify(new ArrayMutation([...deletes, ...inserts]).toEvent());
    return ret;
  }

  private _watchItems(newItems: T[]) {
    for (const item of newItems) {
      if (item && item["observe"]) {
        (<IObservable><any>item).observe(this._itemObserver);
      }
    }
  }
}