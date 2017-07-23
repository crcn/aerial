import sift from 'sift';
import { IBus } from "mesh7";
import { inject } from "../decorators";
import { isMaster } from "../workers";
import { IBrokerBus } from "../busses";
import { IDisposable } from "../object";
import { IActiveRecord } from "./base";
import { PostDSMessage } from "../messages";
import { ObservableCollection } from "../observable";
import { Kernel, PrivateBusProvider, IInjectable } from "../ioc";
import {
  FilterBus,
  readOneChunk,
  readAllChunks,
  CallbackBus,
} from "mesh7";
import {
  DSFindRequest,
  DSUpdateRequest,
  DSInsertRequest 
} from "mesh-ds7";

// TODO - remove global listener
// TODO - listen to DS mediator for updates on record collection
export class ActiveRecordCollection<T extends IActiveRecord<any>, U> extends ObservableCollection<T> implements IInjectable {
  private _sync: IDisposable;
  public collectionName: string;
  public query: Object;
  public createActiveRecord: (source: U) => T;
  private _bus: IBrokerBus;
  private _globalMessageObserver: IBus<any, any>;

  constructor(collectionName: string, kernel: Kernel, createActiveRecord: (source: U) => T, query: any = {}) {
    super();
    this.setup(collectionName, kernel, createActiveRecord, query);
  }

  setup(collectionName: string, kernel: Kernel, createActiveRecord: (source: U) => T, query?: Object) {
    this.collectionName = collectionName;
    this._bus = PrivateBusProvider.getInstance(kernel);
    this.createActiveRecord = createActiveRecord;
    this._globalMessageObserver = new FilterBus((message: PostDSMessage) => {
      return (message.type === DSUpdateRequest.DS_UPDATE || message.type === DSInsertRequest.DS_INSERT || message.type === PostDSMessage.DS_DID_UPDATE || message.type === PostDSMessage.DS_DID_INSERT) && message.collectionName === this.collectionName && sift(this.query)(message.data);
    }, new CallbackBus(this.onPostDSMessage.bind(this)));
    this.query = query || {};
    return this;
  }

  async reload() {
    this.splice(0, this.length);
    this.load();
  }

  $didInject() { }

  async load() {

    // TODO - need to check for duplicates
    this.push(...(await readAllChunks<any>(this._bus.dispatch(new DSFindRequest(this.collectionName, this.query, true)))).map(value => {
      return this.createActiveRecord(value);
    }));
  }

  sync() {
    if (this._sync) return this._sync;

    // TODO - this is very smelly. Collections should not be registering themselves
    // to the global message bus. Instead they should be registering themselves to a DS manager
    // which handles all incomming and outgoing DS messages from the message bus.
    this._bus.register(this._globalMessageObserver);


    return this._sync = {
      dispose: () => {
        this._sync = undefined;
        this._bus.unregister(this._globalMessageObserver);
      }
    }
  }

  /**
   * loads an item with the given query from the DS
   */

  async loadItem(query: any): Promise<T|undefined> {
    const test = sift(query) as any;
    const loaded = this.find((model) => test(model.source));
    if (loaded) return loaded;
    
    const { value, done } = await readOneChunk<any>(this._bus.dispatch(new DSFindRequest(this.collectionName, query, false)));

    // item exists, so add and return it. Otherwise return undefined indicating
    // that the item does not exist.
    if (value) {
      const item = this.createActiveRecord(value);
      this.push(item);
      return item;
    }
  }

  /**
   * Loads an item into this collection if it exists, otherwise creates an item
   */

  async loadOrInsertItem(query: any, source: U = query) {
    const loadedItem = await this.loadItem(query);
    return loadedItem || this.create(source).insert();
  }

  /**
   * Synchronously creates a new active record (without persisting) with the given data
   * source.
   *
   * @param {U} source The source data represented by the new active record.
   * @returns
   */

  create(source: U) {
    const record = this.createActiveRecord(source);
    this.push(record);
    return record;
  }

  private onPostDSMessage(message: PostDSMessage) {
    this._updateActiveRecord(message.data);
  }

  private _updateActiveRecord(source: U) {

    let record = this.find((record) => record[record.idProperty] === source[record.idProperty]);

    if (record) {
      record.deserialize(source);
      return record;
    }

    return this.create(source);
  }
}

