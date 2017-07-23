import { uniq } from "lodash";
import { parallel } from "mesh";
import { 
  URIProtocolState, 
  URI_PROTOCOL_STATE,
  getUriProtocolState, 
  URIProtocolReadResult,
  createUriProtocolState, 
} from "./structs";

import { 
  Action, 
  Message, 
  updateIn, 
  Dispatcher, 
  routeTypes, 
  updateStruct, 
  getPathByType, 
  whenStoreChanged, 
  StoreChangedEvent,
} from "aerial-common2";

import { 
  READ_URI, 
  WRITE_URI, 
  WATCH_URI,
  URI_EXISTS, 
  ReadUriAction,
  BaseUriAction,
  WriteUriAction,
  WatchUriAction,
  UriExistsAction,
} from "./messages";


export type URIProtocol = {
  readUri(uri: string): Promise<URIProtocolReadResult>;
  writeUri(uri: string, content: string|Buffer): any;
  uriExists(uri: string): boolean;
  watchUri(uri: string): () => void;
};

export const uriProtocolReducer = (rootState: any, action: Action) => {
  const uriProtocolState = getUriProtocolState(rootState);
  switch(action.type) {
    case WATCH_URI: {
      const { uri } = action as WatchUriAction;
      return updateStruct(rootState, uriProtocolState, "watchedUris", uniq([...uriProtocolState.watchedUris, uri]));
    }
  }
  return rootState;
}

export const uriProtocolDispatcher = (protocol: URIProtocol) => {
  return parallel(
    whenStoreChanged((rootState: any) => getUriProtocolState(rootState), ({ payload: rootState }: StoreChangedEvent<any>) => {
      const uriProtocolState = getUriProtocolState(rootState);
      // diff array
    }),
    routeTypes({
      [READ_URI]: ({ uri }: ReadUriAction) => protocol.readUri(uri),
      [WRITE_URI]: ({ uri, content }: WriteUriAction) => protocol.writeUri(uri, content),
      [URI_EXISTS]: ({ uri }: UriExistsAction) => protocol.uriExists(uri)
    })
  );
}

// TODO - export const uriProtocolProvider = { reducer: uriProtocolReducer, dispatcher: uriProtocolDispatcher };