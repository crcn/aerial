import { BaseEvent, Request } from "aerial-common2";

export const URI_CACHE_BUSTED = "URI_CACHE_BUSTED";

export type UriCacheBusted = {
  uri: string;
  content: string|Buffer;
  contentType: string;
} & BaseEvent;

export const uriCacheBusted = (uri: string, content: string|Buffer, contentType: string): UriCacheBusted => ({
  uri,
  content, 
  contentType, 
  type: URI_CACHE_BUSTED
})