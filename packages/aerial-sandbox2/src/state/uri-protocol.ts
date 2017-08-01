import { 
  Struct, 
  weakMemo,
  getPathByType,
  getValueByPath,
  createStructFactory,
} from "aerial-common2";

/**
 * Types
 */

export const URI_PROTOCOL_STATE = "URI_PROTOCOL_STATE";

/**
 * Structs
 */


export type URIProtocolReadResult = {
  type: string;
  content: string|Buffer;
};

export type URIProtocolState = {
  watchedUris: string[]
};

/**
 * Factories
 */

export const createURIProtocolState = createStructFactory(URI_PROTOCOL_STATE, {
  watchedUris: []
});


export const getUriProtocolState = weakMemo((root: any) => getValueByPath(root, getPathByType(root, URI_PROTOCOL_STATE))) as (root) => URIProtocolState;

export const hasURIProtocol = (uri: string) => /^\w+:\/\//.test(uri);