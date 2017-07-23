import { 
  Struct, 
  weakMemo, 
  immutable, 
  getPathByType, 
  getValueByPath,
  createImmutableStructFactory, 
} from "aerial-common2";

export type URIProtocolReadResult = {
  type: string;
  content: string|Buffer;
};

export const URI_PROTOCOL_STATE = "URI_PROTOCOL_STATE";

export type URIProtocolState = {
  watchedUris: string[]
} & Struct;

export const createUriProtocolState = createImmutableStructFactory(URI_PROTOCOL_STATE, {
  watchedUris: []
});

export const getUriProtocolState = weakMemo((root: any) => getValueByPath(root, getPathByType(root, URI_PROTOCOL_STATE))) as (root) => URIProtocolState;