import { BaseEvent, Request } from "aerial-common2";

export const URI_CACHE_BUSTED = "URI_CACHE_BUSTED";

export type UriCacheBustedEvent = {
  uri: string;
  content: string|Buffer;
  contentType: string;
} & BaseEvent;

export const createUriCacheBustedEvent = (uri: string, content: string|Buffer, contentType: string): UriCacheBustedEvent => ({
  uri,
  content, 
  contentType, 
  type: URI_CACHE_BUSTED
})