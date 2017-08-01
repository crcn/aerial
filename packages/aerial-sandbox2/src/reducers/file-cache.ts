import { BaseEvent } from "aerial-common2";
import { } from "../actions";
import { FileCache, createFileCache } from "../state";

export const fileCacheReducer = (root: any = createFileCache(), event: BaseEvent) => {
  return root;
}