import { Action } from "aerial-common2";
import { URIProtocolReadResult } from "../state";

export const READ_URI    = "READ_URI";
export const WRITE_URI   = "WRITE_URI";
export const URI_EXISTS  = "URI_EXISTS";
export const WATCH_URI   = "WATCH_URI";

export type BaseUriAction = {
  uri: string
} & Action;

export type ReadUriAction   = BaseUriAction;
export type UriExistsAction = BaseUriAction;
export type WatchUriAction  = BaseUriAction;
export type WriteUriAction  = {
  content: string | Buffer
} & BaseUriAction;

const uriActionFactory = <T extends BaseUriAction>(type: string) => (uri: string): BaseUriAction => ({
  type,
  uri
});

export const readUriAction   = uriActionFactory<ReadUriAction>(READ_URI);
export const uriExistsAction = uriActionFactory<UriExistsAction>(URI_EXISTS);
export const watchUriAction  = uriActionFactory<WatchUriAction>(WATCH_URI);

export const writeUriAction  = (uri: string, content: string|Buffer): WriteUriAction => ({
  type: WRITE_URI,
  content: content,
  uri: uri
});

