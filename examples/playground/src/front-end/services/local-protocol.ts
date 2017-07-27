import { 
  weakMemo,
  routeTypes,
  Dispatcher,
  withStoreState,
} from "aerial-common2";

import { 
  when,
  parallel,
  createQueue, 
} from "mesh";

import { 
  READ_URI,
  WATCH_URI, 
  ReadUriAction, 
  BaseUriAction, 
  WatchUriAction, 
} from "aerial-sandbox2";

import { 
  DIRECTORY,
  Directory, 
  ApplicationState, 
  getAllFilesByPath,
} from "front-end/state";

/**
 * Utilities
 */

const actionIsLocalProtocol = (action: BaseUriAction) => action.uri && /^local\:\/\//.test(action.uri);

/**
 * Services
 */

const getAllFilesWithLocalProtocol = (state: ApplicationState) => getAllFilesByPath(state, "local://");


export const initLocalProtocolService = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) =>  {

  const watchers = {};

  return parallel(downstream, withStoreState((state: ApplicationState) => { 

    for (const uri in watchers) {
      watchers[uri](state);
    }
    
    const files = getAllFilesWithLocalProtocol(state);

    return when(actionIsLocalProtocol, routeTypes({
      [READ_URI]({ uri }: ReadUriAction) {
        return files[uri];
      },
      [WATCH_URI](action: WatchUriAction) {
        const q = createQueue();
        let currentFile = files[action.uri];

        watchers[action.uri] = (state) => {
          const newFiles = getAllFilesWithLocalProtocol(state);
          if (newFiles[action.uri] !== currentFile) {
            currentFile = newFiles[action.uri];
            q.unshift(true);
          }
        }
        
        return {
          [Symbol.asyncIterator]: () => this,
          next() {
            return q.next();
          },
          return() {
            delete watchers[action.uri];
            q.return();
          }
        }
      }
    }));
  }, upstream));
}