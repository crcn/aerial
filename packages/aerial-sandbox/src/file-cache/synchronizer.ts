import { FileCache } from "./file-cache";
import { CallbackBus } from "mesh7";
import { IURIWatcher, URIProtocolProvider } from "../uri";
import { IBrokerBus, diffArray, inject, loggable, Logger, Kernel, KernelProvider } from "aerial-common";

// TODO - need to check if file cache is up to date with local
// TODO - needs to support other protocols such as http, and in-app
@loggable()
export class FileCacheSynchronizer {

  protected logger: Logger;

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  private _watchers: any;
  private _updating: boolean;
  private _shouldUpdateAgain: boolean;

  constructor(private _cache: FileCache, private _bus: IBrokerBus) {
    this._watchers = {};
    this._cache.collection.observe(new CallbackBus(this.update.bind(this)));
    this.update();
  }

  private async update() {
    if (this._updating) {
      this._shouldUpdateAgain = true;
      return;
    }
    this._updating = true;
    const a = Object.keys(this._watchers);
    const b = this._cache.collection.map((item) => item.sourceUri);

    await diffArray(a, b, (a, b) => a === b ? 0 : -1).accept({
      visitInsert: async ({ index, value }) => {

        if (!value) return;

        const protocol = URIProtocolProvider.lookup(value, this._kernel);

        try {
          if (await protocol.fileExists(value)) {
            this._watchers[value] = protocol.watch(value, this.onURISourceChange.bind(this, value));
          }
        } catch(e) {
          this.logger.error(e.stack);
        }
      },
      visitRemove: ({ index }) => {
        (<IURIWatcher>this._watchers[a[index]]).dispose();
      },
      visitUpdate() { }
    });

    this._updating = false;
    if (this._shouldUpdateAgain) {
      this._shouldUpdateAgain = false;
      this.update();
    }
  }

  private async onURISourceChange(uri: string) {
    const entity = await this._cache.find(uri);

    this.logger.debug(`${uri} changed, updating cache.`);

    // just set the timestamp instead of checking lstat -- primarily
    // to ensure that this class works in other environments.
    entity.contentUpdatedAt = Date.now();

    // override any data urls that might be stored on the entity
    entity.setContentUri(uri).save();
  }
}
