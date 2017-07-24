import { 
  Dispatcher,
  withStoreState,
  routeTypes
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
} from "front-end/state";

/**
 * Utilities
 */

const actionIsLocalProtocol = (action: BaseUriAction) => action.uri && /^local\:\/\//.test(action.uri);

// TODO - move me to workspace
export const getFileUrls = (state: ApplicationState) => {
  let urls = {};
  const getFileUrls = (dir: Directory, prefix = '') => {
    for (const doc of dir.childNodes) {
      const newPrefix = `${prefix}/${doc.name}`;
      if (doc.$$type === DIRECTORY) {
        urls = {...urls, ...getFileUrls(doc, newPrefix)};
      } else {
        urls[newPrefix] = doc;
      }
    }
    return urls;
  };

  for (const workspace of state.workspaces) {
    urls = {
      ...urls,
      ...getFileUrls(workspace.sourceFiles, `local://${workspace.$$id}`)
    };
  }

  return urls;
};


/**
 * Services
 */

export const initLocalProtocolService = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) =>  {

  const watchers = {};

  return parallel(downstream, withStoreState((state: ApplicationState) => { 

    for (const uri in watchers) {
      watchers[uri].unshift(true);
    }
    
    const urls = getFileUrls(state);

    return when(actionIsLocalProtocol, routeTypes({
      [READ_URI]({ uri }: ReadUriAction) {
        return urls[uri];
      },
      [WATCH_URI](action: WatchUriAction) {
        const q = createQueue();
        watchers[action.uri] = q;
        
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