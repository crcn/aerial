import sift = require("sift");
import { CoreEvent } from "./base";
import { ITreeNode } from "../tree";
import { IDisposable } from "../object";
import { serializable, ISerializer } from "../serialize";
import {  DSFindRequest, DSInsertRequest, DSRemoveRequest, DSUpdateRequest, DSMessage } from "mesh-crud";
import { Message } from "mesh";

export { CoreEvent };

export class DisposeEvent extends CoreEvent {
  static readonly DISPOSE = "dispose";
  constructor() {
    super(DisposeEvent.DISPOSE);
  }
}

export class LoadApplicationRequest extends Message {
  static readonly LOAD = "loadApplication";
  constructor() {
    super(LoadApplicationRequest.LOAD);
  }
}

export class InitializeApplicationRequest extends Message {
  static readonly INITIALIZE = "initializeApplication";
  constructor() {
    super(InitializeApplicationRequest.INITIALIZE);
  }
}

@serializable("ApplicationReadyMessage")
export class ApplicationReadyMessage extends Message {
  static readonly READY = "applicationReady";
  constructor() {
    super(ApplicationReadyMessage.READY);
  }
}

@serializable("DSUpsertRequest")
export class DSUpsertRequest<T> extends DSMessage {
  static readonly DS_UPSERT = "dsUpsert";
  constructor(collectionName: string, readonly data: any, readonly query: T) {
    super(DSUpsertRequest.DS_UPSERT, collectionName);
  }
}

@serializable("PostDSMessage")
export class PostDSMessage extends DSMessage {

  static readonly DS_DID_INSERT = "dsDidInsert";
  static readonly DS_DID_REMOVE = "dsDidRemove";
  static readonly DS_DID_UPDATE = "dsDidUpdate";

  constructor(type: string, collectionName: string, readonly data: any, readonly timestamp: number) {
    super(type, collectionName);
  }

  static createFromDSRequest(request: DSInsertRequest<any>|DSUpdateRequest<any, any>|DSRemoveRequest<any>, data: any) {
    return new PostDSMessage({
      [DSInsertRequest.DS_INSERT]: PostDSMessage.DS_DID_INSERT,
      [DSUpdateRequest.DS_UPDATE]: PostDSMessage.DS_DID_UPDATE,
      [DSRemoveRequest.DS_REMOVE]: PostDSMessage.DS_DID_REMOVE
    }[request.type], request.collectionName, data, request.timestamp);
  }
}

export class MetadataChangeEvent extends CoreEvent {
  static readonly METADATA_CHANGE = "metadataChange";
  constructor(readonly key: string, readonly value: string) {
    super(MetadataChangeEvent.METADATA_CHANGE);
  }
}
