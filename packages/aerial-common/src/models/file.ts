import { IBus } from "mesh7";
import {
  Kernel,
  PrivateBusProvider,
  MimeTypeProvider,
  KernelProvider,
} from "../ioc";
import { IDisposable } from "../object";

import { bindable, inject } from "../decorators";
import { Observable, watchProperty } from "../observable";


export class File extends Observable {

  @bindable()
  public path: string;

  @bindable()
  public mtime: number;

  @bindable()
  public content: string;

  readonly type: string;

  private _watcher: IDisposable;

  @inject(KernelProvider.ID)
  protected _kernel: Kernel;

  @inject(PrivateBusProvider.ID)
  protected _bus: IBus<any, any>;

  constructor() {
    super();
    // this.updateFromSourceData(data);
  }

  dispose() {
    if (this._watcher) {
      this._watcher.dispose();
      this._watcher = undefined;
    }
  }

  async save() {
    this.mtime = Date.now();
  }

}
