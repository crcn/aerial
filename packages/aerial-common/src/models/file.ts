import { IDispatcher } from "@tandem/mesh";
import {
  Kernel,
  PrivateBusProvider,
  MimeTypeProvider,
  KernelProvider,
} from "@tandem/common/ioc";
import { IDisposable } from "@tandem/common/object";

import { bindable, inject } from "@tandem/common/decorators";
import { Observable, watchProperty } from "@tandem/common/observable";


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
  protected _bus: IDispatcher<any, any>;

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
