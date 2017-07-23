import { CoreEvent } from "./base";
import { IBus, IStreamableBus, DuplexStream, readOneChunk } from "mesh7";

export * from "./base";
export * from "./core";
export * from "./mutate";

export class ActiveRecordEvent extends CoreEvent {
  static readonly ACTIVE_RECORD_DESERIALIZED = "activeRecordDeserialized";
}
