import { CoreEvent } from "./base";
import { IDispatcher, IStreamableDispatcher, DuplexStream, readOneChunk } from "@tandem/mesh";

export * from "./base";
export * from "./core";
export * from "./mutate";

export class ActiveRecordEvent extends CoreEvent {
  static readonly ACTIVE_RECORD_DESERIALIZED = "activeRecordDeserialized";
}
