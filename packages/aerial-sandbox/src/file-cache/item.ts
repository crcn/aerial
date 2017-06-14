import memoize =  require("memoizee");
import { CallbackBus } from "mesh";
import { btoa, atob } from "abab"
import { URIProtocolProvider, URIProtocol, IURIProtocolReadResult  } from "../uri";

import {
  Metadata,
  bindable,
  Kernel,
  inject,
  ENV_IS_NODE,
  MutationEvent,
  createDataUrl,
  MimeTypeProvider,
  BaseActiveRecord,
  KernelProvider,
  PropertyMutation,
} from "aerial-common";

export interface IFileCacheItemData {
  _id?: string;
  type: string;
  sourceUri: string;
  contentUri: string;
  synchronized?: boolean
  updatedAt?: number;
  contentUpdatedAt?: number;
  metadata?: Object;
}

let _i = 0;

// TODO - filePath should be sourceUrl to enable different protocols such as urls
export class FileCacheItem extends BaseActiveRecord<IFileCacheItemData> {

  readonly idProperty = "sourceUri";

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  @bindable(true)
  public type: string;

  @bindable(true)
  public updatedAt: number;

  @bindable(true)
  public contentUpdatedAt: number;

  @bindable(true)
  public contentUri: string;

  @bindable(true)
  public sourceUri: string;

  @bindable(true)
  public metadata: Metadata;

  private _rawDataUrlContent: any;

  constructor(source: IFileCacheItemData, collectionName: string) {
    super(source, collectionName);
  }
  
  get synchronized() {
    return this.sourceUri === this.contentUri;
  }

  serialize() {
    return {
      type       : this.type,
      updatedAt  : this.updatedAt,
      sourceUri  : this.sourceUri,
      contentUpdatedAt: this.contentUpdatedAt,
      contentUri  : this.contentUri,
      synchronized : this.synchronized, 
      metadata    : this.metadata.data
    };
  }

  shouldUpdate() {
    return this.source.contentUri !== this.contentUri || this.contentUpdatedAt !== this.source.contentUpdatedAt;
  }

  willSave() {
    this.updatedAt = Date.now();
  }

  async setDataUrlContent(content: string|Buffer) {
    return this.setContentUri(createDataUrl(content, (await this.read()).type));
  }

  setContentUri(uri: string) {
    this.contentUri = uri;
    this.contentUpdatedAt = Date.now();
    return this;
  }

  async read() {
    const protocol = URIProtocolProvider.lookup(this.contentUri, this._kernel);
    return await protocol.read(this.contentUri);
  }

  shouldDeserialize(b: IFileCacheItemData) {
    return this.updatedAt < b.updatedAt;
  }

  setPropertiesFromSource({ sourceUri, type, updatedAt, contentUri, metadata, contentUpdatedAt }: IFileCacheItemData) {
    this.sourceUri        = sourceUri;
    this.contentUri       = contentUri;
    this.type             = type;
    this.updatedAt        = updatedAt;
    this.metadata         = new Metadata(metadata);
    this.contentUpdatedAt = contentUpdatedAt;
  }
}

