import { BaseEvent, Request } from "aerial-common2";

export const READ_CACHED    = "READ_FILE_CACHE";
export const WRITE_CACHED_URI   = "WRITE_FILE_CACHE";
export const FILE_CACHE_CHANGED = "FILE_CACHE_CHANGED";

export type ReadFileCacheRequest = {
  uri: string;
} & Request;

export type WriteFileCacheRequest = {
  uri: string;
  content: Buffer;
  contentType?: string;
} & Request;

export type FileCacheChangedEvent = {
  cachedFileId: string;
} & BaseEvent;

