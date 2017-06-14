import { CoreEvent } from "./base";
export * from "./base";
export * from "./core";
export * from "./mutate";
export declare class ActiveRecordEvent extends CoreEvent {
    static readonly ACTIVE_RECORD_DESERIALIZED: string;
}
