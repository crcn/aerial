import { identify } from "lodash";
import { URIProtocolReadResult } from "../state";
import { BaseEvent, Request, createStructFactory, generateDefaultId, takeResponse } from "aerial-common2";

export const READ_URI = "READ_URI";
export const CACHEABLE_READ_URI = "CACHEABLE_READ_URI";
export const WRITE_URI = "WRITE_URI";
export const URI_WRITTEN = "URI_WRITTEN";
export const DELETE_URI = "DELETE_URI";
export const URI_EXISTS = "URI_EXISTS";
export const WATCH_URI = "WATCH_URI";
export const UNWATCH_URI = "UNWATCH_URI";

export type BaseUriRequest = {
  uri: string
} & Request;

export type ReadUriRequest   = BaseUriRequest;
export type UriExistsRequest = BaseUriRequest;
export type DeleteUriRequest = BaseUriRequest;
export type WatchUriRequest  = BaseUriRequest;
export type UnwatchUriRequest  = {
  watchRequestId: string
} & Request;
export type WriteUriRequest  = {
  content: string | Buffer;
  contentType?: string;
} & BaseUriRequest;

export type UriWrittenEvent = {
  uri: string;
  content: string | Buffer;
  contentType?: string
} & BaseEvent;

const createUriActionFactory = <T extends BaseUriRequest>(type: string) => (uri: string): BaseUriRequest => ({
  type,
  uri,
  $$id: generateDefaultId()
});

export const createReadUriRequest = createUriActionFactory<ReadUriRequest>(READ_URI);
export const createReadCacheableUriRequest = createUriActionFactory<ReadUriRequest>(CACHEABLE_READ_URI);
export const createDeleteUriRequest = createUriActionFactory<DeleteUriRequest>(DELETE_URI);
export const createUriExistsRequest = createUriActionFactory<UriExistsRequest>(URI_EXISTS);
export const createWatchUriRequest = createUriActionFactory<WatchUriRequest>(WATCH_URI);
export const createUnwatchUriRequest = (watchRequestId: string): UnwatchUriRequest => ({
  type: UNWATCH_URI,
  watchRequestId,
  $$id: generateDefaultId()
});

export const createWriteUriRequest = (uri: string, content: string|Buffer, contentType?: string): WriteUriRequest => ({
  type: WRITE_URI,
  contentType,
  content: content,
  uri: uri,
  $$id: generateDefaultId()
});

export const createUriWrittenEvent = (uri: string, content: string|Buffer, contentType?: string): UriWrittenEvent => ({
  type: URI_WRITTEN,
  uri,
  content,
  contentType
});

